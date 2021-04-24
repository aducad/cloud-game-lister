import Vue from 'vue'

import 'bootstrap-dark-4/dist/bootstrap-dark.css'
import '../assets/styles/custom-bootstrap.css'
import lang from '../_locales/options.json'

import App from './App.vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)
const selectedLang = localStorage.getItem('cloud_game_lister_lang')
const i18n = new VueI18n({
  locale: selectedLang ? selectedLang : 'en',
  messages: lang
})

// eslint-disable-next-line
new Vue({
  el: '#app',
  i18n,
  render: (h) => h(App)
})
