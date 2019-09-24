import Vue from 'vue'
// import VueI18n from 'vue-i18n'
// Vue.use(VueI18n)

import Vssue from 'vssue'
import GithubV3 from '@vssue/api-github-v3'
import 'vssue/dist/vssue.css'

Vue.use(Vssue, {
  api: GithubV3,
  owner: 'haimkastner',
  repo: 'castnet-blog',
  clientId: '1becebae4d8c335b6599',
  clientSecret: '69d98e52bf12e320814035dc9df9421135140182',
})