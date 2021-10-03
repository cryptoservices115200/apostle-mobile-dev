import gql from 'graphql-tag';
import { groupFragment } from './fragments';

/*
*
*/
export const saveGroup = gql`
  mutation saveGroup($data: GroupUpdateInput!, $where: GroupWhereUniqueInput) {
    saveGroup(data: $data, where: $where) ${groupFragment}
  }
`;

/*
*
*/
export const deleteGroup = gql`
  mutation deleteGroup($where: GroupWhereUniqueInput) {
    deleteGroup(where: $where) ${groupFragment}
  }
`;
