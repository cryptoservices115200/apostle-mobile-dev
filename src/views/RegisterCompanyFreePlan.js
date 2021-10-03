import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {MainBoldFont, MainMediumFont, MainSemiBoldFont} from '@/views/Components';
import {Image, KeyboardAvoidingView, SafeAreaView} from 'react-native';

const RegisterCompanyFreePlan = props => {
  const {state, actions} = useOvermind();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    getProductsAndGroups();
  }, []);

  const getProductsAndGroups = async () => {
    try {
      const data = await actions.user.products();
      console.log(state.currentUser);
      setProducts(data.products.slice(data.products.length - 3));
      setSelectedProduct(data.products.slice(data.products.length - 3)[0].id);
      await actions.group.getGroups();
      console.log(products, state.group.groups, 'products');
    } catch (e) {
      console.log(e);
    }
  };

  const onPressNext = async () => {
    actions.hud.show();
    console.log(state.currentUser);
    try {
      const cart = await actions.cart.saveCart({
        userId: state.currentUser?.id,
        addItems: [{
          quantity: 1,
          productId: selectedProduct,
          deliverBy: new Date(),
          deliverTo: {id: products?.find(p => p.id === selectedProduct)?.site?.id},
          pricingType: 'monthly',
        }],
      });
      if (cart?.id) {
        const order = await actions.order.createOrder({
          cartId: state.currentCart?.id,
          tipType: '$',
          tipAmount: state.currentCart?.tip || 0,
        });
        console.log(order, 'order');
        if (order[0]?.id) {
          await actions.user.saveUser({
            where: {
              id: state.currentUser?.id,
            },
            data: {
              // groups: {
              //   connect: [{
              //     id: state.group.groups.find(g => g.name === products?.find(p => p.id === selectedProduct).name.toLowerCase()).id,
              //   }],
              // },
              company: {
                update: {
                  groups: {
                    connect: [{
                      id: state.group.groups.find(g => g.name === products?.find(p => p.id === selectedProduct).name.toLowerCase() && g.type === 'SUBSCRIPTION_LEVEL').id,
                    }],
                  },
                },
              },
            },
          });

          if (props.route?.params?.isForPlan) {
            props.navigation.navigate('Main');
          } else {
            await actions.user.getClearbitPerson({email: state.currentUser?.email});
            props.navigation.navigate('RegisterProfile');
          }
        }
      }
      console.log('next clicked');
    } catch (e) {
      console.log(e);
    } finally {
      actions.hud.hide();
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <KeyboardAvoidingView style={{flex: 1}} behavior={'padding'}>
        <Container>
          <Logo source={Images.logo}/>
          <Body>
            <Image source={Images.plan_logo}/>
          </Body>
          <Title>You're starting off on our free plan</Title>
          <Description>
            Collect authentic content with your team for as long as you'd like on our free plan
          </Description>
          <Row style={{marginTop: 27}}>
            <Image source={Images.icon_triangle}/>
            <Description style={{
              marginTop: 0, marginLeft:
                16,
            }}>Invite up to 10 people</Description>
          </Row>
          <Row>
            <Image source={Images.icon_triangle}/>
            <Description style={{marginTop: 0, marginLeft: 16}}>Store up to 1 gb of videos</Description>
          </Row>
          <Row>
            <Image source={Images.icon_triangle}/>
            <Description style={{marginTop: 0, marginLeft: 16}}>Unlimited storylines and scenes</Description>
          </Row>
          <Row>
            <Image source={Images.icon_triangle}/>
            <Description style={{marginTop: 0, marginLeft: 16}}>Access to quick and easy video editing</Description>
          </Row>
        </Container>
        <Bottom>
          <TextBtn onPress={() => props.navigation.pop()}>
            <LineText>Back</LineText>
          </TextBtn>
          <MainButton onPress={onPressNext}>
            <BtnText>Next</BtnText>
          </MainButton>
        </Bottom>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterCompanyFreePlan;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
`;

const Description = styled(MainMediumFont)`
  font-size: 16px;
  line-height: 24px;
  color: black;
  margin-top: 15px;
`;

const TextBtn = styled.TouchableOpacity`
`;

const LineText = styled(MainBoldFont)`
  color: #6600ED;
`;

const Bottom = styled.View`
  background-color: white;
  border-top-width: 1px;
  border-top-color: #b4b4b4;
  padding-top: 16px;
  padding-horizontal: 20px;
  ${Styles.between_center}
  flex-direction: row;
`;

const Body = styled.View`
  width: 100%;
  ${Styles.center}
  margin-top: 30px;
`;

const Title = styled(MainSemiBoldFont)`
  font-size: 24px;
  line-height: 29px;
  color: #14142b;
  margin-top: 50px;
`;

const MainButton = styled.TouchableOpacity`
  background-color: #6600ED;
  border-radius: 40px;
  padding-horizontal: 25px;
  height: 40px;
  ${Styles.center}
`;

const BtnText = styled(MainBoldFont)`
  color: #f7f7f7;
  font-size: 14px;
`;

const Logo = styled.Image`
  width: 200px;
  height: 50px;
  resize-mode: contain;
  margin-top: 80px;
`;

const Container = styled.ScrollView`
  flex: 1;
  background-color: white;
  padding-horizontal: 25px;
`;
