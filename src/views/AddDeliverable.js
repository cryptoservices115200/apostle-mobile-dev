import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainMediumFont, MainRegularFont, MainSemiBoldFont} from '@/views/Components';
import {Image, SafeAreaView, ScrollView, View} from 'react-native';
import {useActionSheet} from '@expo/react-native-action-sheet';
import {formatError} from '@/utils/Utils';
import Input from '@/views/Components/Input';
import Select from '@/views/Components/Select';

const AddDeliverable = props => {
  const deliverable = props.route.params?.deliverable;
  const storylineId = props.route.params?.storylineId;
  const {state, actions} = useOvermind();
  const {showActionSheetWithOptions} = useActionSheet();
  const [name, setName] = useState(deliverable?.name || null);
  const [description, setDescription] = useState(deliverable?.description || null);
  const [quantity, setQuantity] = useState(deliverable?.quantity || 0);
  const [type, setType] = useState(null);
  const [typeIndex, setTypeIndex] = useState(null);
  const [duration, setDuration] = useState(deliverable?.duration?.toString() || null);
  const [options, setOptions] = useState([]);

  const [errors, setErrors] = useState({
    name: null,
    description: null,
    type: null,
  })

  useEffect(() => {
    getTypes();
  }, []);

  const getTypes = async () => {
    console.log(state.deliverable.deliverableTypes);
    const data = [];
    state.deliverable.deliverableTypes?.map(t => data.push(t.name));
    data.push('Cancel');
    setOptions(data);
    if (deliverable) {
      setType(state.deliverable.deliverableTypes?.find(t => t.name === deliverable?.type?.name)?.name);
      setTypeIndex(state.deliverable.deliverableTypes?.findIndex(t => t.name === deliverable?.type?.name));
    }
  };

  const onPressNext = async () => {
    if (isNaN(duration)) {
      actions.alert.showError({message: 'Please input correct duration!'});
      return false;
    }

    if (!name) {
      const oErrors = {...errors};
      oErrors.name = 'Please input title!';
      setErrors(oErrors)
      return false;
    }

    if (!type) {
      const oErrors = {...errors};
      oErrors.type = 'Please input type!';
      setErrors(oErrors)
      return false;
    }
    actions.hud.show();
    try {
      if (deliverable?.id) {
        await actions.deliverable.saveDeliverable({
          where: {id: deliverable?.id},
          data: {
            name, description, quantity,
            type: {connect: {id: state.deliverable.deliverableTypes[typeIndex]?.id}}, duration: parseInt(duration),
          },
        });
        if (storylineId) {
          await actions.storyline.getStorylines();
        } else {
          await actions.deliverable.getDeliverables();
        }
        actions.alert.showSuccess({message: 'Updated deliverable successfully!'});
        props.navigation.pop();
      } else {
        const {saveDeliverable} = await actions.deliverable.saveDeliverable({
          data: {
            name, description, quantity,
            type: {connect: {id: state.deliverable.deliverableTypes[typeIndex]?.id}}, duration: parseInt(duration),
          },
        });
        if (saveDeliverable?.id) {
          if (storylineId) {
            await actions.storyline.saveStoryline({
              where: {id: storylineId},
              data: {
                deliverables: {
                  connect: [{
                    id: saveDeliverable.id,
                  }],
                },
              },
            });
            await actions.storyline.getStorylines();
            actions.alert.showSuccess({message: 'Added and connected deliverable to storyline successfully!'});
            props.navigation.pop();
          } else {
            await actions.deliverable.getDeliverables();
            actions.alert.showSuccess({message: 'Added deliverable successfully!'});
            if (props.route?.params?.handler) {
              props.route?.params?.handler(saveDeliverable);
            }
            props.navigation.pop();
          }
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      actions.hud.hide();
    }
  };

  const onPressQuantity = (isPlus) => {
    if (isPlus) {
      setQuantity(quantity + 1);
    } else {
      if (quantity - 1 >= 0) {
        setQuantity(quantity - 1);
      }
    }
  };

  const onPressType = () => {
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: options.length - 1,
      }, (index) => {
        if (index !== options.length - 1) {
          setType(options[index]);
          setTypeIndex(index);
        }
      },
    );
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Container>
        <ScrollView style={{flex: 1}}>
          <Title>Would you like us to{'\n'}edit your videos {'\n'}together</Title>
          <Desc>We'll turn your great raw media into final content ready to share anywhere and everywhere</Desc>
          <Input
            placeholder={'Name'}
            style={{marginTop: 22}}
            value={name}
            setValue={(v) => {setName(v); formatError('name', errors, setErrors)}}
            label={'Name'}
            error={errors.name}
            isUpper
          />
          <Form>
            <FormText>Description</FormText>
            <FormInput
              placeholder={'Describe this scene'}
              multiline
              placeholderTextColor={'gray'}
              value={description}
              onChangeText={setDescription}
              style={{height: 190}}/>
          </Form>

          <Quantity>
            <FormText>Quantity</FormText>
            <Right>
              <MinusBtn onPress={() => onPressQuantity(false)}><MinusText>-</MinusText></MinusBtn>
              <Count>{quantity}</Count>
              <MinusBtn onPress={() => onPressQuantity(true)}><MinusText>+</MinusText></MinusBtn>
            </Right>
          </Quantity>
          <Duration>
            <FormText>Duration</FormText>
            <DContent>
              <DInput
                value={duration}
                onChangeText={setDuration}
              />
              <DText>sec</DText>
            </DContent>
          </Duration>
          <Select
            style={{marginTop: 20}}
            label={'Type'}
            onPress={onPressType}
            value={type}
            error={errors.type}
          />
        </ScrollView>
        <Bottom>
          <Button onPress={() => props.navigation.pop()} style={{backgroundColor: '#F7F7FE'}}>
            <AddText style={{color: 'black'}}>Back</AddText>
          </Button>
          <Button onPress={onPressNext}>
            <AddText style={{color: 'white'}}>Next</AddText>
          </Button>
        </Bottom>
      </Container>
    </SafeAreaView>
  );
};

