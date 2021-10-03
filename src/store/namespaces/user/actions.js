import {keyBy, isEmpty} from 'lodash';
import {json} from "overmind";
/*
*
*/
export const getTotalUsers = async ({state, effects}) => {
  const {users} = await effects.gql.queries.users();
  state.user.totalRecords = users ? users.length : 0;
}

/*
*
*/
export const filterUsers = async ({state, effects}, filter) => {
  try {
    state.user.isLoading = true;
    const result = await effects.gql.queries.users({match: filter});
    // await actions.search.search({keywords: userSearchKeyword, userId: currentUser.id});

    console.log(result, 'result');

    state.user.isLoading = false;
    state.user.filteredUsers = result.users;

  } catch (e) {
    // actions.alert.showError('Failed to update user', Title);
  }
}

/*
*
*/
export const getUsers = async ({state, effects}, data) => {
  try {
    let options = {}
    if (isEmpty(data)) {
      options = {
        first: state.user.userPerPage,
        skip: (state.user.activePage - 1) * state.user.userPerPage
      }
    } else {
      options = data;
      if (!data.first) options.first = state.user.userPerPage;
      if (!data.skip) options.skip = (state.user.activePage - 1) * state.user.userPerPage;
    }

    console.log(options, 'getUsers options');

    const {users} = await effects.gql.queries.users(options)

    console.log(users, 'getUsers results');

    state.user.users = users;

  } catch (e) {
    console.log(e, 'getUsers errors');
  }
}

/*
*
*/
export const getUser = async ({state, effects}, options) => {
  try {
    console.log(options, 'getUser options');

    const {user} = await effects.gql.queries.user(options);

    console.log(user, 'getUser results');

    state.user.users[user.id] = user;
    return json(user);

  } catch (e) {
    console.log(e, 'getUser errors');
  }
}

/*
*
*/
export const saveUser = async ({effects, state}, variables) => {
  try {
    const {saveUser} = await effects.gql.mutations.saveUser(variables);
    if (saveUser?.id === state.currentUser?.id) {
      state.currentUser = saveUser
    }
    return saveUser
  } catch (e) {
    console.log(e);
  }
};
/*
*
*/
export const onChangePage = async ({state}, page) => {
  state.user.activePage = page
};

/*
*
*/
export const onUserAdded = ({state}, data) => {
  state.user.push(data)
};

/**
 * Use Add Payment Hook
 * @return {[type]} [description]
 */
/*
*
*/
export const requestSupport = async ({effects}, data) => {
  try {
    await effects.gql.mutations.requestSupport(data);
    return true;
  } catch (e) {
    console.log(e, 'requestSupport errors');
    return false;
  }
};

export const updateUserLocation = async ({effects, state}, data) => {
  try {
    await effects.gql.mutations.updateUserProfile({userId: state.currentUser.id, ...data});
  } catch (e) {
    console.log(e, 'updateUserProfile issues')
  }
};

export const findSocialUsers = async ({effects, state}) => {
  try {
    console.log(state.location.location);
    const byGPS = {
      gps: {
        lon: state.location.location?.lng | -118.4243946,
        lat: state.location.location?.lat | 34.1471148
      },
      radius: 1000
    };
    const {findSocialUsers} = await effects.gql.queries.findSocialUsers({userId: state.currentUser.id, byGPS});
    state.user.socialUsers = findSocialUsers?.items;
    console.log(state.user.socialUsers, '======> Social Users')
  } catch (e) {
    console.log(e, 'Find social Users issue');
  }
};

export const userAcceptedCampaigns = async ({state, effects}) => {
  try {
    const {userAcceptedCampaigns} = await effects.gql.queries.userAcceptedCampaigns({userId: state.currentUser.id})
    state.user.campaigns = userAcceptedCampaigns;
  } catch (e) {
    console.log(e)
  }
};

export const getWalletTransactions = async ({state, effects}) => {
  try {
    const {getWalletTransactions} = await effects.gql.queries.getWalletTransactions({userId: state.currentUser.id});
    state.user.transactions = getWalletTransactions;
  } catch (e) {
    console.log(e)
  }
};

