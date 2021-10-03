import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainMediumFont, MainSemiBoldFont} from '@/views/Components';
import {Image, SafeAreaView, View} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {useActionSheet} from '@expo/react-native-action-sheet';

const Avatar = props => {
  const {state, actions} = useOvermind();
  const {showActionSheetWithOptions} = useActionSheet();

  const [avatar, setAvatar] = useState(state.currentUser?.avatar);
  const [avatarLocal, setAvatarLocal] = useState(null);

  const onPressAvatar = () => {
    const options = ['Take New Photo', 'Photo Library', 'Cancel'];
    const cancelButtonIndex = 2;
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async buttonIndex => {
        const options = {
          width: 800,
          height: 800,
          cropping: true,
          mediaType: 'photo',
          includeBase64: true,
        };

        try {
          let picked = null;
          if (buttonIndex === 1) {
            picked = await ImagePicker.openPicker(options);
          } else if (buttonIndex === 0) {
            picked = await ImagePicker.openCamera(options);
          }
          if (picked) {
            setAvatar(picked.data);
            setAvatarLocal(picked.path);
            await actions.user.updateUserProfile({
              avatar: picked.data,
            });
          }
        } catch (e) {
          console.log('UserSetting::_onPressAvatar failed: ', e);
        }
      },
    );

  };

  const isAvatar = avatar && (avatar.split(':')[0] === 'http' || avatar.split(':')[0] === 'https');

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Container>
        <View style={{flex: 1}}>
          <CloseBtn onPress={() => props.navigation.pop()}>
            <Image source={Images.icon_close_black}/>
          </CloseBtn>
          <Title>Add or edit your headshot</Title>
          <Desc>Pick your favorite photo to be your headshot</Desc>
          <AvatarView>
            {avatar && <AvatarLogo source={{uri: isAvatar ? avatar : avatarLocal || ''}}/>}
          </AvatarView>
        </View>

        <Bottom>
          <Button onPress={onPressAvatar}>
            <AddText style={{color: 'white'}}>Upload New Image</AddText>
          </Button>
        </Bottom>
      </Container>
    </SafeAreaView>
  );
};

export default Avatar;

const AvatarLogo = styled.Image`
  width: 300px;
  height: 300px;
`;

const AvatarView = styled.View`
  width: 100%;
  ${Styles.center}
  margin-top: 100px;
`;

const CloseBtn = styled.TouchableOpacity`
  position: absolute;
  right: 0px;
  top: 0px;
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
  margin-top: 12px;
`;

const Button = styled.TouchableOpacity`
  height: 50px;
  ${Styles.center}
  background-color: #6600ed;
  border-radius: 40px;
  padding-horizontal: 20px;
`;

const Bottom = styled.View`
  ${Styles.end_center}
  flex-direction: row;
`;

const Title = styled(MainBoldFont)`
  font-size: 26px;
  line-height: 32px;
  margin-top: 40px;
`;

const Container = styled.View`
  flex: 1;
  background-color: white;
  padding-horizontal: 25px;
`;
