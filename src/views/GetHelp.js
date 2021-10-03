import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainMediumFont, MainSemiBoldFont} from '@/views/Components';
import {Image, SafeAreaView, TouchableOpacity, View} from 'react-native';
import {formatError} from '@/utils/Utils';
import Input from '@/views/Components/Input';

const GetHelp = props => {
  const {state, actions} = useOvermind();
  const [detail, setDetail] = useState(null);
  const [errors, setErrors] = useState({
    detail: null,
  })

  const onDone = async () => {
    if (!detail) {
      const oErrors = {...errors};
      oErrors.detail = 'Please input project detail!';
      setErrors(oErrors)
      return false;
    }
    props.navigation.pop();
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Container>
        <View style={{flex: 1}}>
          <CloseBtn onPress={() => props.navigation.pop()}>
            <Image source={Images.icon_close_black}/>
          </CloseBtn>
          <Title>Get help from a{'\n'}creative director</Title>
          <Desc>Tell us a bit more about your project and a creative director will reach out to schedule a
            session.</Desc>
          <Input
            placeholder={'Enter details here'}
            style={{marginTop: 22}}
            value={detail}
            setValue={(v) => {setDetail(v); formatError('detail', errors, setErrors)}}
            label={'Project Details'}
            error={errors.detail}
            isUpper
            multiline
            inputStyle={{height: 240, textAlignVertical: 'top'}}
          />
        </View>
        <Bottom>
          <Button onPress={onDone}>
            <AddText style={{color: 'white'}}>Done</AddText>
          </Button>
        </Bottom>
      </Container>
    </SafeAreaView>
  );
};

export default GetHelp;

const FormInput = styled.TextInput`
  background-color: #f7f7f7;
  text-align-vertical: top;
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
  color: #4c4c4c;
`;

const Form = styled.View`
  width: 100%;
  margin-top: 22px;
`;

const CloseBtn = styled.TouchableOpacity`
  position: absolute;
  right: 0px;
  top: 0px;
  z-index: 10;
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
  ${Styles.end_center}
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
