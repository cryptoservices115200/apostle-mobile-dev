import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont} from '@/views/Components';
import {Image, SafeAreaView, ScrollView, TouchableOpacity} from 'react-native';
import GroupItem from '@/views/Components/GroupItem';

const SelectGroup = props => {
  const {state, actions} = useOvermind();
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    getGroups();
  }, []);

  const getGroups = async () => {
    await actions.group.getGroups();
    console.log(state.group.groups.filter(g => g.type === 'TAG'));
    setGroups(state.group.groups.filter(g => g.type === 'TAG' && !state.currentUser?.company?.groups?.find(t => t.id === g.id)));
  };
  const [selectedGroups, setSelectedGroups] = useState([]);

  const onPressGroup = (group) => {
    let originalGroups = [...selectedGroups];
    const index = originalGroups.findIndex(s => s === group);
    if (index > -1) {
      originalGroups.splice(index, 1);
      setSelectedGroups(originalGroups);
    } else {
      originalGroups.push(group);
      setSelectedGroups(originalGroups);
    }
    console.log(originalGroups, 'grops');
  };

  const onPressDone = async () => {
    if (selectedGroups?.length === 0) {
      actions.alert.showError({message: 'Please choose at least a group'});
      return false;
    }

    actions.hud.show();
    try {
      const params = {
        where: {id: state.currentUser?.id},
        data: {
          company: {
            update: {
              groups: {
                connect: [],
              },
            },
          },
        },
      };
      const items = [];
      selectedGroups.map(t => items.push({id: t}));
      params.data.company.update.groups.connect = items;
      await actions.user.saveUser(params);
      actions.alert.showSuccess({message: 'Added Groups to Company successfully!'});
      props.navigation.pop();
    } catch (e) {
      console.log(e);
    } finally {
      actions.hud.hide();
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Container>
        <ScrollView style={{flex: 1}}>
          <CloseBtn onPress={() => props.navigation.pop()}>
            <Image source={Images.icon_close_black}/>
          </CloseBtn>
          <Title>Which group would{'\n'}you like to choose?</Title>
          <Header>
            <Title style={{fontSize: 20, marginTop: 0}}>Groups</Title>
            <TouchableOpacity>
              <Image source={Images.icon_control}/>
            </TouchableOpacity>
          </Header>
          <List
            data={groups}
            renderItem={({item, index}) =>
              <GroupItem isSelectMode={true} index={item} item={item} key={index}
                         onPress={onPressGroup}
                         isSelected={selectedGroups.find(s => s === item.id)}/>}
          />
        </ScrollView>
        <Bottom>
          <Button onPress={onPressDone}>
            <AddText style={{color: 'white'}}>Done</AddText>
          </Button>
        </Bottom>
      </Container>
    </SafeAreaView>
  );
};

export default SelectGroup;

const Header = styled.View`
  flex-direction: row;
  ${Styles.between_center}
  margin-top: 30px;
`;

const List = styled.FlatList`
  flex: 1;
  padding-horizontal: 2px;
  margin-top: 20px;
`;

const AddText = styled(MainBoldFont)`
  font-size: 14px;
  line-height: 24px;
  color: #6600ed;
`;

const Button = styled.TouchableOpacity`
  width: 160px;
  height: 45px;
  ${Styles.center}
  background-color: #6600ed;
  border-radius: 40px;
`;

const Bottom = styled.View`
  ${Styles.end_center}
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
