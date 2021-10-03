import { merge, namespaced } from 'overmind/config';
import { createHook } from 'overmind-react';

import { onInitialize } from './onInitialize'
import { state } from './state'
import * as effects from './effects';
import * as actions from './actions';

// common
import * as alert from '@/store/namespaces/alert';
import * as hud from '@/store/namespaces/hud';
import * as window from '@/store/namespaces/window';

// custom
import * as cart from './namespaces/cart'
import * as google from './namespaces/google'
import * as product from './namespaces/product'
import * as order from './namespaces/order'
import * as user from './namespaces/user'
import * as group from './namespaces/group'
import * as storyline from './namespaces/storyline'
import * as media from './namespaces/media'
import * as linkedMedia from './namespaces/linkedMedia'
import * as storylineTemplate from './namespaces/storylineTemplate'
import * as deliverable from './namespaces/deliverable'
import * as company from './namespaces/company'
import * as scene from './namespaces/scene'
import * as notification from './namespaces/notifications'
import * as deliverableTemplate from './namespaces/deliverableTemplate'

export const config = merge(
  {
    onInitialize,
    state,
    effects,
    actions
  },
  namespaced({
    alert,
    hud,
    window,
    google,
    cart,
    product,
    order,
    user,
    group,
    storyline,
    media,
    linkedMedia,
    storylineTemplate,
    deliverable,
    company,
    scene,
    notification,
    deliverableTemplate
  })
)

export const useOvermind = createHook();
