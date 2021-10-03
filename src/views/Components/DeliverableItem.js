import React from 'react';
import styled from 'styled-components';
import {Images, Styles} from '@/styles';
import {Image, TouchableOpacity, View} from 'react-native';
import {MainMediumFont, MainSemiBoldFont} from '@/views/Components/index';

const DeliverableItem = ({data, selectedMode, isSelected, setSelected, ...props}) => (
  <Container>
    {selectedMode && <SelectBtn isSelected={isSelected} onPress={() => setSelected(data)}>
      {isSelected ? <Image source={Images.icon_check} style={{tintColor: 'white'}}/>: null}
    </SelectBtn>}
    <VideoView>
      <PlayBtn>
        <Image source={Images.icon_triangle_white}/>
      </PlayBtn>
    </VideoView>
    <Body>
      <Image source={Images.icon_video}/>
      <Content>
        <Title>{data?.name}</Title>
        <Desc>{data?.description}</Desc>
      </Content>
    </Body>
    <Body style={{borderBottomWidth: 0, justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20}}>
      <View>
        <ItemText>Quantity</ItemText>
        <ItemBody>
          <Image source={Images.icon_film} style={{tintColor: 'black', width: 20, resizeMode: 'contain'}}/>
          <IText>{data?.quantity}</IText>
        </ItemBody>
      </View>
      <View>
        <ItemText>Duration</ItemText>
        <ItemBody>
          <Image source={Images.icon_triangle_border} style={{tintColor: 'black', marginTop: 2, width: 20, resizeMode: 'contain', marginLeft: -4}}/>
          <IText>{data?.duration}s</IText>
        </ItemBody>
      </View>
      <View>
        <ItemText>Format</ItemText>
        <IText style={{marginLeft: 0}}>{data?.type?.name}</IText>
      </View>
      <TouchableOpacity onPress={props.onPress}>
        <EditText>Edit</EditText>
      </TouchableOpacity>
    </Body>
  </Container>
);

export default DeliverableItem;

const SelectBtn = styled.TouchableOpacity`
  width: 24px; height: 24px; border-radius: 20px;
  position: absolute;
  right: 10px; top: 10px;
  border: 1.5px solid white;
  z-index: 10;
  ${Styles.center}
  border-color: ${props => props.isSelected ? '#6600ed': 'white'};
  background-color: ${props => props.isSelected ? '#6600ed' : 'transparent'};
`

const EditText = styled(MainSemiBoldFont)`
  color: #6600ed;
  font-size: 12px;
`

const IText = styled(MainMediumFont)`
  line-height: 20px;
  margin-left: 7px;
`

const ItemBody = styled.View`
  flex-direction: row;
  align-items: center;
`

const ItemText = styled(MainMediumFont)`
  font-size: 12px;
  color: #4c4c4c;
`


const Desc = styled(MainSemiBoldFont)`
  font-size: 12px;
  margin-top: 5px;
`

const Title = styled(MainSemiBoldFont)`
  
`

const Content = styled.View`
  margin-left: 10px;
`

const Body = styled.View`
  padding-horizontal: 13px;
  padding-vertical: 9px;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #D3D3D3;
`

const PlayBtn = styled.TouchableOpacity`
  width: 55px; height: 55px; border-radius: 30px;
  background-color: #00000080;
  ${Styles.center}
`

const VideoView = styled.View`
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  background-color: #474762;
  height: 100px;
  width: 100%;
  ${Styles.center}
`

const Container = styled.View`
  background-color: white;
  border-radius: 12px;
  margin-bottom: 20px;
  background-color: white;
  border: 2px solid #D3D3D3;
`;
