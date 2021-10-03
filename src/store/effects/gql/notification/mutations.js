import gql from 'graphql-tag';
import {notificationFragment} from './fragments';

/*
*
*/
export const saveNotification = gql`
  mutation saveNotification($data: NotificationUpdateInput!, $where: NotificationWhereUniqueInput) {
    saveNotification(data: $data, where: $where) ${notificationFragment}
  }
`;

/*
*
*/
export const deleteNotification = gql`
  mutation deleteNotification($where: NotificationWhereUniqueInput) {
    deleteNotification(where: $where) ${notificationFragment}
  }
`;
