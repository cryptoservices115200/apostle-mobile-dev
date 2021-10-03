import gql from 'graphql-tag';
import {deliverableFragment} from './fragments';
import {companyFragment} from '@/store/effects/gql/user/fragments';

/*
*
*/
export const companies = gql`
  query companies($where: CompanyWhereInput, $orderBy: CompanyOrderByInput, $skip: Int, $after: String, $before: String, $first: Int, $last: Int) {
    companies(where: $where, orderBy: $orderBy, skip: $skip, after: $after, before: $before, first: $first, last: $last) ${companyFragment}
  }
`;
