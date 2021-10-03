import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainMediumFont, MainSemiBoldFont} from '@/views/Components';
import DateTime from '@/views/Components/datetimepicker';
import {Dimensions, Image, KeyboardAvoidingView, SafeAreaView, ScrollView, TouchableOpacity, View} from 'react-native';
import moment from 'moment';
import {formatError} from '@/utils/Utils';
import Input from '@/views/Components/Input';
import {json} from 'overmind';

const AdditionalDetail = props => {
  const {state, actions} = useOvermind();
  const [isPlaned, setPlaned] = useState(true);
  const [name, setName] = useState(null);
  const [data, setData] = useState([]);
  const _datePicker = useRef(null);
  const [errors, setErrors] = useState({
    name: null,
  });

  const onPressAdd = (index, time) => {
    _datePicker.current.open(time ? time : new Date(), (dob) => {
      const originData = [...data];
      if (index > -1) {
        originData[index].startTime = dob;
      } else {
        originData.push({startTime: dob});
      }
      setData(originData);
    });
  };

  const formData = state.storyline.newStoryline;

  console.log(json(formData), 'formData');


  const onPressNext = async () => {
    if (!name) {
      const oErrors = {...errors};
      oErrors.name = 'Please input new storyline name!';
      setErrors(oErrors);
      return false;
    }
    const params = {
      data: {
        name,
        status: 'NEW',
        shootDates: {},
        companies: {connect: [{id: state.currentUser?.company?.id}]},
      },
    };

    if (formData?.storylineTemplate?.id) {
      params.data.template = {connect: {id: formData?.storylineTemplate?.id}};

      const scenes = [];
      const deliverables = [];
      if (formData?.scenes?.length > 0) {
        if (formData?.scenes[0]?.sceneTemplate?.id) {
          formData?.scenes.map(s => {
            const sceneParams = {
              name: s.sceneTemplate?.name,
              isRequired: s.isRequired,
              quantity: s.quantity,
              template: {connect: {id: s.sceneTemplate?.id}},
              description: s.sceneTemplate?.description,
            };
            if (s.sceneTemplate?.type?.name) {
              sceneParams.type = {connect: {id: s.sceneTemplate?.type?.id}};
            }

            scenes.push(sceneParams);
          });
          params.data.scenes = {create: scenes};
        } else {
          formData?.scenes.map(s => scenes.push({
            id: s.id,
          }));
          params.data.scenes = {connect: scenes};
        }
      }

      if (formData?.deliverable?.length > 0) {
        if (Object.keys(formData?.deliverable[0]).find(k => k === 'example')) {
          formData?.deliverable.map(d => {
            const dParams = {
              name: d.name,
              template: {connect: {id: d.id}},
              description: d.description,
              duration: d.duration,
              medias: d.example?.id ? {connect: [{id: d.example?.id}]} : {},
              status: 'NEW',
            }
            if (d?.type?.id) {
              dParams.type = {connect: {id: d.type?.id}}
            }
            deliverables.push(dParams);
          });
          params.data.deliverables = {create: deliverables};
        } else {
          formData?.deliverable.map(d => deliverables.push({
            id: d.id,
          }));
          params.data.deliverables = {connect: deliverables};
        }
      }

      if (formData?.users?.length > 0) {
        const users = [];
        formData?.users.map(u => users.push({id: u.user.id}));
        params.data.users = {connect: users};
      }
    }
    if (data?.length > 0) {
      params.data.shootDates.create = data;
    } else {
      delete params.data.shootDates;
    }

    console.log(params, 'params');
    actions.hud.show();
    try {
      await actions.storyline.saveStoryline(params);
      await actions.storyline.getStorylines();
      actions.alert.showSuccess({message: 'Added storyline successfully'});
      props.navigation.navigate('Main');
    } catch (e) {
      console.log(e);
    } finally {
      actions.hud.hide();
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>

      <Container>
        <ScrollView keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
          <View style={{flex: 1}}>
            <Title>{state.storyline.newStoryline?.storylineTemplate?.id ? 'Tell us a little more about this storyline' : 'Create a Storyline'}</Title>
            <Input
              placeholder={'Name'}
              style={{marginTop: 22}}
              value={name}
              setValue={(v) => {
                setName(v);
                formatError('name', errors, setErrors);
              }}
              label={'Name'}
              error={errors.name}
              isUpper
            />
            <Desc>Are you planning on setting aside specific dates and times for filming?</Desc>
            <CheckView>
              <Checkbox onPress={() => setPlaned(true)}>{isPlaned && <Circle/>}</Checkbox>
              <CheckText>Yes</CheckText>
              <Checkbox onPress={() => setPlaned(false)} style={{marginLeft: 40}}>{!isPlaned && <Circle/>}</Checkbox>
              <CheckText>No</CheckText>
            </CheckView>
            {isPlaned && <View style={{flex: 1}}>
              <Desc>Add those time slots here. If you don't {'\n'}know them yet, you can add them {'\n'}later</Desc>
              <Row>
                <SubTitle>Film Date</SubTitle>
                {data.length > 0 && <TouchableOpacity onPress={() => onPressAdd()}>
                  <SubTitle style={{color: '#6600ed'}}>+ Add More</SubTitle>
                </TouchableOpacity>}
              </Row>
              <List
                data={data}
                ListFooterComponent={<View style={{height: 100}}/>}
                renderItem={({item, index}) => <Item key={index}>
                  <Left>
                    <Image source={Images.icon_clock}/>
                    <ItemText>{moment(item.startTime).format('MMM DD, YYYY, h:mma')}</ItemText>
                  </Left>
                  <TouchableOpacity onPress={() => onPressAdd(index, item.startTime)}>
                    <ItemText style={{color: '#6600ed'}}>
                      Edit
                    </ItemText>
                  </TouchableOpacity>
                </Item>}
                ListEmptyComponent={<DateView>
                  <Image source={Images.icon_clock}/>
                  <SubTitle style={{marginTop: 6}}>
                    No Time Slots
                  </SubTitle>
                  <AddBtn onPress={onPressAdd}>
                    <AddText>+ Add More</AddText>
                  </AddBtn>
                </DateView>}
              />
            </View>}

          </View>
        </ScrollView>
        <Bottom>
          <Button onPress={() => props.navigation.pop()} style={{backgroundColor: '#F7F7FE'}}>
            <AddText style={{color: 'black'}}>Back</AddText>
          </Button>
          <Button onPress={onPressNext}>
            <AddText style={{color: 'white'}}>Next</AddText>
          </Button>
        </Bottom>
        <DateTime ref={_datePicker}/>
      </Container>

    </SafeAreaView>
  );
};

export default AdditionalDetail;

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
  margin-bottom: 20px;
  ${Styles.between_center}
`;

const List = styled.FlatList`
  flex: 1;
  padding-top: 20px;
`;

const Row = styled.View`
  flex-direction: row;
  ${Styles.between_center}
`;

const AddBtn = styled.TouchableOpacity`
  border: 2px solid #6600ED;
  border-radius: 31px;
  margin-top: 17px;
  width: 123px;
  height: 40px;
  ${Styles.center}
`;

const AddText = styled(MainSemiBoldFont)`
  font-size: 14px;
  line-height: 24px;
  color: #6600ed;
`;

const DateView = styled.View`
  border: 1px solid #D5D5D5;
  border-radius: 6px;
  height: 165px;
  ${Styles.center}
`;

const SubTitle = styled(MainSemiBoldFont)`
  font-size: 14px;
  line-height: 24px;
  margin-top: 20px;
`;

const CheckText = styled(MainMediumFont)`
  margin-left: 10px;
  font-size: 16px;
  line-height: 24px;
  color: #1c1c1c;
`;

const Circle = styled.View`
  width: 28px;
  height: 28px;
  border-radius: 20px;
  background-color: #6600ed;
`;

const Checkbox = styled.TouchableOpacity`
  border: 1px solid #D5D5D5;
  border-radius: 30px;
  width: 38px;
  height: 38px;
  ${Styles.center}
`;

const CheckView = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 17px;
`;

const Desc = styled(MainMediumFont)`
  font-size: 16px;
  line-height: 24px;
  color: #545454;
  margin-top: 26px;
`;

const FormInput = styled.TextInput`
  background-color: #f7f7f7;
  width: 100%;
  border-radius: 6px;
  padding: 15px;
  color: black;
  font-family: Montserrat-Medium;
  font-size: 14px;
  margin-top: 6px;
  text-align-vertical: top;
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

const Button = styled.TouchableOpacity`
  width: 160px;
  height: 56px;
  ${Styles.center}
  background-color: #6600ed;
  border-radius: 40px;
`;

const Bottom = styled.View`
  ${Styles.between_center}
  flex-direction: row;
  margin-bottom: 10px;
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
