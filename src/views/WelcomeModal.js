import React from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainMediumFont, MainSemiBoldFont} from '@/views/Components';
import {Dimensions, Image, KeyboardAvoidingView, SafeAreaView, TouchableOpacity, View} from 'react-native';
import Video from 'react-native-video';

const WelcomeModal = props => {
  const {state, actions} = useOvermind();
  const [isPlay, setIsPlay] = React.useState(false);
  const onPressNext = async () => {
    const isAdmin = state.currentUser?.groups?.find(g => g.name === 'admin' && g.company?.id === state.currentUser?.company?.id);
    if (isAdmin) {
      props.navigation.navigate('CompanyStorylineModal');
    } else {
      props.navigation.navigate('Main');
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <KeyboardAvoidingView style={{flex: 1}} behavior={'padding'}>
        <Container>
          <Body>
            <Title>Welcome to{'\n'}WorkReels!</Title>
            <CloseBtn onPress={onPressNext}>
              <CloseText>X</CloseText>
            </CloseBtn>
          </Body>
          <Description>
            We'd love to show you around
          </Description>
          <VideoView>
            {/*{isPlay || <TouchableOpacity onPress={() => setIsPlay(true)}>*/}
              {/*<Image source={Images.icon_triangle_white}/>*/}
            {/*</TouchableOpacity>}*/}
            <Overlay/>
            <ItemVideo
              source={{uri: 'https://workreels-media.s3.us-west-2.amazonaws.com/--New+Organization+Welcomeoption+3-.mp4'}}
              onError={console.log}
              paused={!isPlay}
              repeat={true}
            />
            <View style={{width: '100%', alignItems: 'center'}}>
              {!isPlay ? <GPlayBtn onPress={() => {setIsPlay(true)}}>
                <Image source={Images.icon_triangle_white}/>
              </GPlayBtn> : <GPauseBtn onPress={() => setIsPlay(false)}/>}
            </View>
          </VideoView>
        </Container>
        <Bottom>
          <MainButton onPress={onPressNext}>
            <BtnText>Next</BtnText>
          </MainButton>
        </Bottom>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default WelcomeModal;

const VideoView = styled.View`
  background-color: black;
  border-radius: 12px;
  width: 100%;
  height: ${Dimensions.get('window').height * 0.6};
  margin-top: 30px;
  ${Styles.center}
`;

const CloseBtn = styled.TouchableOpacity`
`;

const CloseText = styled(MainSemiBoldFont)`
  font-size: 20px;
`;

const Description = styled(MainMediumFont)`
  font-size: 16px;
  line-height: 24px;
  color: black;
  margin-top: 15px;
`;
const Bottom = styled.View`
  background-color: white;
  border-top-width: 1px;
  border-top-color: #b4b4b4;
  padding-top: 16px;
  padding-horizontal: 20px;
  ${Styles.center_end}
`;

const Body = styled.View`
  width: 100%;
  flex-direction: row;
  ${Styles.between_center}
`;

const Title = styled(MainSemiBoldFont)`
  font-size: 24px;
  line-height: 29px;
  color: #14142b;
`;

const MainButton = styled.TouchableOpacity`
  background-color: #6600ED;
  border-radius: 40px;
  padding-horizontal: 25px;
  height: 40px;
  ${Styles.center}
`;

const BtnText = styled(MainBoldFont)`
  color: #f7f7f7;
  font-size: 14px;
`;

const Container = styled.ScrollView`
  flex: 1;
  background-color: white;
  padding-horizontal: 25px;
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
const GPlayBtn = styled.TouchableOpacity`
  width: 70px;
  height: 50px;
  ${Styles.center}
  background-color: #00000080;
  border-radius: 31px;
`;
const GPauseBtn = styled.TouchableOpacity`
  background-color: transparent;
  width: 100%;
  height: 100%;
`;
