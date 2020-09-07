<template>
  <div id="app" class="container">
    <Navbar/>
    <router-view/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Component from 'vue-class-component';
import AffinityComponent from './components/affinityComponent.vue';
import Navbar from './components/layout/navbar.vue';
import RelicsComponent from './components/relicsComponent.vue';
import Market from "./service/Market";
import RelicsService from "./service/RelicsService";
import { Provide } from "vue-property-decorator";

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  { path: '/affinity', component: AffinityComponent },
  { path: '/relics', component: RelicsComponent }
];

const router = new VueRouter({
  routes,
});

const injectables = {
  marketClient: new Market(),
  relicsService: new RelicsService()
}


@Component({
  components: { AffinityComponent, Navbar },
  router
})
export default class App extends Vue {
  defaultRoute = '/relics';

  @Provide() marketClient = injectables.marketClient;
  @Provide() relicsService = injectables.relicsService;


  constructor() {
    super();
  }

  created() {
    if (router.currentRoute.path !== this.defaultRoute)
      router.push(this.defaultRoute);
  }
}
</script>

<style lang="scss">
#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.component-root {
  max-height: 100%;
  overflow-y: hidden;
}
</style>