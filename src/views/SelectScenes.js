import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainSemiBoldFont} from '@/views/Components';
import {Image, SafeAreaView, ScrollView, TouchableOpacity} from 'react-native';
import {json} from 'overmind';
import {ProgressView} from '@react-native-community/progress-view';
import {getHumanDate} from '@/utils/DateUtil';
import {SceneItem} from '@/views/Components/SceneItem';

const SelectScenes = props => {
  const {state, actions} = useOvermind();
  const {data, handler, storylines} = props.route.params;
  const [scenes, setScenes] = useState();
  const [selectedScenes, setSelectedScenes] = useState(data ? data : []);

  useEffect(() => {
    getScenes();
  }, []);

  const getScenes = async () => {
    let data = [];
    storylines.map(s => data = [...data, ...s.scenes]);
    setScenes(data);
  };

  const onPressScene = (scene) => {
    let originalScenes = [...selectedScenes];
    const index = originalScenes.findIndex(s => s.id === scene.id);
    if (index > -1) {
      originalScenes.splice(index, 1);
      setSelectedScenes(originalScenes);
    } else {
      originalScenes.push(scene);
      setSelectedScenes(originalScenes);
    }
    console.log(selectedScenes, 'scenes');
  };

  const onSelectAll = () => {
    setSelectedScenes(json(state.scene.scenes));
  };

  const onSelectNone = () => {
    setSelectedScenes([]);
  };

  const onPressDone = async () => {
    handler(selectedScenes);
    props.navigation.pop();
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Container>
        <ScrollView style={{flex: 1}}>
          <CloseBtn onPress={() => props.navigation.pop()}>
            <Image source={Images.icon_close_black}/>
          </CloseBtn>
          <Title>Which scene would you like?</Title>
          <Row>
            <RText>Scenes</RText>
            <TouchableOpacity>
              <Image source={Images.icon_control}/>
            </TouchableOpacity>
          </Row>
          <List
            data={scenes}
            renderItem={({item, index}) => <SceneItem key={index} data={item} selectedMode
                                                      isSelected={selectedScenes.find(s => s.id === item.id)}
                                                      setSelected={onPressScene}/>}
          />
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

export default SelectScenes;

const RText = styled(MainBoldFont)`
  font-size: 20px;
  color: #14142b;
`;

const Row = styled.View`
  flex-direction: row;
  ${Styles.between_center}
  margin-top: 24px;
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
