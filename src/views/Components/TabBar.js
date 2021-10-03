import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import styled from 'styled-components';
import {Colors, Dimension, Images, Styles} from '@/styles';
import {useOvermind} from '@/store';
import {MainMediumFont, MainRegularFont, MainSemiBoldFont} from '@/views/Components/controls/Text';
import {Dimensions, Image, Platform, SafeAreaView, View} from 'react-native';
import Camera from '@/views/Camera';
import Person from '@/assets/ikonate_icons/person.svg';
import CopyIcon from '@/assets/ikonate_icons/checkbox.svg';
import PasteIcon from '@/assets/ikonate_icons/cards.svg';
import AddPersonIcon from '@/assets/ikonate_icons/person-add.svg';
import DownloadIcon from '@/assets/ikonate_icons/download.svg';
import ArchiveIcon from '@/assets/ikonate_icons/archive.svg';
import ActivityIcon from '@/assets/ikonate_icons/activity.svg';
import ProfileIcon from '@/assets/ikonate_icons/user.svg';
import CompanyIcon from '@/assets/ikonate_icons/suitcase-alt.svg';
import MediaIcon from '@/assets/ikonate_icons/film_black.svg';
import HelpIcon from '@/assets/ikonate_icons/help.svg';
import SignoutIcon from '@/assets/ikonate_icons/entrance.svg';

export const TabBar = (props) => {
  const navigation = props.navigation;
  const {state, actions} = useOvermind();
  const [isOpenModal, setOpenModal] = useState(false);
  const isAdmin = state.currentUser?.groups?.find(g => g.name === 'admin' && g.company?.id === state.currentUser?.company?.id);

  const menus = [
    {name: 'Activity', icon: 'icon_activity'},
    {name: 'Profile', icon: 'icon_profile'},
    {name: 'Company', icon: 'icon_company'},
    {name: 'My Media', icon: 'icon_film'},
    {name: 'Help', icon: 'icon_help'},
    {name: 'Sign Out', icon: 'icon_signout'},
  ];

  const components = {
    icon_activity: ActivityIcon,
    icon_profile: ProfileIcon,
    icon_company: CompanyIcon,
    icon_film: MediaIcon,
    icon_help: HelpIcon,
    icon_signout: SignoutIcon
  }

  const onPressBtn = async (name) => {
    setOpenModal(false)
    if (name === 'Profile' || name === 'Company' || name === 'Activity' || name === 'Help') {
      props.navigation.navigate(name);
    }
    if (name === 'My Media') {
      props.navigation.navigate('MyMedia');
    }
    if (name === 'Sign Out') {
      await actions.logout();
      props.navigation.navigate('Splash');
    }
  };
  return (
    <SafeAreaView style={{backgroundColor: 'white'}}>
      {state.isSelectMode ? <SelectTab>
        <CountView>
          <CountText>{state.selectedVideos.length}</CountText>
        </CountView>
        <SelectText>Selected</SelectText>
        <TouchableOpacity style={{marginLeft: 30}}>
          <CopyIcon width={23} height={23}/>
        </TouchableOpacity>
        <TouchableOpacity style={{marginLeft: 24}}>
          <PasteIcon width={23} height={23}/>
        </TouchableOpacity>
        <TouchableOpacity style={{marginLeft: 24}}>
          <AddPersonIcon width={23} height={23}/>
        </TouchableOpacity>
        <TouchableOpacity style={{marginLeft: 24}}>
          <DownloadIcon width={23} height={23}/>
        </TouchableOpacity>
        <TouchableOpacity style={{marginLeft: 24}}>
          <ArchiveIcon width={23} height={23}/>
        </TouchableOpacity>
      </SelectTab> : <View>
        {isOpenModal && <Container onPress={() => setOpenModal(false)} activeOpacity={1}>
          <MView>
            <Body>
              {menus.map(m => {
                if (m.name === 'Company' && !isAdmin) {
                  return null;
                }
                let Component = components[m.icon];
                return <MenuView onPress={() => onPressBtn(m.name)} key={m.name}>
                  <View style={{width: 40}}>
                    <Component width={23} height={23}/>
                  </View>
                  <MText>{m.name}</MText>
                </MenuView>;
              })}
            </Body>
          </MView>
        </Container>}
        <TabBarContainer>
          <TabBtn onPress={() => navigation.navigate('Home')}>
            <TabIcon source={Images.icon_home} isSelected={props.state.index === 0}/>
            <TabText isSelected={props.state.index === 0}>Home</TabText>
          </TabBtn>
          <TabBtn onPress={() => navigation.navigate('Videos')}>
            <TabIcon source={Images.icon_film} isSelected={props.state.index === 1}/>
            <TabText isSelected={props.state.index === 1}>Videos</TabText>
          </TabBtn>
          <TabBtn onPress={() => props.navigation.navigate('Camera')}>
            <TabCircleBtn>
              <Image source={Images.icon_camera}/>
            </TabCircleBtn>
          </TabBtn>
          <TabBtn onPress={() => navigation.navigate('Storylines')}>
            <TabIcon source={Images.icon_book} isSelected={props.state.index === 2}/>
            <TabText isSelected={props.state.index === 2}>Storylines</TabText>
          </TabBtn>
          <TabBtn onPress={() => setOpenModal(!isOpenModal)}>
            <TabCircleBtn style={{width: 36, height: 36, backgroundColor: '#d8d8d8'}}>
              {state.currentUser?.avatar ? <Image source={{uri: state.currentUser?.avatar || ''}} style={{width: 36, height: 36, borderRadius: 20}}/> : <Person width={25} height={25}/>}
            </TabCircleBtn>
          </TabBtn>
        </TabBarContainer>
      </View>}
    </SafeAreaView>
  );
};
const MText = styled(MainMediumFont)`
  font-size: 12px;
  line-height: 24px;
  color: #0f0f0f;
`;

