import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainMediumFont, MainRegularFont, MainSemiBoldFont} from '@/views/Components';
import {KeyboardAvoidingView, SafeAreaView, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {blacklist_domains} from '@/Constants';
import Input from '@/views/Components/Input';
import Space from '@/views/Components/Space';

const RegisterUser = props => {
  const {state, actions} = useOvermind();
  const [password, setPassword] = useState(null);
  const [email, setEmail] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const pwdRegex = new RegExp("^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

  useEffect(() => {
    getCompanies();
  }, []);

  const getCompanies = async () => {
    await actions.company.getCompanies();
    console.log(state.company.companies, 'companies');
  };

  const onPressNext = async () => {
    if (!email) {
      setEmailError('Please input email address!');
      return false;
    }

    if (!password) {
      setPasswordError('Please input password!');
      return false
    }

    if (!pwdRegex.test(password)) {
      setPasswordError('Please input valid password!');
      return false;
    }

    actions.hud.show();
    try {
      await actions.createAppUser({
        email, password,
      });
      await actions.login({email, password});
      if (state.currentUser?.id) {
        const domain = email?.split('@')[1];
        if (state.company.companies?.find(c => c.url === domain)) {
          props.navigation.navigate('RegisterProfile', {companyId: state.company.companies?.find(c => c.url === domain)?.id});
        } else {
          if (!blacklist_domains.find(d => d === domain?.toLowerCase())) {
            await actions.user.getClearbitCompany({domain});
            console.log(state.user.companyDetail);
          }
          props.navigation.navigate('RegisterCompany');
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      actions.hud.hide();
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <KeyboardAvoidingView style={{flex: 1}} behavior={'padding'}>
        <Container>
          <Logo source={Images.logo}/>
          <Body>
          <Title>Let's start by creating your account</Title>
          <Description>
            WorkReels helps you and your team tell authentic stories with video
          </Description>
          </Body>
          <Input
            placeholder={'yourname@gmail.com'}
            style={{marginTop: 30}}
            value={email}
            setValue={(v) => {
              setEmail(v);
              setEmailError(null)
            }}
            label={'EMAIL'}
            error={emailError}
            isUpper={false}
            textContentType={'emailAddress'}
          />
          <Input
            placeholder={'******'}
            style={{marginTop: 30}}
            value={password}
            setValue={(v) => {
              setPassword(v);
              setPasswordError(null)
            }}
            label={'PASSWORD'}
            error={passwordError}
            isPassword
            isUpper={false}
            textContentType={'password'}
          />
          <Desc>At least 8 characters and a capital letter, number, and special character</Desc>
          <Space height={60}/>
          <Desc>By selecting Agree and Register below, I agree to</Desc>
          <View style={{flexDirection: 'row'}}>
            <Desc style={{marginTop: 0}}>WorkReel's</Desc>
            <HighlightTextContainer onPress={() => {
            }}>
              <HighlightText>
                Terms and Conditions
              </HighlightText>
            </HighlightTextContainer>
          </View>
          <Space height={10}/>
          <TouchableOpacity onPress={onPressNext}>
            <GradientBtnContainer start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#531ad7', '#0e0868']}>
              <GradientBtnText>
                Agree and Register
              </GradientBtnText>
            </GradientBtnContainer>
          </TouchableOpacity>
          <Space height={10}/>
          <View style={{flexDirection: 'row'}}>
            <Desc style={{marginTop: 0}}>Already have an account? </Desc>
            <HighlightTextContainer onPress={() => props.navigation.navigate('SignIn')}>
              <HighlightText>
                Log In
              </HighlightText>
            </HighlightTextContainer>
          </View>
        </Container>


        {/*<Bottom>*/}
        {/*<TouchableOpacity onPress={() => {props.navigation.pop(); actions.logout()}}>*/}
        {/*<BtnText style={{color: '#6600ed'}}>Back</BtnText>*/}
        {/*</TouchableOpacity>*/}
        {/*<MainButton onPress={onPressNext}>*/}
        {/*<BtnText>Next</BtnText>*/}
        {/*</MainButton>*/}
        {/*</Bottom>*/}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterUser;

const Desc = styled(MainRegularFont)`
  font-size: 12px;
  line-height: 18px;
  color: #4c4c4c;
  margin-top: 11px;
`;

const Bottom = styled.View`
  background-color: white;
  border-top-width: 1px;
  border-top-color: #b4b4b4;
  padding-top: 16px;
  padding-horizontal: 20px;
  flex-direction: row;
  ${Styles.between_center}
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

const HighlightTextContainer = styled.TouchableOpacity`
  margin-top: 2px;
  margin-left: 3px;
`;

const HighlightText = styled.Text`
  color: #5a0ae4;
  font-size: 12px;
  textDecorationLine: underline
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
  margin-top: 130px;
`;

const Container = styled.ScrollView`
  flex: 1;
  background-color: white;
  padding-horizontal: 25px;
`;

const GradientBtnContainer = styled(LinearGradient)`
  padding-vertical: 7px;
  width: 180px;
  border-radius: 7px;
`;
const GradientBtnText = styled.Text`
  color: #ebdcd8;
  font-size: 18px;
  text-align:center;
`;
