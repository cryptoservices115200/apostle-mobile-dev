/*
*
*/
export const getTotalstorylines = async ({state, effects}, data) => {
  let options = {};
  if (data && data.options) {
    options = data.options;
  }
  const {storylines} = await effects.gql.queries.storylines(options);

  state.storyline.totalRecords = storylines ? storylines.length : 0;
};

/*
*
*/
export const getStorylines = async ({state, effects}, data) => {
  console.log('action getStorylines...');
  try {
    let options = {};
    if (!data) {
      options = {
        first: state.storyline.storylinePerPage,
        skip: (state.storyline.activePage - 1) * state.storyline.storylinePerPage,
      };
    } else {
      if (data && data.all) {
        options = {};
      } else {
        options = data;
        if (!data.first) {
          options.first = state.storyline.storylinePerPage;
        }
        if (!data.skip) {
          options.skip = (state.storyline.activePage - 1) * state.storyline.storylinePerPage;
        }
      }
    }
    //
    const {storylines} = await effects.gql.queries.storylines(options);
    if (data && data.getValues) {
      return storylines;
    } else {
      state.storyline.storylines = storylines;
    }
  } catch (e) {
    console.log(e, 'getstorylines errors');
  }
};

/*
*
*/
export const saveStoryline = async ({effects, actions}, data) => {
  try {
    return await effects.gql.mutations.saveStoryline(data);
  } catch (e) {
    console.log(e, 'saveStoryline errors');
    actions.alert.showError({
      message: e.response && e.response.errors && e.response.errors.length ? e.response.errors[0]['message'] : 'Error',
      title: 'Saving Storyline',
    });
  }
};

/*
*
*/
export const onChangePage = async ({state}, page) => {
  state.storyline.activePage = page;
};

/*
*
*/
export const onstorylineAdded = ({state}, data) => {
  state.storyline.push(data);
};

export const getstorylineByName = async ({effects, actions}, data) => {
  try {
    const resp = await effects.gql.queries.storylines(data);
    return resp;
  } catch (e) {
    actions.alert.showError({
      message: e.response && e.response.errors && e.response.errors.length ? e.response.errors[0]['message'] : 'Error',
      title: 'Get storyline By Name'
    });
  }
}

export const setNewStoryline = async ({state}, data) => {
  state.storyline.newStoryline = data;
}
