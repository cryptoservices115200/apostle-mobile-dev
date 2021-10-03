import gql from 'graphql-tag';
import {storylineFragment} from "../storyline/fragments";
import {groupFragment} from '@/store/effects/gql/group/fragments';

export const PaymentMethod = `
{
  id type expirationDate cardType last4 isValid isDefault createdAt methodType isValid
  vendors { name token callbackUrl redirectUrl isValid checkoutUrl }
}
`;

export const companyFragment = `
{
   id name username slug entityType url
   owner {id username fullName email paymentMethods${PaymentMethod} groups{id name type}}
   employees {
     id user{
        id
        email
        firstName 
        lastName 
        fullName 
        avatar
        groups{id} 
        favoriteMedias{id name type} 
        storylines{id} 
        nominations{id}
        userGroups{
          id
          group{id name type}
          subgroups{id group{id name}}
          createdAt
          updatedAt
        }
     }
     title {id name}
     startDate
   }
   locations {
          id name nameLower
          products {
            id name nameLower
          }
        }
   groups {id name type groups{id name} company{id username name} createdAt}
   addresses {id name type address address2 city state postalCode country websites {id url name description}}
   storylines {id name dueDate progress status}
   media {id name type description avatar source gallery {id name type avatar}}
   transactions {
    id paymentMethodToken amountPaid transactionId walletAmount response status note type createdAt
    storylines{id name status}
   }
}
`

/*
 *
 */
export const userFragment = gql`{
  id
   balance
   bio
   appVersion
   needToUpgrade
   timezoneOffset
   chatId
   playerId
   gender
   timezone
   firstName
   firstNameLower
   middleName
   middleNameLower
   lastName
   lastNameLower
   fullName
   fullNameLower
   dateOfBirth
   email
   avatar
   braintreeCustomerId
   createdAt
   updatedAt
   site { id name address address2 city state postalCode country phones{id number} googlePlacesId gps{lat lon} }
   sites { id name address address2 city state postalCode country phones{id number} googlePlacesId gps{lat lon}}
   favoriteUsers{
    id fullName email gender
   }
   favoriteMedias {
    id name type
   }
   paymentMethods${PaymentMethod}
   company${companyFragment}
   companies{
    id
    company${companyFragment}
    groups{
      id
      group${groupFragment}
      subgroups{id}
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
   }
   userGroups{
    id
    group${groupFragment}
    subgroups{id}
    createdAt
    updatedAt
   }
   groups { id name groups {id name} type company{id username name} }
   orders { id }
 }`;

/*
 *
 */


export const AuthPayLoad = gql`
{
  user${userFragment}
  verificationCode
}
`;
