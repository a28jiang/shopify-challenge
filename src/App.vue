<template>
  <v-app>
    <div :class="$vuetify.breakpoint.xsOnly ? 'smallAppStyle' : 'appStyle'">
      <v-row class="centered">
        <h1
          :style="
            $vuetify.breakpoint.xsOnly
              ? { fontSize: '9vw' }
              : { fontSize: '7vw' }
          "
          class="pr-8"
        >
          The <span class="accentColour">Shoppies.</span> 🎬
        </h1>
      </v-row>
      <v-row class="centered pt-12">
        <v-autocomplete
          v-model="searchResult"
          :items="items"
          :loading="isLoading"
          :search-input.sync="search"
          clearable
          @change="clearSearch"
          hide-details
          item-text="Title"
          item-value="Title"
          label="Search for a movie to nominate..."
          solo
          rounded
        >
          <template v-slot:no-data>
            <v-list-item>
              <v-list-item-title>
                Search for your favorite
                <strong>movie</strong>, <strong>series</strong> or
                <strong>episode</strong>
              </v-list-item-title>
            </v-list-item>
          </template>
          <template v-slot:item="{ item }">
            <v-avatar @click="itemSelect(item)" left>
              <img :src="item.Poster" alt="Movie" />
            </v-avatar>

            <v-list-item-content @click="itemSelect(item)" class="ml-4">
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
          <h2>🏆 My Nominations</h2>
        </v-col>
      </v-row>
      <v-alert
        class="clickable"
        :style="{ borderRadius: '26px' }"
        v-if="maxBanner"
        dismissible
        @click="() => (this.maxBanner = false)"
        type="info"
        >Maximum of 5 nominations are allowed!</v-alert
      >
      <v-alert
        class="clickable"
        :style="{ borderRadius: '26px' }"
        v-if="existBanner"
        dismissible
        @click="() => (this.existBanner = false)"
        type="info"
        >Nomination has already been added</v-alert
      >
      <v-alert
        class="clickable"
        :style="{ borderRadius: '26px' }"
        v-if="submitBanner"
        dismissible
        @click="() => (this.submitBanner = false)"
        type="success"
        >Nominations successfully saved!</v-alert
      >
      <transition-group tag="div" name="list" class="row">
        <MovieCard
          class="smoothTransition"
          @onDel="handleDelete(nomination.imdbID)"
          v-for="nomination in nominations"
          :key="nomination.imdbID"
          v-bind="nomination"
          :handleDelete="handleDelete"
        />
        <v-col
          :style="{ minHeight: '200px' }"
          class="centered"
          key="noneSelected"
          v-if="!nominations.length"
        >
          <h3>No Movies currently selected 🤔</h3>
        </v-col>
      </transition-group>
      <v-row class="pa-0 pt-8">
        <v-btn
          @click="save"
          class="mr-6 submit"
          x-large
          rounded
          :disabled="!nominations.length"
        >
          SUBMIT
        </v-btn>
        <v-btn @click="clearAll" x-large rounded>
          CLEAR ALL
        </v-btn>
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
    nominations: [],
    searchResult: null,
    search: "",
    value: null,
    tab: null,
    existBanner: false,
    maxBanner: false,
    submitBanner: false,
  }),
  mounted() {
    if (localStorage.getItem("nominations")) {
      try {
        this.nominations = JSON.parse(localStorage.getItem("nominations"));
      } catch (e) {
        localStorage.removeItem("nominations");
      }
    }
  },
  methods: {
    save() {
      const parsed = JSON.stringify(this.nominations);
      localStorage.setItem("nominations", parsed);
      this.submitBanner = true;
    },
    clearAll() {
      this.nominations = [];
    },
    handleDelete(id) {
      console.log("HANDLE");
      console.log(id);
      for (var i = this.nominations.length - 1; i >= 0; i--) {
        console.log(this.nominations[i]);
        if (this.nominations[i].imdbID === id) this.nominations.splice(i, 1);
      }
    },
    itemSelect(item) {
      var isExisting = this.nominations.findIndex(
        (e) => e.imdbID === item.imdbID
      );
      console.log("isExist", isExisting);
      const isMax = this.nominations.length == 5;
      if (isMax) this.maxBanner = true;
      if (isExisting != -1) this.existBanner = true;

      if (isExisting == -1 && !isMax) {
        this.nominations.push(item);
      }
    },
    clearSearch() {
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
.submit {
  background-color: #76d59a !important;
  color: white !important;
}

.accentColour {
  color: #76d59a;
}
h1 {
  color: #414141;
}
h2 {
  color: #414141;
}
h3 {
  font-size: 24;
  font-weight: 400;
  color: #969696;
}
.appStyle {
  padding: 5% 20% 0 20%;
}
.smallAppStyle {
  padding: 15% 10% 0 10%;
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
.list-item {
  transition: all 1s;
}
.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.list-leave-active {
  position: absolute;
}
.smoothTransition {
  transition: all 1s ease;
}
.clickable:hover {
  opacity: 0.5;
  cursor: pointer;
}
</style>
