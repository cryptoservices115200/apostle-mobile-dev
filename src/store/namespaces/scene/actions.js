/*
*
*/
export const getTotalScenes = async ({state, effects}, data) => {
  let options = {}
  if (data && data.options) options = data.options
  const {scenes} = await effects.gql.queries.scenes(options)

  state.scene.totalRecords = scenes ? scenes.length : 0
}

export const getSceneTypes = async ({state, effects}) => {
  const {sceneTypes} = await effects.gql.queries.sceneTypes()
  console.log(sceneTypes, 'sceneTypes')
  state.scene.sceneTypes = sceneTypes;
}

/*
*
*/
export const getScenes = async ({state, effects}, data) => {
  console.log('action getScenes...')
  try {
    let options = {}
    if (!data) {
      options = {
        first: state.scene.scenePerPage,
        skip: (state.scene.activePage - 1) * state.scene.scenePerPage
      }
    } else {
      if (data && data.all) options = {}
      else {
        options = data;
        if (!data.first) options.first = state.scene.scenePerPage;
        if (!data.skip) options.skip = (state.scene.activePage - 1) * state.scene.scenePerPage;
      }
    }
    //
    const {scenes} = await effects.gql.queries.scenes(options)
    if (data && data.getValues) return scenes
    else {
      scenes.map(s => {
        if (s.linkedMedias[0]) {
          s.linkedMedias[0].isPlay = false;
        }
      })
      console.log(scenes, 'scenes')
      state.scene.scenes = scenes
    }
  } catch (e) {
    console.log(e, 'getScenes errors');
  }
}

/*
*
*/
export const saveScene = async ({effects, actions}, data) => {
  try {
    return await effects.gql.mutations.saveScene(data)
  } catch (e) {
    console.log(e, 'saveScene errors')
    actions.alert.showError({
      message: e.response && e.response.errors && e.response.errors.length ? e.response.errors[0]['message'] : 'Error',
      title: 'Saving Scene'
    });
  }
}

/*
*
*/
export const onChangePage = async ({state}, page) => {
  state.scene.activePage = page
}

export const onPlay = ({state}, data) => {
  state.scene.scenes = data;
}