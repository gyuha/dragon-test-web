<template>
  <div>
    <GameState :value="gameState"></GameState>
    <MatgoCards
      @select="firstCardClick"
      v-if="gameState == 'firstPick'"
      :cards="firstSelectCards"
    ></MatgoCards>
    <div v-if="gameState === 'play'">
      <div class="player-card-group">
        <h1>상대 카드({{ opposite.handCardCount }})</h1>
        <MatgoCards :cards="oppositeHandCards"></MatgoCards>

        <h1>상대가 먹은 카드 ({{ opposite.floorCards.length }})</h1>
        <MatgoCards :cards="opposite.floorCards"></MatgoCards>
      </div>

      <h1>바닥 카드({{ floorCards.length }})</h1>
      <MatgoCards :cards="floorCards"></MatgoCards>

      <h1>뒤집힌 카드 ({{ backCardCount }})</h1>
      <MatgoCards
        v-if="backCardCount > 0"
        :cards="[backCard]"
        @select="backCardClick"
      ></MatgoCards>

      <div class="player-card-group">
        <h1>먹은 카드 ({{ my.floorCards.length }})</h1>
        <MatgoCards :cards="my.floorCards"></MatgoCards>

        <h1>내 카드 ({{ myHandCards.length }})</h1>
        <MatgoCards @select="handCardClick" :cards="myHandCards"></MatgoCards>
        <h1 />
      </div>
      <PlayCards :cards="playCards"></PlayCards>
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
    <b-modal
      :active.sync="isSelectModalActive"
      has-modal-card
      :can-cancel="false"
    >
      <form action="">
        <div class="modal-card" style="width: auto">
          <header class="modal-card-head">
            <p class="modal-card-title">Select</p>
          </header>
          <section class="modal-card-body">
            <MatgoCards :cards="selectCards" @select="onSelectCard" />
          </section>
        </div>
      </form>
    </b-modal>
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
import { MatgoCard } from "../matgoSchema/MatgoCard";
import { Player } from "@/matgoSchema/Player";
import {
  MessageType,
  RequestMessageCommand,
  ResponseMessageCommand
} from "@/matgoSchema/MatgoType";
import { ResponseMessage } from "../matgoSchema/ResponseMessage";
import { RequestMessage } from "@/matgoSchema/RequestMessage";
import PlayCards from "@/components/PlayCards.vue";

