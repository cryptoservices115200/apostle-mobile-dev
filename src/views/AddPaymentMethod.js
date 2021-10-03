import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainMediumFont, MainRegularFont, MainSemiBoldFont} from '@/views/Components';
import {Image, SafeAreaView, ScrollView, TouchableOpacity, View} from 'react-native';
import {TextInputMask} from 'react-native-masked-text';

const AddPaymentMethod = props => {
  const {state, actions} = useOvermind();

  const [name, setName] = useState(state.currentUser?.firstName + ' ' + state.currentUser?.lastName);
  const [number, setNumber] = useState(null);
  const [ccv, setCcv] = useState(null);
  const [zipcode, setZipcode] = useState(null);

  const onPressDone = async () => {
    if (!name) {
      actions.alert.showError({message: 'Please type card name'});
      return false;
    }

    if (!number) {
      actions.alert.showError({message: 'Please type card number'});
      return false;
    }

    if (!ccv) {
      actions.alert.showError({message: 'Please type ccv'});
      return false;
    }

    if (!zipcode) {
      actions.alert.showError({message: 'Please type zipcode'});
      return false;
    }

    const params = {
      paymentMethod: {
        firstName: state.currentUser.firstName,
        lastName: state.currentUser.lastName,
        verificationCode: ccv,
        month: '10',
        year: '2022',
        number: number.replace(/[^A-Z0-9]/ig, ''),
        type: 'credit_card',
        billingZip: zipcode,
      },
    };

    console.log(params, 'params');
    const user = await actions.user.updateUserProfile(params);

    console.log(user, 'user');
    props.navigation.pop();

  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Container>
        <ScrollView style={{paddingHorizontal: 24, flex: 1}}>
          <CloseBtn onPress={() => props.navigation.pop()}><Image source={Images.icon_close_black}/></CloseBtn>
          <Title>Looks like we need to add some payment info to your account</Title>
          <Desc>This will allow you to stay on your free account and still purchase services like video editing and
            custom storylines.</Desc>
          <Form>
            <FormText>Name on Card</FormText>
            <FormInput
              placeholder={'FirstName LastName'}
              placeholderTextColor={'gray'}
              value={name}
              onChangeText={setName}
            />
          </Form>
          <Form>
            <FormText>Credit Card Number</FormText>
            <FormInput
              as={TextInputMask}
              placeholder={'0000 0000 0000 0000'}
              placeholderTextColor={'gray'}
              type={'cel-phone'}
              options={{
                maskType: 'BRL',
                withDDD: true,
                dddMask: '9999 9999 9999 9999',
              }}
              value={number}
              onChangeText={setNumber}
            />
          </Form>
          <View style={{flexDirection: 'row'}}>
            <Form style={{width: 80, marginRight: 20}}>
              <FormText>CCV</FormText>
              <FormInput
                placeholder={'***'}
                placeholderTextColor={'gray'}
                value={ccv}
                onChangeText={setCcv}
              />
            </Form>
            <Form style={{width: 'auto', flex: 1}}>
              <FormText>Zip Code</FormText>
              <FormInput
                placeholder={'00000'}
                placeholderTextColor={'gray'}
                value={zipcode}
                onChangeText={setZipcode}
              />
            </Form>
          </View>
        </ScrollView>
        <Bottom>
          <SaveBtn onPress={onPressDone}>
            <SaveText>Next</SaveText>
          </SaveBtn>
        </Bottom>
      </Container>
    </SafeAreaView>
  );
};

export default AddPaymentMethod;

const Desc = styled(MainMediumFont)`
  font-size: 16px;
  line-height: 24px;
  color: #4c4c4c;
  margin-top: 12px;
`;
const SaveText = styled(MainBoldFont)`
  color: white;
  font-size: 16px;
  line-height: 24px;

`;

const SaveBtn = styled.TouchableOpacity`
  background-color: #6600ed;
  padding-horizontal: 40px;
  padding-vertical: 10px;
  border-radius: 40px;
`;

const Bottom = styled.View`
  ${Styles.end_center}
  flex-direction: row;
  border: 0px solid #B4B4B4;
  border-top-width: 1px;
  margin-top: 30px;
  padding-top: 20px;
  padding-horizontal: 24px;
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
  color: #4C4C4C;
`;

const Form = styled.View`
  width: 100%;
  margin-top: 22px;
`;

const Title = styled(MainSemiBoldFont)`
  font-size: 24px;
  line-height: 29px;
  color: #14142b;
`;

const CloseBtn = styled.TouchableOpacity`
  position: absolute;
  right: 0px;
  top: 0px;
  z-index: 10;
`;

const Container = styled.View`
  flex: 1;
  background-color: white;
`;
