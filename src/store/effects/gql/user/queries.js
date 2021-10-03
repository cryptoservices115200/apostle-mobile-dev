import gql from 'graphql-tag';
import {userFragment} from './fragments';

export const users = gql`
  query users($where: UserWhereInput, $orderBy: UserOrderByInput, $skip: Int, $after: String, $before: String, $first: Int, $last: Int) {
    users(where: $where, orderBy: $orderBy, skip: $skip, after: $after, before: $before, first: $first, last: $last) ${userFragment}
  }
`;

export const user = gql`
  query user($where: UserWhereUniqueInput!) {
    user(where: $where) ${userFragment}
  }
`;

export const userRedeemedCampaigns = gql`
  query userRedeemedCampaigns($userId: String!) {
    userRedeemedCampaigns(userId: $userId) {
      id groupName allowedParticipants
    }
  }
`

export const findSocialUsers = gql`
  query findSocialUsers($byGPS:GPSQueryInput, $userId:String! $paging: PagingRequest){
    findSocialUsers(byGPS:$byGPS, userId:$userId, paging: $paging){
      totalCount,
      items{
        id
        firstName
        lastName
        avatar
        gender
        dateOfBirth
        settings {
          drinkOfChoice
          instagramUsername
        }
        metadata
        openedTab {
          id,
          isOpen
          perCost {
            itemCost
            tax
            tip
            serviceFee
            totalCostToSender
            dueToReceiver
          }
        }
      }
      nextToken
    }
  }
`

export const userAcceptedCampaigns = gql`
  query userAcceptedCampaigns($userId:String!) {
      userAcceptedCampaigns(userId:$userId) {
        id,
        name,
        redemptionCount,
        cost
        ads {
          images {
            iPhone,
            android
          },
          recipeUrl
        },
        survey {
          id
          questions {
            id
            question
          }
        }
      }
    }
`;

export const getWalletTransactions = gql`
  query getWalletTransactions(
    $userId:String!
  ) {
    getWalletTransactions(
      userId: $userId
    )
  }
`

export const getUserTabs = gql`
  query getUserTabs(
      $userId: String!
    ) {
      getUserTabs(
        userId: $userId
      )
    }
`

export const getUserById = gql`
  query getUserById($userId: String!) {
    getUserById(userId: $userId)${userFragment}
  }
`;

export const getPlaceFromCoordinates = gql`
  query getPlaceFromCoordinates($gps: GeoLocCreateInput!) {
    getPlaceFromCoordinates(gps: $gps)
  }
`;

export const getWalletBalance = gql`
  query getWalletBalance($userId: String! $date: DateTime) {
    getWalletBalance(userId: $userId date: $date)
  }
`;

export const products = gql`
  query products($where: ProductWhereInput $orderBy: ProductOrderByInput $skip: Int $after: String $before: String $first: Int $last: Int) {
    products(where: $where, orderBy: $orderBy, skip: $skip, after: $after, before: $before first: $first last: $last) {
      id
      name
      blurb
      images {id url}
      description
      isTaxable
      isAddOn
      isFree
      onSale
      tasks {
        id
        name
        sortOrder
        inventoryProduct {
          id
          ingredient {
            id
            name
            isHot
            isReheatable
          }
        }
      }
      site {
        id
        name
        taxRate
        address
        city
        state
        postalCode
        country
      }
      pricing {
        id
        type
        retailPrice
        salePrice
      }
    }
  }
`

export const getClearbitCompany = gql`
    query getClearbitCompany($domain: String) {
        getClearbitCompany(domain: $domain)
    }
`

export const getClearbitPerson = gql`
    query getClearbitPerson($email: String) {
        getClearbitPerson(email: $email)
    }
`
