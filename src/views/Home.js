import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/native';
import { Styles } from '@/styles';
import { Images, Icons } from '@/styles/Images';
import ThumbUp from '@/assets/ikonate_icons/thumb-up.svg';
import ThumbDown from '@/assets/ikonate_icons/thumb-down.svg';
import Person from '@/assets/ikonate_icons/person.svg';
import Chat from '@/assets/ikonate_icons/chat.svg';
import { useOvermind } from '@/store';
import { MainBoldFont, MainMediumFont, MainRegularFont, MainSemiBoldFont } from '@/views/Components';
import { Dimensions, Image, RefreshControl, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { json } from 'overmind';
import AddMessageModal from '@/views/Modals/AddMessageModal';
import Video from 'react-native-video';

const Home = props => {
  const { state, actions } = useOvermind();
  console.log(state.currentUser);

  const [isOpen, setOpen] = useState(false);
  const [selectedScene, setSelectedScene] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [scenes, setScenes] = useState([]);
  const [templates, setTemplates] = useState([])
  const [chosenMedia, setChosenMedia] = useState(null);

  useEffect(() => {
    getScenes();
  }, []);

  const getScenes = async () => {
    try {
      await actions.storyline.getStorylines();
      if (state.storyline.storylines?.find(s => s.companies.find(c => c.id === state.currentUser?.company?.id))) {
        await actions.scene.getScenes();
        setScenes(json(state.scene.scenes)?.sort((a, b) => a.createdAt > b.createdAt ? -1 : 1)?.splice(0, 3))
      } else {
        const templates = await actions.storylineTemplate.getStorylineTemplates({ where: { isDefault: true }, getValues: true });
        console.log(templates, 'templates');
        setTemplates(templates?.sort((a, b) => a.createdAt > b.createdAt ? -1 : 1)?.splice(0, 3))
      }
      await actions.linkedMedia.getLinkedMedias();
      getRole();
    } catch (e) {
      console.log(e)
    }
  };


  const getRole = () => {
    // const groups = state.currentUser?.groups;
    // if (groups.find(g => g.name === 'admin' || g.name === 'super-admin')) {
    //   setData(state.linkedMedia.linkedMedias?.filter(m => m?.media?.user?.company?.id === state.currentUser?.company?.id));
    // } else {
    //   const user = state.currentUser?.company?.employees.find(e => e.user.id === state.currentUser?.id)?.user;
    //   const directorGroups = user.userGroups.filter(ug => ug.subgroups?.find(s => s.group?.name === 'director'));
    //
    //   let employees = [];
    //   directorGroups.map(d => {
    //     employees = [...employees, ...state.currentUser.company?.employees?.filter(e => e.user?.userGroups?.find(ug => ug?.group?.id === d?.group?.id && ug.subgroups[0]?.group?.name === 'employee'))];
    //   });
    //
    //   setData(
    //     state.linkedMedia.linkedMedias?.filter(m =>
    //       m?.media?.user?.id === state.currentUser?.id
    //       || (state.currentUser?.company?.employees?.filter(e => !e.user?.groups?.find(g => g.name === 'admin'))?.find(e => e.user?.id === m?.media?.user?.id) && m.visibility === 'PUBLIC')
    //       || m.taggedUsers.find(u => u.id === state.currentUser.id)
    //       || employees?.find(e => e.user?.id === m.media?.user?.id),
    //     ));
    // }

    setData(json(state.linkedMedia.linkedMedias?.filter(l => l.approval !== 'APPROVED' && l.media.user?.company?.id === state.currentUser?.company?.id)))
  };

  const onPlay = (id) => {
    const medias = json([...data]);
    medias.find(m => m.id === id).isPlay = true;
    setData(medias);
  };

  const onLike = async (linkedMedia) => {
    if (linkedMedia?.media?.likes?.find(l => l?.user?.id === state.currentUser?.id)) {
      actions.alert.showError({ message: 'You\'ve already done.' });
    } else {
      actions.hud.show();
      try {
        await actions.media.saveMedia({
          where: { id: linkedMedia?.media?.id },
          data: {
            likes: {
              create: [{
                user: { connect: { id: state.currentUser?.id } },
              }],
            },
          },
        });
        actions.alert.showSuccess({ message: 'Done successfully!' });
        await actions.linkedMedia.getLinkedMedias();
        getRole()
      } catch (e) {
        console.log(e);
      } finally {
        actions.hud.hide();
      }
    }
  };

  const onDislike = async (linkedMedia) => {
    if (linkedMedia?.media?.dislikes?.find(l => l?.user?.id === state.currentUser?.id)) {
      actions.alert.showError({ message: 'You\'ve already done.' });
    } else {
      actions.hud.show();
      try {
        await actions.media.saveMedia({
          where: { id: linkedMedia?.media?.id },
          data: {
            dislikes: {
              create: [{
                user: { connect: { id: state.currentUser?.id } },
              }],
            },
          },
        });
        actions.alert.showSuccess({ message: 'Done successfully!' });
        await actions.linkedMedia.getLinkedMedias();
        getRole()
      } catch (e) {
        console.log(e);
      } finally {
        actions.hud.hide();
      }
    }
  };

  console.log(data, 'data')

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Container>
        <Header>
          <Left>
            <Title>Hi {state.currentUser?.firstName}!</Title>
            <Desc>What do you want to film today?</Desc>
          </Left>
          <Right as={View}>
            {state.currentUser?.avatar ? <Right source={{ uri: state.currentUser?.avatar || '' }} /> : <Person width={30} height={30} />}
          </Right>
        </Header>
        <SceneContainer style={{ shadowOffset: { x: 0, y: 10 } }}>
          <VideoTitle style={{ marginTop: 0 }}>Give these scenes a try</VideoTitle>
          {scenes?.length > 0 && scenes.sort((a, b) => a.createdAt > b.createdAt ? -1 : 1).map((s, i) => <Scene key={i}>
            <Image style={{ height: 200, backgroundColor: '#f7f7f7' }} source={{ uri: s.template?.example?.source || '' }} />
            <Type>{s.type?.name?.toUpperCase()}</Type>
            <SceneTitle>{s.name}</SceneTitle>
            <Row>
              <Badge>
                <BText>{s?.type?.name}</BText>
              </Badge>
              <TouchableOpacity onPress={() => props.navigation.navigate('SceneDetail', { scene: s })}>
                <Image source={Images.icon_arrow_right} style={{ tintColor: 'black' }} />
              </TouchableOpacity>
            </Row>
          </Scene>)}
          {templates?.map((t, i) => <Scene key={i}>
            <Image style={{ height: 200, backgroundColor: '#f7f7f7' }} source={{ uri: t?.illustrationUrl?.source || '' }} />
            {t.storylineScenes?.map((s, i) => <View key={i}>
              <Type>{t?.name}</Type>
              <SceneTitle>{s?.sceneTemplate?.name}</SceneTitle>
              <Row>
                {s?.sceneTemplate?.type?.name ? <Badge>
                  <BText>{s?.sceneTemplate?.type?.name}</BText>
                </Badge> : <View />}
                <TouchableOpacity>
                  <Image source={Images.icon_arrow_right} style={{ tintColor: 'black' }} />
                </TouchableOpacity>
              </Row>
            </View>)}
          </Scene>)}
        </SceneContainer>
        <VideoTitle>Recently Added</VideoTitle>
        <List
          data={data}
          ListFooterComponent={<View style={{ height: 100 }} />}
          ListEmptyComponent={<MainRegularFont
            style={{ alignSelf: 'center', marginTop: 40, fontSize: 16, color: 'gray' }}>There
            is nothing to show</MainRegularFont>}
          refreshing={refreshing}
          refreshControl={
            <RefreshControl refreshing={refreshing}
              onRefresh={async () => await actions.linkedMedia.getLinkedMedias()} />
          }
          renderItem={({item, index}) => <GridItem key={index}>
            <Overlay/>
            {item?.media?.type === 'IMAGE' ? <ItemVideo source={{uri: item?.media?.source}} as={Image}/>: item.isPlay ? <ItemVideo
              source={{uri: item?.media?.source}}
              onError={console.log}
              paused={!item.isPlay}
            /> : <ItemVideo source={{uri: item?.media?.avatar}} as={Image}/>}
            {/*<GHeader>*/}
            {/*  <VSelectBtn onPress={() => onSelect(item)} isSelected={state.selectedVideos.find(v => v.id === item.id)}*/}
            {/*              style={{borderColor: 'white'}}>*/}
            {/*    {state.selectedVideos.find(v => v.id === item.id) && <Image source={Images.icon_check}/>}*/}
            {/*  </VSelectBtn>*/}
            {/*  <TouchableOpacity onPress={() => setChosenMedia(item.id)}>*/}
            {/*    <Image source={Images.icon_more}/>*/}
            {/*  </TouchableOpacity>*/}
            {/*</GHeader>*/}
            <View style={{width: '100%', alignItems: 'center', marginTop: 130}}>
              {!item.isPlay ? <GPlayBtn onPress={() => onPlay(item.id)}>
                <Image source={Images.icon_triangle_white}/>
              </GPlayBtn> : <GPlayBtn as={View} style={{backgroundColor: 'transparent'}}/>}
            </View>
            <GroupView>
              <TouchableOpacity onPress={() => onLike(item)}>
                <ThumbUp width={40} height={40}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onDislike(item)}>
                <ThumbDown width={40} height={40}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                // setOpen(true);
                // setSelectedScene(item);
              }}><Chat width={40} height={40}/>
              </TouchableOpacity>
            </GroupView>
            <View style={{paddingHorizontal: 20, marginTop: 40}}>
              <GType>{item.media?.type}</GType>
              <GTitle>{item.media?.name}</GTitle>
            </View>
            <Bottom>
              <Avatar source={{uri: item.media?.user?.avatar || ''}}/>
              <Name>{item.media?.user?.firstName + ' ' + item.media?.user?.lastName}</Name>
            </Bottom>
          </GridItem>}
        />
        <AddMessageModal isOpen={isOpen} closeModal={() => setOpen(false)} item={selectedScene} />
      </Container>
    </SafeAreaView>
  );
};

