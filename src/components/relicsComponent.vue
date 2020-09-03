<!--suppress HtmlFormInputWithoutLabel -->
<template>
  <div class="container component-root content" style="overflow-y: auto">
    <table class="table is-bordered is-stripped is-hoverable relic-table">
      <thead>
      <tr>
        <th>
          <select class="has-text-centered has-text-weight-bold" name="relicType" v-model="type"
                  @change="updateActiveRelic()">
            <option v-for="t in allTypes" :key="t" :value="t">{{t}}</option>
          </select></th>
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
            :class="{
              'has-background-black': !isRelicExist(x, y),
              'vaulted': isRelicVaulted(x, y),
              'selected': isRelicSelected(x, y)
            }"
            @click.ctrl="selectRelict(x, y)"
        >
          <input
              v-if="isRelicExist(x, y)"
              type="text"
              class="is-size-5"
              maxlength="3"
              :value="relicCount[type][x][y]"
              @input="onRelicCellInput(type,x,y, $event)"
          />
        </td>
      </tr>
      </tbody>
    </table>
    <relic-card-component v-if="activeRelic" v-bind:relic="activeRelic"></relic-card-component>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import uniq from "lodash/uniq";
import RelicsService, { Relic } from "../service/RelicsService";
import RelicCardComponent from "./Relics/RelicCardComponent.vue";

@Component({
  components: { RelicCardComponent }
})
export default class RelicsComponent extends Vue {
  relics: Relic[] = [];
  type: RelicType = RelicType.axi;
  allTypes = Object.values(RelicType);
  letters: string[] = [];
  numerals: string[] = [];
  filterByType: Relic[] = [];
  relicCount: any = {};
  relicsService: RelicsService = new RelicsService();
  selectedRelic: SelectedRelic = { letter: '', numeral: '' };

  constructor() {
    super();
  }

  created() {
    this.relics = this.relicsService.relics;
    this.updateActiveRelic();
  }

  onRelicCellInput(type: string, letter: string, numeral: string, e: Event) {
    const target = <HTMLInputElement>e.target;
    target.value = target.value.replace(/[^1-9.]/g, '').replace(/(\..*)\./g, '$1');
    if (target.value.length > 0) {
      this.relicCount[type][letter][numeral] = target.value;
    } else if (target.value.length === 0 || target.value === '0') {
      this.relicCount[type][letter][numeral] = null;
    }
    this.save();
  }

  save() {
    localStorage.setItem('relics', JSON.stringify(this.relicCount));
  }

  initRelicCount() {
    // relicCount have the shape of
    //  "type": {
    //    "letter": {
    //      "numeral": count,
    //      "numeral": count,
    //    },
    //  },

    const loadedRelics = localStorage.getItem('relics');
    if (loadedRelics != null) {
      this.relicCount = JSON.parse(loadedRelics);
    }
    const r = this.type;
    if (!this.relicCount[r]) {
      this.relicCount[r] = {};
      for (let x of this.letters) {
        for (let y of this.numerals) {
          if (this.isRelicExist(x, y)) {
            if (!this.relicCount[r][x]) this.relicCount[r][x] = {};
            this.relicCount[r][x][y] = null;
          }
        }
      }
    }
  }

  isRelicExist(letter: string, numeral: string): boolean {
    return (
        this.filterByType.find(
            x => x.letter === letter && x.numeral === numeral
        ) !== undefined
    );
  }

  isRelicVaulted(letter: string, numeral: string): boolean {
    return (
        this.filterByType.find(
            x => x.letter === letter && x.numeral === numeral
        )?.vaulted || false
    );
  }

  isRelicSelected(letter: string, numeral: string): boolean {
    return this.selectedRelic.letter === letter && this.selectedRelic.numeral === numeral;
  }

  selectRelict(letter: string, numeral: string) {
    if (this.isRelicSelected(letter, numeral)) {
      this.deselectRelic()
    } else {
      this.selectedRelic = { letter, numeral };
    }
  }

  deselectRelic() {
    this.selectedRelic = { letter: '', numeral: '' };
  }

  get activeRelic(): Relic | undefined {
    return this.filterByType.find(x => x.letter === this.selectedRelic.letter && x.numeral === this.selectedRelic.numeral);
  }

  updateActiveRelic() {
    this.deselectRelic();
    this.filterByType = this.relics.filter(x => x.type === this.type);
    this.letters = uniq(this.filterByType.map(x => x.letter)).sort();
    this.numerals = uniq(this.filterByType.map(x => x.numeral)).sort(
        (a, b) => parseInt(a) - parseInt(b)
    );
    this.initRelicCount();
  }
}

enum RelicType {
  axi = "Axi",
  meso = "Meso",
  lith = "Lith",
  neo = "Neo"
  //requiem = 'Requiem',
}

interface SelectedRelic {
  letter: string;
  numeral: string;
}
</script>

<style lang="scss">
table.relic-table {
  thead th:first-child {
    padding: 0;

    &::after {
      content: '▼';
      color: black;
      position: absolute;
      top: 25px;
      left: 19px;
      font-size: 0.5em;
    }

    > select {
      margin: 0;
      border: none;
      appearance: none;
      cursor: pointer;
      width: 100%;
      height: 40px;
      display: block;
      box-sizing: border-box;
    }
  }

  tbody tr td {
    position: relative;
    width: 39px;

    background-color: rgba(251, 238, 53, 0.34);

    &.vaulted {
      background-color: #0001;
    }

    &.selected {
      background-color: red;
    }

    > input {
      position: absolute;
      height: 100%;
      width: 39px;
      display: block;
      padding: 0;
      border: none;
      background-color: #0000;
      text-align: center;

      &:focus {
        outline: none;
      }
    }
  }
}
</style>

