import gql from 'graphql-tag';

export const cartFragment = gql`{
  id subtotal tipPercentage tip tax total discount delivery shipping isPending createdAt updatedAt
  serviceFee wallet rebates dueNow
  user { id firstName lastName fullName avatar }
  event { id name days { id name startDate } }
  items { id name description priceEach quantity deliverBy rating isReviewed
    modifiers { id name sortOrder
      inventoryProduct { id
        ingredient { id name }
      }
    }
    deliverTo { id name address address2 state city postalCode country phones{id number} }
    product { id name description isAddOn
      pricing { id type retailPrice }
      tasks { id
        inventoryProduct { id
          ingredient { id name }
        }
      }
    }
  }  
}`
