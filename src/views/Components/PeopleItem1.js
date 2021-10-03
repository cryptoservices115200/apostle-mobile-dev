import React from 'react';
import styled from 'styled-components';
import {Images, Styles} from '@/styles';
import {MainBoldFont, MainMediumFont, MainSemiBoldFont} from '@/views/Components/controls/Text';
import {Image, TouchableOpacity, View} from 'react-native';
import PersonIcon from '@/assets/ikonate_icons/person.svg'
import MediaIcon from '@/assets/ikonate_icons/film.svg'
import StorylineIcon from '@/assets/ikonate_icons/book-opened.svg'
import NominationIcon from '@/assets/ikonate_icons/star.svg'

const PeopleItem1 = ({title, icon, isBlack, item, ...props}) => {
  console.log(item)
  return (
  <Container style={{shadowOffset: {x: 0, y: 10}}} onPress={() => props.onPress && props.onPress(props.index)}>
    {props.isSelectMode && <SelectBtn isSelected={props.isSelected}>
      {props.isSelected ? <Image source={Images.icon_check} style={{tintColor: 'white'}}/>: null}
    </SelectBtn>}
    <View style={{flexDirection: 'row'}}>
      <Logo source={{uri: item?.user?.avatar || ''}}/>
      <View style={{flex: 1}}>
        <Title>{(item?.user?.firstName || '') + ' ' + (item?.user?.lastName || '')}</Title>
        <Email>{item?.user?.email}</Email>
      </View>
    </View>
    <View style={{flexDirection: 'row', alignItems: 'flex-end', marginTop: 20}}>
      <View style={{marginRight: 30}}>
        <Row>
          <PersonIcon width={25} height={25}/>
          <MainBoldFont
            style={{fontSize: 14, lineHeight: 20, marginLeft: 5}}>{item ? item.user?.groups.length : '12'}</MainBoldFont>
        </Row>
        <RText>Groups</RText>
      </View>
      <View style={{marginRight: 30}}>
        <Row>
          <MediaIcon width={25} height={25}/>
          <MainBoldFont style={{
            fontSize: 14,
            lineHeight: 20,
            marginLeft: 5,
          }}>{item ? item?.user?.favoriteMedias?.length : '2'}</MainBoldFont>
        </Row>
        <RText>Media</RText>
      </View>
      <View style={{marginRight: 30}}>
        <Row>
          <StorylineIcon width={25} height={25}/>
          <MainBoldFont
            style={{fontSize: 14, lineHeight: 20, marginLeft: 5}}>{item ? item.user?.storylines?.length : '3'}</MainBoldFont>
        </Row>
        <RText>Storylines</RText>
      </View>
      <View>
        <Row>
          <NominationIcon width={25} height={25}/>
          <MainBoldFont
            style={{fontSize: 14, lineHeight: 20, marginLeft: 5}}>{item ? item?.user?.nominations.length : '2'}</MainBoldFont>
        </Row>
        <RText>Nomination</RText>
      </View>
    </View>

  </Container>
)};

export default PeopleItem1;

const SelectBtn = styled.TouchableOpacity`
  width: 24px; height: 24px; border-radius: 20px;
  position: absolute;
  right: 10px; top: 10px;
  border: 1.5px solid #000000;
  ${Styles.center}
  border-color: ${props => props.isSelected ? '#6600ed': 'black'};
  background-color: ${props => props.isSelected ? '#6600ed' : 'transparent'};
`

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
  background-color: #d8d8d8;
  margin-right: 20px;
`;

const Container = styled.TouchableOpacity`
  background-color: white;
  border-radius: 12px;
  shadow-color: #000000;
  elevation: 3;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  margin-bottom: 20px;
  margin-horizontal: ${Platform.OS === 'ios' ? 2 : 0};
  min-height: 120px;
  padding: 20px;
`;
