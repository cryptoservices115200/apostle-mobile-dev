import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainMediumFont, MainSemiBoldFont} from '@/views/Components';
import {Image, SafeAreaView} from 'react-native';

const SceneDetail = props => {
  const {state, actions} = useOvermind();
  const {scene, storylineId} = props.route.params;
  console.log(scene, 'scene');
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Container>
        <CloseBtn onPress={() => props.navigation.pop()}>
          <Image source={Images.icon_close_black}/>
        </CloseBtn>
        <Logo/>
        <Type>{scene.type?.name?.toUpperCase()}</Type>
        <Title>{scene?.name}</Title>
        <Desc>{scene?.description}</Desc>
        <Button>
          <Type style={{marginTop: 0}}>TIPS</Type>
          <Row>
            <CardText>Before you start</CardText>
            <Image source={Images.icon_arrow_right} style={{tintColor: 'black'}}/>
          </Row>
        </Button>
        <Button>
          <Type style={{marginTop: 0}}>TIPS</Type>
          <Row>
            <CardText>When your filming</CardText>
            <Image source={Images.icon_arrow_right} style={{tintColor: 'black'}}/>
          </Row>
        </Button>
        <CameraBtn onPress={() => props.navigation.navigate('Camera', {scene, storylineId})}>
          <Image source={Images.icon_camera} style={{width: 50, height: 35, resizeMode: 'contain'}}/>
        </CameraBtn>
      </Container>
    </SafeAreaView>
  );
};

export default SceneDetail;

const CameraBtn = styled.TouchableOpacity`
  width: 65px;
  height: 65px;
  border-radius: 40px;
  background-color: #6600ed;
  align-self: center;
  margin-top: 50px;
  ${Styles.center}
  position: absolute;
  bottom: 20px;
`;

const CardText = styled(MainBoldFont)`
  font-size: 14px;
  line-height: 20px;
  color: #14142b;
`;

const Row = styled.View`
  flex-direction: row;
  ${Styles.between_center};
  margin-top: 2px;
`;

const Button = styled.TouchableOpacity`
  border-width: 1px;
  border-color: #b4b4b4;
  border-radius: 12px;
  margin-top: 24px;
  padding-horizontal: 19px;
  padding-vertical: 14px;
`;

const Type = styled(MainSemiBoldFont)`
  margin-top: 14px;
  font-size: 10px;
  color: #4c4c4c;
  line-height: 20px;
`;

const Logo = styled.Image`
  width: 100%;
  height: 200px;
  background-color: #f7f7f7;
  margin-top: 10px;
`;

const CloseBtn = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 20px;
  background-color: white;
  align-self: flex-end;
  ${Styles.center}
`;

const Desc = styled(MainMediumFont)`
  font-size: 16px;
  line-height: 24px;
  color: #6D6D6D;
  margin-top: 1px;
`;

const Title = styled(MainSemiBoldFont)`
  font-size: 24px;
  line-height: 29px;
  margin-top: 1px;
`;

const Container = styled.View`
  flex: 1;
  background-color: white;
  padding-horizontal: 25px;
`;
