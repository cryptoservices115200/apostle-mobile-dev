import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainMediumFont, MainRegularFont, MainSemiBoldFont} from '@/views/Components';
import {Image, KeyboardAvoidingView, SafeAreaView} from 'react-native';
import {useActionSheet} from '@expo/react-native-action-sheet';
import ImagePicker from 'react-native-image-crop-picker';
import PrivacyModal from '@/views/Modals/PrivacyModal';
import TermModal from '@/views/Modals/TermModal';
import {formatError} from '@/utils/Utils';
import Input from '@/views/Components/Input';

const RegisterProfile = props => {
  const {state, actions} = useOvermind();
  const {userDetail} = state.user
  const [firstName, setFirstName] = useState(userDetail?.name?.givenName || null);
  const [lastName, setLastName] = useState(userDetail?.name?.familyName || null);
  const [title, setTitle] = useState(userDetail?.employment?.title ||null);
  const [startYear, setStartYear] = useState(new Date().getFullYear());
  const [avatar, setAvatar] = useState(userDetail?.avatar || null);
  const [avatarLocal, setAvatarLocal] = useState(null);
  const [years, setYears] = useState([]);

  const [isOpenPrivacy, setOpenPrivacy] = useState(false)
  const [isOpenTerm, setOpenTerm] = useState(false)
  const [errors, setErrors] = useState({
    firstName: null,
    lastName: null,
    title: null,
  })

  const {showActionSheetWithOptions} = useActionSheet();

  console.log(state.currentUser?.company, props.route.params?.companyId, state.company.companies?.find(c => c.id === props.route.params?.companyId)?.name, '==========')
  useEffect(() => {
    const years = [];
    for (let i = 1960; i <= new Date().getFullYear(); i++) {
      years.push(i.toString());
    }
    years.push('Cancel');
    setYears(years);
    getGroups();
  }, []);

  const getGroups = async () => {
    actions.hud.show();
    await actions.group.getGroups();
    console.log(state.group.groups, 'groups');
    actions.hud.hide();
  };

  const onPressStartYear = () => {
    showActionSheetWithOptions(
      {
        options: years,
        cancelButtonIndex: years.length - 1,
      }, (index) => {
        if (index !== 2) {
          setStartYear(years[index]);
        }
      },
    );
  };

  const onPressAvatar = () => {
    const options = ['Take New Photo', 'Photo Library', 'Cancel'];
    const cancelButtonIndex = 2;
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async buttonIndex => {
        const options = {
          width: 800,
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
            setAvatar(picked.data);
            setAvatarLocal(picked.path);
          }
        } catch (e) {
          console.log('UserSetting::_onPressAvatar failed: ', e);
        }
      },
    );
  };

  const onPressDone = async () => {
    if (!firstName) {
      const oErrors = {...errors};
      oErrors.firstName = 'Please input first name!';
      setErrors(oErrors)
      return false;
    }

    if (!lastName) {
      const oErrors = {...errors};
      oErrors.lastName = 'Please input last name!';
      setErrors(oErrors)
      return false;
    }

    if (!title) {
      const oErrors = {...errors};
      oErrors.title = 'Please input job title!';
      setErrors(oErrors)
      return false;
    }
    actions.hud.show();
    try {
      const params = {
        where: {id: state.currentUser?.id},
        data: {
          firstName: firstName,
          firstNameLower: firstName.toLowerCase(),
          lastName: lastName,
          lastNameLower: lastName.toLowerCase(),
        },
      };

      if (props.route.params?.companyId) {
        params.data.company = {connect: {id: props.route.params?.companyId}};
        params.data.groups = {
          connect: [
            {id: state.company.companies.find(c => c.id === props.route.params?.companyId)?.groups?.find(g => g.type === 'DEFAULT_COMPANY')?.id},
            {id: state.group.groups.find(g => g.name === 'employee' && g.company?.id === props.route.params?.companyId)?.id},
          ],
        };
      }

      console.log(params);

      await actions.user.saveUser(params);
      console.log(props.route.params?.companyId, state.currentUser, '_++_+_+_+_')
      if (props.route.params?.companyId) {
        await actions.company.saveCompany({
          where: {id: props.route.params?.companyId},
          data: {
            employees: {
              create: [{
                user: {connect: {id: state.currentUser?.id}},
                title: {
                  create: {
                    name: title,
                  },
                },
                startDate: new Date(parseInt(startYear), new Date().getMonth(), new Date().getDate()),
              }],
            },
          },
        });
      } else {
        await actions.company.saveCompany({
          where: {id: state.currentUser?.company?.id},
          data: {
            employees: {
              update: [{
                where: {id: state.currentUser?.company?.employees?.find(e => e.user.id === state.currentUser.id)?.id},
                data: {
                  title: {
                    create: {
                      name: title,
                    },
                  },
                  startDate: new Date(parseInt(startYear), new Date().getMonth(), new Date().getDate()),
                }
              }],
            },
          },
        });
      }
      if (avatar) {
        await actions.user.updateUserProfile({
          avatar: avatar,
        });
      }

      props.navigation.navigate('WelcomeModal');
    } catch (e) {
      console.log(e);
    } finally {
      actions.hud.hide();
    }
  };

  const isAvatar = avatar && (avatar.split(':')[0] === 'http' || avatar.split(':')[0] === 'https');

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <KeyboardAvoidingView style={{flex: 1}} behavior={'padding'}>
        <Container>
          <Logo source={Images.logo}/>
          <Body>
            <Image source={Images.plan_logo}/>
          </Body>
          <Title>Now let's finish up your profile</Title>
          <Description>
            This will help your teammates at {state.company.companies?.find(c => c.id === props.route.params?.companyId)?.name} know it's you
          </Description>
          <Input
            placeholder={'i.e. Jane'}
            style={{marginTop: 35}}
            value={firstName}
            setValue={(v) => {setFirstName(v); formatError('firstName', errors, setErrors)}}
            label={'First Name'}
            error={errors.firstName}
            textContentType={'givenName'}
            isUpper
          />
          <Input
            placeholder={'i.e. Jackson'}
            style={{marginTop: 35}}
            value={lastName}
            setValue={(v) => {setLastName(v); formatError('lastName', errors, setErrors)}}
            label={'Last Name'}
            error={errors.lastName}
            textContentType={'familyName'}
            isUpper
          />
          <Input
            placeholder={'i.e. Marketing Manager'}
            style={{marginTop: 35}}
            value={title}
            setValue={(v) => {setTitle(v); formatError('title', errors, setErrors)}}
            label={'Title'}
            error={errors.title}
            textContentType={'jobTitle'}
            isUpper
          />
          <Form>
            <FormText>Start Year</FormText>
            <FormBtn onPress={onPressStartYear}>
              <FormText>{startYear}</FormText>
              <Image source={Images.icon_arrow_down}/>
            </FormBtn>
          </Form>
          <Form style={{marginBottom: 100}}>
            <FormText>Profile Image</FormText>
            <UploadView>
              <UploadBtn onPress={onPressAvatar}>
                <UploadText>Upload</UploadText>
              </UploadBtn>
              {avatar && <Avatar source={{uri: isAvatar ? avatar : avatarLocal || ''}}/>}
            </UploadView>
          </Form>
        </Container>
        <Bottom>
          <TextBtn onPress={() => props.navigation.pop()}>
            <LineText>Back</LineText>
          </TextBtn>
          <MainButton onPress={onPressDone}>
            <BtnText>Done</BtnText>
          </MainButton>
        </Bottom>
        <BottomText>By clicking next, you agree to {state.currentUser?.company?.name}'s <Underline onPress={() => setOpenTerm(true)}>Terms of Use</Underline> and <Underline onPress={() => setOpenPrivacy(true)}>Privacy Policy</Underline></BottomText>
        <PrivacyModal isOpen={isOpenPrivacy} closeModal={() => setOpenPrivacy(false)}/>
        <TermModal isOpen={isOpenTerm} closeModal={() => setOpenTerm(false)}/>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterProfile;

