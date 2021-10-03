import gql from 'graphql-tag';
import {sceneFragment} from './fragments';

/*
*
*/
export const scenes = gql`
  query scenes($where: SceneWhereInput, $orderBy: SceneOrderByInput, $skip: Int, $after: String, $before: String, $first: Int, $last: Int) {
    scenes(where: $where, orderBy: $orderBy, skip: $skip, after: $after, before: $before, first: $first, last: $last) ${sceneFragment}
  }
`;

export const sceneTypes = gql`
  query sceneTypes($where: SceneTypeWhereInput, $orderBy: SceneTypeOrderByInput, $skip: Int, $after: String, $before: String, $first: Int, $last: Int) {
    sceneTypes(where: $where, orderBy: $orderBy, skip: $skip, after: $after, before: $before, first: $first, last: $last) {id slug name}
  }
`;
