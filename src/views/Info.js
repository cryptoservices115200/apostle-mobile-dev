import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainMediumFont, MainSemiBoldFont} from '@/views/Components';
import {Image, SafeAreaView, ScrollView, TouchableOpacity} from 'react-native';
import moment from 'moment';

const Info = props => {
  const {state, actions} = useOvermind();

  const [linkedMedia, setLinkedMedia] = useState(props.route.params?.video);
  const video = linkedMedia?.media;

  useEffect(() => {
    setLinkedMedia(state.linkedMedia.linkedMedias?.find(m => m.id === props.route.params.video?.id));
  }, [state.linkedMedia.linkedMedias]);

  const onRemovePeople = async (userId) => {
    actions.hud.show();
    try {
      await actions.linkedMedia.saveLinkedMedia({
        where: {id: linkedMedia.id},
        data: {
          taggedUsers: {
            disconnect: [{
              id: userId,
            }],
          },
        },
      });
      await actions.linkedMedia.getLinkedMedias();
      actions.alert.showSuccess({message: 'Removed successfully!'});
    } catch (e) {
      console.log(e);
    } finally {
      actions.hud.hide();
    }
  };

  const onRemoveTag = async (tagId) => {
    actions.hud.show();
    try {
      await actions.linkedMedia.saveLinkedMedia({
        where: {id: linkedMedia.id},
        data: {
          tags: {
            disconnect: [{
              id: tagId,
            }],
          },
        },
      });
      await actions.linkedMedia.getLinkedMedias();
      actions.alert.showSuccess({message: 'Removed successfully!'});
    } catch (e) {
      console.log(e);
    } finally {
      actions.hud.hide();
    }
  };

  const onRemoveStoryline = async () => {
    actions.hud.show();
    try {
      await actions.linkedMedia.saveLinkedMedia({
        where: {id: linkedMedia.id},
        data: {
          storyline: {
            disconnect: true,
          },
        },
      });
      await actions.linkedMedia.getLinkedMedias();
      actions.alert.showSuccess({message: 'Removed successfully!'});
    } catch (e) {
      console.log(e);
    } finally {
      actions.hud.hide();
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Container>
        <ScrollView style={{flex: 1}}>
          <CloseBtn onPress={() => props.navigation.pop()}>
            <Image source={Images.icon_close_black}/>
          </CloseBtn>
          <Title>Info</Title>
          <Form>
            <FormText>Format</FormText>
            <FormTitle>{video?.name}</FormTitle>
          </Form>
          <Form>
            <FormText>Date</FormText>
            <FormTitle>{moment(video?.createdAt).format('M/D/YY')}</FormTitle>
          </Form>
          <Form>
            <FormText>By</FormText>
            <FormTitle>{video?.user?.firstName + ' ' + video?.user?.lastName}</FormTitle>
          </Form>
          <Row>
            <RowText>Tagged People</RowText>
            <TouchableOpacity onPress={() => props.navigation.navigate('SelectPeople', {mediaId: linkedMedia?.id})}>
              <RowText style={{color: '#6600ED'}}>Add People</RowText>
            </TouchableOpacity>
          </Row>
          <List
            data={linkedMedia?.taggedUsers}
            renderItem={({item, index}) => <Item key={index}>
              <Left>
                <Logo source={{uri: item.avatar || ''}}/>
                <ItemText>{item?.firstName || ''} {item?.lastName || ''}</ItemText>
              </Left>
              <TouchableOpacity onPress={() => onRemovePeople(item?.id)}>
                <Image source={Images.icon_remove}/>
              </TouchableOpacity>
            </Item>}
          />
          <Row>
            <RowText>Tags</RowText>
            <TouchableOpacity onPress={() => props.navigation.navigate('SelectTag', {mediaId: linkedMedia?.id})}>
              <RowText style={{color: '#6600ED'}}>Add Tags</RowText>
            </TouchableOpacity>
          </Row>
          <TagView>
            {linkedMedia?.tags?.map((t, i) => <TagItem key={i}>
              <TagText>{t?.name}</TagText>
              <TouchableOpacity onPress={() => onRemoveTag(t.id)}>
                <Image source={Images.icon_close_black}
                       style={{tintColor: '#B4B4B4'}}/></TouchableOpacity>
            </TagItem>)}
          </TagView>
          <Row>
            <RowText>Storylines</RowText>
            <TouchableOpacity onPress={() => props.navigation.navigate('SelectStoryline', {mediaId: linkedMedia?.id})}>
              <RowText style={{color: '#6600ED'}}>Add Storylines</RowText>
            </TouchableOpacity>
          </Row>
          {/*<List*/}
          {/*  data={state.storyline.storylines?.filter(s => s.media.find(m => m.id === video.id))}*/}
          {/*  renderItem={({item, index}) => <Item key={index}>*/}
          {/*    <Left>*/}
          {/*      <Image source={Images.icon_book} style={{tintColor: 'black'}}/>*/}
          {/*      <ItemText>{item.name}</ItemText>*/}
          {/*    </Left>*/}
          {/*    <TouchableOpacity onPress={() => onRemoveStoryline(item.id)}>*/}
          {/*      <Image source={Images.icon_remove}/>*/}
          {/*    </TouchableOpacity>*/}
          {/*  </Item>}*/}
          {/*/>*/}
          {linkedMedia?.storyline && <Item>
            <Left>
              <Image source={Images.icon_book} style={{tintColor: 'black'}}/>
              <ItemText>{linkedMedia?.storyline?.name}</ItemText>
            </Left>
            <TouchableOpacity onPress={() => onRemoveStoryline(linkedMedia?.storyline?.id)}>
              <Image source={Images.icon_remove}/>
            </TouchableOpacity>
          </Item>}
          <Form>
            <FormText>Type</FormText>
            <FormTitle>{linkedMedia?.type}</FormTitle>
          </Form>
          <Form>
            <FormText>Approval</FormText>
            <FormTitle>{linkedMedia?.approval}</FormTitle>
          </Form>
          <Form>
            <FormText>Visibility</FormText>
            <FormTitle>{linkedMedia?.visibility}</FormTitle>
          </Form>
        </ScrollView>
      </Container>
    </SafeAreaView>
  );
};

export default Info;

const TagText = styled(MainMediumFont)`
  line-height: 20px;
`;

const TagItem = styled.View`
  padding-horizontal: 15px;
  padding-vertical: 5px;
  padding-right: 5px;
  border: 1px solid #B4B4B4;
  border-radius: 40px;
  margin-right: 10px;
  ${Styles.between_center}
  flex-direction: row;
`;

const TagView = styled.View`
  flex-wrap: wrap;
  flex-direction: row;
`;

const Logo = styled.Image`
  width: 36px;
  height: 36px;
  background-color: #d8d8d8;
  border-radius: 20px;
`;

const FormTitle = styled(MainMediumFont)`
  font-size: 16px;
  line-height: 24px;
  color: black;
  margin-top: 2px;
`;

const RowText = styled(MainMediumFont)`
  line-height: 20px;
  color: #4c4c4c
`;

const CloseBtn = styled.TouchableOpacity`
  position: absolute;
  z-index: 10;
  right: 0px;
  top: 0px;
`;

const ItemText = styled(MainMediumFont)`
  font-size: 14px;
  line-height: 24px;
  margin-left: 13px;
`;

const Left = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Item = styled.View`
  border: 1px solid #D5D5D5;
  border-radius: 6px;
  padding: 20px;
  flex-direction: row;
  margin-bottom: 10px;
  ${Styles.between_center}
`;

const List = styled.FlatList`
  flex: 1;
`;

const Row = styled.View`
  flex-direction: row;
  ${Styles.between_center};
  margin-vertical: 20px;
`;

const FormText = styled(MainMediumFont)`
  font-size: 14px;
  line-height: 20px;
  color: #4C4C4C;
`;

const Form = styled.View`
  width: 100%;
  margin-top: 22px;
`;

const Title = styled(MainBoldFont)`
  font-size: 26px;
  line-height: 32px;
`;

const Container = styled.View`
  flex: 1;
  background-color: white;
  padding-horizontal: 25px;
`;
