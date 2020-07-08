<template>
  <div>
    <b-steps v-model="stateValue" :has-navigation="false">
      <b-step-item label="none" icon="link"></b-step-item>
      <b-step-item label="ready" icon="account-key"></b-step-item>
      <b-step-item label="firstPick" icon="account"></b-step-item>
      <b-step-item label="play" icon="play"></b-step-item>
      <b-step-item label="end" icon="pause"></b-step-item>
    </b-steps>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
@Component({
  props: {
    value: String
  },
  components: {}
})
export default class GameState extends Vue {
  stateValues = ["none", "ready", "firstPick", "play", "end"];
  get stateValue() {
    return this.stateValues.indexOf(this.$props.value);
  }
}
</script>

<style lang="scss"></style>
