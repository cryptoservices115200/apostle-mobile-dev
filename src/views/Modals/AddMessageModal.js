import React, {useEffect, useState, useRef} from 'react';
import styled from 'styled-components/native';
import {useOvermind} from '@/store';
import Modal from 'react-native-modal';
import {Images, Styles} from '@/styles';
import {Image, TouchableOpacity} from 'react-native';
import {MainBoldFont, MainSemiBoldFont} from '@/views/Components';
import {get} from 'lodash';

const AddMessageModal = props => {
  const {state, actions} = useOvermind();
  const [message, setMessage] = useState(null);

  const onPressSend = async () => {
    if (!message) {
      actions.alert.showError({message: 'Please input message'});
      return false;
    }
    actions.hud.show();
    try {
      await actions.scene.saveScene({
        where: {id: props.item?.id},
        data: {
          comments: {
            create: [{
              user: {
                connect: {id: state.currentUser?.id},
              },
              message
            }]
          }
        }
      })
      actions.alert.showSuccess({message: 'Added message to scene successfully!'});
      await actions.scene.getScenes();
      props.closeModal();
    } catch (e) {
      console.log(e)
    } finally {
      actions.hud.hide();
    }

  }
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
          <Title>Add a message</Title>
          <Desc>{get(props.item, 'medias[0].user.firstName', '') + ' ' + get(props.item, 'medias[0].user.lastName', '')} will be notified</Desc>
          <FormInput
            placeholder={'Description'} multiline
            placeholderTextColor={'gray'} style={{height: 190}}
            value={message}
            onChangeText={setMessage}
          />
        </Body>
        <Bottom>
          <TouchableOpacity onPress={props.closeModal} style={{marginLeft: 30}}>
            <AddText as={MainBoldFont} style={{color: '#6600ed'}}>Cancel</AddText>
          </TouchableOpacity>
          <Button onPress={onPressSend}>
            <AddText style={{color: 'white'}}>Send</AddText>
          </Button>
        </Bottom>
      </Container>
    </MainModal>
  );
};

export default AddMessageModal;

const AddText = styled(MainBoldFont)`
  font-size: 14px;
  line-height: 24px;
  color: #6600ed;
`

const Button = styled.TouchableOpacity`
  width: 160px;
  height: 56px;
  ${Styles.center}
  background-color: #6600ed;
  border-radius: 40px;
`

const Bottom = styled.View`
  ${Styles.between_center}
  flex-direction: row;
  margin-bottom: 20px;
`

const FormInput = styled.TextInput`
  padding-horizontal: 16px;
  text-align-vertical: top;
  padding-top: 15px;
  border-radius: 6px;
  background-color: #f7f7f7;
  margin-top: 20px;
  font-size: 14px;
  color: black;
  font-family: Montserrat-Regular;
`;

const Desc = styled(MainSemiBoldFont)`
  font-size: 16px;
  margin-top: 15px;
  color: grey;
`

const Title = styled(MainBoldFont)`
  font-size: 20px;
  margin-top: 50px;
`

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
