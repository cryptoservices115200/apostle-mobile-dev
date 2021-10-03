import gql from 'graphql-tag';
import { deliverableFragment } from './fragments';

/*
*
*/
export const saveDeliverable = gql`
  mutation saveDeliverable($data: DeliverableUpdateInput!, $where: DeliverableWhereUniqueInput) {
    saveDeliverable(data: $data, where: $where) ${deliverableFragment}
  }
`;

/*
*
*/
export const deleteDeliverable = gql`
  mutation deleteDeliverable($where: DeliverableWhereUniqueInput) {
    deleteDeliverable(where: $where) ${deliverableFragment}
  }
`;
