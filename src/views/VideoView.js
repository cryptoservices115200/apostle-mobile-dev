import React, {useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont} from '@/views/Components';
import {Image, SafeAreaView} from 'react-native';
import Video from 'react-native-video';
import {Settings} from '../../settings';

const VideoView = props => {
  const {state, actions} = useOvermind();
  const [isPlay, setPlay] = useState(props.route?.params?.isPlay);
  const {video} = props.route.params;
  return (
      <Container>
        {isPlay ? <MainVideo
          source={{uri: video.source}}
          poster={video?.avatar || ''}
          paused={!isPlay}
          controls={true}
        /> : <MainVideo
          source={{uri: video?.avatar}}
          as={Image}
        />}
        <AppLogo source={Images.logo_circle}/>
        <CloseBtn onPress={() => props.navigation.pop()}>
          <Image source={Images.icon_close_black}/>
        </CloseBtn>
        {!isPlay && <PlayBtn onPress={() => setPlay(true)}>
          <Image source={Images.icon_triangle_white}/>
        </PlayBtn>}
        {!isPlay && <Title>{video.name}</Title>}
        {/*{isPlay && <Row>*/}
        {/*  <Image source={Images.touch_bar}/>*/}
        {/*  <TouchableOpacity><Image source={Images.icon_share}/></TouchableOpacity>*/}
        {/*  <TouchableOpacity><Image source={Images.icon_maximise}/></TouchableOpacity>*/}
        {/*</Row>}*/}
      </Container>
  );
};

export default VideoView;

const MainVideo = styled(Video)`
  width: 100%;
  height: 100%;
  position: absolute;
  ${Styles.absolute_full}
`

const Row = styled.View`
  flex-direction: row;
  ${Styles.between_center};
  width: 100%;
  padding-horizontal: 10px;
  position: absolute;
  bottom: 35px;
`

const AppLogo = styled.Image`
  position: absolute;
  top: 40px;
  left: 20px;
`

const PlayBtn = styled.TouchableOpacity`
  width: 70px;
  height: 50px;
  border-radius: 20px;
  ${Styles.center}
  background: #00000080;
`

const CloseBtn = styled.TouchableOpacity`
  position: absolute;
  right: 20px;
  top: 40px;
  width: 36px;
  height: 36px;
  border-radius: 20px;
  background-color: white;
  ${Styles.center}
`;
const Title = styled(MainBoldFont)`
  font-size: 26px;
  line-height: 32px;
  color: white;
  position: absolute;
  bottom: 50px;
  left: 30px;
`;

const Container = styled.View`
  flex: 1;
  background-color: black;
  ${Styles.center}
`;
