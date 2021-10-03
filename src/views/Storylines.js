import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainMediumFont, MainRegularFont, MainSemiBoldFont} from '@/views/Components';
import {
  FlatList,
  Image,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {getHumanDate} from '@/utils/DateUtil';
import {ProgressView} from '@react-native-community/progress-view';
import ControlAlt from '@/assets/ikonate_icons/controls-alt.svg';
import ListAlt from '@/assets/ikonate_icons/list-alt.svg';
import ControlAltDisabled from '@/assets/ikonate_icons/controls-alt-gray.svg';
import ListAltDisabled from '@/assets/ikonate_icons/list-alt-gray.svg';
import PlusIcon from '@/assets/ikonate_icons/plus.svg';
import {json} from 'overmind';

const Storylines = props => {
  const {state, actions} = useOvermind();
  const [isGrid, setGrid] = useState(false);
  const [chosenStoryline, setChosenStoryline] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [storylines, setStorylines] = useState([]);

  const isAdmin = state.currentUser?.groups?.find(g => g.name === 'admin' && g.company?.id === state.currentUser?.company?.id);

  useEffect(() => {
    getData();
    // let timeout = null;
    //
    // const unsubscribe = props.navigation.addListener('blur', () => {
    //   timeout && clearTimeout(timeout);
    // });
    //
    // const subscribe = props.navigation.addListener('focus', () => {
    //   if (state.storyline.storylines?.length === 0 && isAdmin) {
    //     timeout = setTimeout(() => props.navigation.navigate('CreateStoryline'), 10000);
    //   }
    // });
    // return () => {
    //   subscribe();
    //   unsubscribe();
    // };
  }, []);

  useEffect(() => {
    setStorylines(json(state.storyline.storylines?.filter(s => s.companies?.find(c => c.id === state.currentUser?.company?.id))))
  }, [state.storyline.storylines])

  const getData = async () => {
    try {
      actions.hud.show();
      // await actions.storyline.getStorylines();
      if (state.linkedMedia.linkedMedias?.length === 0) {
        await actions.linkedMedia.getLinkedMedias();
      }
      console.log('storylines---', state.storyline.storylines);
      setStorylines(json(state.storyline.storylines?.filter(s => s.companies?.find(c => c.id === state.currentUser?.company?.id))))
    } catch (e) {
      console.log(e);
    } finally {
      actions.hud.hide();
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#F7F7FE'}}>
      <Container>
        <Header>
          <Title>Storylines</Title>
          <Right>
            {!state.isSelectMode && <TouchableOpacity style={{marginRight: 25}}>
              {storylines.length !== 0 && <ControlAlt width={25} height={25}/>}
              {storylines.length === 0 && <ControlAltDisabled width={25} height={25}/>}
              {/*<Image source={Images.icon_control} style={{tintColor: storylines.length === 0 ? 'gray': 'black'}}/>*/}
            </TouchableOpacity>}
            {!state.isSelectMode && <TouchableOpacity onPress={() => setGrid(!isGrid)}>
              {storylines.length !== 0 && <ListAlt width={25} height={25}/>}
              {storylines.length === 0 && <ListAltDisabled width={25} height={25}/>}
              {/*<Image source={Images.icon_list} style={{tintColor: storylines.length === 0 ? 'gray': 'black'}}/>*/}
            </TouchableOpacity>}
            {isAdmin && !state.isSelectMode &&
            <TouchableOpacity style={{marginLeft: 25}} onPress={() => props.navigation.navigate('CreateStoryline')}>
              {/*<Image source={Images.icon_plus}/>*/}
              <PlusIcon width={25} height={25}/>
            </TouchableOpacity>}
            <SelectBtn onPress={actions.setSelectMode}>
              <SelectText
                isEmpty={storylines.length === 0}>{state.isSelectMode ? 'Cancel' : 'Select'}</SelectText>
            </SelectBtn>
          </Right>
        </Header>
        {storylines.length > 0 ? <FlatList
          data={storylines}
          refreshing={refreshing}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={async () => await actions.storyline.getStorylines()}/>
          }
          renderItem={({item, index}) => !isGrid ?
            <StorylineItem onPress={() => props.navigation.navigate('StorylineDetail', {itemData: item})} key={index}
                           style={{shadowOffset: {x: 0, y: 10}}}>
              <View style={{flex: 1}}>
                <SType>{item?.status}</SType>
                <STitle>{item?.name}</STitle>
                <Bottom>
                  <View style={{marginRight: 40}}>
                    <SText>Due</SText>
                    <SContent>{getHumanDate(item?.dueDate)}</SContent>
                  </View>
                  <View style={{marginRight: 40}}>
                    <SText>Progress</SText>
                    <SContent>{item.progress || 0}%</SContent>
                  </View>
                  <View>
                    <SText>Talent</SText>
                    <SContent>{item?.users?.length}</SContent>
                  </View>
                </Bottom>
              </View>
              <TouchableOpacity onPress={() => setChosenStoryline(item.id)}>
                <Image source={Images.icon_more} style={{tintColor: 'black'}}/>
              </TouchableOpacity>
              {chosenStoryline === item.id && <Menu>
                <CloseBtn onPress={() => setChosenStoryline(null)}>
                  <Image source={Images.icon_close_black}/>
                </CloseBtn>
                <Item>
                  <Image source={Images.icon_calendar} style={{tintColor: 'black'}}/>
                  <ItemText>Add Talent</ItemText>
                </Item>
                <Item>
                  <Image source={Images.icon_calendar} style={{tintColor: 'black'}}/>
                  <ItemText>Copy Share Link</ItemText>
                </Item>
                <Item>
                  <Image source={Images.icon_calendar} style={{tintColor: 'black'}}/>
                  <ItemText>Duplicate</ItemText>
                </Item>
                <Item style={{marginBottom: 50}}>
                  <Image source={Images.icon_calendar} style={{tintColor: 'black'}}/>
                  <ItemText>Archive</ItemText>
                </Item>
              </Menu>}
            </StorylineItem> : <StorylineItem style={{shadowOffset: {x: 0, y: 10}, flexDirection: 'column'}} key={index}
                                              onPress={() => props.navigation.navigate('StorylineDetail', {itemData: item})}>
              <GHeader>
                <VSelectBtn style={{borderColor: '#B4B4B4'}}>

                </VSelectBtn>
                <TouchableOpacity onPress={() => setChosenStoryline(item.id)}>
                  <Image source={Images.icon_more} style={{tintColor: 'black'}}/>
                </TouchableOpacity>

              </GHeader>
              {chosenStoryline === item.id && <Menu style={{height: 210}}>
                <CloseBtn onPress={() => setChosenStoryline(null)}>
                  <Image source={Images.icon_close_black}/>
                </CloseBtn>
                <Item>
                  <Image source={Images.icon_calendar} style={{tintColor: 'black'}}/>
                  <ItemText>Add Talent</ItemText>
                </Item>
                <Item>
                  <Image source={Images.icon_calendar} style={{tintColor: 'black'}}/>
                  <ItemText>Copy Share Link</ItemText>
                </Item>
                <Item>
                  <Image source={Images.icon_calendar} style={{tintColor: 'black'}}/>
                  <ItemText>Duplicate</ItemText>
                </Item>
                <Item style={{marginBottom: 50}}>
                  <Image source={Images.icon_calendar} style={{tintColor: 'black'}}/>
                  <ItemText>Archive</ItemText>
                </Item>
              </Menu>}
              <GImage/>
              <SType style={{marginTop: 24}}>{item?.type}</SType>
              <STitle style={{fontSize: 26, lineHeight: 30, marginTop: 3}}>{item.name}</STitle>
              <VProgressView>
                <ProgressView
                  progress={(item?.progress || 0) / 100}
                  style={{flex: 1}}
                  trackTintColor={'#eaeaea'}
                  progressImage={Images.progress}
                />
                <PText>{item?.progress || 0}%</PText>
              </VProgressView>
              <BottomView>
                <Calendar>
                  <Image source={Images.icon_calendar}/>
                  <CText>{getHumanDate(item.dueDate)}</CText>
                </Calendar>
                <Users>
                  {item?.users?.length > 3 && <UItem style={{zIndex: 3}}>
                    <UText>+{item?.users?.length - 3}</UText>
                  </UItem>}
                  {item?.users?.length >= 3 && <UItem source={item.users[2]?.avatar} style={{zIndex: 2}}/>}
                  {item?.users?.length >= 2 && <UItem source={item.users[1]?.avatar} style={{zIndex: 1}}/>}
                  {item?.users?.length >= 1 && <UItem source={item.users[0]?.avatar}/>}
                </Users>
              </BottomView>
            </StorylineItem>}
        /> : isAdmin ? <Empty>
          <EmptyText>
            Let's create your first storyline{'\n'} so you can start recording and{'\n'}collecting content.
          </EmptyText>
          <AddBtn onPress={() => props.navigation.navigate('CreateStoryline')}>
            <AddText>+ Storyline</AddText>
          </AddBtn>
        </Empty> : <Empty><EmptyText>Once your company creates some storylines. They will show here!</EmptyText></Empty>}
      </Container>
    </SafeAreaView>
  );
};

export default Storylines;

const CloseBtn = styled.TouchableOpacity`
  position: absolute;
  right: -10px;
  top: -10px;
  z-index: 32;
`;

const ItemText = styled(MainSemiBoldFont)`
  margin-left: 10px;
`;

const Item = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-bottom: 23px;

`;

const Menu = styled.ScrollView`
  width: 280px;
  padding: 20px;
  border: 1px solid #d8d8d8;
  background-color: white;
  position: absolute;
  right: 10px;
  top: 10px;
  height: 100px;
  z-index: 100;
  padding-bottom: 100px;
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
`;

const Empty = styled.View`
  flex: 1;
  ${Styles.center}
`;

const UText = styled(MainSemiBoldFont)`
  font-size: 12px;
  line-height: 14px;
  color: white;
`;

const UItem = styled.View`
  border-width: 2px;
  border-color: white;
  background-color: #6600ed;
  ${Styles.center}
  width: 26px;
  height: 26px;
  border-radius: 14px;
  margin-right: -5px;
`;

const Users = styled.View`
  flex-direction: row;
`;

const CText = styled(MainSemiBoldFont)`
  font-size: 12px;
  color: white;
  margin-left: 10px;
`;

const Calendar = styled.View`
  padding-vertical: 3px;
  padding-horizontal: 6px;
  background-color: black;
  border-radius: 6px;
  flex-direction: row;
  ${Styles.center}
`;

const BottomView = styled.View`
  flex-direction: row;
  ${Styles.between_center}
  margin-top: 26px;
`;

const PText = styled(MainSemiBoldFont)`
  font-size: 12px;
  margin-left: 7px;
`;

const Progress = styled.View`
  height: 4px;
  background-color: #eaeaea;
  flex: 1;
`;

const VProgressView = styled.View`
  flex-direction: row;
  ${Styles.center}
  margin-top: 22px;
  width: 100%;
`;

const GImage = styled.View`
  margin-top: 14px;
  background-color: #f7f7f7;
  height: 200px;
`;

const VSelectBtn = styled.TouchableOpacity`
  width: 22px;
  height: 22px;
  border-radius: 15px;
  border-width: ${props => props.isSelected ? 0 : 1.5};
  border-color: black;
  align-items: flex-end;
  margin-top: 13px;
  background-color: ${props => props.isSelected ? '#6600ed' : 'white'};
`;

const GHeader = styled.View`
  flex-direction: row;
  ${Styles.between_center};
  width: 100%;
`;

const SContent = styled(MainMediumFont)`
  font-size: 12px;
  line-height: 18px;
  margin-top: 2px;
`;

const SText = styled(MainSemiBoldFont)`
  font-size: 12px;
  color: #4c4c4c;
`;

const Bottom = styled.View`
  flex-direction: row;
  margin-top: 10px;
`;

const STitle = styled(MainBoldFont)`
  font-size: 14px;
  line-height: 20px;
  color: black;
`;

const SType = styled(MainSemiBoldFont)`
  font-size: 10px;
  line-height: 20px;
  color: #4c4c4c;
`;

const StorylineItem = styled.TouchableOpacity`
  background-color: white;
  border-radius: 12px;
  shadow-color: #000000;
  elevation: 3;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  flex-direction: row;
  min-height: 120px;
  padding: 15px;
  margin-top: 20px;
  margin-horizontal: ${Platform.OS === 'ios' ? 0 : 2}
  z-index: -1;
`;

const StorylineList = styled.FlatList`
  flex: 1;
  padding-top: 20px;
`;

const SelectText = styled(MainSemiBoldFont)`
  font-size: 14px;
  line-height: 20px;
  color: ${props => props.isEmpty ? 'gray' : '#1b2124'};
`;

const SelectBtn = styled.TouchableOpacity`
  margin-left: 27px;
`;

const Right = styled.View`
  ${Styles.center}
  flex-direction: row;
`;

const Title = styled(MainBoldFont)`
  font-size: 26px;
  line-height: 32px;
  color: #1b2124;
`;

const Header = styled.View`
  flex-direction: row;
  ${Styles.between_center};
`;

const Container = styled.View`
  flex: 1;
  padding-horizontal: 19px;
`;
