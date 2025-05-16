import { createApp } from 'vue'
import App from './App.vue'
import vuetify from "./plugins/vuetify.ts"

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowLeft, faGear } from '@fortawesome/free-solid-svg-icons'
import './style.css';

library.add(faGear); // add only the gear symbol to the icon library
library.add(faArrowLeft)

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)

app.use(vuetify);


app.mount('#app');

