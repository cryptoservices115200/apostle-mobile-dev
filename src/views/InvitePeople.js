import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainMediumFont, MainSemiBoldFont} from '@/views/Components';
import Clipboard from '@react-native-clipboard/clipboard';
import {Image, SafeAreaView, View} from 'react-native';

const InvitePeople = props => {
  const {state, actions} = useOvermind();
  const [message, setMessage] = useState(null);
  const [link, setLink] = useState(null);

  const onPressSend = async () => {
    if (!message) {
      actions.alert.showError({message: 'Please type email addresses!'});
      return false;
    }
    const emails = message.split(',');
    const contacts = [];

    emails.map(e => contacts.push({
      email: e.trim(),
    }));
    actions.hud.show();
    console.log(contacts);
    try {
      await actions.user.inviteContact({
        userId: state.currentUser?.id,
        contacts,
      });
      actions.alert.showSuccess({message: 'You\'ve sent invitations successfully'});
    } catch (e) {
      console.log(e);
    } finally {
      actions.hud.hide();
    }
  };

  const onPressCopy = () => {
    Clipboard.setString(link);
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Container>
        <View style={{flex: 1}}>
          <Title>Let's invite some people to your team!</Title>
          <Desc>
            Write in the email addresses of the people you'd like to invite and add to this storyline
          </Desc>
          <Form>
            <FormText>Enter teammate email addresses separated by a comma</FormText>
            <FormInput
              placeholder={'example@workreels.com, etc'}
              multiline
              value={message}
              onChangeText={setMessage}
              autoCapitalize={'none'}
              placeholderTextColor={'gray'}
              style={{height: 140}}/>
          </Form>
          <Button style={{marginTop: 20, width: '100%', height: 50}} onPress={onPressSend}>
            <AddText style={{color: 'white'}}>Send</AddText>
          </Button>
          <OrView>
            <Line/>
            <OrText>OR</OrText>
            <Line/>
          </OrView>

          <Desc>Send out your companies registration link and invite them to this storyline later</Desc>
          <Form>
            <FormText>Your companies registration link</FormText>
            <View>
              <FormInput
                placeholder={'app.workreels.com/register/KJHihd'} placeholderTextColor={'gray'}
                value={link}
                onChangeText={setLink}
              />
              <CopyBtn onPress={onPressCopy}>
                <Image source={Images.icon_paste} style={{tintColor: 'white'}}/>
              </CopyBtn>
            </View>
          </Form>
        </View>
        <Bottom>
          <Button onPress={() => props.navigation.pop()} style={{backgroundColor: '#F7F7FE'}}>
            <AddText style={{color: 'black'}}>Back</AddText>
          </Button>
          <Button onPress={() => props.navigation.pop()}>
            <AddText style={{color: 'white'}}>Next</AddText>
          </Button>
        </Bottom>
      </Container>
    </SafeAreaView>
  );
};

export default InvitePeople;

const CopyBtn = styled.TouchableOpacity`
  background-color: #6600ed;
  position: absolute;
  right: 0;
  top: 7px;
  ${Styles.center}
  padding: 10px;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
`;

const OrText = styled(MainMediumFont)`
  margin-horizontal: 12px;
  font-size: 16px;
  color: #4c4c4c;
`;

const Line = styled.View`
  flex: 1;
  height: 1px;
  background-color: #b4b4b4;
`;

const OrView = styled.View`
  flex-direction: row;
  ${Styles.between_center}
  margin-top: 20px;
`;

const FormInput = styled.TextInput`
  text-align-vertical: top;
  background-color: #f7f7f7;
  width: 100%;
  border-radius: 6px;
  padding: 15px;
  color: black;
  font-family: Montserrat-Medium;
  font-size: 14px;
  margin-top: 6px;
`;

const FormText = styled(MainMediumFont)`
  font-size: 14px;
  line-height: 20px;
`;


const Form = styled.View`
  width: 100%;
  margin-top: 22px;
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

const AddText = styled(MainBoldFont)`
  font-size: 16px;
  color: #6600ed;
`;

const Desc = styled(MainMediumFont)`
  font-size: 16px;
  line-height: 24px;
  color: #4c4c4c;
  margin-top: 12px;
`;

const Title = styled(MainBoldFont)`
  font-size: 26px;
  line-height: 32px;
`;

const Container = styled.View`
  flex: 1;
  background-color: white;
  padding-horizontal: 25px;
`;
