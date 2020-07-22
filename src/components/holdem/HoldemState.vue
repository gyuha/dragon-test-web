<template>
  <div>
    <b-steps v-model="stateValue" :has-navigation="false">
      <template v-for="(step, index) in stateValues">
        <b-step-item :key="index" :label="step"></b-step-item>
      </template>
    </b-steps>
    {{ value }}
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component({
  props: {
    value: String,
  },
  components: {},
})
export default class HoldemState extends Vue {
  stateValues = [
    'Ready',
    'PreFlop',
    'Bet1',
    'FLop',
    'Bet2',
    'Turn',
    'Bet3',
    'River',
    'Bet4',
    'Finish',
  ];
  get stateValue() {
    return +this.$props.value;
  }
}
</script>

<style lang="scss"></style>
