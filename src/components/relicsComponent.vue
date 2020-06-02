<template>
  <div class="container component-root content" style="overflow-y: auto">
    <select name="relicType" v-model="type" @change="updateActiveRelic()">
      <option v-for="t in allTypes" :key="t" :value="t">{{t}}</option>
    </select>
    <table class="table is-bordered is-stripped is-hoverable">
      <thead>
        <tr>
          <th>{{type}}</th>
          <th v-for="x in letters" :key="x">{{x}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="y in numerals" :key="y">
          <th class="has-text-centered">{{y}}</th>
          <td
            v-for="x in letters"
            :key="x"
            class="is-paddingless"
            :class="{ 'has-background-black': !isRelicExist(x, y) }"
          >
            <input
              v-if="isRelicExist(x, y)"
              type="text"
              class="is-size-5"
              maxlength="3"
              oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Items from "warframe-items";
import { filter, map, uniq, find } from "lodash";

@Component
export default class RelicsComponent extends Vue {
  relics: Relic[] = [];
  type: RelicType = RelicType.axi;
  allTypes = Object.values(RelicType);
  letters: string[] = [];
  numerals: string[] = [];
  filterByType: Relic[] = [];
  relicCount: any = {};

  created() {
    let relicsRaw = new Items({ category: ["Relics"] });
    relicsRaw = filter(relicsRaw, x => x.name.includes("Intact"));
    this.relics = relicsRaw.map(x => {
      const splitName = x.name.split(" ");
      return {
        uniqueName: x.uniqueName,
        name: x.name,
        type: splitName[0],
        letter: splitName[1].substring(0, 1),
        numeral: splitName[1].substring(1)
      };
    });
    this.updateActiveRelic();
    this.initRelicCount();
  }

  initRelicCount() {
    for (let x in this.letters) {
      for (let y in this.numerals) {
        if(this.isRelicExist(x,y)) {
          if (!this.relicCount[x]) this.relicCount[x] = {};
          this.relicCount[x][y] = 0;
        }
      }
    }
  }

  isRelicExist(letter: string, numeral: string) {
    return (
      find(
        this.filterByType,
        x => x.letter === letter && x.numeral === numeral
      ) !== undefined
    );
  }

  updateActiveRelic() {
    this.filterByType = filter(this.relics, x => x.type === this.type);
    this.letters = uniq(map(this.filterByType, x => x.letter)).sort();
    this.numerals = uniq(map(this.filterByType, x => x.numeral)).sort(
      (a, b) => parseInt(a) - parseInt(b)
    );
  }
}

interface Relic {
  uniqueName: string;
  name: string;
  type: string;
  letter: string;
  numeral: string;
}

enum RelicType {
  axi = "Axi",
  meso = "Meso",
  lith = "Lith",
  neo = "Neo"
  //requiem = 'Requiem',
}
</script>

<style lang="scss">
table tbody tr td {
  position: relative;
  width: 39px;

  > input {
    position: absolute;
    height: 100%;
    width: 39px;
    display: block;
    padding: 0;
    border: none;
    background-color: #0000;
    text-align: center;
  }
}
</style>

