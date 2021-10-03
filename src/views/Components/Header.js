import Feather from 'react-native-vector-icons/Feather';
import React from 'react';
import styled from 'styled-components';
import {Styles} from '@/styles';
import {TouchableOpacity} from 'react-native';
import {MainSemiBoldFont} from '@/views/Components/controls/Text';

export const Header = ({title, icon, isBlack, ...props}) => (
  <Container>
    <TouchableOpacity onPress={() => props.navigation.goBack()}>
      <Feather name={'arrow-left'} size={20} color={isBlack ? 'black' : 'white'}/>
    </TouchableOpacity>
    <Title isBlack={isBlack}>{title}</Title>
    <TouchableOpacity>
      <Feather name={icon} size={20} color={isBlack ? 'black' : 'white'}/>
    </TouchableOpacity>
  </Container>
);

const Title = styled(MainSemiBoldFont)`
  font-size: 16px;
  line-height: 22px;
  color: ${props => props.isBlack ? 'black' : 'white'};
`;

const Container = styled.View`
  flex-direction: row;
  ${Styles.between_center}
  margin-horizontal: 28px;
  margin-top: 57px;
`;
