import gql from 'graphql-tag';
import { mediaFragment } from './fragments';

/*
*
*/
export const medias = gql`
  query medias($where: MediaWhereInput, $orderBy: MediaOrderByInput, $skip: Int, $after: String, $before: String, $first: Int, $last: Int) {
    medias(where: $where, orderBy: $orderBy, skip: $skip, after: $after, before: $before, first: $first, last: $last) ${mediaFragment}
  }
`;
