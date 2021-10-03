import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import styled from 'styled-components';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import { Platform } from 'react-native';

import SplashScreen from 'react-native-splash-screen';
import { enableScreens } from 'react-native-screens';
// import SignIn from '@/views/SignIn';
// import ForgotPassword from '@/views/ForgotPassword';
import Splash from '@/views/Splash';
// import ResetPassword from '@/views/ResetPassword';
// import CheckInbox from '@/views/CheckInbox';
// import RegisterUser from '@/views/RegisterUser';
// import RegisterCompany from '@/views/RegisterCompany';
// import RegisterCompanyFreePlan from '@/views/RegisterCompanyFreePlan';
// import CompanyStorylineModal from '@/views/CompanyStorylineModal';
// import WelcomeModal from '@/views/WelcomeModal';
// import { TabBar, tabBarOptions } from '@/views/Components/TabBar';
// import Home from '@/views/Home';
// import Videos from '@/views/Videos';
// import Camera from '@/views/Camera';
// import Storylines from '@/views/Storylines';
// import Profile from '@/views/Profile';
// import RegisterProfile from '@/views/RegisterProfile';
// import StorylineDetail from '@/views/StorylineDetail';
// import Menu from '@/views/Menu';
// import Activity from '@/views/Activity';
// import Company from '@/views/Company';
// import Upgrade from '@/views/Upgrade';
// import CreateStoryline from '@/views/CreateStoryline';
// import SelectTemplate from '@/views/SelectTemplate';
// import AddDeliverable from '@/views/AddDeliverable';
// import AddScene from '@/views/AddScene';
// import InviteTeammates from '@/views/InviteTeammates';
// import AdditionalDetail from '@/views/AdditionalDetail';
// import CompanyGroupDetail from '@/views/CompanyGroupDetail';
// import Uploading from '@/views/Uploading';
// import ShareVideo from '@/views/ShareVideo';
// import VideoView from '@/views/VideoView';
// import Archive from '@/views/Archive';
// import Info from '@/views/Info';
// import SelectTag from '@/views/SelectTag';
// import SelectPeople from '@/views/SelectPeople';
// import SelectStoryline from '@/views/SelectStoryline';
// import AddScene1 from '@/views/AddScene1';
// import InvitePeople from '@/views/InvitePeople';
// import Avatar from '@/views/Avatar';
// import SelectGroup from '@/views/SelectGroup';
// import AddGroup from '@/views/AddGroup';
// import AddMedia from '@/views/AddMedia';
// import DeliverableList from '@/views/DeliverableList';
// import GetHelp from '@/views/GetHelp';
// import AddPaymentMethod from '@/views/AddPaymentMethod';
// import SceneDetail from '@/views/SceneDetail';
// import SelectScenes from '@/views/SelectScenes';
// import MyMedia from '@/views/MyMedia';
// import Help from '@/views/Help';
import Test from '@/views/TaskScheduler'
import DraggableList from '@/views/DraggableList';

const Stack = createStackNavigator();

enableScreens();
export const iosModalOptions = ({ route, navigation }) => ({
  ...TransitionPresets.ModalPresentationIOS,
  cardOverlayEnabled: true,
  gestureEnabled: true,
  headerShown: false,
  headerStatusBarHeight: navigation.dangerouslyGetState().routes.indexOf(route) > 0 ? 0 : undefined,
});

