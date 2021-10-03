import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont} from '@/views/Components';
import {Image, SafeAreaView, View} from 'react-native';

const AddMedia = props => {
  const {state, actions} = useOvermind();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Container>
        <View style={{flex: 1}}>
          <CloseBtn onPress={() => props.navigation.pop()}>
            <Image source={Images.icon_close_black}/>
          </CloseBtn>
          <Title>Upload Media</Title>
        </View>
      </Container>
    </SafeAreaView>
  );
};

export default AddMedia;

const CloseBtn = styled.TouchableOpacity`
  position: absolute;
  right: 0px;
  top: 0px;
  z-index: 10;
`;

const Title = styled(MainBoldFont)`
  font-size: 26px;
  line-height: 32px;
  margin-top: 80px;
`;

const Container = styled.View`
  flex: 1;
  background-color: white;
  padding-horizontal: 25px;
`;
