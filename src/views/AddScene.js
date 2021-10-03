import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainMediumFont, MainSemiBoldFont} from '@/views/Components';
import {Image, SafeAreaView, TouchableOpacity, View} from 'react-native';
import {SceneItem} from '@/views/Components/SceneItem';
import Video from 'react-native-video';

const AddScene = props => {
  const {state, actions} = useOvermind();
  const [selectedScene, setSelectedScene] = useState([]);
  const [chosenScene, setChosenScene] = useState(null);
  const [scenes, setScenes] = useState([]);

  console.log(scenes, 'scenes')

  useEffect(() => {
    getSceneTypes()
  }, []);

  const getSceneTypes = async () => {
    setScenes(state.storyline.newStoryline?.storylineTemplate?.storylineScenes?.filter(s => s?.sceneTemplate?.id))
    await actions.scene.getSceneTypes();
  }

  const onPressNext = () => {
    if (scenes?.length === 0) {
      actions.alert.showError({message: 'Please choose scene templates'});
      return false;
    }
    const storyline = {...state.storyline.newStoryline};
    storyline.scenes = scenes;
    actions.storyline.setNewStoryline(storyline);
    props.navigation.navigate('DeliverableList');
  };

  const handler = (scene) => {
    const data = [...scenes];
    const index = data.findIndex(d => d.id === scene.id);
    if (index > -1) {
      data[index] = scene;
    } else {
      data.push(scene);
    }
    setScenes(data);
  }

  const onPressScene = (scene) => {
    let originalScenes = [...selectedScene];
    const index = originalScenes.findIndex(s => s === scene);
    if (index > -1) {
      originalScenes.splice(index, 1);
      setSelectedScene(originalScenes);
    } else {
      originalScenes.push(scene);
      setSelectedScene(originalScenes);
    }
  };

  const onEdit = (item) => {
    setChosenScene(null);
    props.navigation.navigate('AddScene1', {data: item, handler: handler})
  }

  const onDelete = (id) => {
    setChosenScene(null)
    const data = [...scenes];
    const index = data.findIndex(d => d.id === id);
    if (index > -1) {
      data.splice(index, 1);
    }
    setScenes(data);
  }
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Container>
        <View style={{flex: 1}}>
          <Title>These are the scenes {'\n'}that are part of your storyline</Title>
          <Desc>We'll turn your great raw media into final content ready to share anywhere and everywhere</Desc>

          <Row>
            <STitle>Scenes</STitle>
            <TouchableOpacity onPress={() => props.navigation.navigate('AddScene1', {data: {sceneTemplate: {}}, handler: handler})}>
              <Image source={Images.icon_plus}/>
            </TouchableOpacity>
          </Row>
          <List
            data={scenes}
            ListFooterComponent={<View style={{height: 100}}/>}
            renderItem={({item, index}) => <SceneContainer style={{shadowOffset: {x: 0, y: 10}}}>
              <SubContainer>
                <Header>
                  {item?.sceneTemplate?.type?.name ? <Badge>
                    <BText>{item?.sceneTemplate?.type?.name}</BText>
                  </Badge> : <View/>}
                  <Right>
                    <Image source={Images.icon_film} style={{tintColor: 'black'}}/>
                    <RText>{item?.quantity}</RText>
                    <TouchableOpacity style={{marginLeft: 27}} onPress={() => setChosenScene(item.id)}>
                      <Image source={Images.icon_more} style={{tintColor: 'black'}}/>
                    </TouchableOpacity>
                    {/*<SelectBtn isSelected={selectedScene?.find(s => s.id === item.id)} onPress={() => onPressScene(item)}>*/}
                    {/*  {selectedScene?.find(s => s.id === item.id) ? <Image source={Images.icon_check} style={{tintColor: 'white'}}/> : null}*/}
                    {/*</SelectBtn>*/}
                  </Right>
                </Header>
                <ITitle>{ item?.sceneTemplate?.name}</ITitle>
                <VideoList>
                  {item?.sceneTemplate?.example?.source ? <Block
                    source={{uri: item?.sceneTemplate?.example?.source || item?.sceneTemplate?.example?.avatar || ''}}
                    as={item?.sceneTemplate?.example?.type === 'IMAGE' ? Image : Video}
                    paused={true}
                    onError={console.log}
                    key={index}
                  /> : null}
                </VideoList>
              </SubContainer>
              {chosenScene === item.id && <Menu>
                <CloseBtn onPress={() => setChosenScene(null)}>
                  <Image source={Images.icon_close_black} />
                </CloseBtn>
                <Item onPress={() => onEdit(item)}>
                  <Image source={Images.icon_calendar} style={{ tintColor: 'black' }} />
                  <ItemText>Edit Scene</ItemText>
                </Item>
                <Item onPress={() => onDelete(item.id)}>
                  <Image source={Images.icon_calendar} style={{ tintColor: 'black' }} />
                  <ItemText>Delete Scene</ItemText>
                </Item>
              </Menu>}
            </SceneContainer>}
          />
          <HelpView>
            <Image source={Images.logo_teacher} style={{width: 60, height: 60, resizeMode: 'contain', borderRadius: 50, marginRight: 10}}/>
            <View>
              <HTitle>Want help with your storyline?</HTitle>
              <HDesc>Talk with out in-house creative directors.</HDesc>
            </View>
          </HelpView>
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

export default AddScene;


const SceneContainer = styled.View`
  shadow-color: #000000;
  elevation: 3;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
`


const SelectBtn = styled.TouchableOpacity`
  width: 24px;
  height: 24px;
  border-radius: 20px;
  border: 1.5px solid white;
  z-index: 10;
  ${Styles.center}
  margin-left: 20px;
  border-color: ${props => props.isSelected ? '#6600ed' : 'black'};
  background-color: ${props => props.isSelected ? '#6600ed' : 'transparent'};
`;

const Block = styled(Video)`
  width: 90px;
  height: 90px;
  border-radius: 8px;
  background-color: #f7f7f7;
  ${Styles.center}
  margin-right: 15px;
`;

const VideoList = styled.View`
  flex-direction: row;
  margin-top: 10px;
`;

const ITitle = styled(MainSemiBoldFont)`
  font-size: 24px;
  line-height: 29px;
  color: black;
  margin-top: 15px;
`;

const RText = styled(MainSemiBoldFont)`
  font-size: 12px;
  line-height: 18px;
  color: #0f0f0f;
  margin-left: 10px;
`;

const Right = styled.View`
  flex-direction: row;
  ${Styles.center}
`;

const Badge = styled.View`
  padding-horizontal: 7px;
  padding-vertical: 1px;
  border-width: 1px;
  border-color: #d2d0d0;
  border-radius: 10px;
`;

const BText = styled(MainMediumFont)`
  font-size: 12px;
  line-height: 18px;
  color: #0f0f0f;
`;

const Header = styled.View`
  flex-direction: row;
  ${Styles.between_center};
  width: 100%;
`;

const SubContainer = styled.TouchableOpacity`
  background-color: white;
  border-radius: 12px;
  shadow-color: #000000;
  elevation: 3;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  margin-bottom: 20px;
  min-height: 120px;
  padding: 15px;
`;

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
  height: 110px;
  z-index: 100;
`;


const HDesc = styled(MainMediumFont)`
  font-size: 12px;
  line-height: 18px;
  color: #4b4b4b;
  margin-top: 4px;
`;

const HTitle = styled(MainBoldFont)`
  line-height: 20px;
`;

const HelpView = styled.View`
  border: 2px solid #E6E2BF;
  border-radius: 8px;
  background-color: #FFFDEC;
  flex-direction: row;
  ${Styles.center}
  padding-vertical: 20px;
  padding-horizontal: 15px;
  margin-bottom: 40px;
`;

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
  margin-top: 30px;
`;

const Container = styled.View`
  flex: 1;
  background-color: white;
  padding-horizontal: 25px;
`;
