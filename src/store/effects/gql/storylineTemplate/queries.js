import gql from 'graphql-tag';
import {storylineTemplateFragment} from './fragments';

/*
*
*/
export const storylineTemplates = gql`
  query storylineTemplates($where: StorylineTemplateWhereInput, $orderBy: StorylineTemplateOrderByInput, $skip: Int, $after: String, $before: String, $first: Int, $last: Int) {
    storylineTemplates(where: $where, orderBy: $orderBy, skip: $skip, after: $after, before: $before, first: $first, last: $last) ${storylineTemplateFragment}
  }
`;
