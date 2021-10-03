import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainMediumFont, MainRegularFont, MainSemiBoldFont} from '@/views/Components';
import {Dimensions, KeyboardAvoidingView, SafeAreaView, TouchableOpacity} from 'react-native';
import Input from '@/views/Components/Input';

const ResetPassword = props => {
  const {state, actions} = useOvermind();
  const [password, setPassword] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const onPressReset = async () => {
    if (!password) {
      setPasswordError('Please input new password!');
      return false;
    }
    const {passwordReset} = await actions.user.passwordReset({
      email: props.route.params.email,
      resetToken: props.route.params.resetToken,
      password,
    });
    if (passwordReset) {
      props.navigation.navigate('Login');
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <KeyboardAvoidingView style={{flex: 1}} behavior={'padding'}>
        <Container contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}}>
          <Logo source={Images.logo}/>
          <Body>
            <Title>Let's set a new password</Title>
            <Description>
              Enter your email address associated with your account and we'll send you an email to reset it.
            </Description>
          </Body>
          <Input
            placeholder={'******'}
            style={{marginTop: 53}}
            value={password}
            setValue={(v) => {setPassword(v); setPasswordError(null)}}
            label={'Password'}
            error={passwordError}
            isPassword
            isUpper={false}
          />
        </Container>
        <Bottom>
          <TouchableOpacity onPress={() => props.navigation.pop()}>
            <LineText>Cancel</LineText>
          </TouchableOpacity>
          <MainButton onPress={onPressReset}>
            <BtnText>Reset Password</BtnText>
          </MainButton>
        </Bottom>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ResetPassword;

const LineText = styled(MainBoldFont)`
  color: #6600ED;
`;

const Bottom = styled.View`
  background-color: white;
  border-top-width: 1px;
  border-top-color: #b4b4b4;
  padding-top: 16px;
  padding-horizontal: 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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

const Logo = styled.Image`
  width: 200px;
  height: 50px;
  resize-mode: contain;
  margin-top: 100px;
`;

const Container = styled.View`
  flex: 1;
  background-color: white;
  padding-horizontal: 25px;
  ${Styles.start_center}
`;
