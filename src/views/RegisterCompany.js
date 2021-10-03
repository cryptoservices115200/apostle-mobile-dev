import React, {useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainMediumFont, MainRegularFont, MainSemiBoldFont} from '@/views/Components';
import {Image, KeyboardAvoidingView, SafeAreaView, TouchableOpacity} from 'react-native';
import {useActionSheet} from '@expo/react-native-action-sheet';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import Input from '@/views/Components/Input';
import {formatError} from '@/utils/Utils';
import Tooltip from 'rn-tooltip'
import InfoIcon from '@/assets/ikonate_icons/info.svg';
import Info from "./Info";

const RegisterCompany = props => {
  const {state, actions} = useOvermind();
  const [name, setName] = useState(state.user.companyDetail?.name || null);
  const [type, setType] = useState(state.user.companyDetail?.type?.toUpperCase() || 'PRIVATE');
  const [website, setWebsite] = useState(state.user.companyDetail?.domain || null);
  const {showActionSheetWithOptions} = useActionSheet();
  const [logo, setLogo] = useState(state.user.companyDetail?.logo || null);
  const [localLogo, setLocalLogo] = useState(null);
  const [errors, setErrors] = useState({
    name: null,
    website: null,
  })

  console.log(errors);

  const onPressDone = async () => {
    if (!name) {
      const oErrors = {...errors};
      oErrors.name = 'Please input name!';
      setErrors(oErrors)
      return false;
    }
    if (!website) {
      const oErrors = {...errors};
      oErrors.website = 'Please input website!';
      setErrors(oErrors)
      return false;
    }
    actions.hud.show();
    try {
      let avatar = null;
      if (logo) {
        const isLogo = logo && (logo.split(':')[0] === 'http' || logo.split(':')[0] === 'https');
        if (!isLogo) {
          const {uploadFileToS3} = await actions.user.uploadFileToS3({image: logo});
          console.log(uploadFileToS3, 'res');
          avatar = uploadFileToS3.filepath;
        } else {
          avatar = logo;
        }
      }

      const params = {
        where: {id: state.currentUser?.id},
        data: {company: {}},
      };
      if (state.currentUser?.company?.id) {
        params.data.company = {
          update: {
            name,
            username: name,
            type,
            url: website,
            owner: {connect: {id: state.currentUser?.id}},
            description: state.user.companyDetail?.description || null,
            avatar,
            // employees: {
            //   update: [{
            //     where: {id: state.currentUser?.company?.employees[0]?.id},
            //     data: {
            //       user: {connect: {id: state.currentUser?.id}}
            //     },
            //   }],
            // },
          },
        };
      } else {
        params.data.company = {
          create: {
            name,
            username: name,
            type,
            url: website,
            owner: {connect: {id: state.currentUser?.id}},
            description: state.user.companyDetail?.description,
            avatar,
            employees: {
              create: [{
                user: {connect: {id: state.currentUser?.id}},
              }],
            },
          },
        };
      }
      console.log(params, 'params');
      const user = await actions.user.saveUser(params);

      if (user?.id && user?.company?.id && !user?.groups?.find(g => g.type === 'DEFAULT_COMPANY')) {
        const {saveGroup} = await actions.group.saveGroup({
          data: {
            type: 'DEFAULT_COMPANY',
            name: 'default company',
            company: {connect: {id: user?.company?.id}},
          },
        });

        const group = await actions.group.saveGroup({
          data: {
            type: 'ROLE',
            name: 'admin',
            company: {connect: {id: user?.company?.id}},
          },
        });

        const group1 = await actions.group.saveGroup({
          data: {
            type: 'ROLE',
            name: 'employee',
            company: {connect: {id: user?.company?.id}},
          },
        });

        console.log(saveGroup, group.saveGroup, 'saveGroup');

        if (saveGroup?.id) {
          await actions.user.saveUser({
            where: {id: user.id},
            data: {
              groups: {connect: [{id: saveGroup.id}, {id: group?.saveGroup?.id}, {id: group1.saveGroup?.id}]},
              company: {
                update: {
                  groups: {connect: [{id: saveGroup.id}]},
                },
              },
            },
          });
        }
      }
      console.log(user, 'user');
      if (user?.id) {
        props.navigation.navigate('RegisterCompanyFreePlan');
      }
    } catch (e) {
      console.log(e);
    } finally {
      actions.hud.hide();
    }
  };

  const onPressType = () => {
    const options = ['PUBLIC', 'PRIVATE', 'NONPROFIT', 'GOVERNMENT', 'EDUCATION', 'PERSONAL', 'Cancel'];
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: options.length - 1,
      }, (index) => {
        if (index !== options.length - 1) {
          setType(options[index]);
        }
      },
    );
  };

  const onPressLogo = () => {
    const options = ['Take New Photo', 'Photo Library', 'Cancel'];
    const cancelButtonIndex = 2;
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async buttonIndex => {
        const options = {
          width: 1400,
          height: 800,
          cropping: true,
          mediaType: 'photo',
          includeBase64: true,
        };

        try {
          let picked = null;
          if (buttonIndex === 1) {
            picked = await ImagePicker.openPicker(options);
          } else if (buttonIndex === 0) {
            picked = await ImagePicker.openCamera(options);
          }
          if (picked) {
            setLogo(picked.data);
            setLocalLogo(picked.path);
          }
        } catch (e) {
          console.log('UserSetting::_onPressAvatar failed: ', e);
        }
      },
    );
  };

  const isLogo = logo && (logo.split(':')[0] === 'http' || logo.split(':')[0] === 'https');

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <KeyboardAvoidingView style={{flex: 1}} behavior={'padding'}>
        <Container>
          <Logo source={Images.logo}/>
          <Body>
          <Title>Tell us a little about your team</Title>
          <Description>
            Make sure we've got all the right info and you can update it however you'd like.
          </Description>
          <LogoView onPress={onPressLogo}>
            {logo && <Image source={{uri: isLogo ? logo : localLogo || ''}}
                            style={{width: '100%', height: '100%', borderRadius: 6,resizeMode: 'contain'}}/>}
            {!logo && <EmptyText>Tap to upload company logo</EmptyText>}
          </LogoView>
          </Body>
          <Input
            placeholder={''}
            style={{marginTop: 35}}
            value={name}
            setValue={(v) => {
              setName(v);
              formatError('name', errors, setErrors)
            }}
            label={'Name'}
            error={errors.name}
            textContentType={'name'}
            isUpper
          />
          <Form style={{marginTop: 20}}>
            <FormText>Type</FormText>
            <FormBtn onPress={onPressType}>
              <FormText>{type}</FormText>
              <Image source={Images.icon_arrow_down}/>
            </FormBtn>
          </Form>
          <Input
            placeholder={''}
            style={{marginTop: 20}}
            value={website}
            setValue={(v) => {
              setWebsite(v);
              formatError('website', errors, setErrors)
            }}
            label={'Website'}
            error={errors.website}
            textContentType={'emailAddress'}
            isUpper={false}
          />
          <NoteView>
            {/*<Image source={Images.icon_info}/>*/}
            <Tooltip
              backgroundColor={'#fff'}
              containerStyle={{
                padding: 10,
                paddingVertical: 13,
                backgroundColor: '#ffffff',
                shadowColor: "#000000",
                shadowOpacity: 0.8,
                shadowRadius: 2,
                shadowOffset: {
                  height: 1,
                  width: 1
                }
              }}
              pointerColor={'#adacac'}
              width={'90%'}
              height={'auto'}
              popover={<ToolTipText>Try going back to the previous page and entering your work email address or ask
                someone for you companies unique registration link.</ToolTipText>}
            >
              <InfoIcon width={23} height={25}/>
            </Tooltip>
            <Note>
              Does your company already have a {'\n'}WorkReels account?
            </Note>

          </NoteView>
        </Container>
        <Bottom>
          <TouchableOpacity onPress={() => props.navigation.pop()}>
            <LineText>Back</LineText>
          </TouchableOpacity>
          <MainButton onPress={onPressDone}>
            <BtnText>Done</BtnText>
          </MainButton>
        </Bottom>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterCompany;

