<template>
  <v-card class="cardStyle">
    <v-row>
      <v-img
        v-if="$vuetify.breakpoint.smAndUp"
        class="imageStyle"
        @click="$router.push(name)"
        transition="fade"
        max-width="75"
        src="https://m.media-amazon.com/images/M/MV5BMTYwOTEwNjAzMl5BMl5BanBnXkFtZTcwODc5MTUwMw@@._V1_SX300.jpg"
      />

      <v-col pl-0>
        <v-card-title class="pb-0">PoopooPeepeeCheck </v-card-title>
        <v-card-text class="pt-0">PoopooPeepeeCheck</v-card-text>
      </v-col>
      <v-col :style="{ maxWidth: '48px' }" class="right pr-8">
        <v-icon>mdi-delete </v-icon>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: "MovieCard",
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
