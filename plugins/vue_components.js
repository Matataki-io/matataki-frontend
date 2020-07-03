import Vue from 'vue'
import noContentPrompt from '@/components/no_content_prompt/index.vue'
import header from '~/components/header/index.vue'

// common/components
import ipfs from '@/common/components/ipfs/index'
import dialog from '@/common/components/dialog/index'
import avatar from '@/common/components/avatar'
import userPopover from '@/common/components/user_popover'
import tokenPopover from '@/common/components/token_popover'


Vue.component('g-header', header)
Vue.component('no-content-prompt', noContentPrompt)

// common/components
Vue.component('m-ipfs', ipfs) // ipfs
Vue.component('m-dialog', dialog) // dialog
Vue.component('c-avatar', avatar) // avatar
Vue.component('c-user-popover', userPopover) // user popover
Vue.component('c-token-popover', tokenPopover) // token popover