const EmptyText = styled(MainMediumFont)`
  color: gray;
`;

const LineText = styled(MainBoldFont)`
  color: #6600ED;
`;

const Note = styled(MainSemiBoldFont)`
  font-size: 12px;
  line-height: 14px;
  color: #4c4c4c;
  margin-left: 8px;
`;

const ToolTipText = styled(MainSemiBoldFont)`
  color: #656565;
  font-size: 12px;
  line-height: 16px;
`

const NoteView = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 18px;
  margin-bottom: 100px;
`;

const FormBtn = styled.TouchableOpacity`
  border-radius: 6px;
  background: #F7F7FE;
  padding-horizontal: 16px;
  padding-vertical: 14px;
  margin-top: 6px;
  flex-direction: row;
  ${Styles.between_center}
`;

const LogoView = styled.TouchableOpacity`
  border-radius: 6px;
  background-color: #f7f7f7;
  width: 100%;
  height: 150px;
  ${Styles.center};
  margin-top: 26px;
  padding-vertical: 20px;
`;

const Bottom = styled.View`
  background-color: white;
  border-top-width: 1px;
  border-top-color: #b4b4b4;
  padding-top: 16px;
  padding-horizontal: 20px;
  ${Styles.between_center}
  flex-direction: row;
`;

const Description = styled(MainMediumFont)`
  font-size: 16px;
  line-height: 24px;
  color: black;
  margin-top: 15px;
`;

const Body = styled.View`
  width: 100%;
`;

const Title = styled(MainSemiBoldFont)`
  font-size: 24px;
  line-height: 29px;
  color: #14142b;
  margin-top: 50px;
`;

const MainButton = styled.TouchableOpacity`
  background-color: #6600ED;
  border-radius: 40px;
  padding-horizontal: 25px;
  height: 40px;
  ${Styles.center}
`;

const BtnText = styled(MainBoldFont)`
  color: #f7f7f7;
  font-size: 14px;
`;

const FormInput = styled.TextInput`
  text-align-vertical: top;
  padding-horizontal: 16px;
  padding-vertical: 14px;
  border-radius: 6px;
  background-color: #f7f7f7;
  margin-top: 6px;
  font-size: 14px;
  color: black;
  font-family: Montserrat-Regular;
`;

const Form = styled.View`
  width: 100%;
  justify-content: flex-start;
  margin-top: 35px;
`;

const FormText = styled(MainRegularFont)`
  font-size: 14px;
  line-height: 20px;
  color: #4c4c4c;
`;

const Logo = styled.Image`
  width: 200px;
  height: 50px;
  resize-mode: contain;
  margin-top: 80px;
`;

const Container = styled.ScrollView`
  flex: 1;
  background-color: white;
  padding-horizontal: 25px;
`;
