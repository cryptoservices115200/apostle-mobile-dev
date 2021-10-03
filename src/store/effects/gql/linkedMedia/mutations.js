import gql from 'graphql-tag';
import {linkedMediaFragment} from './fragments';

/*
*
*/
export const saveLinkedMedia = gql`
  mutation saveLinkedMedia($data: LinkedMediaUpdateInput!, $where: LinkedMediaWhereUniqueInput) {
    saveLinkedMedia(data: $data, where: $where) ${linkedMediaFragment}
  }
`;

/*
*
*/
export const deleteLinkedMedia = gql`
  mutation deleteLinkedMedia($where: LinkedMediaWhereUniqueInput) {
    deleteLinkedMedia(where: $where) ${linkedMediaFragment}
  }
`;
