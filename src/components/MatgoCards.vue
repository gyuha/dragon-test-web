<template>
  <div class="card-group">
    <img class="matgoCard" v-for="(card, idx) in cards" :key="idx" :src="imgPath(card.image)" @click="selectCard(idx)"/>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
@Component({
  props: {
    cards: {
      type: Array,
      default: [],
    },
  },
  components: {},
})
export default class MatgoCards extends Vue {
  imgPath(image: string) {
    return "/img/cards/" + image + ".png";
  }

  selectCard(num: number) {
    this.$emit("select", num);
  }
}
</script>

<style lang="scss">
.card-group {
  height: 70px;
}
.matgoCard {
  width: 40px;
  margin: 2px;
}
</style>
