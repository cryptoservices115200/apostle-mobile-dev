/*
*
*/
export const getNotifications = async ({state, effects}, data) => {
  console.log('action getNotifications...');
  try {
    let options = {};
    if (!data) {
      options = {
        first: state.notification.notificationPerPage,
        skip: (state.notification.activePage - 1) * state.notification.notificationPerPage,
      };
    } else {
      if (data && data.all) {
        options = {};
      } else {
        options = data;
        if (!data.first) {
          options.first = state.notification.notificationPerPage;
        }
        if (!data.skip) {
          options.skip = (state.notification.activePage - 1) * state.notification.notificationPerPage;
        }
      }
    }
    //
    const {notifications} = await effects.gql.queries.notifications(options);
    if (data && data.getValues) {
      return notifications;
    } else {
      notifications.map(m => m.isPlay = false);
      state.notification.notifications = notifications;
    }
  } catch (e) {
    console.log(e, 'getNotifications errors');
  }
};

/*
*
*/
export const saveNotification = async ({effects, actions}, data) => {
  try {
    return await effects.gql.mutations.saveNotification(data);
  } catch (e) {
    console.log(e, 'saveNotification errors');
    actions.alert.showError({
      message: e.response && e.response.errors && e.response.errors.length ? e.response.errors[0]['message'] : 'Error',
      title: 'Saving notification',
    });
  }
};

export const deleteNotification = async ({effects, actions}, data) => {
  try {
    return await effects.gql.mutations.deleteNotification(data);
  } catch (e) {
    console.log(e, 'deleteNotification errors');
    actions.alert.showError({
      message: e.response && e.response.errors && e.response.errors.length ? e.response.errors[0]['message'] : 'Error',
      title: 'Deleting notification',
    });
  }
};

/*
*
*/
export const onChangePage = async ({state}, page) => {
  state.notification.activePage = page;
};

export const onPlay = ({state}, data) => {
  state.notification.notifications = data;
}
