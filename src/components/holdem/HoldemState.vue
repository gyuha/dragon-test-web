<template>
  <div>
    <b-steps v-model="stateValue" :has-navigation="false">
      <template v-for="(step, index) in stateValues">
        <b-step-item :key="index" :label="step"></b-step-item>
      </template>
    </b-steps>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
@Component({
  components: {},
})
export default class HoldemState extends Vue {
  @Prop(Number)
  value: number;

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
