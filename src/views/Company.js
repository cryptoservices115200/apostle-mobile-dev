import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainMediumFont, MainSemiBoldFont} from '@/views/Components';
import {FlatList, Image, RefreshControl, SafeAreaView, ScrollView, TouchableOpacity, View} from 'react-native';
import GroupItem from '@/views/Components/GroupItem';
import PeopleItem1 from '@/views/Components/PeopleItem1';
import {useActionSheet} from '@expo/react-native-action-sheet';
import moment from 'moment';
import ArrowLeft from '@/assets/ikonate_icons/arrow-left.svg';
import PersonIcon from '@/assets/ikonate_icons/person.svg';
import GroupIcon from '@/assets/ikonate_icons/people.svg';
import StorylineIcon from '@/assets/ikonate_icons/book-opened.svg';
import MediaIcon from '@/assets/ikonate_icons/film.svg';
import PlusIcon from '@/assets/ikonate_icons/plus.svg';

const Company = props => {
  const {state, actions} = useOvermind();
  const {showActionSheetWithOptions} = useActionSheet();
  const tabs = ['Info', 'Groups', 'People', 'Branding', 'Billing'];

  const [selectedTab, setSelectedTab] = useState('Info');
  const {company} = state.currentUser;
  const [url, setUrl] = useState(company.url);
  const [description, setDescription] = useState(company?.description);
  const [type, setType] = useState(company.entityType || 'Private');
  const [address1, setAddress1] = useState(company.addresses[0]?.address);
  const [address2, setAddress2] = useState(company.addresses[0]?.address2);
  const [city, setCity] = useState(company.addresses[0]?.city);
  const [state1, setState] = useState(company.addresses[0]?.state);
  const [postalCode, setPostalCode] = useState(company.addresses[0]?.postalCode);
  const [country, setCountry] = useState(company.addresses[0]?.country);
  const [linkedIn, setLinkedIn] = useState(null);
  const [twitter, setTwitter] = useState(null);
  const [publicBio, setPublicBio] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const types = ['OFFICE', 'DEPARTMENT', 'TEAM', 'COMPANY'];

  useEffect(() => {
    getGroups();
  }, []);

  const getGroups = async () => {
    await actions.group.getGroups();
  };

  console.log('current user-----', state.currentUser);

  const onPressType = () => {
    const options = ['Public', 'Private', 'Cancel'];
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 2,
      }, (index) => {
        if (index !== 2) {
          setType(options[index]);
        }
      },
    );
  };

  const onSaveCompany = async () => {
    const params = {
      where: {id: company?.id},
      data: {
        username: company.username,
        name: company.name,
        entityType: type,
        addresses: {
          update: [{
            where: {id: company.addresses[0].id},
            data: {
              address: address1,
              address2,
              city, state: state1, postalCode, country,
            },
          }],
        },
      },
    };
    actions.hud.show();
    try {
      await actions.company.saveCompany(params);
    } catch (e) {
      console.log(e, 'error');
    } finally {
      actions.hud.hide();
    }
  };

  const onAdd = () => {
    if (selectedTab === 'Groups') {
      props.navigation.navigate('AddGroup');
    } else if (selectedTab === 'People') {
      props.navigation.navigate('SelectPeople', {isCompany: true});
    }
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
          <Title>
            {state.currentUser?.company?.name}
          </Title>
          <TabBar>
            {tabs.map(t => <TabBtn onPress={() => setSelectedTab(t)} isSelected={t === selectedTab} key={t}>
              <TabText isSelected={t === selectedTab}>{t}</TabText>
            </TabBtn>)}
          </TabBar>
        </DHeader>
        <Body as={(selectedTab === 'Groups' || selectedTab === 'People') ? View : ScrollView}>
          <Row style={{width: '100%', justifyContent: 'space-between'}}>
            <SubTitle>{selectedTab}</SubTitle>
            {(selectedTab === 'Groups' || selectedTab === 'People') &&
            <TouchableOpacity style={{marginTop: 25}} onPress={onAdd}>
              <PlusIcon width={25}
                        height={25}/></TouchableOpacity>}
          </Row>
          {selectedTab === 'Info' && <View>
            <Grid style={{shadowOffset: {x: 0, y: 10}}}>
              <View>
                <Row>
                  <PersonIcon width={25} height={25}/>
                  <MainBoldFont style={{
                    fontSize: 14,
                    lineHeight: 20,
                    marginLeft: 5,
                  }}>{state.currentUser?.company?.employees?.length}</MainBoldFont>
                </Row>
                <RText>Users</RText>
              </View>
              <View>
                <Row>
                  <GroupIcon width={25} height={25}/>
                  <MainBoldFont style={{
                    fontSize: 14,
                    lineHeight: 20,
                    marginLeft: 5,
                  }}>{state.currentUser?.company?.groups?.filter(g => types.find(t => t === g.type)).length}</MainBoldFont>
                </Row>
                <RText>Groups</RText>
              </View>
              <View>
                <Row>
                  <StorylineIcon width={25} height={25}/>
                  <MainBoldFont style={{
                    fontSize: 14,
                    lineHeight: 20,
                    marginLeft: 5,
                  }}>{state.currentUser?.company?.storylines?.length}</MainBoldFont>
                </Row>
                <RText>Storylines</RText>
              </View>
              <View>
                <Row>
                  <MediaIcon width={25} height={25}/>
                  <MainBoldFont style={{
                    fontSize: 14,
                    lineHeight: 20,
                    marginLeft: 5,
                  }}>{state.currentUser?.company?.media?.length}</MainBoldFont>
                </Row>
                <RText>Edited Media</RText>
              </View>
            </Grid>
            <Grid style={{flexDirection: 'column', width: '100%', alignItems: 'flex-start'}}>
              <Row style={{justifyContent: 'space-between', width: '100%'}}>
                <PText>Basic Plan</PText>
                <ProgressText>12%</ProgressText>
              </Row>
              <ProgressView>
                <Progress>
                  <Image source={Images.progress}/>
                </Progress>
              </ProgressView>
              <TouchableOpacity><UText>Upgrade your plan</UText></TouchableOpacity>
            </Grid>
            <Grid style={{flexDirection: 'column', width: '100%', alignItems: 'flex-start', paddingHorizontal: 0}}>
              <MainBoldFont style={{fontSize: 14, lineHeight: 20}}>Details</MainBoldFont>
              <DText>Name</DText>
              <DContent>{state.currentUser.company.name}</DContent>
              <DText>Slug</DText>
              <DContent>{state.currentUser.company.slug}</DContent>
              <Row style={{justifyContent: 'space-between', width: '100%'}}>
                <DText>Account Owner</DText>
                <TouchableOpacity><DText style={{color: '#6600ed'}}>Edit</DText></TouchableOpacity>
              </Row>
              <DContent>{state.currentUser?.company?.owner?.email}</DContent>
              <Form>
                <FormText>Type</FormText>
                <FormBtn onPress={onPressType}>
                  <FormText
                    style={{color: 'black'}}>{type + ' Company'}</FormText>
                  <Image source={Images.icon_arrow_down}/>
                </FormBtn>
              </Form>
              <Form>
                <FormText>Description</FormText>
                <FormInput
                  placeholder={'Description'} multiline
                  placeholderTextColor={'gray'} style={{height: 190}}
                  value={description}
                  onChangeText={setDescription}
                />
              </Form>
              {state.currentUser.company?.addresses?.length > 0 && <Container style={{width: '100%'}}>
                <MainBoldFont style={{fontSize: 14, lineHeight: 20, marginTop: 26}}>Address</MainBoldFont>
                <Form>
                  <FormText>Address 1</FormText>
                  <FormInput placeholder={'Address 1'} placeholderTextColor={'gray'}
                             value={address1} onChangeText={setAddress1}/>
                </Form>
                <Form>
                  <FormText>Address 2</FormText>
                  <FormInput placeholder={'Address 2'} placeholderTextColor={'gray'}
                             value={address2} onChangeText={setAddress2}/>
                </Form>
                <Form>
                  <FormText>City</FormText>
                  <FormInput placeholder={'City'} placeholderTextColor={'gray'}
                             value={city} onChangeText={setCity}/>
                </Form>
                <Form>
                  <FormText>State</FormText>
                  <FormBtn>
                    <FormText style={{color: 'black'}}> {state1}</FormText>
                    <Image source={Images.icon_arrow_down}/>
                  </FormBtn>
                </Form>
                <Form>
                  <FormText>Zip</FormText>
                  <FormInput placeholder={'Zip'} placeholderTextColor={'gray'}
                             value={postalCode} onChangeText={setPostalCode}/>
                </Form>
                <Form>
                  <FormText>Country</FormText>
                  <FormInput placeholder={'Country'} placeholderTextColor={'gray'}
                             value={country} onChangeText={setCountry}/>
                </Form>
              </Container>}

              <MainBoldFont style={{fontSize: 14, lineHeight: 20, marginTop: 26}}>Public Profile</MainBoldFont>
              <Form style={{marginTop: 1}}>
                <Row style={{justifyContent: 'space-between', width: '100%'}}>
                  <DText>URL</DText>
                  <TouchableOpacity><DText style={{color: '#6600ed'}}>launch in new tab</DText></TouchableOpacity>
                </Row>
                <View>
                  <FormInput
                    placeholder={'workreels.com/orgs/true-timber'} placeholderTextColor={'gray'}
                    value={url}
                    onChangeText={setUrl}
                  />
                  <CopyBtn>
                    <Image source={Images.icon_paste} style={{tintColor: 'white'}}/>
                  </CopyBtn>
                </View>
              </Form>
              <Form>
                <FormText>LinkedIn</FormText>
                <FormInput
                  placeholder={'LinkedIn'} placeholderTextColor={'gray'}
                  value={linkedIn} onChangeText={setLinkedIn}
                />
              </Form>
              <Form>
                <FormText>Twitter</FormText>
                <FormInput placeholder={'Twitter'} placeholderTextColor={'gray'}
                           value={twitter} onChangeText={setTwitter}
                />
              </Form>
              <Form>
                <FormText>Public Bio</FormText>
                <FormInput placeholder={'Public Bio'} multiline placeholderTextColor={'gray'} style={{height: 200}}
                           value={publicBio} onChangeText={setPublicBio}
                />
              </Form>
              <Form>
                <FormText>Published Videos</FormText>
                <List
                  style={{paddingTop: 0}}
                  data={company.media}
                  renderItem={({item, index}) => <VideoItem style={{shadowOffset: {x: 0, y: 10}, marginTop: 20}}
                                                            key={index}>
                    <VLogo source={Images.user1}/>
                    <VContent>
                      <VType>{item.type}</VType>
                      <VTitle>{item.name}</VTitle>
                      <VName>Chrissie Jostan</VName>
                    </VContent>
                    <VSelectBtn>
                      <Image source={Images.icon_check}/>
                    </VSelectBtn>
                  </VideoItem>}
                />
              </Form>

            </Grid>
          </View>}
          {selectedTab === 'Groups' && <List
            data={state.currentUser.company.groups?.filter(g => types.find(t => t === g.type))}
            refreshing={refreshing}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={async () => await actions.user.getUserById()}/>
            }
            ListFooterComponent={<View style={{height: 100}}/>}
            renderItem={({item, index}) =>
              <GroupItem item={item} key={index}
                         onPress={() => props.navigation.navigate('CompanyGroupDetail', {data: item})}/>
            }
          />}
          {selectedTab === 'People' && <List
            data={state.currentUser.company.employees}
            ListFooterComponent={<View style={{height: 100}}/>}
            refreshing={refreshing}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={async () => await actions.user.getUserById()}/>
            }
            renderItem={({item, index}) =>
              <PeopleItem1 item={item} key={index}/>
            }
          />}
          {((selectedTab === 'Groups' && state.currentUser.company.groups?.filter(g => types.find(t => t === g.type)).length === 0) || (selectedTab === 'People' && state.currentUser.company.employees.length === 0)) &&
          <Empty>
            <EmptyText>
              You haven't added any editing{'\n'} to this company, but you can at{'\n'} anytime.
            </EmptyText>
            <AddBtn onPress={onAdd}>
              <AddText>+ Add {selectedTab}</AddText>
            </AddBtn>
          </Empty>}
          {selectedTab === 'Branding' && <Grid style={{flexDirection: 'column'}}>
            <Form style={{marginTop: 0}}>
              <FormText>Header Font</FormText>
              <FormBtn>
                <FormText style={{color: 'black'}}>Montserrat</FormText>
                <Image source={Images.icon_arrow_down}/>
              </FormBtn>
            </Form>
            <Form>
              <FormText>Paragraph Font</FormText>
              <FormBtn>
                <FormText style={{color: 'black'}}>Montserrat</FormText>
                <Image source={Images.icon_arrow_down}/>
              </FormBtn>
            </Form>
            <Form>
              <FormText>Primary Color</FormText>
              <FormBtn style={{justifyContent: 'flex-start'}}>
                <Rect/><FormText style={{color: 'black'}}>#1BDA0A</FormText>
              </FormBtn>
            </Form>
            <Form>
              <FormText>Secondary Color</FormText>
              <FormBtn style={{justifyContent: 'flex-start'}}>
                <Rect style={{backgroundColor: '#6600ED'}}/><FormText style={{color: 'black'}}>#6600ED</FormText>
              </FormBtn>
            </Form>
            <Form>
              <FormText>Square Logo</FormText>
              <FormBtn as={View} style={{justifyContent: 'center'}}>
                <Rect style={{
                  backgroundColor: '#B4B4B4',
                  borderRadius: 0,
                  opacity: 0.2,
                  width: 100,
                  height: 100,
                  marginVertical: 20,
                }}/>
              </FormBtn>
            </Form>
            <Form>
              <FormText>Horizontal Logo</FormText>
              <FormBtn as={View} style={{justifyContent: 'center'}}>
                <Rect style={{
                  backgroundColor: '#B4B4B4',
                  borderRadius: 0,
                  opacity: 0.2,
                  width: 170,
                  height: 70,
                  marginVertical: 20,
                }}/>
              </FormBtn>
            </Form>
          </Grid>}
          {selectedTab === 'Billing' && <Billing>
            {state.currentUser?.company?.groups.find(g => g.name === 'basic') && <BText>
              You are currently on the <MainBoldFont>Basic</MainBoldFont> plan and using 40% of your storage. Upgrade
              to <MainBoldFont>Pro</MainBoldFont> and get:
            </BText>}
            <Grid style={{shadowOffset: {x: 0, y: 10}, flexDirection: 'column', alignItems: 'flex-start'}}>
              <VTitle>{state.currentUser?.company?.groups.find(g => g.name === 'pro' || g.name === 'basic' || g.name === 'enterprise')?.name}</VTitle>
              <View style={{flexDirection: 'row', marginTop: 8}}>
                <View style={{width: 8, height: 8, borderRadius: 10, backgroundColor: '#B4B4B4', marginTop: 8}}/>
                <MText>Unlimited Users</MText>
              </View>
              <View style={{flexDirection: 'row', marginTop: 8}}>
                <View style={{width: 8, height: 8, borderRadius: 10, backgroundColor: '#B4B4B4', marginTop: 8}}/>
                <MText>1 tb of storage ($10/mo for each additional 100gb)</MText>
              </View>
            </Grid>
            <View style={{width: '100%', alignItems: 'center'}}>
              <AddBtn style={{
                height: 40,
                width: 122,
                paddingHorizontal: 0,
                marginTop: 20,
                marginBottom: 10,
              }} onPress={() => props.navigation.navigate('Upgrade')}><AddText>Upgrade</AddText></AddBtn>
            </View>
            {state.currentUser.paymentMethods?.length > 0 &&
            <Grid style={{shadowOffset: {x: 0, y: 10}, flexDirection: 'column', alignItems: 'flex-start'}}>
              <MText style={{marginLeft: 0, marginBottom: 20}}>You are currently using a Visa ending in *6543</MText>
              <TouchableOpacity onPress={() => props.navigation.navigate('AddPaymentMethod')}><UpdateText>Update Payment
                Method</UpdateText></TouchableOpacity>
            </Grid>}
            <Grid style={{shadowOffset: {x: 0, y: 10}, flexDirection: 'column', alignItems: 'flex-start'}}>
              <VTitle>Transactions</VTitle>
              {company.transactions?.map(t => <View key={t.id}>
                <DText>Date</DText>
                <DContent>{moment(t.createdAt).format('M/D/YYYY')}</DContent>
                <DText>Amount</DText>
                <DContent>${t.amountPaid}</DContent>
                <DText>Type</DText>
                <DContent>{t.type}</DContent>
                <DText>Storyline</DText>
                <DContent>{t.storylines[0]?.name}</DContent>
              </View>)}
            </Grid>
          </Billing>}
        </Body>
        {selectedTab === 'Info' && <Bottom>
          <TouchableOpacity onPress={() => props.navigation.pop()}>
            <CancelText>Cancel</CancelText>
          </TouchableOpacity>
          <SaveBtn onPress={onSaveCompany}>
            <SaveText>Save</SaveText>
          </SaveBtn>
        </Bottom>}
      </Container>
    </SafeAreaView>
  );
};

