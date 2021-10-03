import React, {useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainMediumFont, MainSemiBoldFont} from '@/views/Components';
import {Image, SafeAreaView, ScrollView, TouchableOpacity, View} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

const ShareVideo = props => {
  const {state, actions} = useOvermind();
  const [url, setUrl] = useState(null);

  const onCopy = () => {
    Clipboard.setString(url);
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Container>
        <ScrollView style={{flex: 1}}>
          <CloseBtn onPress={() => props.navigation.pop()}>
            <Image source={Images.icon_close_black}/>
          </CloseBtn>
          <Title>Share this video</Title>
          <Desc>You can either copy the link below to embed anywhere or pick a social media platform.</Desc>
          <Form>
            <FormText>Shareable Link</FormText>
            <View>
              <FormInput
                placeholder={'workreels.com/orgs/true-timber'} placeholderTextColor={'gray'}
                value={url}
                onChangeText={setUrl}
              />
              <CopyBtn onPress={onCopy}>
                <Image source={Images.icon_paste} style={{tintColor: 'white'}}/>
              </CopyBtn>
            </View>
          </Form>
          <Form style={{marginTop: 35}}>
            <FormText>Pick a Platform</FormText>
            <FormContainer>
              <TouchableOpacity><Image source={Images.icon_instagram}/></TouchableOpacity>
              <TouchableOpacity><Image source={Images.icon_linkedin}/></TouchableOpacity>
              <TouchableOpacity><Image source={Images.icon_youtube}/></TouchableOpacity>
              <TouchableOpacity><Image source={Images.icon_facebook}/></TouchableOpacity>
              <TouchableOpacity><Image source={Images.icon_tiktok}/></TouchableOpacity>
            </FormContainer>
          </Form>
        </ScrollView>
      </Container>
    </SafeAreaView>
  );
};

export default ShareVideo;

const FormContainer = styled.View`
  height: 90px;
  width: 100%;
  border-radius: 6px;
  background-color: #f7f7f7;
  ${Styles.between_center};
  flex-direction: row;
  padding-horizontal: 25px;
`;

const CopyBtn = styled.TouchableOpacity`
  background-color: #6600ed;
  position: absolute;
  right: 0;
  top: 7px;
  ${Styles.center}
  padding: 10px;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
`;

const CloseBtn = styled.TouchableOpacity`
  position: absolute;
  right: 0px;
  top: 0px;
`;
const Desc = styled(MainMediumFont)`
  font-size: 14px;
  line-height: 20px;
  color: black;
  margin-top: 6px;
`;

const FormInput = styled.TextInput`
  text-align-vertical: top;
  background-color: #f7f7f7;
  width: 100%;
  border-radius: 6px;
  padding: 15px;
  color: black;
  font-family: Montserrat-Medium;
  font-size: 14px;
  margin-top: 6px;
`;

const FormText = styled(MainSemiBoldFont)`
  font-size: 14px;
  line-height: 20px;
  color: #0F0F0F;
  margin-bottom: 12px
`;

const Form = styled.View`
  width: 100%;
  margin-top: 22px;
`;
const Title = styled(MainBoldFont)`
  font-size: 26px;
  line-height: 32px;
  margin-top: 30px;
`;

const Container = styled.View`
  flex: 1;
  background-color: white;
  padding-horizontal: 25px;
`;
