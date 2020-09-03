<template>
  <div class="card">
    <div class="card-content">
      <div class="media-left">
        <div class="media">
          <div class="media-left">
            <figure class="image is-96x96">
              <img :src="`https://cdn.warframestat.us/img/${relic.imageName}`"
                   :alt="`Cover of ${relic.name}`"/>
            </figure>
          </div>
          <div class="media-content">
            <p class="title is-5">{{relic.type}}</p>
            <p class="title is-6">{{relic.letter}}{{relic.numeral}}</p>
          </div>
        </div>
      </div>
      <div class="content">
        <table class="table is-bordered is-hoverable relic-drops">
          <thead>
          <th>Loot table</th>
          </thead>
          <tbody>
          <tr v-for="drop in sortedDrops" :key="`${drop.parentName} ${drop.name}`">
            <td>
              <span :class="{'common': drop.rarity === 'Common',
                             'uncommon': drop.rarity === 'Uncommon',
                             'rare': drop.rarity === 'Rare'}"
                    class="tag">{{drop.rarity}}</span>
              <a v-if="drop.wikiaUrl" :href="drop.wikiaUrl">{{drop.parentName}} {{drop.name}}</a>
              <span v-else>{{drop.parentName}} {{drop.name}}</span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Relic, RelicDrop } from "../../service/RelicsService";
import { Prop } from "vue-property-decorator";

@Component
export default class RelicCardComponent extends Vue {
  @Prop() readonly relic: Relic;
  sortedDrops: RelicDrop[] = [];

  constructor() {
    super();
  }

  mounted() {
    this.start();
  }

  beforeUpdate() {
    this.start();
  }

  start() {
    this.sortDrops();
  }

  sortDrops() {
    this.sortedDrops = this.relic.drops.sort((a, b) => b.chance - a.chance );
  }

  async queryMarket() {

  }
}
</script>

<style lang="scss">
.tag{
  &.common {
    background-color: #b76600;
    color: white;
  }
  
  &.uncommon {
    background-color: #cccccc;
  }
  
  &.rare {
    background-color: #e8c600;
  }
}
</style>