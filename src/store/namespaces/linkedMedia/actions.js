
/*
*
*/
export const getLinkedMedias = async ({state, effects}, data) => {
  console.log('action getLinkedMedias...');
  try {
    let options = {};
    if (!data) {
      options = {
        first: state.linkedMedia.linkedMediaPerPage,
        skip: (state.linkedMedia.activePage - 1) * state.linkedMedia.linkedMediaPerPage,
      };
    } else {
      if (data && data.all) {
        options = {};
      } else {
        options = data;
        if (!data.first) {
          options.first = state.linkedMedia.linkedMediaPerPage;
        }
        if (!data.skip) {
          options.skip = (state.linkedMedia.activePage - 1) * state.linkedMedia.linkedMediaPerPage;
        }
      }
    }
    //
    const {linkedMedias} = await effects.gql.queries.linkedMedias(options);
    if (data && data.getValues) {
      return linkedMedias;
    } else {
      linkedMedias.map(m => m.isPlay = false);
      console.log(linkedMedias, 'linkedMedias')
      state.linkedMedia.linkedMedias = linkedMedias;
    }
  } catch (e) {
    console.log(e, 'getLinkedMedias errors');
  }
};

/*
*
*/
export const saveLinkedMedia = async ({effects, actions}, data) => {
  try {
    return await effects.gql.mutations.saveLinkedMedia(data);
  } catch (e) {
    console.log(e, 'saveLinkedMedia errors');
    actions.alert.showError({
      message: e.response && e.response.errors && e.response.errors.length ? e.response.errors[0]['message'] : 'Error',
      title: 'Saving linkedMedia',
    });
  }
};

export const deleteLinkedMedia = async ({effects, actions}, data) => {
  try {
    return await effects.gql.mutations.deleteLinkedMedia(data);
  } catch (e) {
    console.log(e, 'deleteLinkedMedia errors');
    actions.alert.showError({
      message: e.response && e.response.errors && e.response.errors.length ? e.response.errors[0]['message'] : 'Error',
      title: 'Deleting linkedMedia',
    });
  }
};

/*
*
*/
export const onChangePage = async ({state}, page) => {
  state.linkedMedia.activePage = page;
};
