import React, {useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainMediumFont, MainRegularFont, MainSemiBoldFont} from '@/views/Components';
import {KeyboardAvoidingView, SafeAreaView} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Input from '@/views/Components/Input';

const ForgotPassword = props => {
  const {state, actions} = useOvermind();
  const [email, setEmail] = useState(null);
  const [emailError, setEmailError] = useState(null);

  const onPressDone = async () => {
    if (!email) {
      setEmailError('Please input email address!');
      return false;
    }

    try {
      const {triggerPasswordReset} = await actions.user.triggerPasswordReset({
        email: email,
        domain: 'staging-workreels.com',
      });
      if (triggerPasswordReset) {
        AsyncStorage.setItem('forgotPasswordEmail', email);
        actions.alert.showSuccess({message: 'Email sent successfully!'});
        props.navigation.navigate('CheckInbox');
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>

      <KeyboardAvoidingView style={{flex: 1}} behavior={'padding'}>
        <Container>
          <Logo source={Images.logo}/>
          <Body>
            <Title>Forgot your password?{'\n'}We can help!</Title>
            <Description>
              Enter your email address associated with your account and we'll send you an email to reset it.
            </Description>
          </Body>
          <Input
            placeholder={'yourname@gmail.com'}
            style={{marginTop: 53}}
            value={email}
            setValue={(v) => {setEmail(v); setEmailError(null)}}
            label={'Email Address'}
            error={emailError}
            isUpper={false}
          />
        </Container>
        <Bottom>
          <TextBtn onPress={() => props.navigation.navigate('SignIn')}>
            <LineText>Back to Login</LineText>
          </TextBtn>
          <MainButton onPress={onPressDone}>
            <BtnText>Done</BtnText>
          </MainButton>
        </Bottom>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPassword;

const TextBtn = styled.TouchableOpacity`
`;

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

const Container = styled.ScrollView`
  flex: 1;
  background-color: white;
  padding-horizontal: 25px;
`;