export default Company;

const UpdateText = styled(MainBoldFont)`
  color: #6600ed;
`;

const MText = styled(MainMediumFont)`
  font-size: 16px;
  line-height: 24px;
  color: #14142b;
  margin-left: 11px;
`;

const BText = styled(MainMediumFont)`
  font-size: 16px;
  line-height: 24px;
  color: #4c4c4c;
  margin-top: 20px;
`;

const Billing = styled.View`
`;

const Rect = styled.View`
  width: 30px;
  height: 30px;
  border-radius: 2px;
  margin-right: 10px;
  background-color: #1BDA0A;
`;

const AddText = styled(MainBoldFont)`
  font-size: 16px;
  color: white;
`;

const AddBtn = styled.TouchableOpacity`
  height: 64px;
  ${Styles.center}
  padding-horizontal: 50px;
  background-color: #6600ed;
  border-radius: 40px;
  margin-top: 40px;
`;

const EmptyText = styled(MainMediumFont)`
  font-size: 16px;
  line-height: 24px;
  color: #1b2124;
  text-align: center;
  margin-top: -70px;
`;

const Empty = styled.View`
  flex: 1;
  ${Styles.center}
  margin-top: -550px;
`;

const List = styled.FlatList`
  flex: 1;
  padding-top: 20px;
`;