const MenuView = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-bottom: 30px;
`;

const Body = styled.View`
  margin-top: 20px;
  padding-horizontal: 20px;
  padding-bottom: 60px;
`;
const MView = styled.View`
  background-color: white;
  width: 100%;
`

const Container = styled.TouchableOpacity`
  background-color: #00000080;
  width: 100%;
  position: absolute;
  height: ${Dimensions.get('window').height};
  bottom: 0;
  justify-content: flex-end;
  align-items: flex-end;
`

const SelectText = styled(MainSemiBoldFont)`
  font-size: 16px;
  line-height: 24px;
  margin-left: 12px;
`;

const CountView = styled.View`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  ${Styles.center}
  background-color: #6600ED;
`;

const CountText = styled(MainSemiBoldFont)`
  font-size: 12px;
  line-height: 14px;
  color: white;
`;

const SelectTab = styled.View`
  height: 70px;
  flex-direction: row;
  width: 100%;
  ${Styles.center}
  background-color: white;
`;


/*
*
*/
export const tabBarOptions = {
  showLabel: false,
  tabStyle: {backgroundColor: Colors.tabBarColor},
  swipeEnabled: false,
};

const TabCircleBtn = styled.View`
  background-color: #6600ed;
  width: 52px;
  height: 52px;
  border-radius: 30px;
  ${Styles.center}
`;

const TabBtn = styled.TouchableOpacity`
  align-items: center;
  min-width: 18%
`;

const TabText = styled(MainSemiBoldFont)`
  font-size: 12px;
  line-height: 14px;
  color: ${props => props.isSelected ? '#6600ED' : '#B4B4B4'}
`;

const TabBarContainer = styled.View`
  flex-direction: row;
  ${Styles.between_center};
  padding-horizontal: 5%;
  padding-top: 7px;
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: white;
  border-top-width: 1px;
  border-top-color: #B4B4B4;
`;

const TabIcon = styled.Image`
  tint-color: ${props => props.isSelected ? '#6600ED' : '#B4B4B4'}
`;