export const getUserTabs = async ({state, effects}) => {
  try {
    const {getUserTabs} = await effects.gql.queries.getUserTabs({userId: state.currentUser.id});
    state.user.tabs = getUserTabs;
  } catch (e) {
    console.log(e)
  }
};

export const setSocialCb = ({state}, data) => {
  state.user.socialCb = data;
}

export const updateUserProfile = async ({state, effects,actions}, data) => {
  console.log({userId: state.currentUser.id, ...data})
  try {
    const {updateUser} = await effects.gql.mutations.updateUserProfile({userId: state.currentUser.id, ...data})
    state.currentUser = updateUser.user;
    console.log('CurrentUser =>', updateUser.user);
    return updateUser.user;
  } catch (e) {
    console.log(e);
    // actions.alert.showError({message: e.message, title: 'Error in UpdateUser'});
    return false;
  }
};

export const userRedeemedCampaigns = async ({state, effects}) => {
  try {
    const {userRedeemedCampaigns} = await effects.gql.queries.userRedeemedCampaigns({userId: state.currentUser.id});
    state.user.redeemedCampaigns = userRedeemedCampaigns;
    console.log('userRedeemedCampaigns =>', userRedeemedCampaigns);
    return userRedeemedCampaigns;
  } catch (e) {
    console.log(e)
    return false;
  }
};

export const getWalletBalance = async ({effects, state}) => {
  try {
    const {getWalletBalance} = await effects.gql.queries.getWalletBalance({userId: state.currentUser.id});
    console.log(getWalletBalance, 'getWalletBalance');
    state.currentUser.balance = getWalletBalance;
  } catch (e) {
    console.log(e);
  }
};

export const deactivateUser = async ({effects, state}) => {
  try {
    await effects.gql.mutations.deactivateUser({userId: state.currentUser.id})
  } catch (e) {
    console.log(e)
  }
}

export const validateGurrlCode = async ({effects}, data) => {
  try {
    const {validateGurrlCode} = await effects.gql.mutations.validateGurrlCode(data);
    return validateGurrlCode;
  } catch (e) {
    console.log(e)
  }
}

export const sendGurrls = async ({effects}, data) => {
  try {
    const {sendGurrls} = await effects.gql.mutations.sendGurrls(data);
    return sendGurrls;
  } catch (e) {
    console.log(e);
  }
}

export const doAccountsExist = async ({effects}, data) => {
  try {
    const {doAccountsExist} = await effects.gql.mutations.doAccountsExist(data);
    return doAccountsExist;
  } catch (e) {
    console.log(e)
  }
}

export const inviteContact = async ({effects,actions}, data) => {
  try {
    const {inviteContact} = await effects.gql.mutations.inviteContact(data);
    console.log(inviteContact);
    return inviteContact;
  } catch (e) {
    console.log(e)
    actions.alert.showError({ message: e.response.errors[0]['message'], title: 'Invite Contacts' });
  }
}

export const joinMailingList = async ({effects}, data) => {
  try {
    await effects.gql.mutations.joinMailingList(data)
  } catch (e) {
    console.log(e);
  }
};

export const deleteUserAddress = async ({state, effects}, data) => {
  try {
    const {deleteUserAddress} = await effects.gql.mutations.deleteUserAddress(data);
    console.log(deleteUserAddress);
    state.currentUser = deleteUserAddress;
    return deleteUserAddress;
  } catch (e) {
    console.log(e);
  }
};

export const getPlaceFromCoordinates = async ({state, effects}, data) => {
  try {
    const {getPlaceFromCoordinates} = await effects.gql.queries.getPlaceFromCoordinates(data);
    state.user.currentLocation = getPlaceFromCoordinates;
    return getPlaceFromCoordinates;
  } catch (e) {
    console.log(e);
  }
}

export const setSelectedItem = ({state}, data) => {
  state.user.selectedItem = data;
};

export const products = async ({effects}, data) => {
  try {
    return await effects.gql.queries.products(data)
  } catch (e) {
    console.log(e, 'products issue')
  }
}

export const setSignUpUser = ({ state }, data) => {
  state.user.signUpUser = data ? {...data} : null;
}

