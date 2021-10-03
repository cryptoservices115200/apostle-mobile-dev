/*
*
*/
export const getTotalCompanies = async ({state, effects}, data) => {
  let options = {}
  if (data && data.options) options = data.options
  const {companies} = await effects.gql.queries.companies(options)

  state.company.totalRecords = companies ? companies.length : 0
}

/*
*
*/
export const getCompanies = async ({state, effects}, data) => {
  console.log('action getCompanies...')
  try {
    let options = {}
    if (!data) {
      options = {
        first: state.company.companyPerPage,
        skip: (state.company.activePage - 1) * state.company.companyPerPage
      }
    } else {
      if (data && data.all) options = {}
      else {
        options = data;
        if (!data.first) options.first = state.company.companyPerPage;
        if (!data.skip) options.skip = (state.company.activePage - 1) * state.company.companyPerPage;
      }
    }
    //
    const {companies} = await effects.gql.queries.companies(options)
    if (data && data.getValues) return companies
    else state.company.companies = companies
  } catch (e) {
    console.log(e, 'getCompanies errors');
  }
}

/*
*
*/
export const saveCompany = async ({effects, actions}, data) => {
  try {
    return await effects.gql.mutations.saveCompany(data)
  } catch (e) {
    console.log(e, 'saveCompany errors')
    actions.alert.showError({
      message: e.response && e.response.errors && e.response.errors.length ? e.response.errors[0]['message'] : 'Error',
      title: 'Saving Company'
    });
  }
}

/*
*
*/
export const onChangePage = async ({state}, page) => {
  state.company.activePage = page
}