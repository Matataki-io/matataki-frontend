import Vue from 'vue'

import 'viewerjs/dist/viewer.css'
import viewer from 'v-viewer'

Vue.use(viewer, {
  defaultOptions: {
    navbar: false,
    title: false,
    toolbar: true,
    tooltip: false,
    movable: true,
    zoomable: true,
    rotatable: false,
    scalable: false,
    transition: true,
    fullscreen: true,
    keyboard: true
  }
})