export const validateNewUserDetails = ({ state }) => {
  let errors = [];
  const user = { ...state.user.signUpUser };
  if (
    isEmpty(user.fullName) ||
    isEmpty(user.username) ||
    isEmpty(user.email) ||
    isEmpty(user.mobileNumber) ||
    isEmpty(user.password) ||
    isEmpty(user.confirmPassword)
  ) {
    errors.push({ message: "Please fill in required fields" });
  }
  if (user.confirmPassword !== user.password) {
    errors.push({
      message: "Password and Confirm Password fields should match"
    });
  }
  return errors;
};

export const signUp = async ({ effects, actions }, data) => {
  try {
    return await effects.gql.mutations.signup(data)
  } catch (e) {
    console.log(e, 'signup error');
    actions.alert.showError({ message: e.response.errors[0]['message'], title: 'Signup User' });
  }
}

export const becomeContentCreator = async ({effects, actions}, data) => {
  try {
    await effects.gql.mutations.becomeContentCreator(data);
    await actions.getCurrentUser();
  } catch (e) {
    console.log(e, 'become content creator error');
    actions.alert.showError({ message: e.response.errors[0]['message'], title: 'Become Content Creator' });
  }
}

export const setShowVideo = ({state}, isShow) => {
  console.log(isShow);
  state.user.isShowVideo = isShow;
}

export const convertUserToSubscriber = async ({state, effects,actions}, data) => {
  try {
    const {convertUserToSubscriber} = await effects.gql.mutations.convertUserToSubscriber({userId: state.currentUser.id, ...data});
    state.currentUser = convertUserToSubscriber;
    return convertUserToSubscriber;
  } catch (e) {
    actions.alert.showError({ message: e.response.errors[0]['message'], title: 'Convert user to subscriber' });
  }
}

export const tipContentCreator = async ({state, effects,actions}, data) => {
  try {
    const {tipContentCreator} = await effects.gql.mutations.tipContentCreator({userId: state.currentUser.id, ...data});
    state.currentUser = tipContentCreator;
    return tipContentCreator;
  } catch (e) {
    actions.alert.showError({ message: e.response.errors[0]['message'], title: 'tip content creator' });
  }
}


export const subscribeToContentCreator = async ({state, effects,actions}, data) => {
  try {
    const {subscribeToContentCreator} = await effects.gql.mutations.subscribeToContentCreator({userId: state.currentUser.id, ...data});
    state.currentUser = subscribeToContentCreator;
    return subscribeToContentCreator;
  } catch (e) {
    actions.alert.showError({ message: e.response.errors[0]['message'], title: 'tip content creator' });
  }
}

export const setNewUserPassword = async ({effects}, data) => {
  try {
    const {setNewUserPassword} = await effects.gql.mutations.setNewUserPassword(data);
    return setNewUserPassword;
  } catch (e) {
    console.log(e);
  }
}

export const triggerPasswordReset = async ({effects}, data) => {
  try {
    return await effects.gql.mutations.triggerPasswordReset(data);
  } catch (e) {
    console.log(e)
  }
}

export const passwordReset = async ({effects}, data) => {
  try {
    return await effects.gql.mutations.passwordReset(data);
  } catch (e) {
    console.log(e);
  }
}

export const getClearbitCompany = async ({effects, state}, data) => {
  try {
    const {getClearbitCompany} = await effects.gql.queries.getClearbitCompany(data);
    state.user.companyDetail = getClearbitCompany;
    return getClearbitCompany;
  } catch (e) {
    console.log(e);
  }
}

export const getClearbitPerson = async ({effects, state}, data) => {
  try {
    const {getClearbitPerson} = await effects.gql.queries.getClearbitPerson(data);
    state.user.userDetail = getClearbitPerson;
    return getClearbitPerson;
  } catch (e) {
    console.log(e);
  }
}

export const uploadFileToS3 = async ({effects, state}, data) => {
  try {
    return await effects.gql.mutations.uploadFileToS3(data);
  } catch (e) {
    console.log(e);
  }
}

export const getUserById = async ({state, effects}) => {
  try {
    const {getUserById} = await effects.gql.queries.getUserById({userId: state.currentUser?.id});
    state.currentUser = getUserById;
  } catch (e) {
    console.log(e);
  }
}
