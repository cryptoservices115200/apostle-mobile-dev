import gql from 'graphql-tag';
import { notificationFragment } from './fragments';

/*
*
*/
export const notifications = gql`
  query notifications($where: NotificationWhereInput, $orderBy: NotificationOrderByInput, $skip: Int, $after: String, $before: String, $first: Int, $last: Int) {
    notifications(where: $where, orderBy: $orderBy, skip: $skip, after: $after, before: $before, first: $first, last: $last) ${notificationFragment}
  }
`;
