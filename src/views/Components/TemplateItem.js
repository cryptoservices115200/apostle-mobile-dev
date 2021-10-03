import React, {useState} from 'react';
import styled from 'styled-components';
import {Images, Styles} from '@/styles';
import {MainBoldFont, MainMediumFont, MainSemiBoldFont} from '@/views/Components/controls/Text';
import {Image, TouchableOpacity, View} from 'react-native';
import Video from 'react-native-video';

const TemplateItem = ({title, icon, isBlack, item, ...props}) => {
  const [isPlay, setPlay] = useState(false);
  return (
    <Container style={{shadowOffset: {x: 0, y: 10}}}>
      <VideoView source={{uri: item.example?.source}} paused={!isPlay}>
        {!isPlay && <PlayBtn onPress={() => setPlay(true)}>
          <Image source={Images.icon_triangle_white}/>
        </PlayBtn>}
      </VideoView>
      <Type>{item?.category?.toUpperCase()}</Type>
      <Title>{item?.name}</Title>
      <Desc>{item?.description}</Desc>
      <View style={{flexDirection: 'row', alignItems: 'flex-end', marginTop: 40}}>
        <View style={{marginRight: 30}}>
          <Row>
            <Image source={Images.icon_draw}/>
            <MainBoldFont
              style={{fontSize: 14, lineHeight: 20, marginLeft: 5}}>{item?.storylineScenes?.length}</MainBoldFont>
          </Row>
          <RText>Scenes</RText>
        </View>
        <View style={{marginRight: 30}}>
          <Row>
            <Image source={Images.icon_film}
                   style={{width: 30, height: 25, resizeMode: 'contain', tintColor: 'black'}}/>
            <MainBoldFont style={{fontSize: 14, lineHeight: 20, marginLeft: 5}}>2</MainBoldFont>
          </Row>
          <RText>Shots</RText>
        </View>
        <View style={{marginRight: 30}}>
          <Row>
            <Image source={Images.icon_cart}
                   style={{width: 30, height: 25, resizeMode: 'contain', tintColor: 'black'}}/>
            <MainBoldFont
              style={{fontSize: 14, lineHeight: 20, marginLeft: 5}}>{item?.storylineDeliverables?.length}</MainBoldFont>
          </Row>
          <RText>Deliverables</RText>
        </View>
      </View>
      <AddBtn onPress={() => props.onPress(item)}>
        <AddText>+ Storyline</AddText>
      </AddBtn>
    </Container>
  );
};

export default TemplateItem;

const AddText = styled(MainBoldFont)`
  font-size: 16px;
  color: white;
`;

const AddBtn = styled.TouchableOpacity`
  height: 56px;
  ${Styles.center}
  padding-horizontal: 50px;
  background-color: #6600ed;
  border-radius: 40px;
  margin-top: 10px;
`;

const Desc = styled(MainMediumFont)`
  font-size: 14px;
  line-height: 20px;
  color: #4d4d4d;
  margin-top: 40px;
`;

const Title = styled(MainSemiBoldFont)`
  font-size: 24px;
  line-height: 29px;
  color: black;
`;

const Type = styled(MainSemiBoldFont)`
  font-size: 10px;
  line-height: 20px;
  color: #4c4c4c;
  margin-top: 14px;
`;

const PlayBtn = styled.TouchableOpacity`
  width: 53px;
  height: 53px;
  border-radius: 30px;
  background-color: #00000080;
  ${Styles.center}
`;

const VideoView = styled(Video)`
  background-color: #f7f7f7;
  height: 230px;
  ${Styles.center}
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

const RText = styled(MainMediumFont)`
  font-size: 12px;
  line-height: 18px;
  color: #4c4c4c;
  margin-bottom: 15px;
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
  padding: 20px;
`;
