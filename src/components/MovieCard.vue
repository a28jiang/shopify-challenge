<template>
  <v-col cols="12" class="pr-0">
    <v-card class="cardStyle">
      <v-row>
        <v-img
          v-if="$vuetify.breakpoint.smAndUp"
          class="imageStyle"
          @click="$router.push(name)"
          transition="fade"
          max-width="75"
          :src="Poster"
        />

        <v-col pl-0>
          <v-card-title class="pb-0">{{ Title }} </v-card-title>
          <v-card-text class="pt-0">{{
            `${Year} ${capitalizeFirst(Type)}`
          }}</v-card-text>
        </v-col>
        <v-col :style="{ maxWidth: '48px' }" class="right pr-8">
          <v-icon class="clickable" @click="deleteSelf">mdi-delete </v-icon>
        </v-col>
      </v-row>
    </v-card>
  </v-col>
</template>

<script>
export default {
  name: "MovieCard",
  props: {
    Title: String,
    imdbID: String,
    Poster: String,
    Year: String,
    Type: String,
  },
  methods: {
    capitalizeFirst(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    deleteSelf() {
      this.$emit("onDel");
    },
  },
};
</script>

<style>
.cardStyle {
  border-radius: 12px !important;
}
.imageStyle {
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}

@media all and (max-width: 400px) {
  .v-card__title {
    font-size: 14px !important;
  }

  .v-card__text {
    font-size: 12px !important;
  }
}
</style>
