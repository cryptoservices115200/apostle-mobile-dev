export const state = {
  users: [],
  title: '',
  isLoading: false,
  currentUserId: null,
  userPerPage: 100,
  totalRecords: 0,
  activePage: 1,
  filteredUsers: [],
  socialUsers: [],
  isVisibleIG: true,
  socialFilter: {},
  campaigns: [],
  transactions: [],
  redeemedCampaigns: [],
  tabs: [],
  currentLocation: null,
  selectedItem: {},
  signUpUser : null,
  isShowVideo: true,
  companyDetail: null,
  userDetail: null,
  userList: userNamespace =>
    Object.values(userNamespace.users)
      .sort((a, b) => {
        if (a.createdAt > b.createdAt) {
          return 1;
        } else if (a.createdAt < b.createdAt) {
          return -1;
        }
        return 0;
      })
      .slice(0, userNamespace.userPerPage)
}
