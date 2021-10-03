import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainMediumFont, MainSemiBoldFont} from '@/views/Components';
import {Image, SafeAreaView, ScrollView, Switch, View} from 'react-native';
import {useActionSheet} from '@expo/react-native-action-sheet';
import {formatError} from '@/utils/Utils';
import Input from '@/views/Components/Input';
import Select from '@/views/Components/Select';

const AddGroup = props => {
  const {state, actions} = useOvermind();

  const [type, setType] = useState(null);
  const [name, setName] = useState(null);
  const {showActionSheetWithOptions} = useActionSheet();
  const [errors, setErrors] = useState({
    name: null,
    type: null,
  })

  const onPressType = () => {
    try {
      const options = ['Office', 'Department', 'Team', 'Company', 'Cancel'];
      showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: options.length - 1,
        }, (index) => {
          if (index !== options.length - 1) {
            setType(options[index]);
          }
        },
      );
    } catch (e) {
      console.log(e);
    }
  };

  const onPressNext = async () => {
    if (!name) {
      const oErrors = {...errors};
      oErrors.name = 'Please input name!';
      setErrors(oErrors)
      return false;
    }

    if (!type) {
      const oErrors = {...errors};
      oErrors.type = 'Please input type!';
      setErrors(oErrors)
      return false;
    }

    actions.hud.show();
    await actions.company.saveCompany({
      where: {id: state.currentUser?.company?.id},
      data: {
        groups: {
          create: [{
            name,
            type: type.toUpperCase(),
          }],
        },
      },
    });
    await actions.user.getUserById();
    actions.hud.hide();
    props.navigation.pop();
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Container>
        <ScrollView style={{flex: 1}}>
          <CloseBtn onPress={() => props.navigation.pop()}>
            <Image source={Images.icon_close_black}/>
          </CloseBtn>
          <Title>Add a Group</Title>
          <Desc>Groups are how you can get more of your team involved in creating the content they need.</Desc>
          <Input
            placeholder={'Name'}
            style={{marginTop: 22}}
            value={name}
            setValue={(v) => {setName(v); formatError('name', errors, setErrors)}}
            label={'Name'}
            error={errors.name}
            isUpper
          />
          <Select
            style={{marginTop: 20}}
            label={'Type'}
            onPress={onPressType}
            value={type}
            error={errors.type}
          />
        </ScrollView>
        <Bottom>
          <Button onPress={onPressNext}>
            <AddText style={{color: 'white'}}>Next</AddText>
          </Button>
        </Bottom>
      </Container>
    </SafeAreaView>
  );
};

export default AddGroup;

const CloseBtn = styled.TouchableOpacity`
  position: absolute;
  right: 0px;
  top: 0px;
  z-index: 10;
`;

const FormBtn = styled.TouchableOpacity`
  border-radius: 6px;
  background: #F7F7FE;
  padding-horizontal: 16px;
  padding-vertical: 14px;
  margin-top: 6px;
  flex-direction: row;
  ${Styles.between_center}
`;

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
`;

const Form = styled.View`
  width: 100%;
  margin-top: 22px;
`;

const Button = styled.TouchableOpacity`
  width: 160px;
  height: 50px;
  ${Styles.center}
  background-color: #6600ed;
  border-radius: 40px;
`;

const Bottom = styled.View`
  ${Styles.end_center}
  flex-direction: row;
  margin-bottom: 20px;
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
