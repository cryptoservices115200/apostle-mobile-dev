import React, {useState} from 'react';
import styled from 'styled-components';
import {Images, Styles} from '@/styles';
import {MainBoldFont, MainMediumFont, MainSemiBoldFont} from '@/views/Components/controls/Text';
import {Image, TouchableOpacity, View} from 'react-native';
import Video from 'react-native-video';

export const VideoItem = ({title, icon, isBlack, data, chosenMedia, setChosenMedia, ...props}) => {
  const [isPlay, setPlay] = useState(false);
  return (
  <GridItem style={{shadowOffset: {x: 0, y: 10}}}>
    {/*<Logo source={Images.user1} style={{width: '100%', position: 'absolute'}}/>*/}
    <Video source={{uri: data.media?.source}} paused={!isPlay} style={{width: '100%', height: '100%', position: 'absolute'}}/>
    {/*<Overlay/>*/}
    <GHeader>
      <VSelectBtn style={{borderColor: 'white'}}>
      </VSelectBtn>
      <TouchableOpacity onPress={() => setChosenMedia(data.id)}>
        <Image source={Images.icon_more}/>
      </TouchableOpacity>
    </GHeader>
    {chosenMedia === data.id && <Menu>
      <CloseBtn onPress={() => setChosenMedia(null)}>
        <Image source={Images.icon_close_black}/>
      </CloseBtn>
      <Item onPress={() => props.navigation.navigate('VideoView', {video: data.media})}>
        <Image source={Images.icon_calendar} style={{tintColor: 'black'}}/>
        <ItemText>View</ItemText>
      </Item>
      <Item onPress={() => props.navigation.navigate('Info', {video: data})}>
        <Image source={Images.icon_calendar} style={{tintColor: 'black'}}/>
        <ItemText>Info</ItemText>
      </Item>
      <Item onPress={() => props.navigation.navigate('ShareVideo', {video: data.media})}>
        <Image source={Images.icon_calendar} style={{tintColor: 'black'}}/>
        <ItemText>Share</ItemText>
      </Item>
      <Item onPress={() => props.navigation.navigate('VideoView', {video: data.media})}>
        <Image source={Images.icon_calendar} style={{tintColor: 'black'}}/>
        <ItemText>Download</ItemText>
      </Item>
      <Item onPress={() => props.navigation.navigate('Archive', {video: data.media})} style={{marginBottom: 0}}>
        <Image source={Images.icon_calendar} style={{tintColor: 'black'}}/>
        <ItemText>Archive</ItemText>
      </Item>
    </Menu>}
    <View style={{width: '100%', alignItems: 'center', marginTop: 130}}>
      {!isPlay && <GPlayBtn onPress={() => setPlay(true)}>
        <Image source={Images.icon_triangle_white}/>
      </GPlayBtn>}
    </View>
    <View style={{paddingHorizontal: 20, marginTop: 50}}>
      <GType>{data && data.type ? data.type : ''}</GType>
      <GTitle>{data?.media?.name}</GTitle>
    </View>
    <Bottom>
      <Avatar source={{uri: data?.media?.user?.avatar || ''}}/>
      <Name>{data?.media?.user?.firstName + ' ' + data?.media?.user?.lastName}</Name>
    </Bottom>
  </GridItem>
)};

const CloseBtn = styled.TouchableOpacity`
  position: absolute;
  right: 10px;
  top: 10px;
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

const Menu = styled.View`
  width: 280px;
  padding: 20px;
  border: 1px solid #d8d8d8;
  background-color: white;
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 51;
`;

const VSelectBtn = styled.TouchableOpacity`
  width: 22px;
  height: 22px;
  border-radius: 15px;
  border-color: black;
  align-items: flex-end;
  margin-top: 13px;
  ${Styles.center}
`;

const Logo = styled.Image`
  border-radius: 12px;
  height: 100%;
  width: 65px;
`;
const Name = styled(MainMediumFont)`
  line-height: 20px;
  color: white;
  margin-left: 10px;
`;

const Avatar = styled.Image`
  width: 26px;
  height: 26px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.4);
  background-color: gray;
  border-radius: 30px;
`;

const Bottom = styled.View`
  align-items: center;
  width: 100%;
  flex-direction: row;
  margin-top: 10px;
  margin-horizontal: 20px;
`;

const GTitle = styled(MainBoldFont)`
  color: white;
  font-size: 24px;
  line-height: 29px;
`;

const GType = styled(MainSemiBoldFont)`
  font-size: 10px;
  line-height: 20px;
  color: white
`;

const GPlayBtn = styled.TouchableOpacity`
  width: 70px;
  height: 50px;
  ${Styles.center}
  background-color: #00000080;
  border-radius: 31px;
`;

const GHeader = styled.View`
  flex-direction: row;
  ${Styles.between_center};
  padding-horizontal: 20px;
  padding-top: 17px;
`;

const Overlay = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: black;
  opacity: 0.3;
  border-radius: 12px;
`;

const GridItem = styled.View`
  height: 430px;
  margin-bottom: 20px;
  background-color: black;
  border-radius: 12px;
`;
