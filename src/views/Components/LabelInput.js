import React from 'react';
import styled from 'styled-components';
import {Styles} from '@/styles';
import {MainMediumFont, MainRegularFont, MainSemiBoldFont} from '@/views/Components/controls/Text';
import {Images} from '@/styles/Images';
import {TouchableOpacity} from "react-native";

const LabelInput = ({width, label, placeholder, value, setValue, isUpper, error, isPassword, isBottom, style, inputStyle, onPress, ...props}) => {
  return <Container width={width} isBottom={isBottom}>
    <Label>{label}</Label>
    <Input
      placeholder={placeholder}
      placeholderTextColor = '#4E4E4E'
      value={value}
      onChangeText={setValue}
      secureTextEntry={isPassword}
      autoCapitalize={isUpper ? 'sentences' : 'none'}
      style={inputStyle}
      {...props}
    />
    {isPassword && <TouchableOpacity onPress={onPress}><NextImg source={Images.icon_next}/></TouchableOpacity>}
  </Container>
};

export default LabelInput;

const Container = styled.View`
  flex-direction: row;
  border-top-width: 1px;
  border-bottom-width: ${props => props.isBottom ? 1 : 0}px;
  border-top-color: #333333;
  border-bottom-color: #333333;
  padding-vertical: 20px;
  padding-horizontal: 15px;
  width: ${props => props.width}
`;

const Label = styled(MainMediumFont)`
  color: #fff;
  font-size: 12px;
  min-width: 20%;
`;

const Input = styled.TextInput`
  color: #fff;
  width: 73%;
  font-size: 12px;
`;

const NextImg = styled.Image`
  width: 16px;
  height: 16px;
  resize-mode: contain;
`;
