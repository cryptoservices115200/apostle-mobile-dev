import React from 'react';
import styled from 'styled-components';
import { Images, Styles } from '@/styles';
import { MainMediumFont, MainSemiBoldFont } from '@/views/Components/controls/Text';
import { Image, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';

export const SceneItem = ({
  title,
  data,
  selectedMode,
  isSelected,
  setSelected,
  onPress,
  chosenScene,
  setChosenScene,
  hideMore,
  ...props
}) => {
  return (
    <Container style={{ shadowOffset: { x: 0, y: 10 } }}>
      <SubContainer onPress={onPress}>
        <Header>
          <Badge>
            <BText>{data?.type?.name}</BText>
          </Badge>
          <Right>
            <Image source={Images.icon_film} style={{ tintColor: 'black' }} />
            <RText>{data.quantity}</RText>
            {!hideMore && <TouchableOpacity style={{ marginLeft: 27 }} onPress={() => setChosenScene(data.id)}>
              <Image source={Images.icon_more} style={{ tintColor: 'black' }} />
            </TouchableOpacity>}
            {selectedMode && <SelectBtn isSelected={isSelected} onPress={() => setSelected(data)}>
              {isSelected ? <Image source={Images.icon_check} style={{ tintColor: 'white' }} /> : null}
            </SelectBtn>}

          </Right>
        </Header>
        <Title>{data && data.name}</Title>
        <VideoList>
          {data.linkedMedias?.map((media, index) => media?.media?.source ? (<Block
            source={{ uri: media?.media?.type === 'IMAGE' ? media?.media?.source : media?.media?.avatar }}
            as={Image}
            paused={true}
            onError={console.log}
            key={index}
          />) : null)}
        </VideoList>
        {data.isRequired === true && <RedDot />}
      </SubContainer>
      {chosenScene === data.id && <Menu>
        <CloseBtn onPress={() => setChosenScene(null)}>
          <Image source={Images.icon_close_black} />
        </CloseBtn>
        <Item>
          <Image source={Images.icon_calendar} style={{ tintColor: 'black' }} />
          <ItemText>View Details</ItemText>
        </Item>
        <Item>
          <Image source={Images.icon_calendar} style={{ tintColor: 'black' }} />
          <ItemText>View Media</ItemText>
        </Item>
        <Item>
          <Image source={Images.icon_calendar} style={{ tintColor: 'black' }} />
          <ItemText>Share Scene</ItemText>
        </Item>
        <Item>
          <Image source={Images.icon_calendar} style={{ tintColor: 'black' }} />
          <ItemText>Edit</ItemText>
        </Item>
        <Item>
          <Image source={Images.icon_calendar} style={{ tintColor: 'black' }} />
          <ItemText>Duplicate</ItemText>
        </Item>
        <Item style={{ marginBottom: 50 }}>
          <Image source={Images.icon_calendar} style={{ tintColor: 'black' }} />
          <ItemText>Archive</ItemText>
        </Item>
      </Menu>}
    </Container>
  );
};

const SelectBtn = styled.TouchableOpacity`
  width: 24px;
  height: 24px;
  border-radius: 20px;
  border: 1.5px solid white;
  z-index: 10;
  ${Styles.center}
  margin-left: 20px;
  border-color: ${props => props.isSelected ? '#6600ed' : 'black'};
  background-color: ${props => props.isSelected ? '#6600ed' : 'transparent'};
`;

const Block = styled(Video)`
  width: 90px;
  height: 90px;
  border-radius: 8px;
  background-color: #f7f7f7;
  ${Styles.center}
  margin-right: 15px;
`;

const VideoList = styled.View`
  flex-direction: row;
  margin-top: 10px;
`;

const Title = styled(MainSemiBoldFont)`
  font-size: 24px;
  line-height: 29px;
  color: black;
  margin-top: 15px;
`;

const RText = styled(MainSemiBoldFont)`
  font-size: 12px;
  line-height: 18px;
  color: #0f0f0f;
  margin-left: 10px;
`;

const Right = styled.View`
  flex-direction: row;
  ${Styles.center}
`;

const Badge = styled.View`
  padding-horizontal: 7px;
  padding-vertical: 1px;
  border-width: 1px;
  border-color: #d2d0d0;
  border-radius: 10px;
`;

const BText = styled(MainMediumFont)`
  font-size: 12px;
  line-height: 18px;
  color: #0f0f0f;
`;

const Header = styled.View`
  flex-direction: row;
  ${Styles.between_center};
  width: 100%;
`;

const SubContainer = styled.TouchableOpacity`
  background-color: white;
  border-radius: 12px;
  shadow-color: #000000;
  elevation: 3;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  margin-bottom: 20px;
  min-height: 120px;
  padding: 15px;
`;

const CloseBtn = styled.TouchableOpacity`
  position: absolute;
  right: -10px;
  top: -10px;
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

const Menu = styled.ScrollView`
  width: 280px;
  padding: 20px;
  border: 1px solid #d8d8d8;
  background-color: white;
  position: absolute;
  right: 10px;
  top: 10px;
  height: 200px;
  z-index: 100;
  padding-bottom: 100px;
`;

const Container = styled.View`

`;

const RedDot = styled.View`
  width: 9px;
  height: 9px;
  border-radius: 4.5px;
  background-color: #F12B2B;
  position: absolute;
  top: 0;
  right: 0;
`