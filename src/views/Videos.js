import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainMediumFont, MainRegularFont, MainSemiBoldFont} from '@/views/Components';
import {Image, RefreshControl, SafeAreaView, TouchableOpacity, View} from 'react-native';
import Video from 'react-native-video';
import {json} from 'overmind';
import ControlAlt from '@/assets/ikonate_icons/controls-alt.svg';
import ListAlt from '@/assets/ikonate_icons/list-alt.svg';
import ControlAltDisabled from '@/assets/ikonate_icons/controls-alt-gray.svg';
import ListAltDisabled from '@/assets/ikonate_icons/list-alt-gray.svg';
import {useActionSheet} from '@expo/react-native-action-sheet';
import ViewIcon from '@/assets/ikonate_icons/view.svg';
import InfoIcon from '@/assets/ikonate_icons/info-gray.svg';
import ShareIcon from '@/assets/ikonate_icons/share.svg';
import DownloadIcon from '@/assets/ikonate_icons/download.svg';
import ArchiveIcon from '@/assets/ikonate_icons/archive.svg';

const Videos = props => {
  const {state, actions} = useOvermind();
  const [isGrid, setGrid] = useState(false);
  const [chosenMedia, setChosenMedia] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const {showActionSheetWithOptions} = useActionSheet();

  useEffect(() => {
    // getData();
    getRole()
  }, []);

  useEffect(() => {
    getRole();
  }, [state.linkedMedia.linkedMedias]);

  const getData = async () => {
    await actions.linkedMedia.getLinkedMedias();
    console.log('linkedMedia----', state.linkedMedia.linkedMedias);
    getRole();
  };

  const getRole = () => {
    const groups = state.currentUser?.groups;
    if (groups.find(g => g.name === 'admin' || g.name === 'super-admin')) {
      setData(state.linkedMedia.linkedMedias?.filter(m => m?.media?.user?.company?.id === state.currentUser?.company?.id && m?.media?.type === 'VIDEO'));
    } else {
      const user = state.currentUser?.company?.employees.find(e => e.user.id === state.currentUser?.id)?.user;
      const directorGroups = user.userGroups.filter(ug => ug.subgroups?.find(s => s.group?.name === 'director'));

      let employees = [];
      directorGroups.map(d => {
        employees = [...employees, ...state.currentUser.company?.employees?.filter(e => e.user?.userGroups?.find(ug => ug?.group?.id === d?.group?.id && ug.subgroups[0]?.group?.name === 'employee'))];
      });

      setData(
        state.linkedMedia.linkedMedias?.filter(m =>
          m?.media?.user?.id === state.currentUser?.id
          || (state.currentUser?.company?.employees?.filter(e => !e.user?.groups?.find(g => g.name === 'admin'))?.find(e => e.user?.id === m?.media?.user?.id) && m.visibility === 'PUBLIC')
          || m.taggedUsers.find(u => u.id === state.currentUser.id)
          || employees?.find(e => e.user?.id === m.media?.user?.id),
        ).filter(m => m.media?.type === 'VIDEO'));
    }
  };

  const onSelect = (item) => {
    const videos = [...state.selectedVideos];
    const index = videos.findIndex(v => v.id === item.id);
    if (index > -1) {
      videos.splice(index, 1);
    } else {
      videos.push(item);
    }
    actions.setSelectedVideos(videos);
  };

  const onPlay = (id) => {
    const medias = json([...data]);
    medias.find(m => m.id === id).isPlay = true;
    setData(medias);
  };

  const onPressMenu = (video) => {
    try {
      const options = ['View', 'Info', 'Share', 'Download', 'Archive', 'Cancel'];
      showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: options.length - 1,
        }, (index) => {
          if (index !== options.length - 1) {
            if (index === 0) {
              props.navigation.navigate('VideoView', {video: video.media})
            } else if (index === 1) {
              props.navigation.navigate('Info', {video})
            } else if (index === 2) {
              props.navigation.navigate('ShareVideo', {video: video.media})
            } else if (index === 3) {
              props.navigation.navigate('VideoView', {video: video.media})
            } else if (index === 4) {
              props.navigation.navigate('Archive', {video: video.media})
            }
          }
        },
      );
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#f7f7f7'}}>
      <Container>
        <Header>
          <Title>Videos</Title>
          <Right>
            {!state.isSelectMode && <TouchableOpacity style={{marginRight: 25}}>
              {state.linkedMedia.linkedMedias.length !== 0 && <ControlAlt width={25} height={25}/>}
              {state.linkedMedia.linkedMedias.length === 0 && <ControlAltDisabled width={25} height={25}/>}
              {/*<Image source={Images.icon_control} style={{tintColor: state.media.medias.length === 0 ? 'gray': 'black'}}/>*/}
            </TouchableOpacity>}
            {!state.isSelectMode && <TouchableOpacity onPress={() => setGrid(!isGrid)}>
              {state.linkedMedia.linkedMedias.length !== 0 && isGrid && <ListAltDisabled width={25} height={25}/>}
              {state.linkedMedia.linkedMedias.length !== 0 && !isGrid && <ListAlt width={25} height={25}/>}
              {state.linkedMedia.linkedMedias.length === 0 && <ListAltDisabled width={25} height={25}/>}
              {/*<Image source={Images.icon_list} style={{tintColor: state.media.medias.length === 0 ? 'gray': 'black'}}/>*/}
            </TouchableOpacity>}
            <SelectBtn onPress={actions.setSelectMode}>
              <SelectText
                isEmpty={state.linkedMedia.linkedMedias.length === 0}>{state.isSelectMode ? 'Cancel' : 'Select'}</SelectText>
            </SelectBtn>
          </Right>
        </Header>
        <VideoList
          data={data}
          ListFooterComponent={<View style={{height: 100}}/>}
          ListEmptyComponent={<MainRegularFont
            style={{alignSelf: 'center', marginTop: 40, fontSize: 16, color: 'gray'}}>There
            is nothing to show</MainRegularFont>}
          refreshing={refreshing}
          refreshControl={
            <RefreshControl refreshing={refreshing}
                            onRefresh={async () => await actions.linkedMedia.getLinkedMedias()}/>
          }
          renderItem={({item, index}) => !isGrid ? <VideoItem style={{shadowOffset: {x: 0, y: 10}}} key={index}>
            {item.media.type === 'IMAGE' ?
              <Logo source={{uri: item.media.source || ''}}/> :
              <TouchableOpacity onPress={() => props.navigation.navigate('VideoView', {video: item.media, isPlay: true})}>
                <Logo source={{uri: item?.media?.avatar || ''}}/>
              </TouchableOpacity>}
            <Content>
              <VType>{item?.media.type}</VType>
              <VTitle>{item?.media.name}</VTitle>
              <VName>{item?.media.user?.firstName + ' ' + item?.media.user?.lastName}</VName>
            </Content>
            {state.isSelectMode ? <VSelectBtn onPress={() => onSelect(item)} isSelected={state.selectedVideos.find(v => v.id === item.id)}>
              {state.selectedVideos.find(v => v.id === item.id) && <Image source={Images.icon_check}/>}
            </VSelectBtn> : <TouchableOpacity style={{marginTop: 8}} onPress={() => onPressMenu(item)}><Image source={Images.icon_more} style={{tintColor: 'black'}}/></TouchableOpacity>}
          </VideoItem> : <GridItem>
            <Overlay/>
            {item?.media?.type === 'IMAGE' ? <ItemVideo source={{uri: item?.media?.source}} as={Image}/>: item.isPlay ? <ItemVideo
              source={{uri: item?.media?.source}}
              onError={console.log}
              paused={!item.isPlay}
            /> : <ItemVideo source={{uri: item?.media?.avatar}} as={Image}/>}
            <GHeader>
              {state.isSelectMode ? <VSelectBtn onPress={() => onSelect(item)} isSelected={state.selectedVideos.find(v => v.id === item.id)}
                                                 style={{borderColor: 'white'}}>
                {state.isSelectMode && state.selectedVideos.find(v => v.id === item.id) && <Image source={Images.icon_check}/>}
              </VSelectBtn> : <View/>}
              <TouchableOpacity onPress={() => setChosenMedia(item.id)}>
                <Image source={Images.icon_more}/>
              </TouchableOpacity>
            </GHeader>
            {chosenMedia === item.id && <Menu>
              <CloseBtn onPress={() => setChosenMedia(null)}>
                <Image source={Images.icon_close_black}/>
              </CloseBtn>
              <Item onPress={() => props.navigation.navigate('VideoView', {video: item.media})}>
                {/*<Image source={Images.icon_calendar} style={{tintColor: 'black'}}/>*/}
                <ViewIcon width={23} height={23}/>
                <ItemText>View</ItemText>
              </Item>
              <Item onPress={() => props.navigation.navigate('Info', {video: item})}>
                <InfoIcon width={23} height={23}/>
                <ItemText>Info</ItemText>
              </Item>
              <Item onPress={() => props.navigation.navigate('ShareVideo', {video: item.media})}>
                <ShareIcon width={23} height={23}/>
                <ItemText>Share</ItemText>
              </Item>
              <Item onPress={() => props.navigation.navigate('VideoView', {video: item.media})}>
                <DownloadIcon width={23} height={23}/>
                <ItemText>Download</ItemText>
              </Item>
              <Item onPress={() => props.navigation.navigate('Archive', {video: item.media})} style={{marginBottom: 0}}>
                <ArchiveIcon width={23} height={23}/>
                <ItemText>Archive</ItemText>
              </Item>
            </Menu>}
            <View style={{width: '100%', alignItems: 'center', marginTop: 130}}>
              {!item.isPlay ? <GPlayBtn onPress={() => onPlay(item.id)}>
                <Image source={Images.icon_triangle_white}/>
              </GPlayBtn> : <GPlayBtn as={View} style={{backgroundColor: 'transparent'}}/>}
            </View>
            <View style={{paddingHorizontal: 20, marginTop: 100}}>
              <GType>{item.media?.type}</GType>
              <GTitle>{item.media?.name}</GTitle>
            </View>
            <Bottom>
              <Avatar source={{uri: item.media?.user?.avatar || ''}}/>
              <Name>{item.media?.user?.firstName + ' ' + item.media?.user?.lastName}</Name>
            </Bottom>
          </GridItem>}
        />
      </Container>
    </SafeAreaView>
  );
};

