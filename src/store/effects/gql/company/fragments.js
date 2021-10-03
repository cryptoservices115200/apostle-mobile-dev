import gql from 'graphql-tag';
import {storylineFragment} from "@/store/effects/gql/storyline/fragments";
import {mediaFragment} from "@/store/effects/gql/media/fragments";

export const deliverableFragment = gql`{
  id
  name
  storyline${storylineFragment}
  template{
    id
    name
    type{id name}
    description
    duration
    example${mediaFragment}
  }
  description
  quantity
  duration
  type {id name }
  medias${mediaFragment}
  status
  createdAt
}`
