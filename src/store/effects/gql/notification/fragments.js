import gql from 'graphql-tag';

export const notificationFragment = gql`{
  id
	type
	title
	description
	sentence
	user{id firstName lastName avatar email}
	contentUser{id firstName lastName avatar email}
	secondaryUser{id firstName lastName avatar email}
	order{id name}
	product {id name posItemId site{id}}
	site{id}
	wallet{id}
	event{id name}
	article{id name nameLower}
	comment{id user{id firstName lastName avatar email} message subject}
	groups{id name type}
	likeCount
	images{id url width height source}
	toAll
	rating
	read
	createdAt 
}`
