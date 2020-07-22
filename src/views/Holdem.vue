<template>
  <div>
    <HoldemState :value="0"></HoldemState>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import HoldemState from "@/components/holdem/HoldemState.vue";

@Component({
  props: {},
  components: {
    HoldemState
  },
})
export default class Holdem extends Vue {}
</script>

<style lang="scss"></style>
