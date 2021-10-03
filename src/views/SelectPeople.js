import React, {useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont} from '@/views/Components';
import {Image, SafeAreaView, ScrollView, TouchableOpacity} from 'react-native';
import PeopleItem1 from '@/views/Components/PeopleItem1';

const SelectPeople = props => {
  const {state, actions} = useOvermind();
  const storylineId = props.route.params?.storylineId;
  const mediaId = props.route.params?.mediaId;
  const isCompany = props.route.params?.isCompany;

  const newUsers = props.route.params?.newUsers;
  console.log(newUsers, state.group.groups);
  const originPeople = state.storyline.storylines?.find(s => s.id === storylineId)?.users || [];
  const orgMediaPeople = state.linkedMedia.linkedMedias?.find(m => m.id === mediaId)?.taggedUsers || [];
  const [people, setPeople] = useState(newUsers ? newUsers?.filter(u => u.user?.id !== state.currentUser?.id) : (isCompany ? [] : state.currentUser?.company?.employees?.filter(e => mediaId ? !orgMediaPeople?.find(o => o.media?.user?.id === e.user.id) : !originPeople?.find(o => o.id === e?.user.id))));
  const [selectedPeople, setSelectedPeople] = useState(props.route?.params?.people ? props.route?.params?.people : []);

  const onPressPeople = (people) => {
    let originalPeople = [...selectedPeople];
    const index = originalPeople.findIndex(s => s === people);
    if (index > -1) {
      originalPeople.splice(index, 1);
      setSelectedPeople(originalPeople);
    } else {
      originalPeople.push(people);
      setSelectedPeople(originalPeople);
    }
  };

  const onSelectAll = () => {
    setSelectedPeople(state.currentUser?.company?.employees?.filter(e => !originPeople?.find(o => o.id === e?.user.id)));
  };

  const onSelectNone = () => {
    setSelectedPeople([]);
  };

  const onPressDone = async () => {
    if (props.route?.params?.people) {
      props.route?.params?.handler(selectedPeople);
      props.navigation.pop();
    } else if (newUsers) {
      if (selectedPeople?.length === 0) {
        actions.alert.showError({message: 'Please choose at least a people'});
        return false;
      }
      actions.hud.show();
      console.log(props.route.params?.group?.id);
      selectedPeople.map(async p => {
        await actions.user.saveUser({
          where: {id: p.user.id},
          data: {
            userGroups: {
              create: [{
                group: {connect: {id: props.route.params?.group?.id}},
                subgroups: {
                  create: [{
                    group: {connect: {id: state.group.groups?.find(g => g.name === 'employee' && g.company?.id === state.currentUser?.company?.id && g.type === 'ROLE')?.id}},
                  }],
                },
              }],
            },
          },
        });
      });
      await actions.user.getUserById();
      actions.hud.hide();
      props.navigation.pop();
    } else {
      if (selectedPeople?.length === 0) {
        actions.alert.showError({message: 'Please choose at least a people'});
        return false;
      }
      actions.hud.show();
      try {
        if (storylineId) {
          const params = {
            where: {id: storylineId},
            data: {
              users: {
                connect: [],
              },
            },
          };
          const users = [];

          selectedPeople.map(s => users.push({id: s.user?.id}));
          params.data.users.connect = users;
          await actions.storyline.saveStoryline(params);
          await actions.storyline.getStorylines();
          actions.alert.showSuccess({message: 'You\'ve added users to storyline successfully!'});
        } else if (mediaId) {
          const params = {
            where: {id: mediaId},
            data: {
              taggedUsers: {
                connect: [],
              },
            },
          };
          const users = [];

          selectedPeople.map(s => users.push({id: s.user?.id}));
          params.data.taggedUsers.connect = users;
          await actions.linkedMedia.saveLinkedMedia(params);
          await actions.linkedMedia.getLinkedMedias();
          actions.alert.showSuccess({message: 'You\'ve added users to media successfully!'});
        }
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
        <ScrollView style={{flex: 1}}>
          <CloseBtn onPress={() => props.navigation.pop()}>
            <Image source={Images.icon_close_black}/>
          </CloseBtn>
          <Title>Why would you like to choose?</Title>
          <List
            data={people}
            renderItem={({item, index}) => <PeopleItem1 isSelectMode={true} index={item} item={item}
                                                        onPress={onPressPeople}
                                                        isSelected={selectedPeople.find(s => s === item)} key={index}/>}
          />
          <BView onPress={() => props.navigation.navigate('InvitePeople')}>
            <BText>Invite New People</BText>
            <Image source={Images.icon_add}/>
          </BView>
        </ScrollView>
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

export default SelectPeople;

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
`;

const Title = styled(MainBoldFont)`
  font-size: 26px;
  line-height: 32px;
  margin-top: 20px;
`;

const Container = styled.View`
  flex: 1;
  background-color: white;
  padding-horizontal: 25px;
`;
