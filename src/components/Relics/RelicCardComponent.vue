<template>
  <div class="card">
    <div class="card-content">
      <div class="media-left">
        <div class="media">
          <div class="media-left">
            <figure class="image is-96x96">
              <img :src="`https://cdn.warframestat.us/img/${relic.imageName}`"
                   :alt="`Cover for relic ${relic.name}`"/>
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
          <th>Average price (90d)</th>
          <th>Average price (48h)</th>
          </thead>
          <tbody>
          <tr v-for="(drop, index) in sortedDrops" :key="index">
            <td>
              <span :class="{'common': drop.rarity === 'Common',
                             'uncommon': drop.rarity === 'Uncommon',
                             'rare': drop.rarity === 'Rare'}"
                    class="tag">{{drop.rarity}}</span>
              <a v-if="drop.wikiaUrl" :href="drop.wikiaUrl">{{drop.parentName}} {{drop.name}}</a>
              <span v-else>{{drop.parentName}} {{drop.name}}</span>
            </td>
            <td class="has-text-centered">
              <span v-if="!isNil(drop.avgPrice90d)">{{drop.avgPrice90d.toFixed(1)}}<i v-if="drop.avgPrice90d > 0"
                                                                                      class="icon-platinum ml-1"></i></span>
              <div v-else class="loader-cell">
                <loader dark="true"></loader>
              </div>
            </td>
            <td class="has-text-centered">
              <span v-if="!isNil(drop.avgPrice48h)">{{drop.avgPrice48h.toFixed(1)}}<i v-if="drop.avgPrice90d > 0"
                                                                                      class="icon-platinum ml-1"></i></span>
              <div v-else class="loader-cell">
                <loader dark="true"></loader>
              </div>
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
import { Inject, Prop, Watch } from "vue-property-decorator";
import Market from "../../service/Market";
import Loader from "../visual/loader.vue";
import isNil from 'lodash/isNil';

@Component({
  components: { Loader }
})
export default class RelicCardComponent extends Vue {
  @Inject('marketClient') market: Market;

  @Prop() readonly relic: Relic;

  sortedDrops: RelicDrop[] = [];
  isNil = isNil;

  constructor() {
    super();
  }

  mounted() {
    this.sortDrops();
    this.queryMarket();
  }

  @Watch('relic')
  updatePrices(): void {
    this.sortDrops();
    this.queryMarket();
  }

  sortDrops() {
    this.sortedDrops = this.relic.drops.sort((a, b) => b.chance - a.chance);
  }

  queryMarket() {
    for (const drop of this.sortedDrops) {
      if (!drop.name.toLowerCase().includes('forma')) {
        this.market.queryPrices(Market.componentMarketName(drop.parentName, drop.name))
          .then(dropPrice => {
            this.$set(drop, 'avgPrice48h', dropPrice.payload.statistics_live['48hours'].reduce((t, x, i, { length }) => t + x.avg_price / length, 0));
            this.$set(drop, 'avgPrice90d', dropPrice.payload.statistics_live['90days'].reduce((t, x, i, { length }) => t + x.avg_price / length, 0));
          })
          .catch(err => {
            console.error('Unable to join the warframe market api.', err);
            this.$set(drop, 'avgPrice48h', 0);
            this.$set(drop, 'avgPrice90d', 0);
          })
      } else {
        this.$set(drop, 'avgPrice48h', 0);
        this.$set(drop, 'avgPrice90d', 0);
      }
    }
  }
}
</script>

<style lang="scss">
.tag {
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

.loader-cell {
  display: flex;
  justify-content: center;
}

.icon-platinum::before {
  content: ' ';
  background-image: url("../../img/icons/PlatinumLarge.png");
  background-size: 13px 13px;
  display: inline-block;
  width: 13px;
  height: 13px;
}
</style>