import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont} from '@/views/Components';
import {Image, KeyboardAvoidingView, SafeAreaView, TouchableOpacity, View} from 'react-native';
import TemplateItem from '@/views/Components/TemplateItem';

const SelectTemplate = props => {
  const {state, actions} = useOvermind();

  useEffect(() => {
    getStorylineTemplates();
  }, []);

  const getStorylineTemplates = async () => {
    actions.hud.show();
    await actions.storylineTemplate.getStorylineTemplates();
    actions.hud.hide();
  };

  const onPressStoryline = (item) => {
    const storyline = {
      storylineTemplate: item,
    };
    actions.storyline.setNewStoryline(storyline);
    props.navigation.navigate('AddScene');
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Container>
        <Row>
          <TouchableOpacity onPress={() => props.navigation.pop()}>
            <Image source={Images.icon_arrow_left}/>
          </TouchableOpacity>
        </Row>
        <Title>Select a Template</Title>
        <List
          data={state.storylineTemplate.storylineTemplates}
          ListFooterComponent={<View style={{height: 100}}/>}
          renderItem={({item, index}) => <TemplateItem item={item} onPress={onPressStoryline} key={index}/>}
        />
      </Container>
    </SafeAreaView>
  );
};

export default SelectTemplate;

const List = styled.FlatList`
  flex: 1;
  padding-top: 20px;
`;

const Row = styled.View`
  flex-direction: row;
  ${Styles.between_center}
`;

const Title = styled(MainBoldFont)`
  font-size: 26px;
  line-height: 32px;
  text-align: center;
  margin-top: 10px;
`;

const Container = styled.View`
  flex: 1;
  background-color: white;
  padding-horizontal: 25px;
`;
