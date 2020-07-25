<template>
  <div calss="card">
    <HoldemCards :cards="player.cards"></HoldemCards>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import HoldemCards from './HoldemCards.vue';

@Component({
  props: {
    player: {
      type: Object,
      default: {
        cards: [],
      },
    },
  },
  components: {
    HoldemCards,
  },
})
export default class Player extends Vue {

}
</script>

<style lang="scss"></style>
