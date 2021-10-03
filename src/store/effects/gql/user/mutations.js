import gql from 'graphql-tag';
import {userFragment, AuthPayLoad, companyFragment} from './fragments';

/*
*
*/
export const saveUser = gql`
  mutation saveUser($data: UserUpdateInput!, $where: UserWhereUniqueInput) {
    saveUser(data: $data, where: $where) ${userFragment}
  }
`;

/*
*
*/
export const deleteUser = gql`
  mutation deleteUser($where: UserWhereUniqueInput) {
    deleteUser(where: $where) ${userFragment}
  }
`;

/*
*
*/
export const createAppUser = gql`
    mutation createAppUser(
    $generateToken: Boolean,
    $mobileNumber: String
    $email: String
    $password: String
    $gps: GeoLocCreateInput
    $disableSendingSmsCode: Boolean
  ) {
    createAppUser(
      generateToken: $generateToken,
      mobileNumber: $mobileNumber
      email: $email
      password: $password
      gps: $gps
      disableSendingSmsCode: $disableSendingSmsCode
    ) ${AuthPayLoad}
  }
`;

/*
*
*/
export const verifySmsCode = gql`
  mutation verifySmsCode($userId: String! $verifyCode: String! $mobileNumber: String! $device: Json) {
    verifySmsCode(userId: $userId verifyCode: $verifyCode mobileNumber: $mobileNumber device: $device) {
      user {
        id
      }
      token
    }
  }
`;

/*
*
*/
export const login = gql`
  mutation login($email:String! $password:String!) {
    login(email:$email password:$password) {
      token
      user ${userFragment}
    }
  }
`;

/*
*
*/
export const loginWithToken = gql`
  mutation loginWithToken($token:String! $userId:String! $appVersion:String) {
    loginWithToken(token:$token userId:$userId appVersion:$appVersion) {
      user ${userFragment}
    }
  }
`;

/*
*
*/
export const triggerPasswordReset = gql`
  mutation triggerPasswordReset($email:String! $domain:String!) {
    triggerPasswordReset(email:$email domain:$domain)
  }
`;

/*
*
*/
export const passwordReset = gql`
  mutation passwordReset($email:String! $resetToken:String $password:String!) {
    passwordReset(email:$email resetToken:$resetToken password:$password)
  }
`;

/*
*
*/
export const requestSupport = gql`
  mutation requestSupport($userId: String $subject: String! $message: String! $email: String $phone: String) {
    requestSupport(userId: $userId subject: $subject message: $message email: $email phone: $phone)
  }
`;

export const updateUserProfile = gql `
  mutation updateUser(
    $userId: String!,
    $email: String,
    $avatar: String,
    $firstName: String,
    $middleName: String,
    $lastName: String,
    $gender: String,
    $dateOfBirth: DateTime,
    $paymentMethod: PaymentMethodInput,
    $removePaymentMethods: [String],
    $setDefaultPaymentMethodId: String,
    $removeEmails: [String],
    $removePhones: [String],
    $createCompanies: [CompanyCreateInput!],
    $connectCompanies: [CompanyWhereUniqueInput!],
    $createAddresses: [SiteCreateInput!],
    $connectAddresses: [SiteWhereUniqueInput!],
    $settings: UserSettingCreateInput
    $defaultPaymentType: String
    $googlePlacesId: String
    $gps: GeoLocCreateInput
    $address2: String
    $addressNumber: String
    $addressName: String
    $siteId: String
  ) {
    updateUser(
      userId: $userId,
      email: $email,
      avatar: $avatar,
      firstName: $firstName,
      middleName: $middleName,
      lastName: $lastName,
      gender: $gender,
      dateOfBirth: $dateOfBirth,
      paymentMethod: $paymentMethod,
      removePaymentMethods: $removePaymentMethods,
      setDefaultPaymentMethodId: $setDefaultPaymentMethodId,
      removeEmails: $removeEmails,
      removePhones: $removePhones,
      createCompanies: $createCompanies,
      connectCompanies: $connectCompanies,
      createAddresses: $createAddresses,
      connectAddresses: $connectAddresses,
      settings: $settings
      defaultPaymentType: $defaultPaymentType
      googlePlacesId: $googlePlacesId
      gps: $gps
      address2: $address2
      addressNumber: $addressNumber
      addressName: $addressName
      siteId: $siteId
    ) {
      user${userFragment}
    }
  }
`;

