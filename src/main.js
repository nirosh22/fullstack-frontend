import { createApp } from 'vue'
import App from './App.vue'

// Font Awesome imports
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faFutbol,               // ⚽ Football
  faBasketballBall,       // 🏀 Basketball
  faTableTennisPaddleBall, // 🏓 Tennis, Badminton
  faPersonSwimming,       // 🏊 Swimming
  faDumbbell,             // 💪 Martial Arts
  faBaseballBatBall,      // ⚾ Cricket
  faRunning,              // 🏃 Athletics
  faVolleyballBall        // 🏐 Volleyball
} from '@fortawesome/free-solid-svg-icons'

// Add all icons to library
library.add(
  faFutbol,
  faBasketballBall,
  faTableTennisPaddleBall,
  faPersonSwimming,
  faDumbbell,
  faBaseballBatBall,
  faRunning,
  faVolleyballBall
)

// Create Vue app and register Font Awesome
const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')




