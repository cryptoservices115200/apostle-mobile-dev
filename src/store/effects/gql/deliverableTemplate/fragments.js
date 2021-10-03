import gql from 'graphql-tag';
import {mediaFragment} from '@/store/effects/gql/media/fragments';

export const deliverableTemplateFragment = gql`{
  id
  name
  type{id name format width height slug createdAt}
  description
  duration
  price
  example ${mediaFragment}
  createdAt
}`
