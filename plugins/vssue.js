import Vue from 'vue'

import Vssue from 'vssue'
import GithubV3 from '@vssue/api-github-v3'
import 'vssue/dist/vssue.css'

Vue.use(Vssue, {
  api: GithubV3,
  owner: process.env.VSSUE_OWNER,
  repo: process.env.VSSUE_REPO,
  clientId: process.env.VSSUE_CLIENT_ID,
  clientSecret: process.env.VSSUE_CLIENT_SECRET,
})