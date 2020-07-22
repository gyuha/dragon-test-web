<template>
  <div class="card-group">
    <img
      class="matgoCard"
      v-for="(card, idx) in cards"
      :key="idx"
      :src="imgPath(card.image)"
      @click="selectCard(idx)"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component({
  props: {
    cards: {
      type: Array,
      default: [],
    },
  },
  components: {},
})
export default class HoldemCards extends Vue {
  imgPath(image: string) {
    return '/img/pokers/' + image + '.png';
  }

  selectCard(num: number) {
    this.$emit('select', num);
  }
}
</script>

<style lang="scss">
.card-group {
  min-height: 120px;
}
.matgoCard {
  width: 100px;
  margin: 2px;
}
</style>