const Tab = createBottomTabNavigator();
const Router = () => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    SplashScreen.hide();
    setInitialized(true);

    StatusBar.setBarStyle("dark-content");
    if (Platform.OS === 'android') StatusBar.setBackgroundColor("#FFEC00");
    StatusBar.setHidden(true);
  }, []);

  if (!initialized) return null;
  return (
    <KeyboardAvoidingView enabled={Platform.OS === 'ios'} behavior="padding" style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar backgroundColor="#FFEC00" />
        <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="TaskScheduler" component={Test} />
          <Stack.Screen name="DraggableList" component={DraggableList}/>

          {/*<Stack.Screen name="SceneDetail" component={SceneDetail} />*/}
          {/*<Stack.Screen name="MyMedia" component={MyMedia} />*/}
          {/*<Stack.Screen name="SignIn" component={SignIn} />*/}
          {/*<Stack.Screen name="RegisterProfile" component={RegisterProfile} />*/}
          {/*<Stack.Screen name="WelcomeModal" component={WelcomeModal} />*/}
          {/*<Stack.Screen name="RegisterCompanyFreePlan" component={RegisterCompanyFreePlan} />*/}
          {/*<Stack.Screen name="RegisterCompany" component={RegisterCompany} />*/}
          {/*<Stack.Screen name="RegisterUser" component={RegisterUser} />*/}
          {/*<Stack.Screen name="CheckInbox" component={CheckInbox} />*/}
          {/*<Stack.Screen name="ResetPassword" component={ResetPassword} />*/}
          {/*<Stack.Screen name="ForgotPassword" component={ForgotPassword} />*/}
          {/*<Stack.Screen name="Camera" component={Camera} />*/}
          {/*<Stack.Screen name="Upgrade" component={Upgrade} />*/}
          {/*<Stack.Screen name="Help" component={Help} />*/}
          {/*<Stack.Screen name="AdditionalDetail" component={AdditionalDetail} />*/}
          {/*<Stack.Screen name="InviteTeammates" component={InviteTeammates} />*/}
          {/*<Stack.Screen name="CompanyStorylineModal" component={CompanyStorylineModal} />*/}
          {/*<Stack.Screen name="AddMedia" component={AddMedia} />*/}
          {/*<Stack.Screen name="DeliverableList" component={DeliverableList} />*/}
          {/*<Stack.Screen name="AddGroup" component={AddGroup} />*/}
          {/*<Stack.Screen name="SelectGroup" component={SelectGroup} />*/}
          {/*<Stack.Screen name="AddScene" component={AddScene} />*/}
          {/*<Stack.Screen name="AddScene1" component={AddScene1} />*/}
          {/*<Stack.Screen name="AddDeliverable" component={AddDeliverable} />*/}
          {/*<Stack.Screen name="SelectTemplate" component={SelectTemplate} />*/}
          {/*<Stack.Screen name="CreateStoryline" component={CreateStoryline} />*/}
          {/*<Stack.Screen name="Company" component={Company} />*/}
          {/*<Stack.Screen name="Activity" component={Activity} />*/}
          {/*<Stack.Screen name="Profile" component={Profile} />*/}
          {/*<Stack.Screen name="SelectStoryline" component={SelectStoryline} />*/}
          {/*<Stack.Screen name="SelectPeople" component={SelectPeople} />*/}
          {/*<Stack.Screen name="SelectTag" component={SelectTag} />*/}
          {/*<Stack.Screen name="SelectScenes" component={SelectScenes} />*/}
          {/*<Stack.Screen name="Info" component={Info} />*/}
          {/*<Stack.Screen name="VideoView" component={VideoView} />*/}
          {/*<Stack.Screen name="Archive" component={Archive} />*/}
          {/*<Stack.Screen name="ShareVideo" component={ShareVideo} />*/}
          {/*<Stack.Screen name="Uploading" component={Uploading} />*/}
          {/*<Stack.Screen name="CompanyGroupDetail" component={CompanyGroupDetail} />*/}
          {/*<Stack.Screen name="Avatar" component={Avatar} />*/}
          {/*<Stack.Screen name="InvitePeople" component={InvitePeople} />*/}
          {/*<Stack.Screen name="GetHelp" component={GetHelp} />*/}
          {/*<Stack.Screen name="AddPaymentMethod" component={AddPaymentMethod} />*/}
          {/*<Stack.Screen name="Main" options={{ headerShown: false }}>*/}
            {/*{() => <TabNavigatorContainer>*/}
              {/*<Tab.Navigator*/}
                {/*tabBar={props => <TabBar {...props} />}*/}
              {/*>*/}
                {/*<Tab.Screen name="Home" component={Home} />*/}
                {/*<Tab.Screen name="Videos" component={Videos} />*/}
                {/*<Tab.Screen name="Storylines">*/}
                  {/*{() =>*/}
                    {/*<Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>*/}
                      {/*<Stack.Screen name="Storylines" component={Storylines} />*/}
                      {/*<Stack.Screen name="StorylineDetail" component={StorylineDetail} />*/}
                    {/*</Stack.Navigator>}*/}
                {/*</Tab.Screen>*/}
                {/*/!*<Tab.Screen name="Menu" component={Menu}/>*!/*/}
              {/*</Tab.Navigator>*/}
            {/*</TabNavigatorContainer>}*/}
          {/*</Stack.Screen>*/}
        </Stack.Navigator>
      </NavigationContainer>
    </KeyboardAvoidingView>
  )
};

export default Router;

const TabNavigatorContainer = styled.View`
  flex: 1;
`
