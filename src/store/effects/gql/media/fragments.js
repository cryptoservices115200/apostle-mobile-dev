import gql from 'graphql-tag';

export const mediaFragment = gql`{
  id
	name
	type
	avatar
	caption
	source
	user {id firstName lastName fullName email avatar}
	taggedUsers {id firstName lastName fullName email avatar}
	likes {id user{id} createdAt}
	dislikes {id user{id} createdAt}
	metadata 
	isArchived
	approval
	visibility
	tags{id name type}
	createdAt 
}`
