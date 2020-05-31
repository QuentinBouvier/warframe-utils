<template>
    <div id="app" class="container">
        <Navbar />
        <router-view />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Component from 'vue-class-component';
import AffinityComponent from './components/affinityComponent.vue';
import Navbar from './components/layout/navbar.vue';
import RelicsComponent from './components/relicsComponent.vue';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
    { path: '/affinity', component: AffinityComponent },
    { path: '/relics', component: RelicsComponent }
];

const router = new VueRouter({
    routes,
});

@Component({
    components: { AffinityComponent, Navbar },
    router
})
export default class App extends Vue {
    rootUrl = '/';
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