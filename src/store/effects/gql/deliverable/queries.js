import gql from 'graphql-tag';
import {deliverableFragment} from './fragments';

/*
*
*/
export const deliverables = gql`
  query deliverables($where: DeliverableWhereInput, $orderBy: DeliverableOrderByInput, $skip: Int, $after: String, $before: String, $first: Int, $last: Int) {
    deliverables(where: $where, orderBy: $orderBy, skip: $skip, after: $after, before: $before, first: $first, last: $last) ${deliverableFragment}
  }
`;

export const deliverableTypes = gql`
  query deliverableTypes($where: DeliverableTypeWhereInput, $orderBy: DeliverableTypeOrderByInput, $skip: Int, $after: String, $before: String, $first: Int, $last: Int) {
    deliverableTypes(where: $where, orderBy: $orderBy, skip: $skip, after: $after, before: $before, first: $first, last: $last) {id name format width height slug}
  }
`;
