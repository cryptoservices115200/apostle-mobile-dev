import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainMediumFont, MainSemiBoldFont} from '@/views/Components';
import {Image, SafeAreaView, TouchableOpacity, View} from 'react-native';
import {useActionSheet} from '@expo/react-native-action-sheet';
import ArrowLeft from '@/assets/ikonate_icons/arrow-left.svg';
import Person from '@/assets/ikonate_icons/person.svg';

const Profile = props => {
  const {state, actions} = useOvermind();
  const tabs = ['Details', 'Work', 'Education'];
  const [selectedTab, setSelectedTab] = useState('Details');
  const [firstName, setFirstName] = useState(state.currentUser?.firstName);
  const [lastName, setLastName] = useState(state.currentUser?.lastName);
  const [birthYear, setBirthYear] = useState('2021');
  const [gender, setGender] = useState('Male');
  const [race, setRace] = useState(null);
  const [company, setCompany] = useState(state.currentUser?.company?.name);
  const [role, setRole] = useState(null);
  const [workStart, setWorkStart] = useState(null);
  const [workEnd, setWorkEnd] = useState(null);
  const [workDescription, setWorkDescription] = useState(null);
  const [school, setSchool] = useState(null);
  const [eduStart, setEduStart] = useState(null);
  const [eduEnd, setEduEnd] = useState(null);
  const [eduDescription, setEduDescription] = useState(null);
  const {showActionSheetWithOptions} = useActionSheet();

  const onSave = async () => {
    const params = {
      where: {id: state.currentUser?.id},
      data: {},
    };

    if (firstName) {
      params.data.firstName = firstName;
    }
    if (lastName) {
      params.data.lastName = lastName;
    }
    if (gender) {
      params.data.gender = gender;
    }
    actions.hud.show();
    try {
      console.log(params, 'params');
      await actions.user.saveUser(params);
      actions.alert.showSuccess({message: 'Updated user profile successfully!'});
    } catch (e) {
      console.log(e);
    } finally {
      actions.hud.hide();
    }
  };

  const onPressGender = () => {
    const options = ['Male', 'Female', 'Cancel'];
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 2,
      }, (index) => {
        if (index !== 2) {
          setGender(options[index]);
        }
      },
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Container>
        <DHeader>
          <Row>
            <TouchableOpacity onPress={() => props.navigation.pop()}>
              <ArrowLeft width={25} height={25}/>
            </TouchableOpacity>
          </Row>
          <Content>
            <TouchableOpacity onPress={() => props.navigation.navigate('Avatar')}>
              <Logo as={View}>
                {state.currentUser?.avatar ? <Logo source={{uri: state.currentUser?.avatar || ''}}/> : <Person width={35} height={35}/>}
              </Logo>
            </TouchableOpacity>
            <View style={{marginLeft: 22}}>
              <Name>{state.currentUser?.firstName + ' ' + state.currentUser?.lastName}</Name>
              <Description>Project Manager @ Acme</Description>
              <SubText>
                Uploaded <SubText
                style={{color: '#6600ed'}}>{state.currentUser?.favoriteMedias?.length} videos</SubText> / In <SubText
                style={{color: '#6600ed'}}>{state.currentUser?.favoriteMedias?.length} videos</SubText>
              </SubText>
            </View>
          </Content>
          <TabBar>
            {tabs.map(t => <TabBtn onPress={() => setSelectedTab(t)} isSelected={t === selectedTab} key={t}>
              <TabText isSelected={t === selectedTab}>{t}</TabText>
            </TabBtn>)}
          </TabBar>
        </DHeader>
        <Body>
          <Title>{selectedTab}</Title>
          {selectedTab === 'Details' && <Grid style={{shadowOffset: {x: 0, y: 10}}}>
            <Form>
              <FormText>First Name</FormText>
              <FormInput
                placeholder={'First Name'}
                placeholderTextColor={'gray'}
                value={firstName}
                onChangeText={setFirstName}
              />
            </Form>
            <Form>
              <FormText>Last Name</FormText>
              <FormInput
                placeholder={'Last Name'}
                placeholderTextColor={'gray'}
                value={lastName}
                onChangeText={setLastName}
              />
            </Form>
            <Form>
              <FormText>Birth Year</FormText>
              <FormInput
                placeholder={'Birth Year'}
                placeholderTextColor={'gray'}
                value={birthYear}
                onChangeText={setBirthYear}
              />
            </Form>
            <Form>
              <FormText>Gender</FormText>
              <FormBtn onPress={onPressGender}>
                <FormText style={{color: 'black'}}>{gender}</FormText>
                <Image source={Images.icon_arrow_down}/>
              </FormBtn>
            </Form>
            <Form>
              <FormText>Race / Ethnicity</FormText>
              <FormBtn>
                <FormText style={{color: 'black'}}>{race}</FormText>
                <Image source={Images.icon_arrow_down}/>
              </FormBtn>
            </Form>
          </Grid>}
          {selectedTab === 'Work' && <Grid style={{shadowOffset: {x: 0, y: 10}}}>
            <Form>
              <FormText>Company</FormText>
              <FormInput
                placeholder={'Company'}
                placeholderTextColor={'gray'}
                value={company}
                onChangeText={setCompany}
              />
            </Form>
            <Form>
              <FormText>Role</FormText>
              <FormInput
                placeholder={'Role'}
                placeholderTextColor={'gray'}
                value={role}
                onChangeText={setRole}
              />
            </Form>
            <Form>
              <FormText>Start Year</FormText>
              <FormInput
                placeholder={'Start Year'}
                placeholderTextColor={'gray'}
                value={workStart}
                onChangeText={setWorkStart}
              />
            </Form>
            <Form>
              <FormText>End Year</FormText>
              <FormInput
                placeholder={'End Year'}
                placeholderTextColor={'gray'}
                value={workEnd}
                onChangeText={setWorkEnd}
              />
            </Form>
            <Form>
              <FormText>Description</FormText>
              <FormInput
                placeholder={'Your work details'}
                placeholderTextColor={'gray'}
                multiline
                style={{height: 100}}
                value={workDescription}
                onChangeText={setWorkDescription}
              />
            </Form>
          </Grid>}
          {selectedTab === 'Education' && <Grid style={{shadowOffset: {x: 0, y: 10}}}>
            <Form>
              <FormText>School</FormText>
              <FormInput
                placeholder={'School'}
                placeholderTextColor={'gray'}
                value={school}
                onChangeText={setSchool}
              />
            </Form>
            <Form>
              <FormText>Start Year</FormText>
              <FormInput
                placeholder={'Start Year'}
                placeholderTextColor={'gray'}
                value={eduStart}
                onChangeText={setEduStart}
              />
            </Form>
            <Form>
              <FormText>End Year</FormText>
              <FormInput
                placeholder={'End Year'}
                placeholderTextColor={'gray'}
                value={eduEnd}
                onChangeText={setEduEnd}
              />
            </Form>
            <Form>
              <FormText>Description</FormText>
              <FormInput
                placeholder={'Your education details'}
                placeholderTextColor={'gray'}
                multiline
                style={{height: 100}}
                value={eduDescription}
                onChangeText={setEduDescription}
              />
            </Form>
          </Grid>}
        </Body>
        <Bottom>
          <SaveBtn onPress={onSave}>
            <SaveText>Save</SaveText>
          </SaveBtn>
        </Bottom>
      </Container>
    </SafeAreaView>
  );
};

