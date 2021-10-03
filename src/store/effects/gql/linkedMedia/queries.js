import gql from 'graphql-tag';
import { linkedMediaFragment } from './fragments';

/*
*
*/
export const linkedMedias = gql`
  query linkedMedias($where: LinkedMediaWhereInput, $orderBy: LinkedMediaOrderByInput, $skip: Int, $after: String, $before: String, $first: Int, $last: Int) {
    linkedMedias(where: $where, orderBy: $orderBy, skip: $skip, after: $after, before: $before, first: $first, last: $last) ${linkedMediaFragment}
  }
`;
