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
          <v-card-title
            class="pb-0"
            :style="{ wordBreak: 'break-word !important' }"
            >{{ Title }}
          </v-card-title>
          <v-card-text class="pt-0">{{
            `${Year} ${capitalizeFirst(Type)}`
          }}</v-card-text>
        </v-col>
        <v-col :style="{ maxWidth: '72px' }" class="right pr-8">
          <v-icon class="clickable  px-xs-0 px-2" @click="moreInfo"
            >mdi-information
          </v-icon>
          <v-icon class="clickable  px-xs-0 px-2" @click="deleteSelf"
            >mdi-delete
          </v-icon>
        </v-col>
      </v-row>
    </v-card>
    <v-dialog v-model="dialog" max-width="700">
      <v-card class="cardStyle hideOverflow">
        <v-row>
          <v-img
            class="imageStyle"
            @click="$router.push(name)"
            transition="fade"
            max-width="125"
            :src="Poster"
          />

          <v-col>
            <v-card-title
              class="pr-0"
              :style="{ wordBreak: 'break-word !important' }"
              >{{ Title }}
            </v-card-title>
            <v-card-subtitle
              :style="
                $vuetify.breakpoint.xsOnly ? { flexDirection: 'column' } : ''
              "
              class="left"
            >
              <div v-if="stars" class="alignLeft">
                <v-icon v-for="i in stars" :key="i">
                  mdi-star
                </v-icon>
                <v-icon v-for="i in 5 - stars" :key="6 - i">
                  mdi-star-outline
                </v-icon>
              </div>
              <div
                class="alignLeft"
                :style="
                  $vuetify.breakpoint.xsOnly ? '' : { marginLeft: '-12px' }
                "
              >
                {{ modalDetails.imdbRating }} from
                {{ modalDetails.imdbVotes }} voters
              </div>
              <div
                class="alignLeft"
                :style="
                  $vuetify.breakpoint.xsOnly ? '' : { paddingLeft: '12px' }
                "
              >
                Released: {{ modalDetails.Released }}
              </div>
            </v-card-subtitle>
            <v-card-text> {{ modalDetails.Plot }}</v-card-text>
          </v-col>
          <v-col cols="1" />
        </v-row>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script>
export default {
  name: "MovieCard",
  data: () => ({
    dialog: false,
    apiKey: "464910c",
    stars: 0,
    modalDetails: {
      Plot: "",
      Released: "",
      imdbRating: "",
      imdbVotes: "",
    },
  }),
  props: {
    Title: String,
    imdbID: String,
    Poster: String,
    Year: String,
    Type: String,
  },
  methods: {
    moreInfo() {
      fetch(`https://omdbapi.com/?i=${this.imdbID}&apikey=${this.apiKey}`)
        .then((res) => res.clone().json())
        .then((res) => {
          if (res.Response) {
            this.modalDetails = res;
            this.stars = Math.floor(parseInt(res.imdbRating) / 2);
          }
        })
        .catch((err) => {
          console.log("ERROR", err);
        })
        .finally(() => {
          this.dialog = true;
        });
    },
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
.alignLeft {
  width: 100%;
  text-align: left;
}
.hideOverflow {
  overflow: hidden;
}
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
