import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainMediumFont, MainRegularFont, MainSemiBoldFont} from '@/views/Components';
import {Image, SafeAreaView, TouchableOpacity, View} from 'react-native';
import {json} from 'overmind';
import ControlAlt from '@/assets/ikonate_icons/controls-alt.svg';
import ArrowLeft from '@/assets/ikonate_icons/arrow-left.svg';

const Activity = props => {
  const {state, actions} = useOvermind();

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    await actions.notification.getNotifications();
    console.log(state.notification.notifications, 'notifications');
    setNotifications(json(state.notification.notifications));
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#F7F7FE'}}>
      <Container>
        <TouchableOpacity onPress={() => props.navigation.pop()}>
          <ArrowLeft width={25} height={25}/>
        </TouchableOpacity>
        <Header>
          <Title>Activity</Title>
          <TouchableOpacity>
            <ControlAlt width={25} height={25}/>
          </TouchableOpacity>
        </Header>
        <Body contentContainerStyle={{
          shadowColor: 'black',
          shadowOpacity: 0.1,
          shadowRadius: 3,
          shadowOffset: {x: 0, y: 10},
          paddingBottom: 100,
        }}>
          <Row>
            <Logo source={Images.user1}/>
            <View style={{width: '85%'}}>
              <Cal>Jan 5</Cal>
              <Message>
                <MainBoldFont>Chrissie Jonston</MainBoldFont> just accepted the invitation to <MainSemiBoldFont
                style={{color: '#6600ed'}}>True Timber</MainSemiBoldFont>
              </Message>
            </View>
          </Row>
          <Row>
            <Logo source={Images.user1}/>
            <View style={{width: '85%'}}>
              <Cal>Jan 5</Cal>
              <Message>
                <MainBoldFont>Chrissie Jonston</MainBoldFont> added to the group <MainSemiBoldFont
                style={{color: '#6600ed'}}>Richmond Office</MainSemiBoldFont>
              </Message>
            </View>
          </Row>
          <Row>
            <Logo source={Images.user1}/>
            <View style={{width: '85%'}}>
              <Cal>Jan 5</Cal>
              <Message>
                You just uploaded a video
              </Message>
              <Thumbnail source={Images.user1}/>
            </View>
          </Row>
          <Row>
            <LogoView>
              <Image source={Images.icon_up} style={{width: 25, height: 25}}/>
            </LogoView>
            <View style={{width: '85%'}}>
              <Cal>Jan 5</Cal>
              <Message>
                <MainBoldFont>Chrissie Jonston's</MainBoldFont> video was just approved
              </Message>
              <Thumbnail source={Images.user1}/>
            </View>
          </Row>
          <Row>
            <Logo source={Images.user1}/>
            <View style={{width: '85%'}}>
              <Cal>Jan 5</Cal>
              <Message>
                You just uploaded a video
              </Message>
              <Thumbnail source={Images.user1}/>
            </View>
          </Row>
          <Row>
            <Logo source={Images.user1}/>
            <View style={{width: '85%'}}>
              <Cal>Jan 5</Cal>
              <Message>
                You just uploaded a video
              </Message>
              <Thumbnail source={Images.user1}/>
            </View>
          </Row>
          <Row>
            <Logo source={Images.user1}/>
            <View style={{width: '85%'}}>
              <Cal>Jan 5</Cal>
              <Message>
                You just uploaded a video
              </Message>
              <Thumbnail source={Images.user1}/>
            </View>
          </Row>
          <Row>
            <Logo source={Images.user1}/>
            <View style={{width: '85%'}}>
              <Cal>Jan 5</Cal>
              <Message>
                You just uploaded a video
              </Message>
              <Thumbnail source={Images.user1}/>
            </View>
          </Row>
        </Body>
      </Container>
    </SafeAreaView>
  );
};

export default Activity;

const LogoView = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 20px;
  border-width: 1px;
  border-color: #00DBBA;
  ${Styles.center}
  margin-right: 12px;
`;

const Thumbnail = styled.Image`
  width: 100%;
  height: 122px;
  border-radius: 8px;
  margin-top: 10px;
`;
const Message = styled(MainMediumFont)`
  font-size: 12px;
  line-height: 18px;
  margin-top: 4px;
`;

const Cal = styled(MainRegularFont)`
  font-size: 12px;
  line-height: 18px;
  color: #4c4c4c;
`;

const Row = styled.View`
  flex-direction: row;
  margin-top: 20px;
`;

const Logo = styled.Image`
  width: 36px;
  height: 36px;
  border-radius: 30px;
  margin-right: 12px;
`;

const Body = styled.ScrollView`
  flex: 1;
  background-color: white;
  border-radius: 12px;
  elevation: 3;
  margin-bottom: 20px;
  min-height: 120px;
  padding: 20px;
  margin-top: 18px;
`;

const Title = styled(MainBoldFont)`
  font-size: 26px;
  line-height: 32px;
  color: #1b2124;
`;

const Header = styled.View`
  ${Styles.between_center}
  flex-direction: row;
  margin-top: 10px;
`;

const Container = styled.View`
  flex: 1;
  background-color: #f7f7f7;
  padding-horizontal: 20px;
`;
