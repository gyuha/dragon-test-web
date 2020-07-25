<template>
  <div class="card-group">
    <img class="matgoCard" v-for="(card, idx) in cards" :key="idx" :src="imgPath(card)" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
@Component({
  components: {},
})
export default class HoldemCards extends Vue {
  @Prop(Array)
  cards: string[];

  imgPath(image: string) {
    return '/img/pokers/' + image + '.png';
  }

  @Watch('update')
  updateData() {
    this.$forceUpdate();
  }
}
</script>

<style lang="scss">
.card-group {
  min-height: 80px;
}
.matgoCard {
  width: 60px;
  margin: 2px;
}
</style>
