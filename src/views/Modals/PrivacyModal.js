import React, {useEffect, useState, useRef} from 'react';
import styled from 'styled-components/native';
import {useOvermind} from '@/store';
import Modal from 'react-native-modal';
import {Images, Styles} from '@/styles';
import {Image, TouchableOpacity} from 'react-native';
import {MainBoldFont, MainSemiBoldFont} from '@/views/Components';
import {get} from 'lodash';
import WebView from 'react-native-webview';

const PrivacyModal = props => {
  const {state, actions} = useOvermind();

  return (
    <MainModal
      isVisible={props.isOpen}
      onBackdropPress={() => props.closeModal()}
    >
      <Container>
        <CloseBtn onPress={props.closeModal}>
          <Image source={Images.icon_plus_thin}/>
        </CloseBtn>
        <Body>
          <WebView source={{uri: 'https://staging.workreels.com'}} style={{flex: 1}}/>
        </Body>
      </Container>
    </MainModal>
  );
};

export default PrivacyModal;

const Body = styled.View`
  flex: 1;
`

const CloseBtn = styled.TouchableOpacity`
  position: absolute;
  right: 20px;
  top: 20px;
  z-index: 10;
`;

const MainModal = styled(Modal)`
  flex: 1;
  margin: 0;
`;

const Container = styled.View`
  flex: 1;
  background-color: white;
  padding: 20px;
`;
