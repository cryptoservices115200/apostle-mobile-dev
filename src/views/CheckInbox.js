import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainMediumFont, MainRegularFont, MainSemiBoldFont} from '@/views/Components';
import AsyncStorage from '@react-native-community/async-storage';
import {SafeAreaView} from 'react-native';

const CheckInbox = props => {
  const {state, actions} = useOvermind();
  const [email, setEmail] = useState(null);
  useEffect(() => getForgotEmail());

  const getForgotEmail = async () => {
    const emailAddress = await AsyncStorage.getItem('forgotPasswordEmail');
    setEmail(emailAddress);
  };

  const onPressResend = async () => {
    if (email) {
      const {triggerPasswordReset} = await actions.user.triggerPasswordReset({
        email: email,
        domain: 'staging-workreels.com',
      });

      if (triggerPasswordReset) {
        actions.alert.showSuccess({message: 'Email resent successfully!'});
      }
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Container>
        <Logo source={Images.logo}/>
        <Body>
          <Title>Check your inbox</Title>
          <Description>
            We just sent you an email with a link to reset your password. If you can't find it after a few minutes, we
            can
            send you another one.
          </Description>
        </Body>
        <MainButton onPress={onPressResend}>
          <BtnText>Resend</BtnText>
        </MainButton>
      </Container>
    </SafeAreaView>
  );
};

export default CheckInbox;

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
  margin-top: 60px;
`;

const BtnText = styled(MainBoldFont)`
  color: #f7f7f7;
  font-size: 14px;
`;

const Logo = styled.Image`
  width: 200px;
  height: 50px;
  resize-mode: contain;
`;

const Container = styled.View`
  flex: 1;
  background-color: white;
  padding-horizontal: 25px;
  ${Styles.center}
`;