export default Videos;

const ItemVideo = styled(Video)`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 12px;
`;

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
  z-index: 51;
`;

const Name = styled(MainMediumFont)`
  line-height: 20px;
  color: white;
  margin-left: 10px;
`;

const Avatar = styled.Image`
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

const Overlay = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: black;
  border-radius: 12px;
`;

const GridItem = styled.View`
  height: 430px;
  margin-bottom: 20px;
`;

const VSelectBtn = styled.TouchableOpacity`
  width: 22px;
  height: 22px;
  border-radius: 15px;
  border-width: ${props => props.isSelected ? 0 : 1.5};
  border-color: black;
  align-items: flex-end;
  margin-top: 13px;
  ${Styles.center}
  background-color: ${props => props.isSelected ? '#6600ed' : 'white'};
`;

const VName = styled(MainMediumFont)`
  font-size: 12px;
  line-height: 18px;
  color: #4c4c4c;
  margin-top: 5px;
`;

const VTitle = styled(MainBoldFont)`
  font-size: 14px;
  line-height: 20px;
  color: black;
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

const Logo = styled.Image`
  border-radius: 12px;
  height: 100%;
  width: 65px;
`;

const VideoItem = styled.View`
  background-color: white;
  border-radius: 12px;
  shadow-color: #000000;
  elevation: 3;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  margin-bottom: 20px;
  margin-horizontal: ${Platform.OS === 'ios' ? 0 : 2};
  flex-direction: row;
  height: 120px;
`;

const VideoList = styled.FlatList`
  flex: 1;
  padding-top: 20px;
`;

const SelectText = styled(MainSemiBoldFont)`
  font-size: 14px;
  line-height: 20px;
  color: ${props => props.isEmpty ? 'gray' : '#1b2124'};
`;

const SelectBtn = styled.TouchableOpacity`
  margin-left: 27px;
`;

const Right = styled.View`
  ${Styles.center}
  flex-direction: row;
`;

const Title = styled(MainBoldFont)`
  font-size: 26px;
  line-height: 32px;
  color: #1b2124;
`;

const Header = styled.View`
  flex-direction: row;
  ${Styles.between_center};
`;

const Container = styled.View`
  flex: 1;
  background-color: #F7F7FE;
  padding-horizontal: 19px;
`;
