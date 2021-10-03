import {Image, View} from 'react-native';
import React from 'react';
import styled from 'styled-components';
import {MainBoldFont, MainRegularFont, MainSemiBoldFont} from '@/views/Components/controls/Text';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';

const Item = (props) => {
  return (
    <ItemContainer style={{shadowOffset: {width: 0, height: 5}}} key={props.i?.toString()} onPress={props.onPress}>
      {props.isPayment ? <ItemLogo source={props.i === 0 ? Images.ic_visa : Images.ic_master}/> :
        <Circle isLarge={props.email}>
          {props.icon ? <Image source={props.icon}/> : <CircleText>{props.name?.charAt(0).toUpperCase()}</CircleText>}
        </Circle>}
      <View>
        <ItemTitle>{props.name}</ItemTitle>
        <ItemDate>{props.description}</ItemDate>
      </View>
      {props.price && <PriceView>
        <PriceText isPositive={props.i !== 1}>{props.price}</PriceText>
      </PriceView>}
    </ItemContainer>);
};

export default Item;

const ItemLogo = styled.Image`
  margin-right: 16px;
  width: 30px;
  resize-mode: contain;
`;

const ItemDate = styled(MainRegularFont)`
  margin-top: 1px;
  color: #243656;
  opacity: 0.5;
  font-size: 12px;
  line-height: 16px;
`;

const ItemTitle = styled(MainRegularFont)`
  font-size: 16px;
  line-height: 22px;
  color: #243656;
`;
const PriceText = styled(MainSemiBoldFont)`
  font-size: 13px;
  line-height: 18px;
  color: ${props => props.isPositive ? '#37D39B' : '#F47090'}
`;

const PriceView = styled.View`
  position: absolute;
  right: 23px;
`;

const CircleText = styled(MainBoldFont)`
  font-size: 17px;
`;

const Circle = styled.View`
  width: ${props => props.isLarge ? 46 : 32}px;
  height: ${props => props.isLarge ? 46 : 32}px;
  border-radius: 20px;
  background-color: #F5F7FA;
  ${Styles.center}
  margin-right: 16px;
`;

const ItemContainer = styled.TouchableOpacity`
  background-color: white;
  border-radius: 20px;
  shadow-opacity: 0.1;
  shadow-radius: 6px;
  shadow-color: rgb(21, 70, 160);
  padding-vertical: 12px;
  padding-horizontal: 15px;
  margin-bottom: 8px;
  ${Styles.start_center};
  flex-direction: row;
`;
