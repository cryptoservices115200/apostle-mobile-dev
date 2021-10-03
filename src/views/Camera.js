import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { Styles } from '@/styles';
import { Images } from '@/styles/Images';
import { useOvermind } from '@/store';
import { MainBoldFont, MainMediumFont, MainSemiBoldFont } from '@/views/Components';
import { Dimensions, Image, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import useInterval from '@/utils/useInterval';
import ImagePicker from 'react-native-image-crop-picker';
import Upload from 'react-native-background-upload';
import { Settings } from '../../settings';
import { ProgressView } from '@react-native-community/progress-view';
import InfoIcon from '@/assets/ikonate_icons/info-white.svg';
import CameraIcon from '@/assets/ikonate_icons/camera-rear.svg'
import CameraRoll from "@react-native-community/cameraroll";

const { width } = Dimensions.get("window");

const Camera = props => {
  const { state, actions } = useOvermind();
  const camera = useRef(null);
  const [isRecord, setRecord] = useState(false);
  const [time, setTime] = useState(0);
  const [countInterval, setCountInterval] = useState(null);
  const [isShow, setShow] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentImage, setCurrentImage] = useState(null);
  const [front, setFront] = useState(false);

  const scene = props.route?.params?.scene;
  const storylineId = props.route?.params?.storylineId;

  useInterval(() => {
    if (time === 59) {
      setCountInterval(null);
      stopRecording();
    }
    setTime(time + 1);
  }, countInterval);

  const saveScene = async (d) => {
    console.log(d)
    actions.hud.show();
    const linkedParams = {
      media: { connect: {} },
      storyline: { connect: { id: storylineId } },
      scenes: { connect: [{ id: scene.id }] },
      tags: { connect: [] },
      taggedUsers: { connect: [] },
      type: 'RAW',
      approval: 'NEW',
      visibility: 'INTERNAL',
    };
    if (d?.id) {
      const { saveMedia } = await actions.media.saveMedia({
        where: { id: d?.id },
        data: {
          name: d?.filename ? d.filename : d.path.split('/')[d.path.split('/')?.length - 1],
          source: d?.path,
          avatar: d?.thumbnail?.filepath,
          user: { connect: { id: state.currentUser?.id } },
        },
      });
      linkedParams.media.connect = { id: saveMedia.id };
      const tags = [];
      if (saveMedia?.tags?.length > 0) {
        saveMedia.tags.map(t => tags.push({ id: t.id }));
        linkedParams.tags.connect = tags;
      }

      const taggedUsers = [];
      if (saveMedia?.taggedUsers?.length > 0) {
        saveMedia.taggedUsers.map(t => tags.push({ id: t.id }));
        linkedParams.taggedUsers.connect = taggedUsers;
      }
    } else {
      const { saveMedia } = await actions.media.saveMedia({
        data: {
          name: d?.filename ? d.filename : d.path.split('/')[d.path.split('/')?.length - 1],
          type: d?.mime?.includes('image') ? 'IMAGE' : 'VIDEO',
          source: d?.path,
          avatar: d?.thumbnail?.filepath,
          user: { connect: { id: state.currentUser?.id } },
        },
      });
      linkedParams.media.connect = { id: saveMedia?.id };
    }

    await actions.linkedMedia.saveLinkedMedia({ data: linkedParams });
    await actions.storyline.getStorylines();
    await actions.linkedMedia.getLinkedMedias();
    console.log(state.storyline.storylines);
    props.navigation.pop();
    props.navigation.pop();
    actions.hud.hide();
  };

  const onUpload = async (d) => {
    if (d?.mime?.includes('image')) {
      actions.hud.show();
      const { uploadFileToS3 } = await actions.user.uploadFileToS3({ image: d?.data });
      actions.hud.hide();
      console.log(uploadFileToS3, 'uploadFileToS3');
      if (scene?.id) {
        await saveScene({ ...d, ...{ path: uploadFileToS3?.filepath } })
      } else {
        props.navigation.navigate('Uploading', { data: { ...d, ...{ path: uploadFileToS3?.filepath } } });
      }
    } else {
      setShow(true);
      Upload.getFileInfo(d.path).then(metadata => {
        console.log(metadata, 'metadata');
        const options = {
          url: Settings.uploadUrl,
          path: d.path,
          method: 'POST',
          type: 'multipart',
          field: 'uploaded_media',
          headers: {
            'content-type': metadata.mimeType,
          },
          parameters: {
            createMedia: true,
            savePath: 'scenes/',
          },
          maxRetries: 2, // set retry count (Android only). Default 2
          // Below are options only supported on Android
          notification: {
            enabled: true,
          },
          useUtf8Charset: true,
        };

        Upload.startUpload(options).then((uploadId) => {
          Upload.addListener('progress', uploadId, (data) => {
            console.log(`Progress: ${data.progress}%`);
            setProgress(data.progress);
          });
          Upload.addListener('error', uploadId, (data) => {
            console.log(`Error: ${data.error}%`);
          });
          Upload.addListener('cancelled', uploadId, (data) => {
            console.log(`Cancelled!`);
          });
          Upload.addListener('completed', uploadId, async (da) => {
            // data includes responseCode: number and responseBody: Object
            console.log('Completed!', da);
            setShow(false);
            setProgress(0);
            const data = JSON.parse(da.responseBody);
            console.log(data, 'data')
            if (data?.path?.includes('http')) {
              if (scene?.id) {
                await saveScene({ ...d, ...data });
              } else {
                props.navigation.navigate('Uploading', { data: { ...d, ...data } });
              }
            } else {
              actions.alert.showError({ message: 'Something went wrong in uploading. please try again!' });
            }
          });
        }).catch((err) => {
          console.log('Upload error!', err);
        });
      });
    }

  };

  const onPressRecord = async () => {
    setRecord(true);
    setCountInterval(1000);
    setTime(0);
    try {
      const params = await camera.current.recordAsync();
      console.log(params);
      const data = {
        path: params.uri,
        name: params.uri?.split('/')[params.uri?.split('/')?.length - 1],
      };
      onUpload(data);
    } catch (e) {
      console.log(e);
    }
  };

  const stopRecording = async () => {
    camera.current.stopRecording();
    setRecord(!isRecord);
    setCountInterval(null);
  };

  const getTime = () => {
    const min = Math.floor(time / 60);
    const seconds = time % 60;
    return `${min}:${seconds < 10 ? ('0' + seconds) : seconds}`;
  };

  const onPressPicker = async () => {
    const options = { includeBase64: true };
    const picked = await ImagePicker.openPicker(options);
    onUpload(picked);
  };

  const fetchImageFromCameraRoll = () => {
    CameraRoll.getPhotos({
      first: 1,
      assetType: 'Photos'
    }).then((res) => {
      setCurrentImage(res.edges[0].node.image.uri);
    }).catch(console.log);
  }

  const onChangeType = () => {
    setFront(!front);
  }

  const onShowSceneDetail = () => {
    props.navigation.navigate('SceneDetail', {
      scene,
      storylineId
    })
  }

  useEffect(() => {
    fetchImageFromCameraRoll();
  }, [])

  return (
    <Container>

      <RNCamera
        ref={camera}
        style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height, position: 'absolute' }}
        type={front ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.on}
        permissionDialogTitle={'Permission to use Camera'}
        permissionDialogMessage={'We need your permission to use your camera phone'}
      />

      <View style={{ paddingHorizontal: 25, flex: 1 }}>
        <Header>
          <TouchableOpacity onPress={props.onClose ? props.onClose : () => props.navigation.pop()}>
            <Image source={Images.icon_close} />
          </TouchableOpacity>
        </Header>
        <View style={{ flex: 1 }} />
        {scene && <Type>{scene?.type?.name?.toUpperCase()}</Type>}
        {scene && <Desc>{scene?.name}</Desc>}
        <Bottom>
          <TouchableOpacity onPress={onPressPicker}>
            <RollImage source={{ uri: currentImage || '' }} />
          </TouchableOpacity>
          {scene && <TouchableOpacity onPress={onShowSceneDetail}>
            <InfoIcon width={35} height={35} />
          </TouchableOpacity>}
          {!scene && <View style={{ width: 35 }} />}
          <Btn onPress={isRecord ? stopRecording : onPressRecord} isRecord={isRecord}>
            <Circle isRecord={isRecord} />
          </Btn>
          <Count>{getTime()}</Count>
          <TouchableOpacity onPress={onChangeType}>
            <CameraIcon width={35} height={35} />
          </TouchableOpacity>
        </Bottom>
        {!isShow && <TimeBar duration={time} />}
        {isShow && <Progress>
          <PBody>
            <VProgressView>
              <ProgressView
                progress={progress / 100}
                style={{ flex: 1 }}
                trackTintColor={'#eaeaea'}
                progressImage={Images.progress}
              />
              <PText>{progress.toFixed(0)}%</PText>
            </VProgressView>
          </PBody>
        </Progress>}
      </View>

    </Container>
  );
};

