<template>
  <div>
    <GameState :value="gameState"></GameState>
    <hr />
    <MatgoCards
      @select="firstCardClick"
      v-if="gameState == 'firstPick'"
      :cards="firstSelectCards"
    ></MatgoCards>
    <div v-if="gameState === 'play'">
      <h1>상대 카드({{ partnerCards.length }})</h1>
      <MatgoCards :cards="partnerCards"></MatgoCards>
      <h1>상대가 먹은 카드 ({{ partnerFloorCards.length }})</h1>
      <MatgoCards :cards="partnerFloorCards"></MatgoCards>
      <h1>바닥 카드({{ floorCards.length }})</h1>
      <MatgoCards :cards="floorCards"></MatgoCards>
      <h1>뒤집힌 카드 ({{ backCardCount }})</h1>
      <MatgoCards
        v-if="backCardCount > 0"
        :cards="[backCard]"
        @select="backCardClick"
      ></MatgoCards>
      <h1>먹은 카드 ({{ myFloorCards.length }})</h1>
      <MatgoCards :cards="myFloorCards"></MatgoCards>
      <h1>내 카드 ({{ myCards.length }})</h1>
      <MatgoCards @select="handCardClick" :cards="myCards"></MatgoCards>
    </div>
    <hr />
    <div class="columns">
      <div class="column is-three-quarters">
        <b-field grouped group-multiline>
          <div class="control">
            <b-taglist attached>
              <b-tag type="is-dark">Room ID</b-tag>
              <b-tag type="is-info">{{ roomId }}</b-tag>
            </b-taglist>
          </div>
          <div class="control">
            <b-taglist attached>
              <b-tag type="is-dark">Session ID</b-tag>
              <b-tag type="is-info">{{ sessionId }}</b-tag>
            </b-taglist>
          </div>
          <div class="control">
            <b-taglist attached>
              <b-tag type="is-dark">Message Type</b-tag>
              <b-tag type="is-info">{{ messageType }}</b-tag>
            </b-taglist>
          </div>
        </b-field>
      </div>
      <div class="column">
        <b-button
          type="is-info"
          @click="joinRoom"
          :disabled="gameState != 'none'"
          >Join Room</b-button
        >
        <b-button
          type="is-danger"
          @click="leave"
          :disabled="gameState == 'none'"
          >Leave</b-button
        >
      </div>
    </div>
    <hr />
    <json-view :data="stateData" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import * as Colyseus from "colyseus.js";
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JSONView } from "vue-json-component";
import GameState from "@/components/GameState.vue";
import _ from "lodash";
import MatgoCards from "@/components/MatgoCards.vue";
import { MatgoCard, ResponseMessage } from "../matgo";

@Component({
  props: {},
  components: {
    GameState,
    MatgoCards,
    "json-view": JSONView
  }
})
export default class Home extends Vue {
  client!: Colyseus.Client;
  room: Colyseus.Room | null = null;
  messageType = "";

  stateData = {
    state: "none"
  };

  firstSelectCards = [];

  myCards = [];
  myFloorCards = [];
  partnerCardCount = 0;
  partnerFloorCards = [];
  floorCards = [];
  backCardCount = 0;
  turn = "";

  backCard: MatgoCard = {
    id: -1,
    num: -1,
    image: 0,
    tag: -1,
    type: -1,
    event: 0
  };

  get roomId() {
    return this.room ? this.room.id : "";
  }

  get sessionId() {
    return this.room ? this.room.sessionId : "";
  }

  get gameState() {
    return this.stateData.state;
  }

  get partnerCards(): MatgoCard[] {
    const cards = [];
    for (let i = 0; i < this.partnerCardCount; i++) {
      cards.push(this.backCard);
    }
    return cards;
  }

  constructor() {
    super();
  }

  leaveAction() {
    this.stateData = {
      state: "none"
    };
    this.messageType = "";
    this.room = null;
  }

  leave() {
    if (!this.room) {
      return;
    }
    console.log("leave room", this.room.id);
    this.room.leave();
    this.leaveAction();
  }

  /**
   * 방 접속 하기
   */
  joinRoom() {
    this.client = new Colyseus.Client("ws://127.0.0.1:2567");
    this.client
      .joinOrCreate("room1")
      .then((room: Colyseus.Room) => {
        console.log(room);
        this.room = room;
        this.eventRegister();
      })
      .catch((e: unknown) => {
        console.log("JOIN ERROR", e);
      });
  }

  eventRegister() {
    if (!this.room) {
      return;
    }
    const room = this.room;
    this.room.onStateChange((state: any) => {
      console.log("Home -> eventRegister -> state", state.state);
      this.toast("Change state : " + JSON.stringify(state).slice(0, 50));
      this.stateData = _.clone(state);
      if (this.gameState === "play") {
        this.playCardsDisplay(state);
      }
      this.$forceUpdate();
    });

    //! 게임 시작 여부
    this.room.onMessage("startGame", message => {
      this.messageType = "startGame";
      console.log("Home -> eventRegister -> message", message);
      this.$swal({
        title: "게임 시작",
        text: "사용자가 입장 했습니다.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "시작",
        cancelButtonText: "내보내기"
      }).then((result: any) => {
        console.log(result);
        room.send("startGame", {
          value: result.value ? true : false
        });
      });
    });
    //! 선 고르기
    this.room.onMessage("firstSelect", message => {
      this.messageType = "firstSelect";
      this.firstSelectCards = message.cards;
      console.log("Home -> eventRegister -> message", message);
    });
    //! 게임 플레이
    this.room.onMessage("play", message => {
      this.messageType = "play";
      this.onPlayMessage(message);
    });

    //! 게임에서 내보내 질때
    this.room.onLeave(code => {
      console.log("Home -> eventRegister -> code", code);
      this.leaveAction();
    });

    this.room.onMessage("put", message => {
      this.messageType = "put";
      this.firstSelectCards = message.cards;
    });
  }

  playCardsDisplay(state: any) {
    _.forEach(state.players, (player: any, id: string) => {
      if (this.sessionId == player.sessionId) {
        this.myFloorCards = player.floorCards;
      } else {
        this.partnerFloorCards = player.floorCards;
        this.partnerCardCount = player.handCardCount;
      }
    });
    this.turn = state.turn;
    this.backCardCount = state.backCardCount;
    this.floorCards = state.floorCards;
  }

  firstCardClick(num: number) {
    if (!this.room) {
      return;
    }
    console.log("firstPick: " + num);
    this.room.send("firstPick", {
      sessionId: this.sessionId,
      cards: [num]
    });
  }

  handCardClick(num: number) {
    if (this.turn !== this.sessionId) {
      this.toast("칠 차례가 아닙니다.", "is-danger");
      return;
    }
    console.log("Home -> onHandCardSelect -> num", num);
  }

  backCardClick(num: number) {
    console.log("Home -> backCardClick -> num", num);
  }

  onPlayMessage(message: ResponseMessage) {
    if (message.type === "handCards") {
      this.myCards = message.cards as [];
    }
  }

  toast(message: string, type = "is-warning") {
    this.$buefy.snackbar.open({
      duration: 500,
      message: message,
      type,
      position: "is-bottom"
    });
  }
}
</script>

<style lang="sass"></style>
