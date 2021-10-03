import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import {Images, Styles} from '@/styles';
import {useOvermind} from '@/store';
import {Image, View} from 'react-native';
import {MainMediumFont, MainSemiBoldFont} from '@/views/Components';
import ActivityIcon from '@/assets/ikonate_icons/activity.svg';
import ProfileIcon from '@/assets/ikonate_icons/user.svg';
import CompanyIcon from '@/assets/ikonate_icons/suitcase-alt.svg';
import MediaIcon from '@/assets/ikonate_icons/film_black.svg';
import HelpIcon from '@/assets/ikonate_icons/help.svg';
import SignoutIcon from '@/assets/ikonate_icons/entrance.svg';

const Menu = props => {
  const {state, actions} = useOvermind();
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
    <Container>
      <Body>
        {menus.map(m => {
          if (m.name === 'Company' && !isAdmin) {
            return null;
          }
          let Component = components[m.icon];
          return <MenuView onPress={() => onPressBtn(m.name)} key={m.name}>
            <View style={{width: 40}}>
              {/*<Image source={Images[m.icon]} style={{tintColor: 'black'}}/>*/}
              <Component width={23} height={23}/>
            </View>
            <MText>{m.name}</MText>
          </MenuView>;
        })}
      </Body>
    </Container>
  );
};

export default Menu;

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
  margin-top: 70px;
`;

const Container = styled.View`
  flex: 1;
  background-color: white;
  padding-horizontal: 25px;
`;
