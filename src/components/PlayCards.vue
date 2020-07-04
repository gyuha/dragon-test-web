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
.card-action2 {
  background-color: #ddd;
}
</style>
