import React from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {MainBoldFont} from '@/views/Components';
import {SafeAreaView, TouchableOpacity} from 'react-native';
import ArrowLeft from '@/assets/ikonate_icons/arrow-left.svg';
import WebView from 'react-native-webview';

const Help = props => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Container>
        <TouchableOpacity onPress={() => props.navigation.pop()}>
          <ArrowLeft width={25} height={25}/>
        </TouchableOpacity>
        <Header>
          <Title>Help</Title>
        </Header>
        <WebView source={{uri: 'https://workreels.zendesk.com/hc/en-us'}} style={{flex: 1, marginTop: 10}}/>
      </Container>
    </SafeAreaView>
  );
};

export default Help;

const Title = styled(MainBoldFont)`
  font-size: 26px;
  line-height: 32px;
  color: #1b2124;
`;

const Header = styled.View`
  ${Styles.between_center}
  flex-direction: row;
  margin-top: 10px;
`;

const Container = styled.View`
  flex: 1;
  background-color: white;
  padding-horizontal: 20px;
`;
