import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainMediumFont, MainSemiBoldFont} from '@/views/Components';
import {Dimensions, Image, KeyboardAvoidingView, SafeAreaView, TouchableOpacity, View} from 'react-native';
import PeopleItem1 from '@/views/Components/PeopleItem1';

const InviteTeammates = props => {
  const {state, actions} = useOvermind();
  const [selectedPeople, setSelectedPeople] = useState([]);

  const onPressNext = () => {
    if (selectedPeople?.length > 0) {
      const storyline = {...state.storyline.newStoryline};
      storyline.users = selectedPeople;
      actions.storyline.setNewStoryline(storyline);
    }
    props.navigation.navigate('AdditionalDetail');
  };

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

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Container>
        <View style={{flex: 1}}>
          <Title>Select some of your teammates to help you</Title>
          <Desc>
            We'll notify these people that they've been added and help them to get you great content as quickly and
            easily as possible. If you skip this step, you can always add people later.
          </Desc>
          <Row>
            <STitle>People</STitle>
            <TouchableOpacity onPress={() => props.navigation.navigate('InvitePeople')}>
              <Image source={Images.icon_plus}/>
            </TouchableOpacity>
          </Row>
          <List
            data={state.currentUser?.company?.employees}
            ListFooterComponent={<View style={{height: 100}}/>}
            renderItem={({item, index}) => <PeopleItem1 isSelectMode={true} index={item} item={item}
                                                        onPress={onPressPeople}
                                                        isSelected={selectedPeople.find(s => s === item)} key={index}/>}
          />
        </View>
        <Bottom>
          <Button onPress={() => props.navigation.pop()} style={{backgroundColor: '#F7F7FE'}}>
            <AddText style={{color: 'black'}}>Back</AddText>
          </Button>
          <Button onPress={onPressNext}>
            <AddText style={{color: 'white'}}>Next</AddText>
          </Button>
        </Bottom>
      </Container>
    </SafeAreaView>
  );
};

export default InviteTeammates;

const STitle = styled(MainSemiBoldFont)`
  font-size: 20px;
  line-height: 24px;
`;

const Row = styled.View`
  flex-direction: row;
  ${Styles.between_center}
  margin-top: 26px;
`;

const Button = styled.TouchableOpacity`
  width: 160px;
  height: 56px;
  ${Styles.center}
  background-color: #6600ed;
  border-radius: 40px;
`;

const Bottom = styled.View`
  ${Styles.between_center}
  flex-direction: row;
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

const List = styled.FlatList`
  padding-top: 20px;
  height: 200px;
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
