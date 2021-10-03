import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainMediumFont, MainSemiBoldFont} from '@/views/Components';
import {Image, SafeAreaView, ScrollView, TouchableOpacity, View} from 'react-native';
import {useActionSheet} from '@expo/react-native-action-sheet';
import DeliverableItem from '@/views/Components/DeliverableItem';
import Video from 'react-native-video';
import {json} from 'overmind';

const DeliverableList = props => {
  const {state, actions} = useOvermind();
  useEffect(() => {
    getDeliverables();
  }, []);
  const [selectedDeliverable, setSelectedDeliverable] = useState([]);
  const [data, setData] = useState([]);
  const getDeliverables = async () => {
    actions.hud.show();
    await actions.deliverableTemplate.getDeliverableTemplates();
    await actions.deliverable.getDeliverableTypes();
    const d = [...json(state.deliverableTemplate.deliverableTemplates)];
    d.map(d => d.isPlay = false);
    setData(d);
    actions.hud.hide();
  };

  console.log(data)
  const onPressNext = async () => {
    if (selectedDeliverable?.length > 0) {
      const storyline = {...state.storyline.newStoryline};
      storyline.deliverable = selectedDeliverable;
      actions.storyline.setNewStoryline(storyline);
    }
    props.navigation.navigate('InviteTeammates');
  };

  const handler = (deliverable) => {
    const storyline = {...state.storyline.newStoryline};
    storyline.deliverable = [deliverable];
    actions.storyline.setNewStoryline(storyline);
    props.navigation.navigate('InviteTeammates');
  }

  const onPressDeliverable = (deliverable) => {
    let originalDeliverables = [...selectedDeliverable];
    const index = originalDeliverables.findIndex(s => s === deliverable);
    if (index > -1) {
      originalDeliverables.splice(index, 1);
      setSelectedDeliverable(originalDeliverables);
    } else {
      originalDeliverables.push(deliverable);
      setSelectedDeliverable(originalDeliverables);
    }
  };

  const onPlay = (id) => {
    const d = [...data];
    d.find(d => d.id === id).isPlay = true;
    setData(d);
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Container>
        <View style={{flex: 1}}>
          <Title>Would you like us to{'\n'}edit your videos {'\n'}together</Title>
          <Desc>We'll turn your great raw media into final content ready to share anywhere and everywhere</Desc>
          <Row>
            <STitle>Deliverables</STitle>
            <TouchableOpacity onPress={() => props.navigation.navigate('AddDeliverable', {handler: handler})}>
              <Image source={Images.icon_plus}/>
            </TouchableOpacity>
          </Row>
          {data?.length > 0 ? <List
            data={data}
            ListFooterComponent={<View style={{height: 100}}/>}
            renderItem={({item, index}) => <Item key={index}>
              <SelectBtn isSelected={selectedDeliverable?.find(d => d.id === item.id)} onPress={() => onPressDeliverable(item)}>
                {selectedDeliverable?.find(d => d.id === item.id) ? <Image source={Images.icon_check} style={{tintColor: 'white'}}/>: null}
              </SelectBtn>
              <VideoView source={{uri: item?.example?.source}} paused={!item.isPlay}>
                {!item.isPlay && <PlayBtn onPress={() => onPlay(item.id)}>
                  <Image source={Images.icon_triangle_white}/>
                </PlayBtn>}
              </VideoView>
              <Body>
                <Image source={Images.icon_video}/>
                <Content>
                  <DTitle>{item?.name}</DTitle>
                  <DDesc>{item?.description}</DDesc>
                </Content>
              </Body>
              <Body style={{borderBottomWidth: 0, justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20}}>
                <View>
                  <ItemText>Quantity</ItemText>
                  <ItemBody>
                    <Image source={Images.icon_film} style={{tintColor: 'black', width: 20, resizeMode: 'contain'}}/>
                    <IText>{item?.quantity}</IText>
                  </ItemBody>
                </View>
                <View>
                  <ItemText>Duration</ItemText>
                  <ItemBody>
                    <Image source={Images.icon_triangle_border} style={{tintColor: 'black', marginTop: 2, width: 20, resizeMode: 'contain', marginLeft: -4}}/>
                    <IText>{item?.duration}s</IText>
                  </ItemBody>
                </View>
                <View>
                  <ItemText>Format</ItemText>
                  <IText style={{marginLeft: 0}}>{item?.type?.name}</IText>
                </View>
                {/*<TouchableOpacity onPress={props.onPress}>*/}
                {/*  <EditText>Edit</EditText>*/}
                {/*</TouchableOpacity>*/}
              </Body>
            </Item>}
          /> : <Empty>
            <AddBtn onPress={() => props.navigation.navigate('AddDeliverable', {handler: handler})}>
              <AddText>+ Add a Deliverable</AddText>
            </AddBtn>
          </Empty>}
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

export default DeliverableList;

const STitle = styled(MainSemiBoldFont)`
  font-size: 20px;
  line-height: 24px;
`;

const Row = styled.View`
  flex-direction: row;
  ${Styles.between_center}
  margin-top: 26px;
`;

const Item = styled.View`
  background-color: white;
  border-radius: 12px;
  margin-bottom: 20px;
  background-color: white;
  border: 2px solid #D3D3D3;
`;


const SelectBtn = styled.TouchableOpacity`
  width: 24px; height: 24px; border-radius: 20px;
  position: absolute;
  right: 10px; top: 10px;
  border: 1.5px solid white;
  z-index: 10;
  ${Styles.center}
  border-color: ${props => props.isSelected ? '#6600ed': 'white'};
  background-color: ${props => props.isSelected ? '#6600ed' : 'transparent'};
`

const EditText = styled(MainSemiBoldFont)`
  color: #6600ed;
  font-size: 12px;
`

const IText = styled(MainMediumFont)`
  line-height: 20px;
  margin-left: 7px;
`

const ItemBody = styled.View`
  flex-direction: row;
  align-items: center;
`

const ItemText = styled(MainMediumFont)`
  font-size: 12px;
  color: #4c4c4c;
`


const DDesc = styled(MainSemiBoldFont)`
  font-size: 12px;
  margin-top: 5px;
`

const DTitle = styled(MainSemiBoldFont)`
  
`

const Content = styled.View`
  margin-left: 10px;
`

const Body = styled.View`
  padding-horizontal: 13px;
  padding-vertical: 9px;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #D3D3D3;
`

const PlayBtn = styled.TouchableOpacity`
  width: 55px; height: 55px; border-radius: 30px;
  background-color: #00000080;
  ${Styles.center}
`

const VideoView = styled(Video)`
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  background-color: #474762;
  height: 100px;
  width: 100%;
  ${Styles.center}
`

const Empty = styled.View`
  flex: 1;
  ${Styles.center}
`;

const AddBtn = styled.TouchableOpacity`
  border: 2px solid #6600ED;
  border-radius: 31px;
  margin-top: 17px;
  height: 50px;
  padding-horizontal: 20px;
  ${Styles.center}
`;

const List = styled.FlatList`
  flex: 1;
  margin-top: 20px;
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

const Title = styled(MainBoldFont)`
  font-size: 26px;
  line-height: 32px;
`;

const Container = styled.View`
  flex: 1;
  background-color: white;
  padding-horizontal: 25px;
`;
