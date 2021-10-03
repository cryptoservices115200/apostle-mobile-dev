import { graphql } from 'overmind-graphql';

import * as cartMutations from './cart/mutations'
import * as cartQueries from './cart/queries'
import * as cartSubscriptions from './cart/subscriptions'

import * as productMutations from './product/mutations'
import * as productQueries from './product/queries'
import * as productSubscriptions from './product/subscriptions'

import * as orderMutations from './order/mutations'
import * as orderQueries from './order/queries'
import * as orderSubscriptions from './order/subscriptions'

import * as userMutations from './user/mutations'
import * as userQueries from './user/queries'
import * as userSubscriptions from './user/subscriptions'

import * as loginTokenMutations from './loginToken/mutations'
import * as loginTokenQueries from './loginToken/queries'
import * as loginTokenSubscriptions from './loginToken/subscriptions'

import * as websiteMutations from './website/mutations'
import * as websiteQueries from './website/queries'
import * as websiteSubscriptions from './website/subscriptions'

import * as googleQueries from './google/queries'

import * as groupQueries from './group/queries';
import * as groupMutations from './group/mutations';

import * as storylineQueries from './storyline/queries';
import * as storylineMutations from './storyline/mutations';

import * as mediaQueries from './media/queries';
import * as mediaMutations from './media/mutations';

import * as storylineTemplateQueries from './storylineTemplate/queries'
import * as storylineTemplateMutations from './storylineTemplate/mutations'

import * as deliverableQueries from './deliverable/queries'
import * as deliverableMutations from './deliverable/mutations'

import * as companyQueries from './company/queries'
import * as companyMutations from './company/mutations'

import * as sceneQueries from './scene/queries'
import * as sceneMutations from './scene/mutations'

import * as notificationQueries from './notification/queries'
import * as notificationMutations from './notification/mutations'

import * as linkedMediaQueries from './linkedMedia/queries'
import * as linkedMediaMutations from './linkedMedia/mutations'

import * as deliverableTemplateQueries from './deliverableTemplate/queries'
import * as deliverableTemplateMutations from './deliverableTemplate/mutations'

export default graphql({
  subscriptions: {
    ...userSubscriptions,
  },
  queries: {
    ...cartQueries,
    ...orderQueries,
    ...userQueries,
    ...loginTokenQueries,
    ...websiteQueries,
    ...googleQueries,
    ...groupQueries,
    ...storylineQueries,
    ...mediaQueries,
    ...storylineTemplateQueries,
    ...deliverableQueries,
    ...companyQueries,
    ...sceneQueries,
    ...notificationQueries,
    ...linkedMediaQueries,
    ...deliverableTemplateQueries
  },
  mutations: {
    ...cartMutations,
    ...productMutations,
    ...orderMutations,
    ...userMutations,
    ...loginTokenMutations,
    ...websiteMutations,
    ...groupMutations,
    ...storylineMutations,
    ...mediaMutations,
    ...storylineTemplateMutations,
    ...deliverableMutations,
    ...companyMutations,
    ...sceneMutations,
    ...notificationMutations,
    ...linkedMediaMutations,
    ...deliverableTemplateMutations
  }
})
