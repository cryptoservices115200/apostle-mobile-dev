import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainMediumFont, MainRegularFont, MainSemiBoldFont} from '@/views/Components';
import {Image, SafeAreaView, ScrollView, TouchableOpacity, View} from 'react-native';
import {TextInputMask} from 'react-native-masked-text';

const Upgrade = props => {
  const {state, actions} = useOvermind();

  const [products, setProducts] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(products.find(p => state.currentUser?.company?.groups.find(g => g.name === p.name?.toLowerCase()))?.id);
  const [name, setName] = useState(state.currentUser.firstName + ' ' + state.currentUser.lastName);
  console.log(selectedPlan, '==========');
  const [number, setNumber] = useState(null);
  const [ccv, setCcv] = useState(null);
  const [zipcode, setZipcode] = useState(null);

  useEffect(() => {
    getProductsAndGroups();
  }, []);

  const getProductsAndGroups = async () => {
    try {
      const data = await actions.user.products();
      setProducts(data.products.slice(data.products.length - 3));
      setSelectedPlan(data.products.slice(data.products.length - 3).find(p => state.currentUser?.company?.groups.find(g => g.name === p.name?.toLowerCase()))?.id);
      await actions.group.getGroups();
      console.log(products, 'products');
    } catch (e) {
      console.log(e);
    }
  };

  const onPressDone = async () => {
    if (!selectedPlan) {
      actions.alert.showError({message: 'Please choose a plan'});
      return false;
    }

    if (!name) {
      actions.alert.showError({message: 'Please type card name'});
      return false;
    }

    if (!number) {
      actions.alert.showError({message: 'Please type card number'});
      return false;
    }

    if (!ccv) {
      actions.alert.showError({message: 'Please type ccv'});
      return false;
    }

    if (!zipcode) {
      actions.alert.showError({message: 'Please type zipcode'});
      return false;
    }

    const params = {
      paymentMethod: {
        firstName: state.currentUser.firstName,
        lastName: state.currentUser.lastName,
        verificationCode: ccv,
        month: '10',
        year: '2022',
        number: number.replace(/[^A-Z0-9]/ig, ''),
        type: 'credit_card',
        billingZip: zipcode,
      },
    };

    console.log(params, 'params');
    const user = await actions.user.updateUserProfile(params);

    console.log(user, 'user');


    // if (!state.currentUser?.company?.owner?.groups?.find(g => g.name === products.find(p => p.id === selectedPlan)?.name?.toLowerCase())) {
    //   actions.hud.show();
    //   try {
    //     const cart = await actions.cart.saveCart({
    //       userId: state.currentUser?.id,
    //       addItems: [{
    //         quantity: 1,
    //         productId: selectedPlan,
    //         deliverBy: new Date(),
    //         deliverTo: {id: products?.find(p => p.id === selectedPlan)?.site?.id},
    //         pricingType: 'monthly',
    //       }],
    //     });
    //     if (cart?.id) {
    //       const order = await actions.order.createOrder({
    //         cartId: state.currentCart?.id,
    //         tipType: '$',
    //         tipAmount: state.currentCart?.tip || 0,
    //       });
    //       console.log(order, 'order');
    //       if (order[0]?.id) {
    //         await actions.user.saveUser({
    //           where: {
    //             id: state.currentUser?.id,
    //           },
    //           data: {
    //             groups: {
    //               connect: [{
    //                 id: state.group.groups.find(g => g.name === products?.find(p => p.id === selectedPlan).name.toLowerCase()).id,
    //               }],
    //             },
    //           },
    //         });
    //       }
    //     }
    //   } catch (e) {
    //     console.log(e);
    //   } finally {
    //     actions.hud.hide();
    //   }
    // }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Container>
        <ScrollView style={{paddingHorizontal: 24, flex: 1}}>
          <CloseBtn onPress={() => props.navigation.pop()}><Image source={Images.icon_close}
                                                                  style={{tintColor: 'black'}}/></CloseBtn>
          <Title>It's time to upgrade!{'\n'}Pick your plan</Title>
          {products?.map(p => <Item key={p.id} style={{shadowOffset: {x: 0, y: 10}}} isSelected={selectedPlan === p.id}
                                    onPress={() => setSelectedPlan(p.id)}>
            <ItemHeader>
              <View style={{flexDirection: 'row'}}>
                <Image source={Images.icon_user_circle}/>
                <View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <ITitle>{p.name}</ITitle>
                    <IDesc>(where you are now)</IDesc>
                  </View>
                  <PriceText>${p.pricing[0].retailPrice}</PriceText>
                </View>
              </View>
              <ChooseBtn>
                {selectedPlan === p.id && <ChooseCircle/>}
              </ChooseBtn>
            </ItemHeader>
            <Row><Dot/><SubText>10 Users</SubText></Row>
            <Row><Dot/><SubText>1 gb of storage</SubText></Row>
            <Row><Dot/><SubText>Free forever</SubText></Row>
          </Item>)}
          {/*<Item style={{shadowOffset: {x: 0, y: 10}}} isSelected={selectedPlan === 'standard'} onPress={() => setSelectedPlan('standard')}>*/}
          {/*  <ItemHeader>*/}
          {/*    <View style={{flexDirection: 'row'}}>*/}
          {/*      <Image source={Images.icon_check_rect}/>*/}
          {/*      <View>*/}
          {/*        <View style={{flexDirection: 'row', alignItems: 'center'}}>*/}
          {/*          <ITitle>Standard</ITitle>*/}
          {/*        </View>*/}
          {/*        <PriceText>$19.95/mo</PriceText>*/}
          {/*      </View>*/}
          {/*    </View>*/}
          {/*    <ChooseBtn>*/}
          {/*      {selectedPlan === 'standard' && <ChooseCircle/>}*/}
          {/*    </ChooseBtn>*/}
          {/*  </ItemHeader>*/}
          {/*  <Row><Dot/><SubText>50 Users</SubText></Row>*/}
          {/*  <Row><Dot/><SubText>100 gb of storage ($10/mo for each additional 100gb)</SubText></Row>*/}
          {/*  <Row><Dot/><SubText>1 edited video package included</SubText></Row>*/}
          {/*</Item>*/}
          {/*<Item style={{shadowOffset: {x: 0, y: 10}}} isSelected={selectedPlan === 'premium'} onPress={() => setSelectedPlan('premium')}>*/}
          {/*  <ItemHeader>*/}
          {/*    <View style={{flexDirection: 'row'}}>*/}
          {/*      <Image source={Images.icon_company}/>*/}
          {/*      <View>*/}
          {/*        <View style={{flexDirection: 'row', alignItems: 'center'}}>*/}
          {/*          <ITitle>Premium</ITitle>*/}
          {/*        </View>*/}
          {/*      </View>*/}
          {/*    </View>*/}
          {/*    <ChooseBtn>*/}
          {/*      {selectedPlan === 'premium' && <ChooseCircle/>}*/}
          {/*    </ChooseBtn>*/}
          {/*  </ItemHeader>*/}
          {/*  <Row><Dot/><SubText>Unlimited users</SubText></Row>*/}
          {/*  <Row><Dot/><SubText>1 tb of storage ($10/mo for each additional 100gb)</SubText></Row>*/}
          {/*  <Row><Dot/><SubText>3 edited video package included</SubText></Row>*/}
          {/*  <Row><Dot/><SubText>$79.95/mo</SubText></Row>*/}
          {/*</Item>*/}
          {/*<Item style={{shadowOffset: {x: 0, y: 10}}}>*/}
          {/*  <ItemHeader style={{alignItems: 'center'}}>*/}
          {/*    <View style={{flexDirection: 'row', alignItems: 'center'}}>*/}
          {/*      <Image source={Images.icon_world}/>*/}
          {/*      <View>*/}
          {/*        <View style={{flexDirection: 'row', alignItems: 'center'}}>*/}
          {/*          <ITitle>Enterprise</ITitle>*/}
          {/*        </View>*/}
          {/*      </View>*/}
          {/*    </View>*/}
          {/*    <TouchableOpacity>*/}
          {/*      <ContactText>Contact Us</ContactText>*/}
          {/*    </TouchableOpacity>*/}
          {/*  </ItemHeader>*/}
          {/*  <Row><Dot/><SubText>Unlimited users</SubText></Row>*/}
          {/*  <Row><Dot/><SubText>Unlimited storage</SubText></Row>*/}
          {/*  <Row><Dot/><SubText>Invoicing</SubText></Row>*/}
          {/*</Item>*/}
          <Title>How would you like to {'\n'}pay?</Title>
          <Form>
            <FormText>Name on Card</FormText>
            <FormInput
              placeholder={'FirstName LastName'}
              placeholderTextColor={'gray'}
              value={name}
              onChangeText={setName}
            />
          </Form>
          <Form>
            <FormText>Credit Card Number</FormText>
            <FormInput
              as={TextInputMask}
              placeholder={'0000 0000 0000 0000'}
              placeholderTextColor={'gray'}
              type={'cel-phone'}
              options={{
                maskType: 'BRL',
                withDDD: true,
                dddMask: '9999 9999 9999 9999',
              }}
              value={number}
              onChangeText={setNumber}
            />
          </Form>
          <View style={{flexDirection: 'row'}}>
            <Form style={{width: 80, marginRight: 20}}>
              <FormText>CCV</FormText>
              <FormInput
                placeholder={'***'}
                placeholderTextColor={'gray'}
                value={ccv}
                onChangeText={setCcv}
              />
            </Form>
            <Form style={{width: 'auto', flex: 1}}>

              <FormText>Zip Code</FormText>
              <FormInput
                placeholder={'00000'}
                placeholderTextColor={'gray'}
                value={zipcode}
                onChangeText={setZipcode}
              />
            </Form>
          </View>
        </ScrollView>
        <Bottom>
          <TouchableOpacity onPress={() => props.navigation.pop()}>
            <CancelText>Back</CancelText>
          </TouchableOpacity>
          <SaveBtn onPress={onPressDone}>
            <SaveText>Done</SaveText>
          </SaveBtn>
        </Bottom>
      </Container>
    </SafeAreaView>
  );
};

