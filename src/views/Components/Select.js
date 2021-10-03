import React from 'react';
import styled from 'styled-components';
import {Images, Styles} from '@/styles';
import {MainMediumFont, MainRegularFont, MainSemiBoldFont} from '@/views/Components/controls/Text';
import {Image, TouchableOpacity} from 'react-native';

const Select = ({label, value, error, onPress, style, ...props}) => (
  <Form style={style}>
    <FormHeader>
      <FormText>{label}</FormText>
      {error && <FormError numberOfLines={2}>{error}</FormError>}
    </FormHeader>
    <FormBtn onPress={onPress}>
      <FText as={MainMediumFont}>{value}</FText>
      <Image source={Images.icon_arrow_down}/>
    </FormBtn>
  </Form>
);

export default Select;

const FText = styled(MainMediumFont)`
  font-size: 14px;
  line-height: 20px;
`;

const FormError = styled(MainRegularFont)`
  font-size: 12px;
  color: red;
  margin-left: 20px;
`

const FormHeader = styled.View`
  flex-direction: row;
  ${Styles.between_center}
`

const FormBtn = styled.TouchableOpacity`
  border-radius: 6px;
  background: #F7F7FE;
  padding-horizontal: 16px;
  padding-vertical: 14px;
  margin-top: 6px;
  flex-direction: row;
  ${Styles.between_center}
`;

const Form = styled.View`
  width: 100%;
  justify-content: flex-start;
`;

const FormText = styled(MainRegularFont)`
  font-size: 14px;
  line-height: 20px;
  color: #4c4c4c;
`;