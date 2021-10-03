import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainMediumFont} from '@/views/Components';
import {Image, KeyboardAvoidingView, SafeAreaView, View} from 'react-native';

const CreateStoryline = props => {
  const {state, actions} = useOvermind();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <KeyboardAvoidingView style={{flex: 1}} behavior={'padding'}>
        <Container>
          <CloseBtn onPress={() => props.navigation.pop()}>
            <Image source={Images.icon_plus_thin}/>
          </CloseBtn>
          <Title>Create a Storyline</Title>
          <Item onPress={() => props.navigation.navigate('SelectTemplate')}>
            <View style={{width: 100, alignItems: 'center'}}>
              <Image source={Images.logo_template}/>
            </View>
            <View>
              <Row>
                <ITitle>Select a Template</ITitle>
                <Image source={Images.icon_arrow_right}/>
              </Row>
              <Desc>Pick from one of our premade{'\n'}templates.</Desc>
            </View>
          </Item>
          <Item onPress={() => props.navigation.navigate('AdditionalDetail')}>
            <View style={{width: 100, alignItems: 'center'}}>
              <Image source={Images.logo_scratch}/>
            </View>
            <View>
              <Row>
                <ITitle>Start from Scratch</ITitle>
                <Image source={Images.icon_arrow_right}/>
              </Row>
              <Desc>Customize your own unique {'\n'}storyline.</Desc>
            </View>
          </Item>
          <Item onPress={() => props.navigation.navigate('GetHelp')}>
            <View style={{width: 100, alignItems: 'center'}}>
              <Image source={Images.logo_teacher} style={{borderRadius: 50}}/>
            </View>
            <View>
              <Row>
                <ITitle>Get Help</ITitle>
                <Image source={Images.icon_arrow_right}/>
              </Row>
              <Desc>Get help from one of our{'\n'}in-house creative directors{'\n'}to create a custom storyline.</Desc>
            </View>
          </Item>
        </Container>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateStoryline;

const Desc = styled(MainMediumFont)`
  font-size: 14px;
  line-height: 22px;
  margin-top: 5px;
`;

const ITitle = styled(MainBoldFont)`
  line-height: 20px;
  font-size: 14px;
  margin-right: 10px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Item = styled.TouchableOpacity`
  flex-direction: row;
  padding-horizontal: 20px;
  margin-top: 40px;
  width: 100%;
`;

const Title = styled(MainBoldFont)`
  font-size: 26px;
  line-height: 32px;
`;

const CloseBtn = styled.TouchableOpacity`
  ${Styles.center}
  width: 36px;
  height: 36px;
  border-radius: 20px;
  background-color: #f7f7f7;
  position: absolute;
  right: 30px;
  top: 0px;
  z-index: 10;
`;

const Container = styled.View`
  flex: 1;
  background-color: white;
  padding-horizontal: 25px;
  ${Styles.center}
`;
