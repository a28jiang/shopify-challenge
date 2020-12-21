<template>
  <v-app>
    <div class="appStyle">
      <v-row class="centered">
        <h1>The Shoppies</h1>
      </v-row>
      <v-row class="centered pt-10">
        <v-autocomplete
          v-model="searchResult"
          :items="items"
          :loading="isLoading"
          :search-input.sync="search"
          @change="itemSelect"
          clearable
          hide-details
          item-text="Title"
          item-value="Title"
          label="Search for a movie..."
          solo
        >
          <template v-slot:item="{ item }">
            <v-avatar left>
              <img :src="item.Poster" alt="Movie" />
            </v-avatar>

            <v-list-item-content class="ml-4">
              <v-list-item-title v-text="item.Title"></v-list-item-title>
              <v-list-item-subtitle v-text="item.Year"></v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-icon v-if="item.Type === 'game'">mdi-gamepad-variant</v-icon>
              <v-icon v-if="item.Type === 'movie'">mdi-movie</v-icon>
              <v-icon v-if="item.Type === 'episode'"
                >mdi-television-classic</v-icon
              >
              <v-icon v-if="item.Type === 'series'"
                >mdi-television-classic</v-icon
              >
            </v-list-item-action>
          </template>
        </v-autocomplete>
      </v-row>

      <v-row class="pt-10">
        <v-col>
          <h2>My Selected Nominations</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="pr-0">
          <MovieCard />
        </v-col>
        <v-col cols="12" class="pr-0">
          <MovieCard />
        </v-col>
        <v-col cols="12" class="pr-0">
          <MovieCard />
        </v-col>
        <v-col cols="12" class="pr-0">
          <MovieCard />
        </v-col>
      </v-row>
    </div>
  </v-app>
</template>

<script>
import MovieCard from "./components/MovieCard";
export default {
  name: "App",
  components: { MovieCard },
  data: () => ({
    apiKey: "464910c",
    isLoading: false,
    awaitingSearch: false,
    selectedItems: [],
    items: [],
    searchResult: null,
    search: "",
    value: null,
    tab: null,
  }),
  methods: {
    itemSelect() {
      this.$nextTick(() => {
        this.search = "";
        this.searchResult = null;
      });
    },
  },
  watch: {
    search(val) {
      if (!val) return;
      if (val.length < 3) return;
      this.value = val;
      if (!this.awaitingSearch) {
        setTimeout(() => {
          this.isLoading = true;
          const concatVal = this.value.split(" ").join("+");

          fetch(`https://omdbapi.com/?s=${concatVal}&apikey=${this.apiKey}`)
            .then((res) => res.clone().json())
            .then((res) => {
              if (res.Response) {
                this.items = res.Search;
                console.log(this.items);
              }
            })
            .catch((err) => {
              console.log("ERROR", err);
            })
            .finally(() => {
              this.isLoading = false;
              this.awaitingSearch = false;
            });
        }, 1000); // 1 sec delay
        this.awaitingSearch = true;
      }
    },
  },
};
</script>

<style>
.appStyle {
  padding: 10% 20% 0 20%;
}

.centered {
  display: flex;
  justify-content: center;
  align-items: center;
}

.right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.left {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>
