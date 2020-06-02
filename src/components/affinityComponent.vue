<template>
  <div class="container component-root">
    <div class="columns is-gapless">
      <div class="column is-one-fifth options" v-bind:class="{ shrunk: !options.visible.options}">
        <div class="options-body" v-show="options.visible.options">
          <p class="title is-2">Options</p>
          <div class="field">
            <div class="control">
              <input id="displayMastered" v-model="options.displayMastered" type="checkbox" />
              <label for="displayMastered" class="checkbox has-text-light">Show mastered</label>
            </div>
          </div>

          <div class="field">
            <div class="control">
              <label for="itemLists" class="label has-text-light">Item lists</label>
              <select id="itemsLists" multiple v-bind:size="activeCategories.length" v-model="options.items" @change="updateItemList()">
                <option v-for="category in activeCategories" v-bind:key="category.name" v-bind:value="category.name">{{category.label}}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="pannel-button has-text-light" v-bind:class="{ shrunk: !options.visible.options}" v-on:click="shrink('options')"></div>
      </div>
      <div class="column">
        <div class="cards-container">
          <div
            v-for="item in filteredList"
            :key="item.uniqueName"
            class="card"
            v-on:click="toggleMastered(item)"
          >
            <i class="icon-mastered" v-if="isMastered(item.uniqueName)"></i>
            <div class="card-image">
              <figure class="image is-3by2">
                <img :src="`https://cdn.warframestat.us/img/${item.imageName}`" :alt="item.name" />
              </figure>
            </div>
            <div class="card-title">
              <p class="title is-5">{{item.name}}</p>
            </div>
          </div>
          <div v-for="n in 6" :key="n" class="card" style="visibility:hidden;"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import Items, { Item, Category } from "warframe-items";
import { filter } from "lodash";

@Component
export default class AffinityComponent extends Vue {
  items: Items;
  masteredItems: string[] = [];
  options: AffinityComponentOptions;
  activeCategories = [
    {
      name: 'Warframes',
      label: 'Warframes'
    },
    {
      name: 'Primary',
      label: 'Primary'
    },
    {
      name: 'Secondary',
      label: 'Secondary'
    },
    {
      name: 'Melee',
      label: 'Melee'
    },
    {
      name: 'Archwing',
      label: 'Archwing'
    },
    {
      name: 'Arch-Gun',
      label: 'Arch-Gun'
    },
    {
      name: 'Arch-Melee',
      label: 'Arch-Melee'
    },
    {
      name: 'Sentinels',
      label: 'Sentinels'
    },
    {
      name: 'Pets',
      label: 'Pets'
    },
  ];

  constructor() {
    super();
    this.options = { visible: { options: true }, displayMastered: true, items: [ 'Primary' ] };
    this.items = new Items({ category: this.options.items });
  }

  mounted() {
    const options = localStorage.getItem('options');
    const mastered = localStorage.getItem('mastered');
    if (options != null) {
      this.options = JSON.parse(options);
    }
    if (mastered != null) {
      this.masteredItems = JSON.parse(mastered);
    }
    this.updateItemList();
  }

  get filteredList() {
    if (!this.options.displayMastered)
      return filter(
        this.items,
        x => this.masteredItems.indexOf(x.uniqueName) < 0
      );
    else return this.items;
  }

  updateItemList() {
    this.items = new Items({ category: this.options.items });
    this.save();
  }

  toggleMastered(item: Item): void {
    const index: number = this.masteredItems.indexOf(item.uniqueName);
    if (index < 0) {
      this.masteredItems.push(item.uniqueName);
    } else {
      this.masteredItems.splice(index, 1);
    }
    this.save();
  }

  isMastered(itemName: string): boolean {
    return this.masteredItems.indexOf(itemName) >= 0;
  }

  shrink(target: "options"): void {
    this.options.visible[target] = !this.options.visible[target];
    this.save();
  }

  save() {
    localStorage.setItem('mastered', JSON.stringify(this.masteredItems));
    localStorage.setItem('options', JSON.stringify(this.options));
  }
}

interface AffinityComponentOptions {
  visible: {
    options: boolean,
  };
  items: Category[];
  displayMastered: boolean;
}
</script>

<style lang="scss">
@import '../styles/_vars.scss';

.columns, .column {
  height: 100%;
}

.options {
  background-color: $component-background;
  border-right: #666 2px solid;
  position: relative;

  &.shrunk {
    width: 0px !important;
  }

  > .options-body {
    padding: 5px;
  }

  .title {
    color: #eee;
  }

  .pannel-button {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 10px;
    display: block;
    background-color: #6660;
    display: flex;
    align-items: center;
    height: 100%;

    &.shrunk {
      left: 2px;
    }
  }

  .pannel-button:hover {
    cursor: pointer;
    background-color: #666;

    &::before {
      content: "«";
    }

    &.shrunk::before {
      content: "»";
    }
  }
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-content: start;
  background-color: #222e;
  background-size: 10px 10px;
  background-image: linear-gradient(to right, #6663 1px, transparent 1px),
    linear-gradient(to bottom, #3333 1px, transparent 1px);
  height: 100%;
  overflow-y: auto;

  .card {
    margin: 5px 5px;
    width: 200px;
    max-height: 132px;
    cursor: pointer;
    background-color: #6664;
    border: #666 1px solid;
    overflow: hidden;
  }

  .card-title {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #fffd;

    > .title {
      padding: 2px;
    }
  }
}

.icon-mastered::before {
  content: url("../img/mastered.svg");
  display: block;
  width: 21px;
  top: 10px;
  right: 10px;
  filter: invert(100%) drop-shadow(0px 0px 3px #00df76);
  position: absolute;
  z-index: 999;
}
</style>