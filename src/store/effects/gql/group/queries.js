import gql from 'graphql-tag';
import { groupFragment } from './fragments';

/*
*
*/
export const groups = gql`
  query groups($where: GroupWhereInput, $orderBy: GroupOrderByInput, $skip: Int, $after: String, $before: String, $first: Int, $last: Int) {
    groups(where: $where, orderBy: $orderBy, skip: $skip, after: $after, before: $before, first: $first, last: $last) ${groupFragment}
  }
`;