const Underline = styled(MainMediumFont)`
  text-decoration: underline;
  text-decoration-color: gray;
`

const BottomText = styled(MainMediumFont)`
  font-size: 12px;
  color: gray;
  background-color: white;
  padding-horizontal: 20px;
  line-height: 18px;
`

const Avatar = styled.Image`
  width: 100px;
  height: 100px;
  margin-left: 20px;
`;
const UploadBtn = styled.TouchableOpacity`
  background-color: white;
  border-radius: 6px;
  border-width: 1px;
  border-color: #dddddd;
  width: 76px;
  ${Styles.center}
  padding-vertical: 10px;
  height: 40px;
`;

const UploadText = styled(MainMediumFont)`
  font-size: 12px;
`;

const UploadView = styled.View`
  border-radius: 6px;
  background: #F7F7FE;
  padding-horizontal: 16px;
  padding-vertical: 7px;
  margin-top: 6px;
  flex-direction: row;
`;

const TextBtn = styled.TouchableOpacity`
`;

const LineText = styled(MainBoldFont)`
  color: #6600ED;
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

const Bottom = styled.View`
  background-color: white;
  border-top-width: 1px;
  border-top-color: #b4b4b4;
  padding-top: 16px;
  padding-bottom: 10px;
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
  ${Styles.center}
  margin-top: 30px;
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