export default Home;

const GridItem = styled.View`
  height: 430px;
  margin-bottom: 20px;
`;
const GTitle = styled(MainBoldFont)`
  color: white;
  font-size: 24px;
  line-height: 29px;
`;

const GType = styled(MainSemiBoldFont)`
  font-size: 10px;
  line-height: 20px;
  color: white
`;


const VName = styled(MainMediumFont)`
  font-size: 12px;
  line-height: 18px;
  color: #4c4c4c;
  margin-top: 5px;
`;
const GPlayBtn = styled.TouchableOpacity`
  width: 70px;
  height: 50px;
  ${Styles.center}
  background-color: #00000080;
  border-radius: 31px;
`;

const GHeader = styled.View`
  flex-direction: row;
  ${Styles.between_center};
  padding-horizontal: 20px;
  padding-top: 17px;
`;

const VType = styled(MainSemiBoldFont)`
  color: #4c4c4c;
  font-size: 10px;
  line-height: 20px;
  letter-spacing: 2px;
`;

const Content = styled.View`
  margin-left: 11px;
  justify-content: center;
  width: 70%;
`;

const BText = styled(MainMediumFont)`
  font-size: 12px;
  line-height: 18px;
  color: #0f0f0f;
`

const Badge = styled.View`
  border-radius: 100px;
  border-width: 1px;
  border-color: #bcbcbc;
  padding-horizontal: 8px;
  padding-vertical: 2px;
`

