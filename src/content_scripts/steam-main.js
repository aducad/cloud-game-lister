import { injectStyleFile } from '../common/utility'
import {
  tabHandler,
  carouselHandler,
  observeCarouselHandler
} from '../common/steam-page'

console.log(`%cSteam Extensions - Cloud Game Lister...`, 'color:#20aae8')

const modules = [
  {
    // main slider
    module: '#home_maincap_v7',
    itemSelector: '.store_main_capsule'
  },
  {
    // spotlight carousel handler
    module: '#spotlight_carousel',
    itemSelector: '.home_area_spotlight|.store_capsule'
  },
  {
    // community recommendations
    module: '#module_community_recommendations',
    itemSelector: '.community_recommendation_capsule'
  },
  {
    // deep dive
    module: '#module_deep_dive'
  },
  {
    // module recommender
    module: '#module_recommender'
  },
  {
    // recommended creators
    module: '.recommended_creators_ctn'
  },
  {
    // specials under 10
    module: '.specials_under10'
  },
  {
    // marketing message area
    module: '.home_ctn.marketingmessage_area',
    carouselItems: '.marketingmessage_container',
    itemSelector: '.home_marketing_message'
  }
]

const observableModules = [
  {
    // recently updated
    settings: { module: '.recently_updated_block' },
    rootSelector: '.recently_updated_block .carousel_items'
  },
  {
    // feature curators
    settings: { module: '#feature_curators_block_0' },
    rootSelector: '#steam_curators_not_empty'
  },
  {
    // friends recently purchased
    settings: { module: '.friends_recently_purchased' },
    rootSelector: '.friends_recently_purchased .carousel_items'
  }
]

const init = async () => {
  // inject style file
  injectStyleFile('./assets/styles/steam-main.css')

  // spotlightCarouselHandler()

  // observable modules
  for (let i = 0; i < observableModules.length; i++) {
    const { rootSelector, settings } = observableModules[i]
    observeCarouselHandler(rootSelector, () => {
      carouselHandler(settings)
    })
  }

  // carousel modules
  for (let i = 0; i < modules.length; i++) {
    const module = modules[i]
    carouselHandler(module)
  }

  // tabs handler
  tabHandler('.home_tabs_content', '.tab_item')
}

init()
