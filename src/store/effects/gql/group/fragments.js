import gql from 'graphql-tag';

export const groupFragment = gql`{
  id
  name
	description
	type
	createdAt
	permissions {
		id
		type
		name
		description
		createdAt
		updatedAt
	}
	company{
	  id
	  username
	  name
	  employees{id}
	  storylines{id}
	  deliverables{id}
	}
	groups {
		id
		name
		description
		permissions {
			id
			type
			name
			description
			createdAt
			updatedAt
		}
		groups {
			id
			name
			description
			createdAt
			updatedAt
		}
		createdAt
		updatedAt
	}
}`