const Row = styled.View`
  flex-direction: row;
  ${Styles.between_center}
  margin-top: 15px;
`

const SceneTitle = styled(MainSemiBoldFont)`
  font-size: 24px;
  line-height: 29px;
`

const Type = styled(MainSemiBoldFont)`
  font-size: 10px;
  line-height: 20px;
  color: #4c4c4c;
  margin-top: 13px;
  letter-spacing: 1px;
`

const Scene = styled.View`
  margin-bottom: 20px;
`

const SceneContainer = styled.View`
  shadow-color: #000000;
  elevation: 3;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  background-color: white;
  padding-horizontal: 18px;
  padding-top: 23px;
  border-radius: 12px;
  margin-top: 32px;
`

const CloseBtn = styled.TouchableOpacity`
  position: absolute;
  right: 10px;
  top: 10px;
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

const Menu = styled.View`
  width: 280px;
  padding: 20px;
  border: 1px solid #d8d8d8;
  background-color: white;
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 31;
`;

const List = styled.FlatList`
  flex: 1;
  margin-bottom: 50px;
`;

const Name = styled(MainMediumFont)`
  line-height: 20px;
  color: white;
  margin-left: 10px;
`;

const Avatar = styled.View`
  width: 26px;
  height: 26px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.4);
  background-color: gray;
  border-radius: 30px;
`;

const Bottom = styled.View`
  align-items: center;
  width: 100%;
  flex-direction: row;
  margin-top: 10px;
  margin-horizontal: 20px;
`;

const GroupView = styled.View`
  height: 76px;
  border-radius: 20px;
  background-color: white;
  margin-top: 25px;
  ${Styles.between_center}
  flex-direction: row;
  padding-horizontal: 50px;
  margin-horizontal: 20px;
`;

const VTitle = styled(MainSemiBoldFont)`
  font-size: 24px;
  line-height: 29px;
  color: white;
`;

const VText = styled(MainSemiBoldFont)`
  font-size: 10px;
  line-height: 20px;
  color: white;
`;

const PlayBtn = styled.TouchableOpacity`
  background-color: #00000080;
  border-radius: 20px;
  width: 85px;
  height: 63px;
  ${Styles.center}
  margin-top: 100px;
`;

const Overlay = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: black;
  border-radius: 12px;
`;

const ItemVideo = styled(Video)`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 12px;
`;

const Logo = styled.Image`
  position: absolute;
  width: ${Dimensions.get('window').width - 50};
  height: ${Dimensions.get('window').width * 1.3};
  border-radius: 12px;
`;

const VideoView = styled.View`
  padding-horizontal: 20px;
  margin-bottom: 40px;
  height: ${Dimensions.get('window').width * 1.3};
`;

const VideoTitle = styled(MainBoldFont)`
  font-size: 20px;
  line-height: 24px;
  color: black;
  margin-top: 50px;
  margin-bottom: 10px;
`;

const Right = styled.Image`
  width: 52px;
  height: 52px;
  border-radius: 30px;
  background-color: #d8d8d8;
  ${Styles.center}
`;

const Desc = styled(MainMediumFont)`
  margin-top: 2px;
  line-height: 20px;
  color: #4c4c4c;
`;

const Title = styled(MainBoldFont)`
  font-size: 26px;
  line-height: 32px;
  color: #1b2124;
`;

const Left = styled.View``;

const Header = styled.View`
  flex-direction: row;
  ${Styles.between_center}
`;

const Container = styled.ScrollView`
  flex: 1;
  background-color: white;
  padding-horizontal: 25px;
`;