const CancelText = styled(MainBoldFont)`
  color: #6600ed;
  font-size: 14px;
  line-height: 20px;
`;

const VSelectBtn = styled.TouchableOpacity`
  width: 22px;
  height: 22px;
  border-radius: 15px;
  border-width: ${props => props.isSelected ? 0 : 1.5};
  border-color: black;
  align-items: flex-end;
  margin-top: 13px;
  ${Styles.center}
  background-color: ${props => props.isSelected ? '#6600ed' : 'white'};
`;

const VName = styled(MainMediumFont)`
  font-size: 12px;
  line-height: 18px;
  color: #4c4c4c;
  margin-top: 5px;
`;

const VTitle = styled(MainBoldFont)`
  font-size: 14px;
  line-height: 20px;
  color: black;
`;

const VType = styled(MainSemiBoldFont)`
  color: #4c4c4c;
  font-size: 10px;
  line-height: 20px;
  letter-spacing: 2px;
`;

const VContent = styled.View`
  margin-left: 11px;
  justify-content: center;
  width: 70%;
`;

const VLogo = styled.Image`
  border-radius: 12px;
  height: 100%;
  width: 65px;
`;

const VideoItem = styled.View`
  background-color: white;
  border-radius: 12px;
  shadow-color: #000000;
  elevation: 3;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  margin-bottom: 20px;
  flex-direction: row;
  margin-horizontal: 2px;
  height: 120px;
`;

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

const DContent = styled(MainMediumFont)`
  font-size: 16px;
  line-height: 24px;
  margin-top: 3px;
`;

const DText = styled(MainMediumFont)`
  font-size: 14px;
  line-height: 20px;
  color: #4c4c4c;
  margin-top: 18px;
`;

const UText = styled(MainMediumFont)`
  font-size: 12px;
  line-height: 18px;
  color: #6600ed;
`;

const Progress = styled.View`
  height: 4px;
  background-color: #eaeaea;
  flex: 1;
`;

const ProgressView = styled.View`
  flex-direction: row;
  ${Styles.center}
  margin-vertical: 10px;
`;

const ProgressText = styled(MainBoldFont)`
  font-size: 14px;
  line-height: 20px;
`;

const PText = styled(MainMediumFont)`
  font-size: 14px;
  line-height: 20px;
  color: #4c4c4c;
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
  width: 100%;
  ${Styles.between_center}
  flex-direction: row;
  padding-top: 20px;
  padding-horizontal: 20px;
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
  width: 100%;
  border-radius: 6px;
  padding: 15px;
  color: black;
  font-family: Montserrat-Medium;
  font-size: 14px;
  margin-top: 6px;
  text-align-vertical: top;
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
