import Vue from 'vue'
import noContentPrompt from '@/components/no_content_prompt/index.vue'
import header from '~/components/header/index.vue'

// common/components
import ipfs from '@/common/components/ipfs/index'
import dialog from '@/common/components/dialog/index'
import avatar from '@/common/components/avatar'
import avatarUserPopover from '@/common/components/avatar_user_popover'


Vue.component('g-header', header)
Vue.component('no-content-prompt', noContentPrompt)

// common/components
Vue.component('m-ipfs', ipfs) // ipfs
Vue.component('m-dialog', dialog) // dialog
Vue.component('c-avatar', avatar) // avatar
Vue.component('c-avatar-user-popover', avatarUserPopover) // avatar user popover