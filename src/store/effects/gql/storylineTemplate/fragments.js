import gql from 'graphql-tag';
import {mediaFragment} from '@/store/effects/gql/media/fragments';

export const storylineTemplateFragment = gql`{
  id
  name
  category
  description
  uses
  illustrationUrl${mediaFragment}
  tips
  example${mediaFragment}
  createdAt
  isDefault
  storylineScenes{
    id
    quantity
    isRequired
    storylineTemplate{id name category}
    sceneTemplate{id name type{id name} description storylineScenes{id isRequired quantity} example${mediaFragment} createdAt}
  }
  storylineDeliverables {
    id
    deliverableTemplate{id name}
    storylineTemplate{id name category}
  }
}`