export default Upgrade;

const SaveText = styled(MainBoldFont)`
  color: white;
  font-size: 16px;
  line-height: 24px;

`;

const SaveBtn = styled.TouchableOpacity`
  background-color: #6600ed;
  padding-horizontal: 40px;
  padding-vertical: 10px;
  border-radius: 40px;
`;

const CancelText = styled(MainBoldFont)`
  color: #6600ed;
  font-size: 14px;
  line-height: 20px;
`;

const Bottom = styled.View`
  ${Styles.between_center}
  flex-direction: row;
  border: 0px solid #B4B4B4;
  border-top-width: 1px;
  padding-vertical: 20px;
  padding-horizontal: 24px;
`;

const FormInput = styled.TextInput`
  text-align-vertical: top;
  background-color: #f7f7f7;
  width: 100%;
  border-radius: 6px;
  padding: 15px;
  color: black;
  font-family: Montserrat-Medium;
  font-size: 14px;
  margin-top: 6px;
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

const ContactText = styled(MainSemiBoldFont)`
  font-size: 14px;
  line-height: 20px;
  color: #6600ed;
`;

const Dot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 10px;
  background-color: #B4B4B4;
  margin-top: 8px;
`;

const Row = styled.View`
  flex-direction: row;
  margin-top: 12px;
`;

