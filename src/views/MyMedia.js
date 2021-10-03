import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images, Icons} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainMediumFont, MainSemiBoldFont} from '@/views/Components';
import {Image, RefreshControl, SafeAreaView, TouchableOpacity, View} from 'react-native';
import Video from 'react-native-video';
import {json} from 'overmind';
import ControlAlt from '@/assets/ikonate_icons/controls-alt.svg';
import ListAlt from '@/assets/ikonate_icons/list-alt.svg';
import ControlAltDisabled from '@/assets/ikonate_icons/controls-alt-gray.svg';
import ListAltDisabled from '@/assets/ikonate_icons/list-alt-gray.svg';
import CloseIcon from '@/assets/ikonate_icons/close.svg';
import ViewIcon from '@/assets/ikonate_icons/view.svg';
import InfoIcon from '@/assets/ikonate_icons/info-gray.svg';
import ShareIcon from '@/assets/ikonate_icons/share.svg';
import DownloadIcon from '@/assets/ikonate_icons/download.svg';
import ArchiveIcon from '@/assets/ikonate_icons/archive.svg';
import Archive from "./Archive";
import CopyIcon from '@/assets/ikonate_icons/checkbox.svg';
import PasteIcon from '@/assets/ikonate_icons/cards.svg';
import AddPersonIcon from '@/assets/ikonate_icons/person-add.svg';

// Import RNFetchBlob for the file download
import RNFetchBlob from 'rn-fetch-blob';
import {Settings} from '../../settings';

