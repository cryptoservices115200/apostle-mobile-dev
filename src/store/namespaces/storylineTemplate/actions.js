/*
*
*/
export const getTotalStorylineTemplates = async ({state, effects}, data) => {
  let options = {}
  if (data && data.options) options = data.options
  const {storylineTemplates} = await effects.gql.queries.storylineTemplates(options)

  state.storylineTemplate.totalRecords = storylineTemplates ? storylineTemplates.length : 0
}

/*
*
*/
export const getStorylineTemplates = async ({state, effects}, data) => {
  console.log('action getStorylineTemplates...')
  try {
    let options = {}
    if (!data) {
      options = {
        first: state.storylineTemplate.storylineTemplatePerPage,
        skip: (state.storylineTemplate.activePage - 1) * state.storylineTemplate.storylineTemplatePerPage
      }
    } else {
      if (data && data.all) options = {}
      else {
        options = data;
        if (!data.first) options.first = state.storylineTemplate.storylineTemplatePerPage;
        if (!data.skip) options.skip = (state.storylineTemplate.activePage - 1) * state.storylineTemplate.storylineTemplatePerPage;
      }
    }
    //
    const {storylineTemplates} = await effects.gql.queries.storylineTemplates(options)
    if (data && data.getValues) return storylineTemplates
    else state.storylineTemplate.storylineTemplates = storylineTemplates;
    console.log(storylineTemplates, 'storylineTemplates')
  } catch (e) {
    console.log(e, 'getStorylineTemplates errors');
  }
}

/*
*
*/
export const saveStorylineTemplate = async ({effects, actions}, data) => {
  try {
    return await effects.gql.mutations.saveStorylineTemplate(data)
  } catch (e) {
    console.log(e, 'saveStorylineTemplate errors')
    actions.alert.showError({
      message: e.response && e.response.errors && e.response.errors.length ? e.response.errors[0]['message'] : 'Error',
      title: 'Saving StorylineTemplate'
    });
  }
}

/*
*
*/
export const onChangePage = async ({state}, page) => {
  state.storylineTemplate.activePage = page
}