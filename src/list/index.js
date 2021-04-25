import Vue from 'vue'

import { getLocale } from '../common/extension'
import { LANGUAGES } from '../common/config'

import 'bootstrap-dark-4/dist/bootstrap-dark.css'
import '../assets/styles/custom-bootstrap.css'

import lang from '../_locales/list.json'

import App from './App.vue'
import VueI18n from 'vue-i18n'

const locale = getLocale(
  localStorage.getItem('cloud_game_lister_lang'),
  'en',
  LANGUAGES.map((lang) => lang.key)
)

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale,
  messages: lang
})

// eslint-disable-next-line
new Vue({
  el: '#app',
  i18n,
  render: (h) => h(App)
})