export const deleteUserAddress = gql`
  mutation deleteUserAddress($siteId: String! $userId: String!){
    deleteUserAddress(siteId: $siteId, userId: $userId)${userFragment}
  }
`

export const deactivateUser = gql`
 mutation deactivateUser(
    $userId: String!
  ) {
    deactivateUser(
      userId: $userId
    )
  }
  `

export const validateGurrlCode = gql`
  mutation validateGurrlCode(
    $promoCode: String!,
    $userId: String!,
    $image: String,
    $locationPlaceId: String
  ) {
    validateGurrlCode(
      promoCode: $promoCode,
      userId: $userId,
      image: $image,
      locationPlaceId: $locationPlaceId
    )
  }
  `

export const sendGurrls = gql`
  mutation sendGurrls(
    $fromUserId: String!
    $toGurrls: [ToGurrl!]
    $useWallet: Boolean
  ) {
    sendGurrls(
      toGurrls: $toGurrls,
      fromUserId: $fromUserId,
      useWallet: $useWallet
    )
  }
`

export const doAccountsExist = gql`
   mutation doAccountsExist(
    $mobileNumbers: [String]
  ) {
    doAccountsExist(
      mobileNumbers: $mobileNumbers
    ) {
      id avatar username phones{ number verified} status
    }
  }
`

export const inviteContact = gql`
  mutation inviteContact(
     $contacts: [InviteContactCreateInput!]
     $userId: String!
  ) {
    inviteContact(
      contacts: $contacts
      userId: $userId
    )
  }
  `

export const joinMailingList = gql`
  mutation joinMailingList($email: String!) {
    joinMailingList(email: $email)
  }
`

export const signup = gql`
mutation signup($email: String! $username: String! $password: String! $fullName: String! $mobileNumber: String!) {
  signup(email: $email username:$username password: $password fullName: $fullName mobileNumber: $mobileNumber) {
    user ${userFragment}
    token
    verificationCode
  }
}
`

export const becomeContentCreator = gql`
  mutation becomeContentCreator($userId: String! $paymentData: Json $membershipLevel: String){
    becomeContentCreator(userId: $userId paymentData: $paymentData membershipLevel: $membershipLevel)${companyFragment}
  }
`


export const convertUserToSubscriber = gql`
  mutation convertUserToSubscriber($userId: String! $plan: String!, $paymentMethodId: String!){
    convertUserToSubscriber(userId: $userId, plan: $plan, paymentMethodId: $paymentMethodId)${userFragment}
  }
`


export const tipContentCreator = gql`
  mutation tipContentCreator($userId: String! $contentCreatorId: String!, $amount: Float!){
    tipContentCreator(userId: $userId, contentCreatorId: $contentCreatorId, amount: $amount)${userFragment}
  }
`


export const subscribeToContentCreator = gql`
  mutation subscribeToContentCreator($userId: String! $contentCreatorId: String!, $productId: String!){
    subscribeToContentCreator(userId: $userId, contentCreatorId: $contentCreatorId, productId: $productId)${userFragment}
  }
`

export const setNewUserPassword = gql`
  mutation setNewUserPassword($newPass: String! $userId: String! $token: String!){
    setNewUserPassword(newPass: $newPass userId: $userId  token: $token)
  }
`

export const uploadFileToS3 = gql`
  mutation uploadFileToS3($image: String! $path: String $stream: Boolean) {
    uploadFileToS3(image: $image path: $path stream: $stream)
  }
`