export default Profile;

const SaveText = styled(MainBoldFont)`
  color: white;
  font-size: 16px;
  line-height: 24px;

`;

const SaveBtn = styled.TouchableOpacity`
  background-color: #6600ed;
  padding-horizontal: 50px;
  padding-vertical: 15px;
  border-radius: 40px;
`;

const Bottom = styled.View`
  width: 100%;
  align-items: flex-end;
  padding-horizontal: 18px;
  padding-top: 10px;
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
  margin-bottom: 25px;
`;

const Grid = styled.View`
  background-color: white;
  border-radius: 12px;
  shadow-color: #000000;
  elevation: 3;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  margin-bottom: 20px;
  min-height: 120px;
  padding: 20px;
  margin-top: 18px;
`;

const Title = styled(MainSemiBoldFont)`
  font-size: 20px;
  line-height: 24px;
  margin-top: 25px;
`;

const SubText = styled(MainMediumFont)`
  font-size: 12px;
  line-height: 18px;
  margin-top: 10px;
`;

const Description = styled(MainMediumFont)`
  font-size: 14px;
  line-height: 20px;
  color: #4c4c4c;
`;

const Name = styled(MainBoldFont)`
  font-size: 20px;
  line-height: 24px;
  color: #1b2124;
`;

const Logo = styled.Image`
  width: 52px;
  height: 52px;
  border-radius: 30px;
  background-color: #d8d8d8;
  ${Styles.center}
`;

const Content = styled.View`
  flex-direction: row;
  margin-top: 25px;
`;

const Body = styled.ScrollView`
  padding-horizontal: 18px;
  flex: 1;
  background-color: #F7F7FE;
`;

const TabBtn = styled.TouchableOpacity`
  border-bottom-width: 2px;
  border-bottom-color: ${props => props.isSelected ? '#6600ed' : 'white'};
  padding-bottom: 10px;
`;

const TabText = styled(MainSemiBoldFont)`
  font-size: 14px;
  color: ${props => props.isSelected ? '#6600ed' : 'black'}
`;

const TabBar = styled.View`
  flex-direction: row;
  ${Styles.between_center};
  padding-horizontal: 20px;
  margin-top: 26px;
`;

const Row = styled.View`
  flex-direction: row;
  ${Styles.between_center}
`;

const DHeader = styled.View`
  padding: 23px;
  background-color: white;
  padding-bottom: 0px;
  padding-top: 0px;
  border-bottom-width: 1px;
  border-bottom-color: #D8D8D8;
`;

const Container = styled.View`
  flex: 1;
  background-color: white;
`;
