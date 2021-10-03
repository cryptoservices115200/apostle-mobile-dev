import gql from 'graphql-tag';
import { storylineFragment } from './fragments';

/*
*
*/
export const storylines = gql`
  query storylines($where: StorylineWhereInput, $orderBy: StorylineOrderByInput, $skip: Int, $after: String, $before: String, $first: Int, $last: Int) {
    storylines(where: $where, orderBy: $orderBy, skip: $skip, after: $after, before: $before, first: $first, last: $last) ${storylineFragment}
  }
`;
