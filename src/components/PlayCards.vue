<template>
  <div class="card-group">
    <div
      class="play-card"
      v-for="(card, idx) in cards"
      :key="idx"
      style="display: inline-block;"
      :class="[cardActionBg(card)]"
    >
      <img class="matgoCard" :src="imgPath(card.image)" />
      <br />
      {{ cardMove(card.from) }}
      <br />
      {{ cardMove(card.to) }}
      <hr />
      {{ cardAction(card.action) }}
    </div>
  </div>
</template>

<script lang="ts">
enum cMove {
  "0.없음" = 0,
  "1.내손",
  "2.내바닥",
  "3.바닥",
  "4.뒷면",
  "5.니손",
  "6.니바닥"
}

enum cAction {
  "0.없음" = 0,
  "1.이동",
  "2.받기",
  "3.내기",
  "4.쪽",
  "5.뻑",
  "6.따닥",
  "7.폭탄",
  "8.싹쓸이",
  "9.뻑먹기",
  "10.짜뻑",
  "11.흔들기",
  "12.상대피"
}

import { Vue, Component } from "vue-property-decorator";
@Component({
  props: {
    cards: {
      type: Array,
      default: []
    }
  },
  components: {}
})
export default class PlayCards extends Vue {
  imgPath(image: string) {
    return "/img/cards/" + image + ".png";
  }

  cardActionBg(card: any): string {
    return "card-action" + card.action;
  }

  cardMove(e: number) {
    return cMove[e];
  }

  cardAction(e: number) {
    return cAction[e];
  }
}
</script>

<style lang="scss">
.play-card {
  margin: 0.5px;
  padding: 1px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 10px;
  text-align: center;
  hr {
    padding: 0;
    margin: 2px;
  }
}
.card-action0 {
  background-color: #999;
}
.card-action1 {
  background-color: #fff;
}
.card-action2 {
  background-color: #f88;
}
.card-action3 {
  background-color: #8fd;
}
.card-action4 {
  background-color: #ddf;
}
.card-action5 {
  background-color: #fdf;
}
.card-action6 {
  background-color: #e9f;
}
.card-action7 {
  background-color: #f83;
}
.card-action8 {
  background-color: #3f3;
}
.card-action9 {
  background-color: #99f;
}
.card-action10 {
  background-color: #ff9;
}
.card-action11 {
  background-color: #f33;
}
.card-action12 {
  background-color: #f66;
}
</style>
