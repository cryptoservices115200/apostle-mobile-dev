import gql from 'graphql-tag';
import {storylineFragment} from "@/store/effects/gql/storyline/fragments";
import {mediaFragment} from "@/store/effects/gql/media/fragments";
import {linkedMediaFragment} from '@/store/effects/gql/linkedMedia/fragments';

export const sceneFragment = gql`{
  id
  name
  type{id name slug}
  quantity
  comments {
    id
    user{id firstName lastName avatar}
    message
    subject
    createdAt
  }
  medias ${mediaFragment}
  linkedMedias ${linkedMediaFragment}
  template {
    id name type {id name}
    description
    example${mediaFragment}
    storylineScenes{
      id
    }
    example{
      id
      name
      type
      avatar
      caption
      source
    }
    createdAt
  }
  description
  storyline${storylineFragment}
  nominations{
    id user {id}
    scene {
      id name
    }
  }
  publicUrl{url name description}
  createdAt
}`
