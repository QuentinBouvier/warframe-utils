import VueRouter, { RouteConfig } from 'vue-router';
import AffinityComponent from '../components/affinityComponent.vue';
import RelicsComponent from '../components/relicsCmponent.vue';

const routes: RouteConfig[] = [
  { path: '/affinity', component: AffinityComponent },
  { path: '/relics', component: RelicsComponent },
];

const router: VueRouter = new VueRouter({
  routes,
});

export default router;