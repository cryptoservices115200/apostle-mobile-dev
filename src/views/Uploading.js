import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainMediumFont, MainSemiBoldFont} from '@/views/Components';
import {Image, ScrollView, TouchableOpacity, View} from 'react-native';

const Uploading = props => {
  const {state, actions} = useOvermind();
  const {data} = props.route.params;
  const [name, setName] = useState(data?.filename ? data?.filename : data.path.split('/')[data.path.split('/')?.length - 1]);
  const [people, setPeople] = useState([]);
  const [tags, setTags] = useState([]);
  const [storylines, setStorylines] = useState([]);
  const [scenes, setScenes] = useState([]);

  console.log(data, 'data ==========');

  useEffect(() => {
    getGroups();
  }, []);

  useEffect(() => {
    setScenes([]);
  }, [storylines]);

  const getGroups = async () => {
    await actions.group.getGroups();
    await actions.storyline.getStorylines();
  };

  const onRemovePeople = (id) => {
    const data = [...people];
    data.splice(data.findIndex(d => d.id === id), 1);
    setPeople(data);
  };

  const onRemoveStoryline = (id) => {
    const data = [...storylines];
    data.splice(data.findIndex(d => d.id === id), 1);
    setStorylines(data);
  };

  const onRemoveScene = (id) => {
    const data = [...scenes];
    data.splice(data.findIndex(d => d.id === id), 1);
    setScenes(data);
  };

  const onRemoveTag = (id) => {
    const data = [...tags];
    data.splice(data.findIndex(d => d === id), 1);
    setTags(data);
  };

  const onNext = async () => {
    actions.hud.show();
    const params = {
      data: {
        name,
        type: data?.mime?.includes('image') ? 'IMAGE' : 'VIDEO',
        source: data?.path,
        avatar: data?.thumbnail?.filepath,
        user: {connect: {id: state.currentUser?.id}},
      },
    };

    const linkedParams = {
      data: {
        type: 'RAW',
        approval: 'NEW',
        visibility: 'INTERNAL',
      },
    };

    if (data?.id) {
      params.where = {id: data?.id};
    }

    if (people?.length > 0) {
      const peopleParam = [];
      people.map(p => peopleParam.push({id: p?.user?.id}));
      params.data.taggedUsers = {
        connect: peopleParam,
      };
      linkedParams.data.taggedUsers = {
        connect: peopleParam,
      };
    }

    if (tags?.length > 0) {
      const tagParam = [];
      tags.map(t => tagParam.push({id: t}));
      params.data.tags = {
        connect: tagParam,
      };
      linkedParams.data.tags = {
        connect: tagParam,
      };
    }

    console.log(params, 'params');

    const {saveMedia} = await actions.media.saveMedia(params);
    if (saveMedia?.id) {

      linkedParams.data.media = {connect: {id: saveMedia?.id}};

      if (storylines?.length > 0) {

        storylines.map(async (s) => {
          const sceneParams = [];
          scenes.filter(scene => s.scenes.find(ss => ss.id === scene.id)).map(d => sceneParams.push({id: d.id}));
          if (sceneParams?.length > 0) {
            linkedParams.data.scenes = {connect: sceneParams};
          }
          linkedParams.data.storyline = {connect: {id: s.id}};
          console.log(linkedParams);
          await actions.linkedMedia.saveLinkedMedia(linkedParams);

          await actions.storyline.saveStoryline({
            where: {id: s.id},
            data: {
              medias: {
                connect: [{id: saveMedia?.id}],
              },
            },
          });
        });

      } else {
        await actions.linkedMedia.saveLinkedMedia(linkedParams);
      }

      scenes.map(async (s) => {
        await actions.scene.saveScene({
          where: {id: s.id},
          data: {
            medias: {
              connect: [{id: saveMedia?.id}],
            },
          },
        });
      });
      await actions.storyline.getStorylines();
      await actions.scene.getScenes();
      await actions.media.getMedias();
      await actions.linkedMedia.getLinkedMedias();
      actions.hud.hide();
      props.navigation.navigate('Videos');
    }
  };

  return (
    <Container>
      <ScrollView style={{flex: 1}}>
        <CloseBtn onPress={() => props.navigation.pop()}>
          <Image source={Images.icon_close_black}/>
        </CloseBtn>
        <Title>Great Job!</Title>
        <Desc>While your video uploads, you can add some info below</Desc>
        <Form>
          <FormText>Name</FormText>
          <FormInput
            placeholder={'Name'}
            placeholderTextColor={'gray'}
            value={name}
            onChangeText={setName}
          />
        </Form>
        <Row>
          <RowText>Tagged People</RowText>
          <TouchableOpacity onPress={() => props.navigation.navigate('SelectPeople', {people, handler: setPeople})}>
            <RowText style={{color: '#6600ED'}}>Add People</RowText>
          </TouchableOpacity>
        </Row>
        <List
          data={people}
          renderItem={({item, index}) => <Item key={index}>
            <Left>
              <Logo source={{uri: item?.user?.avatar || ''}}/>
              <ItemText style={{color: 'black'}}>{item?.user?.firstName || ''} {item?.user?.lastName || ''}</ItemText>
            </Left>
            <TouchableOpacity onPress={() => onRemovePeople(item?.id)}>
              <Image source={Images.icon_remove}/>
            </TouchableOpacity>
          </Item>}
        />
        <Row>
          <RowText>Tags</RowText>
          <TouchableOpacity onPress={() => props.navigation.navigate('SelectTag', {data: tags, handler: setTags})}>
            <RowText style={{color: '#6600ED'}}>Add Tags</RowText>
          </TouchableOpacity>
        </Row>
        <TagView>
          {state.group.groups.filter(g => tags.find(t => t === g.id))?.map((t, i) => <TagItem key={i}>
            <TagText>{t.name}</TagText>
            <TouchableOpacity onPress={() => onRemoveTag(t.id)}>
              <Image source={Images.icon_close_black}
                     style={{tintColor: '#B4B4B4'}}/></TouchableOpacity>
          </TagItem>)}
        </TagView>
        <Row>
          <RowText>Storylines</RowText>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('SelectStoryline', {data: storylines, handler: setStorylines})}>
            <RowText style={{color: '#6600ED'}}>Add Storylines</RowText>
          </TouchableOpacity>
        </Row>
        <List
          data={storylines}
          renderItem={({item, index}) => <Item key={index}>
            <Left>
              <Image source={Images.icon_book} style={{tintColor: 'black'}}/>
              <ItemText>{item?.name}</ItemText>
            </Left>
            <TouchableOpacity onPress={() => onRemoveStoryline(item.id)}>
              <Image source={Images.icon_remove}/>
            </TouchableOpacity>
          </Item>}
        />
        {storylines?.length > 0 && <View>
          <Row>
            <RowText>Scenes</RowText>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('SelectScenes', {data: scenes, storylines, handler: setScenes})}>
              <RowText style={{color: '#6600ED'}}>Add Scenes</RowText>
            </TouchableOpacity>
          </Row>
          <List
            data={scenes}
            ListFooterComponent={<View style={{height: 100}}/>}
            renderItem={({item, index}) => <Item key={index}>
              <ItemText style={{marginLeft: 0}}>{item?.name}</ItemText>
              <TouchableOpacity onPress={() => onRemoveScene(item.id)}>
                <Image source={Images.icon_remove}/>
              </TouchableOpacity>
            </Item>}
          />
        </View>}
      </ScrollView>
      <Bottom>
        <TouchableOpacity onPress={() => props.navigation.pop()} style={{marginLeft: 20}}>
          <AddText style={{color: '#6600ed'}}>Cancel</AddText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.pop()}>
          <AddText style={{color: '#6600ed'}}>Delete</AddText>
        </TouchableOpacity>
        <Button onPress={onNext}>
          <AddText style={{color: 'white'}}>Done</AddText>
        </Button>
      </Bottom>
    </Container>
  );
};

