import React from 'react';
import styled from 'styled-components';
import LinearGradient from 'react-native-linear-gradient';
import {Styles} from '@/styles';
import {MainSemiBoldFont} from '@/views/Components/controls/Text';

export const ConfirmButton = ({text, onPress, ...props}) => {
  return (<ConfirmBtn style={{shadowOffset: {width: 0, height: 11}}} onPress={onPress}>
    <ConfirmGradient colors={['#0070BA', '#1546A0']}>
      <ConfirmText>{text}</ConfirmText>
    </ConfirmGradient>
  </ConfirmBtn>);
};

const ConfirmGradient = styled(LinearGradient)`
  width: 100%;
  height: 64px;
  ${Styles.center}
  border-radius: 20px;
`;

const ConfirmText = styled(MainSemiBoldFont)`
  font-size: 16px;
  line-height: 22px;
  color: white;
`;

const ConfirmBtn = styled.TouchableOpacity`
  width: 100%;
  height: 64px;
  ${Styles.center}
  shadow-opacity: 0.5;
  shadow-radius: 20px;
  shadow-color: rgb(21, 70, 160);
  elevation: 10;
  margin-top: 50px;
`;

export default ConfirmButton;
