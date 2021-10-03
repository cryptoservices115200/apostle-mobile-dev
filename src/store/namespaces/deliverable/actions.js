/*
*
*/
export const getTotalDeliverables = async ({state, effects}, data) => {
  let options = {}
  if (data && data.options) options = data.options
  const {deliverables} = await effects.gql.queries.deliverables(options)

  state.deliverable.totalRecords = deliverables ? deliverables.length : 0
}

export const getDeliverableTypes = async ({state, effects}) => {
  try {
    const {deliverableTypes} = await effects.gql.queries.deliverableTypes()
    console.log(deliverableTypes, 'deliverableTypes')
    state.deliverable.deliverableTypes = deliverableTypes
  } catch (e) {
    console.log(e)
  }
}

/*
*
*/
export const getDeliverables = async ({state, effects}, data) => {
  console.log('action getDeliverables...')
  try {
    let options = {}
    if (!data) {
      options = {
        first: state.deliverable.deliverablePerPage,
        skip: (state.deliverable.activePage - 1) * state.deliverable.deliverablePerPage
      }
    } else {
      if (data && data.all) options = {}
      else {
        options = data;
        if (!data.first) options.first = state.deliverable.deliverablePerPage;
        if (!data.skip) options.skip = (state.deliverable.activePage - 1) * state.deliverable.deliverablePerPage;
      }
    }
    //
    const {deliverables} = await effects.gql.queries.deliverables(options)
    if (data && data.getValues) return deliverables
    else state.deliverable.deliverables = deliverables
  } catch (e) {
    console.log(e, 'getDeliverables errors');
  }
}

/*
*
*/
export const saveDeliverable = async ({effects, actions}, data) => {
  try {
    return await effects.gql.mutations.saveDeliverable(data)
  } catch (e) {
    console.log(e, 'saveDeliverable errors')
    actions.alert.showError({
      message: e.response && e.response.errors && e.response.errors.length ? e.response.errors[0]['message'] : 'Error',
      title: 'Saving Deliverable'
    });
  }
}

/*
*
*/
export const onChangePage = async ({state}, page) => {
  state.deliverable.activePage = page
}