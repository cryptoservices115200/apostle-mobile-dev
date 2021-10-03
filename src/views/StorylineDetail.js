import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { Styles } from '@/styles';
import { Images } from '@/styles/Images';
import { useOvermind } from '@/store';
import { MainBoldFont, MainMediumFont, MainRegularFont, MainSemiBoldFont } from '@/views/Components';
import { FlatList, Image, RefreshControl, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { SceneItem } from '@/views/Components/SceneItem';
import { MediaItem } from '@/views/Components/MediaItem';
import PeopleItem from '@/views/Components/PeopleItem';
import { getHumanDate } from '@/utils/DateUtil';
import DeliverableItem from '@/views/Components/DeliverableItem';
import { useActionSheet } from '@expo/react-native-action-sheet';

const StorylineDetail = ({ route, navigation }) => {
  const { state, actions } = useOvermind();
  const [itemData, setItemData] = useState(state.storyline.storylines.find(s => s.id === route.params?.itemData.id));
  const tabs = ['Scenes', 'Media', 'People', 'Details'];
  const [selectedTab, setSelectedTab] = useState('Scenes');
  const [chosenMedia, setChosenMedia] = useState(null);
  const [chosenStoryline, setChosenStoryline] = useState(null);
  const [chosenScene, setChosenScene] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { showActionSheetWithOptions } = useActionSheet();
  useEffect(() => {
    const findOne = state.storyline.storylines.find(s => s.id === route.params?.itemData.id);
    console.log("=====>", findOne);
    setItemData(findOne);
    getTypes();
  }, [state.storyline.storylines]);

  const getTypes = async () => {
    await actions.scene.getSceneTypes();
    await actions.deliverable.getDeliverableTypes();
  };

  const onPressAdd = () => {
    if (selectedTab === 'Details') {
      navigation.navigate('AddDeliverable', { storylineId: itemData.id });
    } else if (selectedTab === 'Scenes') {
      navigation.navigate('AddScene1', { storylineId: itemData.id });
    } else if (selectedTab === 'People') {
      navigation.navigate('SelectPeople', { storylineId: itemData.id });
    }
  };

  const onChosenStoryline = (id) => {
    // setChosenStoryline(id);
    try {
      const options = ['Add Talent', 'Copy Share Link', 'Duplicate', 'Archive', 'Cancel'];
      showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: options.length - 1,
        }, (index) => {
          if (index !== options.length - 1) {
          }
        },
      );
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Container>
        <DHeader>
          <Row>
            <TouchableOpacity onPress={() => navigation.navigate('Storylines')}>
              <Image source={Images.icon_arrow_left} />
            </TouchableOpacity>
            <Calendar>
              <Image source={Images.icon_calendar} style={{ tintColor: 'black' }} />
              <CText>{getHumanDate(itemData?.createdAt)}</CText>
            </Calendar>
          </Row>
          <SType style={{ marginTop: 8 }}>{itemData.status?.toUpperCase()}</SType>
          <STitle style={{ fontSize: 28, lineHeight: 30 }}>{itemData?.name}</STitle>
          <TabBar>
            {tabs.map((t, index) => <TabBtn onPress={() => setSelectedTab(t)} isSelected={t === selectedTab}
              key={index}>
              <TabText isSelected={t === selectedTab}>{t}</TabText>
            </TabBtn>)}
          </TabBar>
        </DHeader>
        <Body>
          <Header>
            <Title>{selectedTab}</Title>
            <Right>
              <TouchableOpacity style={{ marginRight: 20 }}>
                <Image source={Images.icon_control} />
              </TouchableOpacity>
              {selectedTab === 'Media' && <TouchableOpacity style={{ marginRight: 20 }}>
                <Image source={Images.icon_list} />
              </TouchableOpacity>}
              <TouchableOpacity onPress={onPressAdd}>
                <Image source={Images.icon_plus} />
              </TouchableOpacity>
              {(selectedTab === 'Media' || selectedTab === 'People') && <SelectBtn>
                <SelectText>{state.isSelectMode ? 'Cancel' : 'Select'}</SelectText>
              </SelectBtn>}
            </Right>
          </Header>
          {selectedTab === 'Scenes' ? (itemData?.scenes?.length > 0 ? <FlatList
            style={{ marginTop: 10, flex: 1 }} data={itemData.scenes}
            renderItem={({ item, index }) =>
              <SceneItem key={index} data={item} hideMore
                onPress={() => navigation.navigate('SceneDetail', {
                  scene: item,
                  storylineId: route.params?.itemData.id,
                })} chosenScene={chosenScene} setChosenScene={setChosenScene} />}
            refreshing={refreshing}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={async () => await actions.storyline.getStorylines()} />
            }
          /> : <Empty>
            <EmptyText>
              You haven't added any editing{'\n'} to this storyline, but you can at{'\n'} anytime.
            </EmptyText>
            <AddBtn onPress={() => navigation.navigate('AddScene1', { storylineId: itemData.id })}>
              <AddText>+ Add Scene</AddText>
            </AddBtn>
          </Empty>) :
            selectedTab === 'Media' ? <FlatList
              style={{ marginTop: 10, flex: 1 }}
              data={state.linkedMedia.linkedMedias?.filter(l => l.storyline?.id === itemData.id)}
              renderItem={({ item, index }) =>
                <MediaItem key={index} data={item} chosenMedia={chosenMedia}
                  setChosenMedia={setChosenMedia} navigation={navigation} />}
              refreshing={refreshing}
              refreshControl={
                <RefreshControl refreshing={refreshing}
                  onRefresh={async () => await actions.storyline.getStorylines()} />
              }
            /> :
              selectedTab === 'People' ? (itemData.users?.length > 0 ? <FlatList
                style={{ marginTop: 10, flex: 1 }} data={itemData.users}
                CellRendererComponent={({ item, index }) =>
                  <PeopleItem key={index} data={item}
                    chosenStoryline={chosenStoryline}
                    setChosenStoryline={onChosenStoryline} />}
                refreshing={refreshing}
                refreshControl={
                  <RefreshControl refreshing={refreshing}
                    onRefresh={async () => await actions.storyline.getStorylines()} />
                }
              /> : <Empty>
                <EmptyText>
                  You haven't added any editing{'\n'} to this storyline, but you can at{'\n'} anytime.
                </EmptyText>
                <AddBtn onPress={() => navigation.navigate('SelectPeople', { storylineId: itemData.id })}>
                  <AddText>+ Add People</AddText>
                </AddBtn>
              </Empty>) :
                selectedTab === 'Details' && (itemData?.deliverables?.length > 0 ? <FlatList
                  style={{ marginTop: 10, flex: 1 }} data={itemData.deliverables}
                  renderItem={({ item, index }) =>
                    <DeliverableItem key={index} data={item}
                      onPress={() => navigation.navigate('AddDeliverable', {
                        deliverable: item,
                        storylineId: itemData.id,
                      })} />}
                  refreshing={refreshing}
                  refreshControl={
                    <RefreshControl refreshing={refreshing}
                      onRefresh={async () => await actions.storyline.getStorylines()} />
                  }
                /> : <Empty>
                  <EmptyText>
                    You haven't added any editing{'\n'} to this storyline, but you can at{'\n'} anytime.
                  </EmptyText>
                  <AddBtn onPress={() => navigation.navigate('AddDeliverable', { storylineId: itemData.id })}>
                    <AddText>+ Add Deliverable</AddText>
                  </AddBtn>
                </Empty>)
          }
        </Body>
      </Container>
    </SafeAreaView>
  );
};

export default StorylineDetail;

const Body = styled.View`
  padding-horizontal: 18px;
  flex: 1;
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
  margin-top: 15px;
`;

const CText = styled(MainSemiBoldFont)`
  font-size: 12px;
  color: black;
  margin-left: 10px;
`;

const Calendar = styled.View`
  padding-vertical: 3px;
  padding-horizontal: 6px;
  background-color: #F7F7FE;
  border-radius: 6px;
  flex-direction: row;
  ${Styles.center}
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
  letter-spacing: 1px;
`;

const SelectText = styled(MainSemiBoldFont)`
  font-size: 14px;
  line-height: 20px;
  color: #1b2124;
`;

const SelectBtn = styled.TouchableOpacity`
  margin-left: 27px;
`;

const Right = styled.View`
  ${Styles.center}
  flex-direction: row;
`;

const Title = styled(MainBoldFont)`
  font-size: 20px;
  line-height: 32px;
  color: #1b2124;
`;

const Header = styled.View`
  flex-direction: row;
  ${Styles.between_center};
  margin-top: 20px;
`;

const Container = styled.View`
  flex: 1;
  background-color: #F7F7FE;
`;
