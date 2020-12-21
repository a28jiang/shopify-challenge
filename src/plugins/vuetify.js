import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

const vuetify = new Vuetify({
  theme: {
    options: { customProperties: true },
    themes: {
      light: {
        primary: "#3f3f3f",
        secondary: "#2C2C2C",

        info: "#6C86A1",
        success: "#76d59a",
      },
    },
  },
});
export default vuetify;
