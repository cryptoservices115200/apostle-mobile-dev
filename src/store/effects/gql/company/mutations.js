import gql from 'graphql-tag';
import {companyFragment} from '@/store/effects/gql/user/fragments';

/*
*
*/
export const saveCompany = gql`
  mutation saveCompany($data: CompanyUpdateInput!, $where: CompanyWhereUniqueInput) {
    saveCompany(data: $data, where: $where) ${companyFragment}
  }
`;

/*
*
*/
export const deleteCompany = gql`
  mutation deleteCompany($where: CompanyWhereUniqueInput) {
    deleteDeliverable(where: $where) ${companyFragment}
  }
`;
