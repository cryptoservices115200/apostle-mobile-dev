import gql from 'graphql-tag';
import {mediaFragment} from './fragments';

/*
*
*/
export const saveMedia = gql`
  mutation saveMedia($data: MediaUpdateInput!, $where: MediaWhereUniqueInput) {
    saveMedia(data: $data, where: $where) ${mediaFragment}
  }
`;

/*
*
*/
export const deleteMedia = gql`
  mutation deleteMedia($where: MediaWhereUniqueInput) {
    deleteMedia(where: $where) ${mediaFragment}
  }
`;
