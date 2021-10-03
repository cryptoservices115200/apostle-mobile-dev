import gql from 'graphql-tag';

export const searchGooglePlaces = gql`
  query searchGooglePlaces($keyword: String!) {
    searchGooglePlaces(keyword: $keyword)
  }
`;