export default Camera;

const PText = styled(MainSemiBoldFont)`
  font-size: 12px;
  margin-left: 7px;
`;

const VProgressView = styled.View`
  flex-direction: row;
  ${Styles.center}
`;

const PBody = styled.View`
  margin-horizontal: 20px;
  border-radius: 10px;
  padding: 10px;
  background-color: white;
  width: 90%;
`;

const Progress = styled.View`
  position: absolute;
  bottom: 0px;
  left:0;
  width: ${width}px;
`;


const Circle = styled.View`
  background-color: ${props => props.isRecord ? 'red' : 'white'};
  width: 44px;
  height: 44px;
  border-radius: 30px;
`;

const Btn = styled.TouchableOpacity`
  border-width: 2px;
  border-color: ${props => props.isRecord ? 'red' : 'white'};
  width: 53px;
  height: 53px;
  border-radius: 30px;
  ${Styles.center}
`;

const BtnView = styled.View`
  ${Styles.center}
  position: absolute;
  bottom: 21px;
  left: ${Dimensions.get('window').width * 0.4}
`;

const Count = styled(MainMediumFont)`
  font-size: 16px;
  line-height: 24px;
  color: white;
`;

const Bottom = styled.View`
  flex-direction: row;
  margin-top: 40px;
  margin-bottom: 30px;
  z-index: 20;
  ${Styles.between_center}
`;

const Desc = styled(MainBoldFont)`
  font-size: 14px;
  line-height: 20px;
  color: white;
  margin-top: 10px;
`;

const Type = styled(MainSemiBoldFont)`
  font-size: 10px;
  line-height: 20px;
  color: white;
`;

const Header = styled.View`
  width: 100%;
  justify-content: flex-end;
  align-items: flex-end;
  margin-top: 25px;
`;

const Container = styled.View`
  height: 100%;
  background-color: #333333;
`;

const RollImage = styled.Image`
  resize-mode: cover;
  width: 40px;
  height:40px;
  border-radius: 3px;
  background-color: grey;
`

const TimeBar = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: ${props => props.duration < 50 ? "#30D5C8" : "red"};
  height: 4px;
  width: ${props => (width * props.duration / 60)}px;
`