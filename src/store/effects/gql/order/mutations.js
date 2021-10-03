import gql from 'graphql-tag';
import {orderFragment} from './fragments';

export const saveOrder = gql`
  mutation saveOrder($data: OrderUpdateInput!, $where: OrderWhereUniqueInput) {
    saveOrder(data: $data, where: $where) ${orderFragment}
  }
`;

export const deleteOrder = gql`
  mutation deleteOrder($where: OrderWhereUniqueInput) {
    deleteOrder(where: $where) ${orderFragment}
  }
`;

export const createOrder = gql`
  mutation createOrder(
        $cartId:String!
        $eventId: String
        $paymentMethodId: String
        $useWallet: Boolean
        $tipAmount: Float
        $tipType: String
        $notes: String
        $sendUtensils: Boolean
    ){
      createOrder(
          cartId: $cartId
          eventId: $eventId
          paymentMethodId: $paymentMethodId
          useWallet: $useWallet
          tipAmount: $tipAmount
          tipType: $tipType
          notes: $notes
          sendUtensils: $sendUtensils
      ){
        id
      }
    }
  `;

export const updateOrder = gql`
  mutation updateOrder(
      $data: OrderUpdateInput!
      $where: OrderWhereUniqueInput!
      $tipAmount: Float!
      $tipType: String!
  ){
      updateOrder(
          data: $data
          where: $where
          tipAmount: $tipAmount
          tipType: $tipType
      )${orderFragment}
  }
`;

export const cancelOrder = gql`
  mutation cancelOrder(
    $orderId: String!
    $userId: String!
    $eventId: String
  ){
    cancelOrder(
      orderId: $orderId
      userId: $userId
      eventId: $eventId
    )
  }
`;

export const emailReceipt = gql`
mutation emailReceipt($orderId: String!){
  emailReceipt(orderId:$orderId)
}
`;