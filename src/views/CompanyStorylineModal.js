import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import {Images, Styles} from '@/styles';
import {useOvermind} from '@/store';
import {MainBoldFont, MainMediumFont, MainRegularFont, MainSemiBoldFont} from '@/views/Components';
import {Image, KeyboardAvoidingView, SafeAreaView} from 'react-native';

const CompanyStorylineModal = props => {
  const {state, actions} = useOvermind();

  const onPress = (confirmed) => {
    if (confirmed) {
      props.navigation.navigate('CreateStoryline');
    } else {
      props.navigation.navigate('Main', {screen: 'Storylines'});
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Container>
        <Body>
          <Title>Let's try creating your first storyline</Title>
          <CloseBtn>
            <CloseText>X</CloseText>
          </CloseBtn>
        </Body>
        <Description>
          Storylines are like folders where you can start gathering and organizing content. You can start with a
          template or come up with your own.
        </Description>
        <Image source={Images.logo_storyline} style={{alignSelf: 'center'}}/>
      </Container>
      <Bottom>
        <TextBtn onPress={() => onPress(false)}>
          <LineText>Skip</LineText>
        </TextBtn>
        <MainButton onPress={() => onPress(true)}>
          <BtnText>Create a storyline</BtnText>
        </MainButton>
      </Bottom>
    </SafeAreaView>
  );
};

export default CompanyStorylineModal;

const CloseBtn = styled.TouchableOpacity`
`;

const CloseText = styled(MainSemiBoldFont)`
  font-size: 20px;
`;

const Description = styled(MainMediumFont)`
  font-size: 16px;
  line-height: 24px;
  color: black;
  margin-top: 15px;
  margin-bottom: 100px;
`;

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
  ${Styles.between_center}
  flex-direction: row;
`;

const Body = styled.View`
  width: 100%;
  flex-direction: row;
  ${Styles.between_center}
`;

const Title = styled(MainSemiBoldFont)`
  font-size: 24px;
  line-height: 29px;
  color: #14142b;
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

const Container = styled.ScrollView`
  flex: 1;
  background-color: white;
  padding-horizontal: 25px;
`;
