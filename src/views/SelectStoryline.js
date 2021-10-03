import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainMediumFont, MainSemiBoldFont} from '@/views/Components';
import {Image, SafeAreaView, ScrollView, TouchableOpacity, View} from 'react-native';
import {json} from 'overmind';
import {ProgressView} from '@react-native-community/progress-view';
import {getHumanDate} from '@/utils/DateUtil';

const SelectStoryline = props => {
  const {state, actions} = useOvermind();
  const {mediaId, data, handler} = props.route.params;
  const [storylines, setStorylines] = useState([]);
  const [selectedStorylines, setSelectedStorylines] = useState(data ? data : []);

  const isAdmin = state.currentUser?.groups?.find(g => g.name === 'admin' && g.company?.id === state.currentUser?.company?.id);

  useEffect(() => {
    getStorylines();
  }, []);

  const getStorylines = async () => {
    setStorylines(json(state.storyline.storylines)?.filter(s => !s.linkedMedias?.find(m => m.id === mediaId)));
  };

  const onPressStoryline = (storyline) => {
    let originalStorylines = [...selectedStorylines];
    const index = originalStorylines.findIndex(s => s.id === storyline.id);
    if (index > -1) {
      originalStorylines.splice(index, 1);
      setSelectedStorylines(originalStorylines);
    } else {
      originalStorylines.push(storyline);
      setSelectedStorylines(originalStorylines);
    }
  };

  const onSelectAll = () => {
    setSelectedStorylines(json(state.storyline.storylines)?.filter(s => !s.linkedMedias?.find(m => m.id === mediaId)));
  };

  const onSelectNone = () => {
    setSelectedStorylines([]);
  };

  const onPressDone = async () => {
    if (data) {
      handler(selectedStorylines);
      props.navigation.pop();
    } else {
      if (selectedStorylines?.length !== 1) {
        actions.alert.showError({message: 'Please choose a storyline'});
        return false;
      }

      actions.hud.show();
      try {
        const params = {
          where: {id: mediaId},
          data: {
            storyline: {
              connect: {id: selectedStorylines[0]?.id},
            },
          },
        };
        await actions.linkedMedia.saveLinkedMedia(params);
        await actions.linkedMedia.getLinkedMedias();
        actions.alert.showSuccess({message: 'Added media to storyline successfully!'});
        props.navigation.pop();
      } catch (e) {
        console.log(e);
      } finally {
        actions.hud.hide();
      }
    }

  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Container>
        <View style={{flex: 1}}>
          <CloseBtn onPress={() => props.navigation.pop()}>
            <Image source={Images.icon_close_black}/>
          </CloseBtn>
          <Title>Which storyline would you like?</Title>
          <Row>
            <RText>Storylines</RText>
            <TouchableOpacity>
              <Image source={Images.icon_control}/>
            </TouchableOpacity>
          </Row>
          {storylines.length > 0 ? <List
            data={storylines}
            renderItem={({item, index}) => <StorylineItem style={{shadowOffset: {x: 0, y: 10}, flexDirection: 'column'}}
                                                          key={index} onPress={() => onPressStoryline(item)}>
              <GHeader>
                <VSelectBtn style={{borderColor: '#B4B4B4'}}
                            isSelected={selectedStorylines.find(s => s.id === item.id)}>
                  {selectedStorylines.find(s => s.id === item.id) ?
                    <Image source={Images.icon_check} style={{tintColor: 'white'}}/> : null}
                </VSelectBtn>
                <TouchableOpacity>
                  <Image source={Images.icon_more} style={{tintColor: 'black'}}/>
                </TouchableOpacity>
              </GHeader>
              <SType style={{marginTop: 24}}>{item?.status?.toUpperCase()}</SType>
              <STitle style={{fontSize: 26, lineHeight: 30, marginTop: 3}}>{item?.name}</STitle>
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
              <AddText style={{color: 'white'}}>+ Storyline</AddText>
            </AddBtn>
          </Empty> : <Empty><EmptyText>Once your company creates some storylines. They will show here!</EmptyText></Empty>}
        </View>
        <Bottom>
          <TouchableOpacity onPress={onSelectAll} style={{marginLeft: 20}}>
            <AddText style={{color: '#6600ed'}}>Select All</AddText>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSelectNone}>
            <AddText style={{color: '#6600ed'}}>None</AddText>
          </TouchableOpacity>
          <Button onPress={onPressDone}>
            <AddText style={{color: 'white'}}>Done</AddText>
          </Button>
        </Bottom>
      </Container>
    </SafeAreaView>
  );
};

export default SelectStoryline;

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


const StorylineItem = styled.TouchableOpacity`
  background-color: white;
  border-radius: 12px;
  shadow-color: #000000;
  elevation: 3;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  margin-bottom: 20px;
  flex-direction: row;
  min-height: 120px;
  padding: 15px;
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

const VProgressView = styled.View`
  flex-direction: row;
  ${Styles.center}
  margin-top: 22px;
`;

const VSelectBtn = styled.View`
  width: 22px;
  height: 22px;
  border-radius: 15px;
  border-width: ${props => props.isSelected ? 0 : 1.5};
  border-color: black;
  ${Styles.center}
  margin-top: 13px;
  background-color: ${props => props.isSelected ? '#6600ed' : 'white'};
`;

const GHeader = styled.View`
  flex-direction: row;
  ${Styles.between_center};
  width: 100%;
`;

const RText = styled(MainBoldFont)`
  font-size: 20px;
  color: #14142b;
`;

const Row = styled.View`
  flex-direction: row;
  ${Styles.between_center}
  margin-top: 24px;
`;

const BText = styled(MainBoldFont)`
  line-height: 20px;
  color: #6600ed;
  margin-right: 10px;
`;

const BView = styled.TouchableOpacity`
  width: 100%;
  ${Styles.end_center};
  flex-direction: row;
`;

const List = styled.FlatList`
  flex: 1;
  padding-horizontal: 2px;
  margin-top: 50px;
`;

const AddText = styled(MainBoldFont)`
  font-size: 14px;
  line-height: 24px;
  color: #6600ed;
`;

const Button = styled.TouchableOpacity`
  width: 160px;
  height: 50px;
  ${Styles.center}
  background-color: #6600ed;
  border-radius: 40px;
`;

const Bottom = styled.View`
  ${Styles.between_center}
  flex-direction: row;
`;

const CloseBtn = styled.TouchableOpacity`
  position: absolute;
  right: 0px;
  top: 0px;
  z-index: 10;
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
