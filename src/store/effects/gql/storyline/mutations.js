import gql from 'graphql-tag';
import {storylineFragment} from './fragments';

/*
*
*/
export const saveStoryline = gql`
  mutation saveStoryline($data: StorylineUpdateInput!, $where: StorylineWhereUniqueInput) {
    saveStoryline(data: $data, where: $where) ${storylineFragment}
  }
`;

/*
*
*/
export const deleteStoryline = gql`
  mutation deleteStoryline($where: StorylineWhereUniqueInput) {
    deleteStoryline(where: $where) ${storylineFragment}
  }
`;
