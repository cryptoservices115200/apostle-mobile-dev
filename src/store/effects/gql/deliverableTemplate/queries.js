import gql from 'graphql-tag';
import {deliverableTemplateFragment} from './fragments';

/*
*
*/
export const deliverableTemplates = gql`
  query deliverableTemplates($where: DeliverableTemplateWhereInput, $orderBy: DeliverableTemplateOrderByInput, $skip: Int, $after: String, $before: String, $first: Int, $last: Int) {
    deliverableTemplates(where: $where, orderBy: $orderBy, skip: $skip, after: $after, before: $before, first: $first, last: $last) ${deliverableTemplateFragment}
  }
`;