const MyMedia = props => {
  const {state, actions} = useOvermind();
  const [isGrid, setGrid] = useState(false);
  const [chosenMedia, setChosenMedia] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [medias, setMedias] = useState([]);

  useEffect(() => {
    const getData = async () => {
      await actions.linkedMedia.getLinkedMedias();
      console.log('medias----', state.linkedMedia.linkedMedias);
      setMedias(json(state.linkedMedia.linkedMedias)?.filter(m => m.media?.user?.id === state.currentUser?.id));
    };
    getData();
  }, []);

  const onSelect = (item) => {
    const videos = [...state.selectedVideos];
    const index = videos.findIndex(v => v.id === item.id);
    if (index > -1) {
      videos.splice(index, 1);
    } else {
      videos.push(item);
    }
    actions.setSelectedVideos(videos);
    console.log(state.selectedVideos, '====');
  };

  const selectAll = () => {
    const videos = [...state.selectedVideos];
    medias.map(media => {
      const index = videos.findIndex(v => v.id === media.id);
      if (index < 0) {
        videos.push(media);
      }
    });
    actions.setSelectedVideos(videos);
  };

  const unSelectAll = () => {
    actions.setSelectedVideos([]);
  };

  const onPlay = (id) => {
    const medias = json(state.linkedMedia.linkedMedias);
    medias.map(s => {
      if (s.id === id) {
        s.isPlay = true;
      }
    });
    actions.media.onPlay(medias);
  };

  const downloadFile = (url) => {

    // Get today's date to add the time suffix in filename
    let date = new Date();
    // File URL which we want to download
    let FILE_URL = url;
    // Function to get extention of the file url
    let file_ext = getFileExtention(FILE_URL);

    file_ext = '.' + file_ext[0];

    // config: To get response by passing the downloading related options
    // fs: Root directory path to download
    const { config, fs } = RNFetchBlob;
    let RootDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path:
          RootDir+
          '/file_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          file_ext,
        description: 'downloading file...',
        notification: true,
        // useDownloadManager works with Android only
        useDownloadManager: true,
      },
    };
    config(options)
      .fetch('GET', FILE_URL)
      .then(res => {
        // Alert after successful downloading
        console.log('res -> ', JSON.stringify(res));
        alert('File Downloaded Successfully.');
        RNFetchBlob.ios.openDocument(res.data);
      });
  };

  const getFileExtention = fileUrl => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ?
      /[^.]+$/.exec(fileUrl) : undefined;
  };

  const downloadSelected = () => {
    state.selectedVideos.map(video => {
      console.log('video link---', video.media.source);
      downloadFile(video.media.source)
    })
  };

  const onArchive = () => {
    try {
      state.selectedVideos.map(async video => {
        actions.linkedMedia.saveLinkedMedia({
          where: { id: video?.id },
          data: {
            media: {
              update: {
                isArchived: true
              }
            }
          },
        });
      })
    } catch (e) {
      console.log('on archive error---', e)
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#F7F7FE'}}>
      <Container>
        <CloseBtn onPress={() => props.navigation.pop()}>
          <CloseIcon width={25} height={25}/>
        </CloseBtn>
        <Header>
          <Title>My Media</Title>
          <Right>
            {!state.isSelectMode && <TouchableOpacity style={{marginRight: 25}}>
              {state.media.medias.length !== 0 && <ControlAlt width={25} height={25}/>}
              {state.media.medias.length === 0 && <ControlAltDisabled width={25} height={25}/>}
              {/*<Image source={Images.icon_control} style={{tintColor: state.media.medias.length === 0 ? 'gray': 'black'}}/>*/}
            </TouchableOpacity>}
            {!state.isSelectMode && <TouchableOpacity onPress={() => setGrid(!isGrid)}>
              {state.media.medias.length !== 0 && <ListAlt width={25} height={25}/>}
              {state.media.medias.length === 0 && <ListAltDisabled width={25} height={25}/>}
              {/*<Image source={Images.icon_list} style={{tintColor: state.media.medias.length === 0 ? 'gray': 'black'}}/>*/}
            </TouchableOpacity>}
            <SelectBtn onPress={actions.setSelectMode}>
              <SelectText isEmpty={state.media.medias.length === 0}>{state.isSelectMode ? 'Cancel' : 'Select'}</SelectText>
            </SelectBtn>
          </Right>
        </Header>
        <VideoList
          data={medias}
          ListFooterComponent={<View style={{height: 100}}/>}
          refreshing={refreshing}
          refreshControl={
            <RefreshControl refreshing={refreshing}
                            onRefresh={async () => await actions.linkedMedia.getLinkedMedias()}/>
          }
          renderItem={({item, index}) => !isGrid ? <VideoItem style={{shadowOffset: {x: 0, y: 10}}} key={index}>
            {item.media.type === 'IMAGE' ?
              <Logo source={{uri: item.media.source}}/> :
              <TouchableOpacity onPress={() => props.navigation.navigate('VideoView', {video: item.media, isPlay: true})}>
                <Logo source={{uri: item?.media?.avatar}}/>
              </TouchableOpacity>}
            <Content>
              <VType>{item?.media?.type}</VType>
              <VTitle>{item?.media?.name}</VTitle>
              <VName>{item?.media?.user?.firstName + ' ' + item?.media?.user?.lastName}</VName>
            </Content>
            {state.isSelectMode && <VSelectBtn onPress={() => onSelect(item)} isSelected={state.selectedVideos.find(v => v.id === item.id)}>
              {state.selectedVideos.find(v => v.id === item.id) && <Image source={Images.icon_check}/>}
            </VSelectBtn>}
          </VideoItem> : <GridItem>
            <Overlay/>
            {item?.media?.type === 'IMAGE' ? <ItemVideo source={{uri: item?.media?.source}} as={Image}/>: <ItemVideo
              source={{uri: item?.media?.source}}
              onError={console.log}
              paused={!item.isPlay}
            />}
            <GHeader>
              {state.isSelectMode ? <VSelectBtn onPress={() => onSelect(item)} isSelected={state.selectedVideos.find(v => v.id === item.id)}
                          style={{borderColor: 'white'}}>
                {state.selectedVideos.find(v => v.id === item.id) && <Image source={Images.icon_check}/>}
              </VSelectBtn> : <View/>}
              <TouchableOpacity onPress={() => setChosenMedia(item.id)}>
                <Image source={Images.icon_more}/>
              </TouchableOpacity>
            </GHeader>
            {chosenMedia === item.id && <Menu>
              <CloseBtn onPress={() => setChosenMedia(null)}>
                {/*<Image source={Images.icon_close_black}/>*/}
                <CloseIcon width={23} height={23}/>
              </CloseBtn>
              <Item onPress={() => props.navigation.navigate('VideoView', {video: item?.media})}>
                {/*<Image source={Images.icon_calendar} style={{tintColor: 'black'}}/>*/}
                <ViewIcon width={23} height={23}/>
                <ItemText>View</ItemText>
              </Item>
              <Item onPress={() => props.navigation.navigate('Info', {video: item})}>
                <InfoIcon width={23} height={23}/>
                <ItemText>Info</ItemText>
              </Item>
              <Item onPress={() => props.navigation.navigate('ShareVideo', {video: item?.media})}>
                <ShareIcon width={23} height={23}/>
                <ItemText>Share</ItemText>
              </Item>
              <Item onPress={() => props.navigation.navigate('VideoView', {video: item?.media})}>
                <DownloadIcon width={23} height={23}/>
                <ItemText>Download</ItemText>
              </Item>
              <Item onPress={() => props.navigation.navigate('Archive', {video: item?.media})}
                    style={{marginBottom: 0}}>
                <ArchiveIcon width={23} height={23}/>
                <ItemText>Archive</ItemText>
              </Item>
            </Menu>}
            <View style={{width: '100%', alignItems: 'center', marginTop: 130}}>
              {(!item.isPlay && item?.media?.type === 'VIDEO') ? <GPlayBtn onPress={() => onPlay(item.id)}>
                <Image source={Images.icon_triangle_white}/>
              </GPlayBtn> : <GPlayBtn as={View} style={{backgroundColor: 'transparent'}}/>}
            </View>
            <View style={{paddingHorizontal: 20, marginTop: 100}}>
              <GType>{item?.media?.type}</GType>
              <GTitle>{item?.media?.name}</GTitle>
            </View>
            <Bottom>
              <Avatar source={{uri: item?.media?.user?.avatar || ''}}/>
              <Name>{item?.media?.user?.firstName + ' ' + item?.media?.user?.lastName}</Name>
            </Bottom>
          </GridItem>}
        />

      </Container>
      {state.isSelectMode && <SelectTab>
        <CountView>
          <CountText>{state.selectedVideos.length}</CountText>
        </CountView>
        <SelectText>Selected</SelectText>
        <TouchableOpacity onPress={selectAll} style={{marginLeft: 30}}>
          <CopyIcon width={23} height={23}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={unSelectAll} style={{marginLeft: 24}}>
          <PasteIcon width={23} height={23}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate('InvitePeople')} style={{marginLeft: 24}}>
          <AddPersonIcon width={23} height={23}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={downloadSelected} style={{marginLeft: 24}}>
          <DownloadIcon width={23} height={23}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={onArchive} style={{marginLeft: 24}}>
          <ArchiveIcon width={23} height={23}/>
        </TouchableOpacity>
      </SelectTab>}
    </SafeAreaView>
  );
};

