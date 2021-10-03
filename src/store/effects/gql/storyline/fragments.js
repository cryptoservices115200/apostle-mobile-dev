import gql from 'graphql-tag';
import {mediaFragment} from '@/store/effects/gql/media/fragments';
import {linkedMediaFragment} from '@/store/effects/gql/linkedMedia/fragments';
import {companyFragment} from '@/store/effects/gql/user/fragments';

export const storylineFragment = gql`{
  id
	name
	group {id name}
	status
	publicUrl{url name description}
	dueDate
	scenes {id name isRequired type{id name slug} medias${mediaFragment} linkedMedias${linkedMediaFragment} quantity template {id name type {id slug name} description example${mediaFragment}} description publicUrl{url name description}}
	medias${mediaFragment}
	linkedMedias${linkedMediaFragment}
	companies{id username name}
	users {id playerId username email emails {id address verified type} phones {id number verified type} fullName avatar firstName lastName groups{id} favoriteMedias{id} storylines{id}}
	deliverables {id name description quantity duration type{id name height width}}
	progress
	createdAt
}`
