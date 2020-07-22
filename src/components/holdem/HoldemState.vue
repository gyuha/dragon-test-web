<template>
  <b-steps v-model="stateValue" :has-navigation="false">
    <b-step-item v-for="v in stateValues" :key="v" :label="v"></b-step-item>
  </b-steps>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
@Component({
  props: {
    value: String
  },
  components: {}
})
export default class HoldemState extends Vue {
  stateValues = [
    "Ready",
    "PreFlop",
    "Bet",
    "FLop",
    "Bet",
    "Turn",
    "Bet",
    "River",
    "Bet",
    "Finish"
  ];
  get stateValue() {
    return this.stateValues.indexOf(this.$props.value);
  }
}
</script>

<style lang="scss"></style>
