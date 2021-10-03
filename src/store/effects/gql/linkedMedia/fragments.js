import gql from 'graphql-tag';

export const linkedMediaFragment = gql`{
  id
  media { id user { id firstName lastName email avatar company{id username name}} source avatar name type likes{id user{id}} dislikes{id user{id}} isArchived}
  storyline { id name scenes{id name type{id name slug} description} }
  scenes { id name type{id name slug} description }
  tags { id type name description}
  taggedUsers { id firstName lastName avatar email}
  type
  approval
  visibility
  supportingLinkedMedias { id }
  deliverable { id }
  createdAt
  updatedAt
}`
