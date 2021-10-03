import gql from 'graphql-tag';
import { storylineTemplateFragment } from './fragments';

/*
*
*/
export const saveStorylineTemplate = gql`
  mutation saveStorylineTemplate($data: StorylineTemplateUpdateInput!, $where: StorylineTemplateWhereUniqueInput) {
    saveStorylineTemplate(data: $data, where: $where) ${storylineTemplateFragment}
  }
`;

/*
*
*/
export const deleteStorylineTemplate = gql`
  mutation deleteStorylineTemplate($where: StorylineTemplateWhereUniqueInput) {
    deleteStorylineTemplate(where: $where) ${storylineTemplateFragment}
  }
`;
