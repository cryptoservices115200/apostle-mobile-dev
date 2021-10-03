import React from 'react';
import styled from 'styled-components';
import {Styles} from '@/styles';
import {MainMediumFont, MainRegularFont, MainSemiBoldFont} from '@/views/Components/controls/Text';
import {TouchableOpacity} from 'react-native';

const Input = ({label, placeholder, value, setValue, isUpper, error, isPassword, style, inputStyle, ...props}) => (
  <Form style={style}>
    <FormHeader>
      <FormText>{label}</FormText>
      {error && <FormError numberOfLines={2}>{error}</FormError>}
    </FormHeader>
    <FormInput
      placeholder={placeholder}
      placeholderTextColor={'#4c4c4c'}
      value={value}
      onChangeText={setValue}
      secureTextEntry={isPassword}
      autoCapitalize={isUpper ? 'sentences' : 'none'}
      style={inputStyle}
      {...props}
    />
  </Form>
);

export default Input;

const FormError = styled(MainRegularFont)`
  font-size: 12px;
  color: red;
  margin-left: 20px;
`

const FormHeader = styled.View`
  flex-direction: row;
  ${Styles.between_center}
`

const FormInput = styled.TextInput`
  text-align-vertical: top;
  padding-horizontal: 16px;
  padding-vertical: 14px;
  border-radius: 6px;
  background-color: #f7f7f7;
  margin-top: 6px;
  font-size: 14px;
  color: black;
  font-family: Montserrat-Medium;
`;

const Form = styled.View`
  width: 100%;
  justify-content: flex-start;
`;

const FormText = styled(MainMediumFont)`
  font-size: 14px;
  line-height: 20px;
  color: #4c4c4c;
`;
