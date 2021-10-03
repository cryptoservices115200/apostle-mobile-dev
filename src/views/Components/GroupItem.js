import React from 'react';
import styled from 'styled-components';
import {Images, Styles} from '@/styles';
import {MainBoldFont, MainMediumFont, MainSemiBoldFont} from '@/views/Components/controls/Text';
import {Image, TouchableOpacity, View} from 'react-native';
import {getHumanDate} from '@/utils/DateUtil';
import PersonIcon from '@/assets/ikonate_icons/person.svg'
import StorylineIcon from '@/assets/ikonate_icons/book-opened.svg'
import DeliverableIcon from '@/assets/ikonate_icons/cart.svg'
import IconMore from '@/assets/ikonate_icons/ellypsis.svg'
import {useOvermind} from '@/store';

const GroupItem = ({title, icon, isBlack, item, onPress, ...props}) => {
  const {state, actions} = useOvermind();
  return (
  <Container style={{shadowOffset: {x: 0, y: 10}}} onPress={onPress && onPress}>
    {props.isSelectMode && <SelectBtn isSelected={props.isSelected} onPress={() => props.onPress(item.id)}>
      {props.isSelected ? <Image source={Images.icon_check} style={{tintColor: 'white'}}/>: null}
    </SelectBtn>}
    <Header>
      <Badge>
        <BText>{item && item.type ? item.type : 'Office'}</BText>
      </Badge>
      {!props.isSelectMode && <Right>
        <TouchableOpacity style={{marginLeft: 27}}>
          <IconMore width={25} height={25}/>
        </TouchableOpacity>
      </Right>}
    </Header>
    <Title>{item && item.name ? item.name : 'Richmond Office'}</Title>
    <RText>Created {item && item.createdAt ? getHumanDate(item.createdAt) : 'Jan 10, 2020'}</RText>
    <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
      <View style={{marginRight: 30}}>
        <Row>
          <PersonIcon width={25} height={25}/>
          <MainBoldFont style={{fontSize: 14, lineHeight: 20, marginLeft: 5}}>{state.user.users?.filter(u => u.groups.find(g => g.id === item.id)).length || 0}</MainBoldFont>
        </Row>
        <RText>People</RText>
      </View>
      <View style={{marginRight: 30}}>
        <Row>
          <StorylineIcon width={25} height={25}/>
          <MainBoldFont style={{fontSize: 14, lineHeight: 20, marginLeft: 5}}>{item?.company?.storylines?.length || 0}</MainBoldFont>
        </Row>
        <RText>Storylines</RText>
      </View>
      <View>
        <Row>
          <DeliverableIcon width={25} height={25}/>
          <MainBoldFont style={{fontSize: 14, lineHeight: 20, marginLeft: 5}}>{item?.company?.deliverables?.length || 0}</MainBoldFont>
        </Row>
        <RText>Deliverables</RText>
      </View>
    </View>
  </Container>
)};

export default GroupItem;

const SelectBtn = styled.TouchableOpacity`
  width: 24px; height: 24px; border-radius: 20px;
  position: absolute;
  right: 10px; top: 10px;
  border: 1.5px solid #000000;
  ${Styles.center}
  z-index: 10;
  border-color: ${props => props.isSelected ? '#6600ed': 'black'};
  background-color: ${props => props.isSelected ? '#6600ed' : 'transparent'};
`

const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Title = styled(MainSemiBoldFont)`
  font-size: 24px;
  line-height: 29px;
  color: black;
  margin-top: 15px;
`;

const RText = styled(MainMediumFont)`
  font-size: 12px;
  line-height: 18px;
  color: #4c4c4c;
  margin-bottom: 15px;
`;

const Right = styled.View`
  flex-direction: row;
  ${Styles.center}
`;

const Badge = styled.View`
  padding-horizontal: 7px;
  padding-vertical: 1px;
  border-width: 1px;
  border-color: #d2d0d0;
  border-radius: 10px;
`;

const BText = styled(MainMediumFont)`
  font-size: 12px;
  line-height: 18px;
  color: #0f0f0f;
`;

const Header = styled.View`
  flex-direction: row;
  ${Styles.between_center};
  width: 100%;
`;

const Container = styled.TouchableOpacity`
  background-color: white;
  border-radius: 12px;
  shadow-color: #000000;
  elevation: 3;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  margin-bottom: 20px;
  min-height: 120px;
  padding: 15px;
`;
