import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainMediumFont, MainRegularFont, MainSemiBoldFont} from '@/views/Components';
import {Dimensions, Image, KeyboardAvoidingView, SafeAreaView, TouchableOpacity, View} from 'react-native';
import GroupItem from '@/views/Components/GroupItem';
import PeopleItem1 from '@/views/Components/PeopleItem1';
import {useActionSheet} from '@expo/react-native-action-sheet';
import moment from 'moment';

const CompanyGroupDetail = props => {
  const {state, actions} = useOvermind();
  const {showActionSheetWithOptions} = useActionSheet();
  const {data} = props.route.params;
  const tabs = ['Info', 'People'];
  const [name, setName] = useState(data.name);
  const [type, setType] = useState(data.type);
  const [selectedTab, setSelectedTab] = useState('Info');
  const onPressType = () => {
    try {
      const options = ['Office', 'Department', 'Team', 'Company', 'Cancel'];
      showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: options.length - 1,
        }, (index) => {
          if (index !== options.length - 1) {
            setType(options[index].toUpperCase());
          }
        },
      );
    } catch (e) {
      console.log(e);
    }
  };

  const onPressType1 = (user) => {
    const options = ['Director', 'Employee', 'Cancel'];
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: options.length - 1,
      }, async (index) => {

        if (index !== options.length - 1) {
          if (options[index]?.toLowerCase() !== user?.userGroups?.find(g => g.group.id === data.id)?.subgroups[0]?.group?.name) {
            actions.hud.show();
            const group = state.group.groups?.find(g => g.name === options[index]?.toLowerCase() && g.company?.id === state.currentUser?.company?.id && g.type === 'ROLE');
            console.log(group);
            if (group) {
              await actions.user.saveUser({
                where: {id: user?.id},
                data: {
                  userGroups: {
                    update: [{
                      where: {id: user?.userGroups?.find(g => g.group.id === data.id)?.id},
                      data: {
                        subgroups: {
                          disconnect: [{id: user?.userGroups?.find(g => g.group.id === data.id)?.subgroups[0]?.id}],
                          create: [{group: {connect: {id: group.id}}}],
                        },
                      },
                    }],
                  },
                },
              });
            } else {
              await actions.user.saveUser({
                where: {id: user?.id},
                data: {
                  userGroups: {
                    update: [{
                      where: {id: user?.userGroups?.find(g => g.group.id === data.id)?.id},
                      data: {
                        subgroups: {
                          disconnect: [{id: user?.userGroups?.find(g => g.group.id === data.id)?.subgroups[0]?.id}],
                          create: [
                            {
                              group:
                                {
                                  create: {
                                    name: options[index].toLowerCase(),
                                    type: 'ROLE',
                                    company: {connect: {id: state.currentUser?.company?.id}},
                                  },
                                },
                            }],
                        },
                      },
                    }],
                  },
                },
              });
              await actions.group.getGroups();
            }
            await actions.user.getUserById();
            actions.hud.hide();
          }
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
              <Image source={Images.icon_arrow_left}/>
            </TouchableOpacity>
          </Row>
          <Title>
            {data.name}
          </Title>
          <TabBar>
            {tabs.map(t => <TabBtn onPress={() => setSelectedTab(t)} isSelected={t === selectedTab} key={t}>
              <TabText isSelected={t === selectedTab}>{t}</TabText>
            </TabBtn>)}
          </TabBar>
        </DHeader>
        <Body>
          <Row style={{width: '100%', justifyContent: 'space-between'}}>
            <SubTitle>{selectedTab}</SubTitle>
            {selectedTab === 'People' &&
            <TouchableOpacity style={{marginTop: 25}} onPress={() => props.navigation.navigate('SelectPeople', {
              group: data,
              newUsers: state.currentUser?.company?.employees?.filter(e => !e?.user?.userGroups?.find(g => g.group.id === data.id)),
            })}><Image source={Images.icon_plus}/></TouchableOpacity>}
          </Row>
          {selectedTab === 'Info' && <View>
            <Grid style={{shadowOffset: {x: 0, y: 10}}}>
              <View>
                <Row>
                  <Image source={Images.icon_person}/>
                  <MainBoldFont style={{
                    fontSize: 14,
                    lineHeight: 20,
                    marginLeft: 5,
                  }}>{state.user.users?.filter(u => u.groups.find(g => g.id === data.id)).length || 0}</MainBoldFont>
                </Row>
                <RText>Users</RText>
              </View>
              <View>
                <Row>
                  <Image source={Images.icon_book}
                         style={{width: 30, height: 25, resizeMode: 'contain', tintColor: 'black'}}/>
                  <MainBoldFont style={{
                    fontSize: 14,
                    lineHeight: 20,
                    marginLeft: 5,
                  }}>0</MainBoldFont>
                </Row>
                <RText>Storylines</RText>
              </View>
              <View>
                <Row>
                  <Image source={Images.icon_film}
                         style={{width: 30, height: 25, resizeMode: 'contain', tintColor: 'black'}}/>
                  <MainBoldFont style={{
                    fontSize: 14,
                    lineHeight: 20,
                    marginLeft: 5,
                  }}>0</MainBoldFont>
                </Row>
                <RText>Edited Media</RText>
              </View>
            </Grid>
            <Grid style={{shadowOffset: {x: 0, y: 10}}}>
              <View style={{width: '100%'}}>
                <Form>
                  <FormText>Name</FormText>
                  <FormInput
                    placeholder={'Name'}
                    placeholderTextColor={'gray'}
                    value={name}
                    onChangeText={setName}
                  />
                </Form>
                <Form>
                  <FormText>Gender</FormText>
                  <FormBtn onPress={onPressType}>
                    <FormText style={{color: 'black'}}>{type}</FormText>
                    <Image source={Images.icon_arrow_down}/>
                  </FormBtn>
                </Form>
              </View>
            </Grid>
          </View>}

          {selectedTab === 'People' && <View>
            {state.currentUser?.company?.employees?.filter(e => e?.user?.userGroups?.find(g => g.group.id === data.id))?.length > 0 &&
            <Grid style={{shadowOffset: {x: 0, y: 10}}}>
              <View style={{width: '100%'}}>
                {state.currentUser?.company?.employees?.filter(e => e?.user?.userGroups?.find(g => g.group.id === data.id))?.map((item, index) =>
                  <Item key={index}>
                    <Left>
                      <Logo source={{uri: item?.user?.avatar || ''}}/>
                      <Content>
                        <ItemTitle>{item?.user?.firstName || ''} {item?.user?.lastName || ''}</ItemTitle>
                        <ItemDesc>{item?.user?.email || ''}</ItemDesc>
                      </Content>
                    </Left>
                    <ItemBtn onPress={() => onPressType1(item.user)}>
                      <BtnText>{item?.user?.userGroups?.find(g => g.group.id === data.id)?.subgroups[0]?.group?.name === 'employee' ? 'Talent' : item?.user?.userGroups?.find(g => g.group.id === data.id)?.subgroups[0]?.group?.name === 'director' ? 'Director' : ''}</BtnText>
                      <Image source={Images.icon_arrow_down}/>
                    </ItemBtn>
                  </Item>)}
              </View>
            </Grid>}
          </View>}
        </Body>
      </Container>
    </SafeAreaView>
  );
};