export default Uploading;

const PText = styled(MainSemiBoldFont)`
  font-size: 12px;
  margin-left: 7px;
`;

const VProgressView = styled.View`
  flex-direction: row;
  ${Styles.center}
`;

const PBody = styled.View`
  margin-horizontal: 20px;
  border-radius: 10px;
  padding: 10px;
  background-color: white;
  width: 90%;
`;

const Progress = styled.View`
  ${Styles.absolute_full}
  background-color: #00000080;
  z-index: 10;
  ${Styles.start_center}
  padding-top: 50px;
`;

const TagText = styled(MainMediumFont)`
  line-height: 20px;
`;

const TagItem = styled.View`
  padding-horizontal: 15px;
  padding-vertical: 5px;
  padding-right: 5px;
  border: 1px solid #B4B4B4;
  border-radius: 40px;
  margin-right: 10px;
  ${Styles.between_center}
  flex-direction: row;
`;

const TagView = styled.View`
  flex-wrap: wrap;
  flex-direction: row;
`;

const Logo = styled.Image`
  width: 36px;
  height: 36px;
  background-color: #d8d8d8;
  border-radius: 20px;
`;

const RowText = styled(MainMediumFont)`
  line-height: 20px;
  color: #4c4c4c
`;

const CloseBtn = styled.TouchableOpacity`
  position: absolute;
  right: 0px;
  top: 20px;
`;

const ItemText = styled(MainMediumFont)`
  font-size: 14px;
  line-height: 24px;
  margin-left: 13px;
`;

const Left = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Item = styled.View`
  border: 1px solid #D5D5D5;
  border-radius: 6px;
  padding: 20px;
  flex-direction: row;
  margin-bottom: 20px;
  ${Styles.between_center}
`;

const List = styled.FlatList`
  flex: 1;
`;

const Row = styled.View`
  flex-direction: row;
  ${Styles.between_center};
  margin-vertical: 20px;
`;

const AddText = styled(MainSemiBoldFont)`
  font-size: 14px;
  line-height: 24px;
  color: #6600ed;
`;

const Desc = styled(MainMediumFont)`
  font-size: 16px;
  line-height: 24px;
  color: #4c4c4c;
  margin-top: 6px;
`;

const FormInput = styled.TextInput`
  text-align-vertical: top;
  background-color: #f7f7f7;
  width: 100%;
  border-radius: 6px;
  padding: 15px;
  color: black;
  font-family: Montserrat-Medium;
  font-size: 14px;
  margin-top: 6px;
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
  margin-bottom: 20px;
`;

const Title = styled(MainBoldFont)`
  font-size: 26px;
  line-height: 32px;
  margin-top: 50px;
`;

const Container = styled.View`
  flex: 1;
  background-color: white;
  padding-horizontal: 25px;
`;
