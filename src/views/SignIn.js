import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainMediumFont, MainRegularFont, MainSemiBoldFont} from '@/views/Components';
import {KeyboardAvoidingView, SafeAreaView, TouchableOpacity, TextInput} from 'react-native';
import Input from '@/views/Components/Input';

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.style = {placeholderTextColor: '#3f3'}

const SignIn = props => {
  const {state, actions} = useOvermind();
  const [password, setPassword] = useState(null);
  const [email, setEmail] = useState(null);

  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

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
      await actions.login({email, password});
    } catch (e) {
      console.log(e);
    } finally {
      actions.hud.hide();
    }
    // navigation.navigate('Main');
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <KeyboardAvoidingView style={{flex: 1}} behavior={'padding'}>
        <Container contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}}>
          <Logo source={Images.logo_circle_blue}/>
          <Title>Welcome Back!</Title>
          <Desc>Log in to your WorkReels account</Desc>
          <Input
            placeholder={'yourname@gmail.com'}
            style={{marginTop: 38}}
            value={email}
            setValue={(v) => {setEmail(v); setEmailError(null)}}
            label={'Username'}
            error={emailError}
            isUpper={false}
            textContentType={'emailAddress'}
          />
          <Input
            placeholder={'******'}
            style={{marginTop: 30}}
            value={password}
            setValue={(v) => {setPassword(v); setPasswordError(null)}}
            label={'Password'}
            error={passwordError}
            isPassword
            isUpper={false}
            textContentType={'password'}
          />
          <MainButton onPress={onPressLogin}>
            <BtnText>Login</BtnText>
          </MainButton>
          <TouchableOpacity style={{marginTop: 20}} onPress={() => props.navigation.navigate('ForgotPassword')}>
            <BtnText style={{color: '#6600ed', fontFamily: 'Montserrat-Medium'}}>Forgot your password?</BtnText>
          </TouchableOpacity>

        </Container>
      </KeyboardAvoidingView>
      <Bottom>
        <BtnText style={{color: '#000000', fontFamily: 'Montserrat-Medium'}}>Don't have a WorkReels account yet?</BtnText>
        <TouchableOpacity style={{marginTop: 7}} onPress={() => props.navigation.navigate('RegisterUser')}><BtnText style={{color: '#6600ed', fontFamily: 'Montserrat-Medium'}}>Get Started</BtnText></TouchableOpacity>
      </Bottom>
    </SafeAreaView>
  );
};

export default SignIn;

const Bottom = styled.View`
  ${Styles.center}
`

const Desc = styled(MainMediumFont)`
  font-size: 16px;
  line-height: 24px;
  color: #1b2124;
`

const Title = styled(MainSemiBoldFont)`
  font-size: 24px;
  line-height: 29px;
  color: #14142b;
  margin-top: 28px;
`
const MainButton = styled.TouchableOpacity`
  background-color: #6600ED;
  border-radius: 40px;
  height: 40px;
  width: 100%;
  ${Styles.center}
  margin-top: 31px;
`;

const BtnText = styled(MainBoldFont)`
  color: #f7f7f7;
  font-size: 14px;
`;

const Logo = styled.Image`
`;

const Container = styled.View`
  flex: 1;
  background-color: white;
  padding-horizontal: 25px;
  ${Styles.center}
`;
