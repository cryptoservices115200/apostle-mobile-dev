import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainMediumFont, MainSemiBoldFont} from '@/views/Components';
import {Image, SafeAreaView, TouchableOpacity, View} from 'react-native';

const Archive = props => {
  const {state, actions} = useOvermind();

  const onArchive = async () => {
    actions.hud.show();
    try {
      await actions.media.saveMedia({
        where: {id: props.route.params.video?.id},
        data: {
          isArchived: true,
        },
      });
      await actions.media.getMedias();
      await actions.linkedMedia.getLinkedMedias();
      actions.alert.showSuccess({message: 'Archived media successfully!'});
      props.navigation.pop();
    } catch (e) {

    } finally {
      actions.hud.hide();
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Container>
        <View style={{flex: 1}}>
          <CloseBtn onPress={() => props.navigation.pop()}>
            <Image source={Images.icon_close_black}/>
          </CloseBtn>
          <Title>Are you sure you want to archive this storyline?</Title>
          <Desc>You will still have access to all of the associated media</Desc>
        </View>
        <Bottom>
          <TouchableOpacity onPress={() => props.navigation.pop()} style={{marginLeft: 20}}>
            <AddText style={{color: '#6600ed'}}>Cancel</AddText>
          </TouchableOpacity>
          <Button onPress={onArchive}>
            <AddText style={{color: 'white'}}>Yes, I'm Sure</AddText>
          </Button>
        </Bottom>
      </Container>
    </SafeAreaView>
  );
};

export default Archive;

const CloseBtn = styled.TouchableOpacity`
  position: absolute;
  right: 0px;
  top: 0px;
`;

const AddText = styled(MainSemiBoldFont)`
  font-size: 14px;
  line-height: 24px;
  color: #6600ed;
`;

const Desc = styled(MainMediumFont)`
  font-size: 16px;
  line-height: 24px;
  color: #4c4c4c;
  margin-top: 12px;
`;

const Button = styled.TouchableOpacity`
  width: 160px;
  height: 56px;
  ${Styles.center}
  background-color: #6600ed;
  border-radius: 40px;
`;

const Bottom = styled.View`
  ${Styles.between_center}
  flex-direction: row;
`;

const Title = styled(MainBoldFont)`
  font-size: 26px;
  line-height: 32px;
  margin-top: 30px;
`;

const Container = styled.View`
  flex: 1;
  background-color: white;
  padding-horizontal: 25px;
`;