export default AddDeliverable;

const DText = styled(MainMediumFont)`
  font-size: 14px;
  line-height: 20px;
  color: #7c7c7c;
`;

const DInput = styled.TextInput`
  width: 40px;
  font-size: 16px;
  font-family: Montserrat-Medium;
  color: #0f0f0f;
`;

const DContent = styled.View`
  background-color: #f7f7f7;
  border-radius: 6px;
  padding-vertical: 12px;
  padding-horizontal: 20px;
  flex-direction: row;
  align-items: center;
`;

const Duration = styled.View`
  flex-direction: row;
  ${Styles.between_center}
  margin-top: 40px;
`;

const FormBtn = styled.TouchableOpacity`
  border-radius: 6px;
  background: #F7F7FE;
  padding-horizontal: 16px;
  padding-vertical: 14px;
  margin-top: 6px;
  flex-direction: row;
  ${Styles.between_center}
`;

const Count = styled(MainBoldFont)`
  font-size: 16px;
  line-height: 24px;
  color: #14142b;
  margin-horizontal: 20px;
`;

const MinusBtn = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  border-radius: 22px;
  background-color: #f7f7f7;
  ${Styles.center}
`;

const MinusText = styled(MainSemiBoldFont)`
  font-size: 23px;
`;

const Right = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Quantity = styled.View`
  flex-direction: row;
  ${Styles.between_center}
  margin-top: 20px;
`;

const FormInput = styled.TextInput`
  background-color: #f7f7f7;
  text-align-vertical: top;
  width: 100%;
  border-radius: 6px;
  padding: 15px;
  color: black;
  font-family: Montserrat-Medium;
  font-size: 14px;
  margin-top: 6px;
`;

const FormText = styled(MainRegularFont)`
  font-size: 14px;
  line-height: 20px;
  color: #4c4c4c;
`;

const FText = styled(MainMediumFont)`
  font-size: 14px;
  line-height: 20px;
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
`;

const AddText = styled(MainBoldFont)`
  font-size: 16px;
  color: #6600ed;
`;

const Desc = styled(MainMediumFont)`
  font-size: 16px;
  line-height: 24px;
  color: #4c4c4c;
  margin-top: 12px;
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
