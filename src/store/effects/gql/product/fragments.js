import gql from 'graphql-tag';

export const productFragment = gql`{
  id
  name
  description
  isActive
  pricing { id type retailPrice }
  images { id url source }
  tasks {
    id
    sortOrder
    name
    description
    type
    inventoryProduct {
      id
      ingredient {
        id
        name
      }
      minimumOrderSize
      minimumOrderUnit
    }
    size
    unit
  }
}`
