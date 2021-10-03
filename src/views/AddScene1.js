import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainMediumFont, MainRegularFont, MainSemiBoldFont} from '@/views/Components';
import {Image, SafeAreaView, ScrollView, Switch, View} from 'react-native';
import {useActionSheet} from '@expo/react-native-action-sheet';
import {formatError} from '@/utils/Utils';
import Input from '@/views/Components/Input';
import Select from '@/views/Components/Select';
import {json} from 'overmind';

const AddScene1 = props => {
  const scene = props.route.params?.scene;
  const storylineId = props.route.params?.storylineId;
  const data = props.route.params?.data;
  const {state, actions} = useOvermind();
  const {showActionSheetWithOptions} = useActionSheet();
  const [name, setName] = useState(scene ? scene?.name : data ? data?.sceneTemplate?.name : null);
  const [description, setDescription] = useState(scene ? scene?.description : data ? data?.sceneTemplate?.description : null);
  const [quantity, setQuantity] = useState(scene ? scene?.quantity : data && data?.quantity || 0);
  const [type, setType] = useState(null);
  const [typeIndex, setTypeIndex] = useState(null);
  const [required, setRequired] = useState(scene ? scene?.isRequired : data ? data?.isRequired : false);
  const [options, setOptions] = useState([]);
  const [errors, setErrors] = useState({
    name: null,
    description: null,
    type: null,
  })

  useEffect(() => {
    getTypes();
  }, []);

  const getTypes = () => {
    const d = [];
    state.scene.sceneTypes?.map(t => d.push(t.name));
    d.push('Cancel');
    setOptions(d);
    if (scene) {
      setType(state.scene.sceneTypes?.find(t => t.name === scene?.type?.name)?.name);
      setTypeIndex(state.scene.sceneTypes?.findIndex(t => t.name === scene?.type?.name));
    }

    if (data) {
      setType(state.scene.sceneTypes?.find(t => t.name === data?.sceneTemplate?.type?.name)?.name);
      setTypeIndex(state.scene.sceneTypes?.findIndex(t => t.name === data?.sceneTemplate?.type?.name));
    }
  };

  const onPressNext = async () => {
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
    if (data && props.route.params?.handler) {
      try {
        const d = json({...data});
        d.isRequired = required;
        d.quantity = quantity;
        d.sceneTemplate.name = name;
        d.sceneTemplate.type = state.scene.sceneTypes[typeIndex];
        d.sceneTemplate.description = description;

        console.log(d, 'storylineScene data');
        props.route.params.handler(d);
        props.navigation.pop();
      } catch (e) {
        console.log(e)
      }
    } else {
      actions.hud.show();
      try {
        if (scene?.id) {
          await actions.scene.saveScene({
            where: {id: scene?.id},
            data: {
              name,
              description,
              quantity,
              type: {connect: {id: state.scene.sceneTypes[typeIndex]?.id}},
              isRequired: required,
            },
          });
          if (storylineId) {
            await actions.storyline.getStorylines();
          } else {
            await actions.scene.getScenes();
          }
          actions.alert.showSuccess({message: 'Updated scene successfully!'});
          props.navigation.pop();
        } else {
          const {saveScene} = await actions.scene.saveScene({
            data: {
              name,
              description,
              quantity,
              type: {connect: {id: state.scene.sceneTypes[typeIndex]?.id}},
              isRequired: required,
            },
          });
          if (saveScene?.id) {
            if (storylineId) {
              await actions.storyline.saveStoryline({
                where: {id: storylineId},
                data: {
                  scenes: {
                    connect: [{
                      id: saveScene.id,
                    }],
                  },
                },
              });
              await actions.storyline.getStorylines();
              actions.alert.showSuccess({message: 'Added and connected scene to storyline successfully!'});
              props.navigation.pop();
            } else {
              await actions.scene.getScenes();
              actions.alert.showSuccess({message: 'Added scene successfully!'});
              props.navigation.pop();
            }
          }
        }
      } catch (e) {
        console.log(e);
      } finally {
        actions.hud.hide();
      }
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
          <Title>Now let's add some scenes to your storyline</Title>
          <Desc>You have to add at least one so that your teammates know what to do</Desc>
          <Input
            placeholder={'Title'}
            style={{marginTop: 22}}
            value={name}
            setValue={(v) => {setName(v); formatError('name', errors, setErrors)}}
            label={'Title'}
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
          <Select
            style={{marginTop: 22}}
            label={'Type'}
            onPress={onPressType}
            value={type}
            error={errors.type}
          />
          <Quantity>
            <FormText>Required</FormText>
            <Switch
              value={required}
              onValueChange={setRequired}
              trackColor={{false: '#767577', true: '#6600ed'}}
            />
          </Quantity>
          <Quantity>
            <FormText>Quantity</FormText>
            <Right>
              <MinusBtn onPress={() => onPressQuantity(false)}><MinusText>-</MinusText></MinusBtn>
              <Count>{quantity}</Count>
              <MinusBtn onPress={() => onPressQuantity(true)}><MinusText>+</MinusText></MinusBtn>
            </Right>
          </Quantity>

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

export default AddScene1;

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
  margin-top: 40px;
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
