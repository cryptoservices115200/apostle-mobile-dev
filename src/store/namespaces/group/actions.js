/*
*
*/
export const getTotalGroups = async ({state, effects}, data) => {
  let options = {};
  if (data && data.options) {
    options = data.options;
  }
  const {groups} = await effects.gql.queries.groups(options);

  state.group.totalRecords = groups ? groups.length : 0;
};

/*
*
*/
export const getGroups = async ({state, effects}, data) => {
  console.log('action getGroups...');
  try {
    let options = {};
    if (!data) {
      options = {
        first: state.group.groupPerPage,
        skip: (state.group.activePage - 1) * state.group.groupPerPage,
      };
    } else {
      if (data && data.all) {
        options = {};
      } else {
        options = data;
        if (!data.first) {
          options.first = state.group.groupPerPage;
        }
        if (!data.skip) {
          options.skip = (state.group.activePage - 1) * state.group.groupPerPage;
        }
      }
    }
    //
    const {groups} = await effects.gql.queries.groups(options);
    if (data && data.getValues) {
      return groups;
    } else {
      state.group.groups = groups;
    }
  } catch (e) {
    console.log(e, 'getGroups errors');
  }
};

/*
*
*/
export const saveGroup = async ({effects, actions}, data) => {
  try {
    return await effects.gql.mutations.saveGroup(data);
  } catch (e) {
    console.log(e, 'saveGroup errors');
    actions.alert.showError({
      message: e.response && e.response.errors && e.response.errors.length ? e.response.errors[0]['message'] : 'Error',
      title: 'Saving Group',
    });
  }
};

/*
*
*/
export const onChangePage = async ({state}, page) => {
  state.group.activePage = page;
};

/*
*
*/
export const onGroupAdded = ({state}, data) => {
  state.group.push(data);
};

export const getGroupByName = async ({effects, actions}, data) => {
  try {
    const resp = await effects.gql.queries.groups(data);
    return resp;
  } catch (e) {
    actions.alert.showError({
      message: e.response && e.response.errors && e.response.errors.length ? e.response.errors[0]['message'] : 'Error',
      title: 'Get Group By Name'
    });
  }
}