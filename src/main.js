import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./style.css";
import VueGoogleMaps from "@fawmi/vue-google-maps";

const app = createApp(App);
app.use(VueGoogleMaps, {
  installComponents: true,
  load: {
    key: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries: ["places", "routes"],
  },
});
app.use(router);
app.mount("#app");
