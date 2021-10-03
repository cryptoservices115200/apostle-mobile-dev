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
export const getMedias = async ({state, effects}, data) => {
  console.log('action getMediass...');
  try {
    let options = {};
    if (!data) {
      options = {
        first: state.media.mediaPerPage,
        skip: (state.media.activePage - 1) * state.media.mediaPerPage,
      };
    } else {
      if (data && data.all) {
        options = {};
      } else {
        options = data;
        if (!data.first) {
          options.first = state.media.mediaPerPage;
        }
        if (!data.skip) {
          options.skip = (state.media.activePage - 1) * state.media.mediaPerPage;
        }
      }
    }
    //
    const {medias} = await effects.gql.queries.medias(options);
    if (data && data.getValues) {
      return medias;
    } else {
      medias.map(m => m.isPlay = false);
      state.media.medias = medias;
    }
  } catch (e) {
    console.log(e, 'getmedias errors');
  }
};

/*
*
*/
export const saveMedia = async ({effects, actions}, data) => {
  try {
    return await effects.gql.mutations.saveMedia(data);
  } catch (e) {
    console.log(e, 'saveMedia errors');
    actions.alert.showError({
      message: e.response && e.response.errors && e.response.errors.length ? e.response.errors[0]['message'] : 'Error',
      title: 'Saving Media',
    });
  }
};

export const deleteMedia = async ({effects, actions}, data) => {
  try {
    return await effects.gql.mutations.deleteMedia(data);
  } catch (e) {
    console.log(e, 'deleteMedia errors');
    actions.alert.showError({
      message: e.response && e.response.errors && e.response.errors.length ? e.response.errors[0]['message'] : 'Error',
      title: 'Deleting Media',
    });
  }
};

/*
*
*/
export const onChangePage = async ({state}, page) => {
  state.media.activePage = page;
};

export const onPlay = ({state}, data) => {
  state.media.medias = data;
}
