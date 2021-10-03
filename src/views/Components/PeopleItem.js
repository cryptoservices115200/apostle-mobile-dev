import React from 'react';
import styled from 'styled-components';
import {Images, Styles} from '@/styles';
import {MainBoldFont, MainMediumFont, MainSemiBoldFont} from '@/views/Components/controls/Text';
import {Image, TouchableOpacity, View} from 'react-native';

const PeopleItem = ({title, icon, isBlack, data, chosenStoryline, setChosenStoryline, ...props}) => (
  <Container style={{shadowOffset: {x: 0, y: 10}}}>
    <Logo source={{uri: data.avatar || ''}}/>
    {/*{chosenStoryline === data.id && <Menu>*/}
    {/*  <CloseBtn onPress={() => setChosenStoryline(null)}>*/}
    {/*    <Image source={Images.icon_close_black}/>*/}
    {/*  </CloseBtn>*/}
    {/*  <Item>*/}
    {/*    <Image source={Images.icon_calendar} style={{tintColor: 'black'}}/>*/}
    {/*    <ItemText>Add Talent</ItemText>*/}
    {/*  </Item>*/}
    {/*  <Item>*/}
    {/*    <Image source={Images.icon_calendar} style={{tintColor: 'black'}}/>*/}
    {/*    <ItemText>Copy Share Link</ItemText>*/}
    {/*  </Item>*/}
    {/*  <Item>*/}
    {/*    <Image source={Images.icon_calendar} style={{tintColor: 'black'}}/>*/}
    {/*    <ItemText>Duplicate</ItemText>*/}
    {/*  </Item>*/}
    {/*  <Item style={{marginBottom: 50}}>*/}
    {/*    <Image source={Images.icon_calendar} style={{tintColor: 'black'}}/>*/}
    {/*    <ItemText>Archive</ItemText>*/}
    {/*  </Item>*/}
    {/*</Menu>}*/}
    <View style={{flex: 1}}>
      <Title>{data.firstName + ' ' + data.lastName}</Title>
      <Email>{data.email}</Email>
      <Bottom>
        <View style={{marginRight: 40}}>
          <SText>Groups</SText>
          <SView>
            <Image source={Images.icon_people}/>
            <SContent>{data?.groups?.length}</SContent>
          </SView>
        </View>
        <View style={{marginRight: 40}}>
          <SText>Media</SText>
          <SView>
            <Image source={Images.icon_film}
                   style={{tintColor: 'black', width: 15, height: 17, resizeMode: 'contain'}}/>
            <SContent>{data.favoriteMedias?.length}</SContent>
          </SView>
        </View>
        <View>
          <SText>Storylines</SText>
          <SView>
            <Image source={Images.icon_book}
                   style={{tintColor: 'black', width: 15, height: 17, resizeMode: 'contain'}}/>
            <SContent>{data.storylines?.length}</SContent>
          </SView>
        </View>
      </Bottom>
    </View>
    <TouchableOpacity onPress={() => setChosenStoryline(data.id)}>
      <Image source={Images.icon_more} style={{tintColor: 'black'}}/>
    </TouchableOpacity>
  </Container>
);

export default PeopleItem;

const CloseBtn = styled.TouchableOpacity`
  position: absolute;
  right: -10px;
  top: -10px;
  z-index: 32;
`;

const ItemText = styled(MainSemiBoldFont)`
  margin-left: 10px;
`;

const Item = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-bottom: 23px;
`;

const Menu = styled.ScrollView`
  width: 280px;
  padding: 20px;
  border: 1px solid #d8d8d8;
  background-color: white;
  position: absolute;
  right: 10px;
  top: 10px;
  height: 100px;
  z-index: 100;
  padding-bottom: 100px;
`;

const SView = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
`;

const SContent = styled(MainMediumFont)`
  font-size: 12px;
  line-height: 18px;
  margin-left: 6px;
`;

const SText = styled(MainSemiBoldFont)`
  font-size: 12px;
  color: #4c4c4c;
`;

const Bottom = styled.View`
  flex-direction: row;
  margin-top: 10px;
`;

const Email = styled(MainMediumFont)`
  font-size: 12px;
  line-height: 18px;
  color: #4c4c4c;
  margin-top: 4px;
`;

const Title = styled(MainBoldFont)`
  font-size: 14px;
  line-height: 20px;
`;

const Logo = styled.Image`
  width: 45px;
  height: 45px;
  border-radius: 30px;
  margin-right: 20px;
  background-color: #d8d8d8;
`;

const Container = styled.View`
  background-color: white;
  border-radius: 12px;
  shadow-color: #000000;
  elevation: 3;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  margin-bottom: 20px;
  min-height: 120px;
  flex-direction: row;
  padding: 15px;
`;
