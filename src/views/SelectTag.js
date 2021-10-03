import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont} from '@/views/Components';
import {Image, SafeAreaView, ScrollView} from 'react-native';

const SelectTag = props => {
  const {state, actions} = useOvermind();
  const [tags, setTags] = useState([]);
  const {mediaId, data, handler} = props.route.params;
  useEffect(() => {
    getGroups();
  }, []);

  const getGroups = async () => {
    await actions.group.getGroups();
    console.log(state.group.groups);
    setTags(data ? state.group.groups.filter(g => g.type === 'TAG') : state.group.groups.filter(g => g.type === 'TAG' && !state.linkedMedia.linkedMedias.find(m => m.id === mediaId).tags?.find(t => t.id === g.id)));
  };
  const [selectedTags, setSelectedTags] = useState(data ? data : []);

  const onPressTag = (tag) => {
    let originalTags = [...selectedTags];
    const index = originalTags.findIndex(s => s === tag);
    if (index > -1) {
      originalTags.splice(index, 1);
      setSelectedTags(originalTags);
    } else {
      originalTags.push(tag);
      setSelectedTags(originalTags);
    }
  };

  const onPressDone = async () => {
    if (data) {
      handler(selectedTags);
      props.navigation.pop();
    } else {
      if (selectedTags?.length === 0) {
        actions.alert.showError({message: 'Please choose at least a tag'});
        return false;
      }

      actions.hud.show();
      try {
        const params = {
          where: {id: mediaId},
          data: {
            tags: {
              connect: [],
            },
          },
        };
        const items = [];
        selectedTags.map(t => items.push({id: t}));
        params.data.tags.connect = items;
        await actions.linkedMedia.saveLinkedMedia(params);
        await actions.linkedMedia.getLinkedMedias();
        actions.alert.showSuccess({message: 'Added Tags to LinkedMedia successfully!'});
        props.navigation.pop();
      } catch (e) {
        console.log(e);
      } finally {
        actions.hud.hide();
      }
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Container>
        <ScrollView style={{flex: 1}}>
          <CloseBtn onPress={() => props.navigation.pop()}>
            <Image source={Images.icon_close_black}/>
          </CloseBtn>
          <Title>Select tags</Title>
          <TagView>
            {tags.map((t, i) => <TagItem key={i} onPress={() => onPressTag(t.id)}
                                         isSelected={selectedTags.find(s => s === t.id)}>
              <TagText isSelected={selectedTags.find(s => s === t.id)}>{t.name}</TagText>
            </TagItem>)}
          </TagView>
        </ScrollView>
        <Bottom>
          <Button onPress={onPressDone}>
            <AddText style={{color: 'white'}}>Done</AddText>
          </Button>
        </Bottom>
      </Container>
    </SafeAreaView>
  );
};

export default SelectTag;

const AddText = styled(MainBoldFont)`
  font-size: 14px;
  line-height: 24px;
  color: #6600ed;
`;

const Button = styled.TouchableOpacity`
  width: 160px;
  height: 50px;
  ${Styles.center}
  background-color: #6600ed;
  border-radius: 40px;
`;

const Bottom = styled.View`
  ${Styles.end_center}
  flex-direction: row;
`;

const TagText = styled(MainBoldFont)`
  line-height: 20px;
  color: ${props => props.isSelected ? '#6600ed' : 'black'}
`;

const TagItem = styled.TouchableOpacity`
  padding-horizontal: 25px;
  padding-vertical: 10px;
  border: 2px solid #B4B4B4;
  border-radius: 40px;
  margin-right: 20px;
  ${Styles.between_center}
  flex-direction: row;
  margin-top: 16px;
  border-color: ${props => props.isSelected ? '#6600ed' : '#B4B4B4'}
`;

const TagView = styled.View`
  flex-wrap: wrap;
  flex-direction: row;
`;

const CloseBtn = styled.TouchableOpacity`
  position: absolute;
  right: 0px;
  top: 0px;
`;

const Title = styled(MainBoldFont)`
  font-size: 26px;
  line-height: 32px;
  margin-top: 30px;
`;

const Container = styled.View`
  flex: 1;
  background-color: white;
  padding-horizontal: 25px;
`;