export default MyMedia;

const ItemVideo = styled(Video)`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 12px;
`;

const CloseBtn = styled.TouchableOpacity`
  position: absolute;
  right: 14px;
  top: 3px;
  z-index: 32;
`;

const ItemText = styled(MainSemiBoldFont)`
  margin-left: 10px;
`;

const Item = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-bottom: 23px;

`;

const Menu = styled.View`
  width: 280px;
  padding: 20px;
  border: 1px solid #d8d8d8;
  background-color: white;
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 51;
`;

const Name = styled(MainMediumFont)`
  line-height: 20px;
  color: white;
  margin-left: 10px;
`;

const Avatar = styled.Image`
  width: 26px;
  height: 26px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.4);
  background-color: gray;
  border-radius: 30px;
`;

const Bottom = styled.View`
  align-items: center;
  width: 100%;
  flex-direction: row;
  margin-top: 10px;
  margin-horizontal: 20px;
`;

const GTitle = styled(MainBoldFont)`
  color: white;
  font-size: 24px;
  line-height: 29px;
`;

const GType = styled(MainSemiBoldFont)`
  font-size: 10px;
  line-height: 20px;
  color: white
`;

const GPlayBtn = styled.TouchableOpacity`
  width: 70px;
  height: 50px;
  ${Styles.center}
  background-color: #00000080;
  border-radius: 31px;
`;

const GHeader = styled.View`
  flex-direction: row;
  ${Styles.between_center};
  padding-horizontal: 20px;
  padding-top: 17px;
`;

const Overlay = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: black;
  opacity: 0.3;
  border-radius: 12px;
`;

const GridItem = styled.View`
  height: 430px;
  margin-bottom: 20px;
`;

const VSelectBtn = styled.TouchableOpacity`
  width: 22px;
  height: 22px;
  border-radius: 15px;
  border-width: ${props => props.isSelected ? 0 : 1.5};
  border-color: black;
  align-items: flex-end;
  margin-top: 13px;
  ${Styles.center}
  background-color: ${props => props.isSelected ? '#6600ed' : 'white'};
`;

const VName = styled(MainMediumFont)`
  font-size: 12px;
  line-height: 18px;
  color: #4c4c4c;
  margin-top: 5px;
`;

const VTitle = styled(MainBoldFont)`
  font-size: 14px;
  line-height: 20px;
  color: black;
`;

const VType = styled(MainSemiBoldFont)`
  color: #4c4c4c;
  font-size: 10px;
  line-height: 20px;
  letter-spacing: 2px;
`;

const Content = styled.View`
  margin-left: 11px;
  justify-content: center;
  width: 70%;
`;

const Logo = styled.Image`
  border-radius: 12px;
  height: 100%;
  width: 65px;
`;

const VideoItem = styled.View`
  background-color: white;
  border-radius: 12px;
  shadow-color: #000000;
  elevation: 3;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  margin-bottom: 20px;
  margin-horizontal: ${Platform.OS === 'ios' ? 0 : 2};
  flex-direction: row;
  height: 120px;
`;

const VideoList = styled.FlatList`
  flex: 1;
  padding-top: 20px;
`;

const SelectText = styled(MainSemiBoldFont)`
  font-size: 14px;
  line-height: 20px;
  color: ${props => props.isEmpty ? 'gray' : '#1b2124'};
`;

const SelectBtn = styled.TouchableOpacity`
  margin-left: 27px;
`;

const Right = styled.View`
  ${Styles.center}
  flex-direction: row;
`;

const Title = styled(MainBoldFont)`
  font-size: 26px;
  line-height: 32px;
  color: #1b2124;
`;

const Header = styled.View`
  flex-direction: row;
  ${Styles.between_center};
  margin-top: 30px;
`;

const Container = styled.View`
  flex: 1;
  background-color: #F7F7FE;
  padding-horizontal: 19px;
`;
const SelectTab = styled.View`
  height: 70px;
  flex-direction: row;
  width: 100%;
  ${Styles.center}
  background-color: white;
  justify-content: space-around;
  padding-horizontal: 5px;
`;
const CountView = styled.View`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  ${Styles.center}
  background-color: #6600ED;
`;

const CountText = styled(MainSemiBoldFont)`
  font-size: 12px;
  line-height: 14px;
  color: white;
`;