const SubText = styled(MainMediumFont)`
  font-size: 16px;
  line-height: 24px;
  color: #14142B;
  margin-left: 10px;
`;

const PriceText = styled(MainMediumFont)`
  font-size: 16px;
  line-height: 24px;
  color: #4c4c4c;
  margin-left: 10px;
  margin-top: 2px;
`;

const ChooseCircle = styled.View`
  width: 16px;
  height: 16px;
  border-radius: 10px;
  background-color: #00dbba;
`;

const ChooseBtn = styled.TouchableOpacity`
  border-width: 1.5px;
  border-color: #b4b4b4;
  width: 22px;
  height: 22px;
  border-radius: 12px;
  ${Styles.center}
`;

const IDesc = styled(MainRegularFont)`
  font-size: 12px;
  color: #4C4C4C;
  margin-left: 6px;
`;

const ITitle = styled(MainBoldFont)`
  font-size: 14px;
  line-height: 20px;
  color: #14142b;
  margin-left: 10px;
`;

const ItemHeader = styled.View`
  flex-direction: row;
  ${Styles.between_start}
`;

const Item = styled.TouchableOpacity`
  background-color: white;
  border-radius: 12px;
  shadow-color: #000000;
  elevation: 3;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  padding: 20px;
  margin-top: 18px;
  border-width: ${props => props.isSelected ? 1.5 : 0};
  border-color: #00DBBA;
`;

const Title = styled(MainSemiBoldFont)`
  font-size: 24px;
  line-height: 29px;
  color: #14142b;
  margin-top: 30px;
`;

const CloseBtn = styled.TouchableOpacity`
  position: absolute;
  right: 24px;
  top: 0px;
  z-index: 10;
`;

const Container = styled.View`
  flex: 1;
  background-color: white;
  padding-top: 30px;
`;
