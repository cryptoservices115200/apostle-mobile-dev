import gql from 'graphql-tag';
import {deliverableTemplateFragment} from './fragments';

/*
*
*/
export const saveDeliverableTemplate = gql`
  mutation saveDeliverableTemplate($data: DeliverableTemplateUpdateInput!, $where: DeliverableTemplateWhereUniqueInput) {
    saveDeliverableTemplate(data: $data, where: $where) ${deliverableTemplateFragment}
  }
`;

/*
*
*/
export const deleteDeliverableTemplate = gql`
  mutation deleteDeliverableTemplate($where: DeliverableTemplateWhereUniqueInput) {
    deleteDeliverableTemplate(where: $where) ${deliverableTemplateFragment}
  }
`;