export default CompanyGroupDetail;

const Left = styled.View`
  flex-direction: row;
  align-items: center;
`;

const BtnText = styled(MainMediumFont)`
  line-height: 20px;
`;

const ItemBtn = styled.TouchableOpacity`
  padding-horizontal: 12px;
  padding-vertical: 14px;
  background: #F7F7FE;
  ${Styles.between_center}
  flex-direction: row;
  width: 100px;
  border-radius: 6px;
`;

const ItemDesc = styled(MainMediumFont)`
  font-size: 12px;
  line-height: 18px;
  color: #1b2124;
  margin-top: 2px;
`;

const ItemTitle = styled(MainBoldFont)`
  line-height: 20px;
  color: black;
`;

const Content = styled.View`
  margin-left: 8px;
`;

const Logo = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #d8d8d8;
`;

const Item = styled.View`
  flex-direction: row;
  width: 100%;
  ${Styles.between_center}
  margin-bottom: 18px;
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
  margin-top: 22px;
`;

const RText = styled(MainMediumFont)`
  font-size: 12px;
  line-height: 18px;
  color: #4c4c4c;
`;

const SubTitle = styled(MainSemiBoldFont)`
  font-size: 20px;
  line-height: 24px;
  margin-top: 25px;
`;

const Grid = styled.View`
  background-color: white;
  border-radius: 12px;
  shadow-color: #000000;
  elevation: 3;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  margin-bottom: 0px;
  padding: 20px;
  margin-top: 18px;
  flex-direction: row;
  ${Styles.between_center}
`;

const Title = styled(MainBoldFont)`
  font-size: 28px;
  line-height: 34px;
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
  flex: 1;
  ${Styles.center}
`;

const TabText = styled(MainSemiBoldFont)`
  font-size: 14px;
  color: ${props => props.isSelected ? '#6600ed' : 'black'}
`;

const TabBar = styled.View`
  flex-direction: row;
  ${Styles.between_center};
  margin-top: 26px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
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
