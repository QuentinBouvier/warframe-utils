<template>
    <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a :href="rootUrl" class="navbar-item">
                <img id="icon" src="/img/mastered.svg" alt="icon">
            </a>
            <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>
        <div class="navbar-menu">
            <div class="navbar-start">
                <router-link to="/affinity" class="navbar-item">Affinity</router-link>
                <router-link to="/relics" class="navbar-item">Relics</router-link>
            </div>
        </div>
    </nav>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import WeaponsComponent from './components/weaponsComponent.vue';

@Component
export default class Navbar extends Vue {
    rootUrl = '/';
}
</script>

<style lang="scss">
@import '../../styles/_vars.scss';

#icon {
    width: 50px;
}

.navbar {
    background-color: $component-background;
}
</style>