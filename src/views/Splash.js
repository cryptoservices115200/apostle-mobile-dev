import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Platform} from 'react-native'
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainLightFont, MainMediumFont} from '@/views/Components';
import {useNavigation} from '@react-navigation/native';
import LabelInput from '@/views/Components/LabelInput';
import Space from '@/views/Components/Space';
import {Spacing} from "@/styles/Dimension";

const Splash = props => {
  const {state, actions} = useOvermind();
  const {window, isLoggedIn} = state;
  const navigation = useNavigation();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const {isPad} = Platform;
  const _go2Next = async () => {
    try {
      navigation.navigate('Main');
    } catch (e) {
      console.log(e);
    }

  };
  useEffect(() => {
    // actions.logout();
    /**
     * auto login
     */
    if (isLoggedIn && state.currentUser?.company?.id) {

      if (state.currentUser?.company?.groups?.find((g => g.name === 'basic' || g.name === 'pro' || g.name === 'enterprise'))) {
        _go2Next();
      } else {
        const isAdmin = state.currentUser?.groups?.find(g => g.name === 'admin' && g.company?.id === state.currentUser?.company?.id);
        if (isAdmin) {
          props.navigation.navigate('RegisterCompanyFreePlan', {isForPlan: true})
        } else {
          actions.alert.showError({message: "Please contact your company admin to select a plan."})
        }
      }
    }
  }, [isLoggedIn]);

  const onPressLogin = async () => {
    if (!email) {
      setEmailError('Please input email address!');
      return false;
    }

    if (!password) {
      setPasswordError('Please input password!');
      return false
    }
    actions.hud.show();
    try {
      const user = await actions.login({email, password});
      user && navigation.navigate('TaskScheduler')
    } catch (e) {
      console.log(e);
    } finally {
      actions.hud.hide();
    }
    // navigation.navigate('Main');
  };

  return (
    <Container>

      {/*<Description>*/}
      {/*Easily record and collect media{'\n'}with your teammates*/}
      {/*</Description>*/}
      {/*<WhiteBtn onPress={() => props.navigation.navigate('RegisterUser')}>*/}
      {/*<BlueText>Get Started</BlueText>*/}
      {/*</WhiteBtn>*/}
      {/*<BorderBtn onPress={() => props.navigation.navigate('SignIn')}>*/}
      {/*<BlueText style={{color: '#6600ed'}}>Login</BlueText>*/}
      {/*</BorderBtn>*/}

      <SubContainer width={isPad ? '50%' : '300px'}>
        <Title>Welcome</Title>
        <Space height={Spacing.MD}/>
        <LabelInput
          width={'100%'}
          label={'User ID'}
          placeholder={'username@chewbox.com'}
          value={email}
          setValue={setEmail}
        />
        <LabelInput
          width={'100%'}
          label={'Password'}
          placeholder={''}
          isPassword={true}
          value={password}
          setValue={setPassword}
          isBottom={true}
          onPress={() => onPressLogin()}
        />
        <LinkTextContainer>
          <LinkText>Reset Password</LinkText>
        </LinkTextContainer>
      </SubContainer>
    </Container>
  );
};

export default Splash;

const BorderBtn = styled.TouchableOpacity`
  height: 63px;
  width: 70%;
  ${Styles.center}
  border-radius: 40px;
  border-width: 2px;
  border-color: #6600ed;
  margin-top: 10px;
`;

const WhiteBtn = styled.TouchableOpacity`
  border-radius: 40px;
  background-color: #6600ed;
  height: 63px;
  width: 70%;
  ${Styles.center}
  margin-top: 29px;
`;

const BlueText = styled(MainBoldFont)`
  color: white;
  font-size: 16px;
  line-height: 24px;
`;

const Description = styled(MainMediumFont)`
  font-size: 16px;
  line-height: 24px;
  color: black;
  margin-top: 12px;
  text-align: center;
`;

const Title = styled(MainLightFont)`
  font-size: 22px;
  line-height: 39px;
  color: #fff;
  text-align: center;
  margin-top: 34px;
`;

const Logo = styled.Image`
  width: 100%;
`;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #111111;
  ${Styles.center}
`;
const LinkText = styled.Text`
  color: #FAFF01;
  font-size: 12px;
  textDecorationLine: underline;
`;
const SubContainer = styled.View`
  margin:auto;
  width: ${props => props.width}
`;
const LinkTextContainer = styled.View`
  flex-direction: row;
  margin-left: auto;
  margin-top: 20px;
`;