@Component({
  props: {},
  components: {
    GameState,
    MatgoCards,
    PlayCards,
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

  firstSelectCards: MatgoCard[] = [];

  my: Player = new Player();
  opposite: Player = new Player();

  myHandCards = [];

  floorCards = [];
  selectCards = [];
  playCards = [];
  backCardCount = 0;
  turn = "";

  backCard: MatgoCard = new MatgoCard();
  oppositeHandCards: MatgoCard[] = [];

  isSelectModalActive = false;

  get roomId() {
    return this.room ? this.room.id : "";
  }

  get sessionId() {
    return this.room ? this.room.sessionId : "";
  }

  get gameState() {
    return this.stateData.state;
  }

  oppositeHandCardUpdate() {
    this.oppositeHandCards = [];
    for (let i = 0; i < this.opposite.handCardCount; i++) {
      this.oppositeHandCards.push(this.backCard);
    }
  }

  constructor() {
    super();
    this.backCard.id = -1;
    this.backCard.num = -1;
    this.backCard.tag = -1;
    this.backCard.image = "back";
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
    const host = `ws://${process.env.VUE_APP_SERVER_HOST}`;
    console.log(host);
    this.client = new Colyseus.Client(host);
    this.client
      .joinOrCreate("room1")
      .then((room: Colyseus.Room) => {
        console.log(room);
        this.room = room;
        console.log("Home -> joinRoom -> this.room", this.room.state);
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
    this.room.onStateChange((state: any) => {
      this.stateData = _.clone(state);
      if (this.gameState === "play") {
        this.playCardsDisplay(state);
      }
      this.$forceUpdate();
    });

    //! 게임 시작 여부
    this.room.onMessage(MessageType.startGame, () => {
      this.messageType = "startGame";
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
        this.sendMessage(MessageType.startGame, {
          sessionId: this.sessionId,
          command: RequestMessageCommand.put,
          value: [result.value ? 1 : 0]
        });
      });
    });
    //! 선 고르기
    this.room.onMessage(MessageType.firstPick, (message: ResponseMessage) => {
      this.messageType = "firstSelect";
      this.firstSelectCards = message.cards as MatgoCard[];
      console.log("Home -> eventRegister -> message", message);
    });
    //! 게임 플레이
    this.room.onMessage(MessageType.play, (message: ResponseMessage) => {
      this.messageType = "play";
      this.onPlayMessage(message);
    });

    //! 게임에서 내보내 질때
    this.room.onLeave(code => {
      console.log("Home -> eventRegister -> code", code);
      this.leaveAction();
    });
  }

  playCardsDisplay(state: any) {
    _.forEach(state.players, (player: any) => {
      if (this.sessionId == player.sessionId) {
        this.my = player;
      } else {
        this.opposite = player;
      }
    });
    this.turn = state.turn;
    this.backCardCount = state.backCardCount;
    this.floorCards = state.floorCards;
    this.oppositeHandCardUpdate();
  }

  firstCardClick(num: number) {
    if (!this.room) {
      return;
    }
    console.log("firstPick: " + num);
    this.sendMessage(MessageType.firstPick, {
      command: RequestMessageCommand.none,
      sessionId: this.sessionId,
      value: [num]
    });
  }

  /**
   * 손에 있는 카드 치기
   */
  async handCardClick(idx: number) {
    const command: RequestMessageCommand = RequestMessageCommand.put;
    if (!this.room) {
      return;
    }
    if (this.turn !== this.sessionId) {
      this.toast("칠 차례가 아닙니다.", "is-danger");
      return;
    }

    let ids = this.sameNums(this.myHandCards, idx);

    // 먹을게 2개 이면 그냥 선택한거 치기
    if (ids.length === 2) {
      ids = [idx];
    } else if (ids.length === 3) {
      const sames = this.sameNums(this.floorCards, idx);
      console.log("Home -> handCardClick -> this.floorCards", this.floorCards);
      if (sames.length === 0) {
        // 흔듬 선택
        this.shake(idx);
        return;
      }
    }

    console.log("Home -> onHandCardSelect -> num", idx);
    this.sendMessage(MessageType.play, {
      sessionId: this.sessionId,
      command,
      value: ids
    });
  }

  async shake(idx: number) {
    const result = await this.$swal({
      title: "흔들까요?",
      icon: "question",
      confirmButtonText: "예",
      cancelButtonText: "아니요",
      showCancelButton: true,
      allowOutsideClick: false
    });

    this.sendMessage(MessageType.play, {
      sessionId: this.sessionId,
      command: result ? RequestMessageCommand.shake : RequestMessageCommand.put,
      value: [idx]
    });
  }

  backCardClick(num: number) {
    console.log("Home -> backCardClick -> num", num);
  }

  onPlayMessage(message: ResponseMessage) {
    switch (message.command) {
      case ResponseMessageCommand.handCards:
        this.myHandCards = message.cards as [];
        break;
      case ResponseMessageCommand.take:
        console.warn(message.playCards);
        this.playCards = message.playCards as [];
        break;
      case ResponseMessageCommand.select:
        this.selectCards = message.cards as [];
        this.isSelectModalActive = true;
        this.playCards = message.playCards as [];
        break;
    }
  }

  /**
   * 손에 든 같은 숫자의 갯수
   */
  sameNums(cards: MatgoCard[], idx: number): number[] {
    const nums: number[] = [];
    const num = (this.myHandCards[idx] as MatgoCard).num;
    cards.forEach((card: MatgoCard, index) => {
      if (card.num === num) {
        nums.push(index);
      }
    });
    return nums;
  }

  // 카드 선택하기
  onSelectCard(idx: number) {
    this.isSelectModalActive = false;
    this.sendMessage(MessageType.play, {
      sessionId: this.sessionId,
      command: RequestMessageCommand.select,
      value: [idx]
    } as RequestMessage);
  }

  toast(message: string, type = "is-warning") {
    this.$buefy.snackbar.open({
      duration: 500,
      message: message,
      type,
      position: "is-bottom"
    });
  }

  public sendMessage(type: MessageType, message: RequestMessage) {
    if (this.room) {
      this.room.send(type, message);
    }
  }
}
</script>

<style lang="scss">
.player-card-group {
  background-color: #c4d1b5;
  padding: 10px;
}
</style>
