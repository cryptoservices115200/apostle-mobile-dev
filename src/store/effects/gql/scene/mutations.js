import gql from 'graphql-tag';
import {sceneFragment} from '@/store/effects/gql/scene/fragments';

/*
*
*/
export const saveScene = gql`
  mutation saveScene($data: SceneUpdateInput!, $where: SceneWhereUniqueInput) {
    saveScene(data: $data, where: $where) ${sceneFragment}
  }
`;

/*
*
*/
export const deleteScene = gql`
  mutation deleteScene($where: SceneWhereUniqueInput) {
    deleteScene(where: $where) ${sceneFragment}
  }
`;
