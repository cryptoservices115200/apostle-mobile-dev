/*
*
*/
export const getTotalDeliverableTemplates = async ({state, effects}, data) => {
  let options = {}
  if (data && data.options) options = data.options
  const {deliverableTemplates} = await effects.gql.queries.deliverableTemplates(options)

  state.deliverableTemplate.totalRecords = deliverableTemplates ? deliverableTemplates.length : 0
}

/*
*
*/
export const getDeliverableTemplates = async ({state, effects}, data) => {
  console.log('action getDeliverableTemplates...')
  try {
    let options = {}
    if (!data) {
      options = {
        first: state.deliverableTemplate.deliverableTemplatePerPage,
        skip: (state.deliverableTemplate.activePage - 1) * state.deliverableTemplate.deliverableTemplatePerPage
      }
    } else {
      if (data && data.all) options = {}
      else {
        options = data;
        if (!data.first) options.first = state.deliverableTemplate.deliverableTemplatePerPage;
        if (!data.skip) options.skip = (state.deliverableTemplate.activePage - 1) * state.deliverableTemplate.deliverableTemplatePerPage;
      }
    }
    //
    const {deliverableTemplates} = await effects.gql.queries.deliverableTemplates(options)
    if (data && data.getValues) return deliverableTemplates
    else state.deliverableTemplate.deliverableTemplates = deliverableTemplates;
    console.log(deliverableTemplates, 'deliverableTemplates')
  } catch (e) {
    console.log(e, 'getDeliverableTemplates errors');
  }
}

/*
*
*/
export const saveDeliverableTemplate = async ({effects, actions}, data) => {
  try {
    return await effects.gql.mutations.saveDeliverableTemplate(data)
  } catch (e) {
    console.log(e, 'saveDeliverableTemplate errors')
    actions.alert.showError({
      message: e.response && e.response.errors && e.response.errors.length ? e.response.errors[0]['message'] : 'Error',
      title: 'saveDeliverableTemplate'
    });
  }
}

/*
*
*/
export const onChangePage = async ({state}, page) => {
  state.deliverableTemplate.activePage = page
}