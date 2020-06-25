<template>
  <div>
    <h1>ROOM ID : {{ roomId }}</h1>
    <GameState :value="gameState"></GameState>
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
    <b-button @click="joinRoom">Join Room</b-button>
    <b-button @click="leave">Leave</b-button>
    <hr />
    <MatgoCards
      @select="onSelectCard"
      v-if="gameState == 'firstPick'"
      :cards="firstSelectCards"
    ></MatgoCards>
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

@Component({
  props: {},
  components: {
    GameState,
    MatgoCards,
    "json-view": JSONView,
  },
})
export default class Home extends Vue {
  client!: Colyseus.Client;
  room: Colyseus.Room | null = null;
  messageType = "";

  stateData = {
    state: "none",
  };

  firstSelectCards = [];

  get roomId() {
    return this.room ? this.room.id : "";
  }

  get sessionId() {
    return this.room ? this.room.sessionId : "";
  }

  get gameState() {
    return this.stateData.state;
  }

  constructor() {
    super();
  }

  leaveAction() {
    this.stateData = {
      state: "none",
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
      this.$buefy.snackbar.open({
        duration: 500,
        message: "Change state : " + JSON.stringify(state).slice(0, 50),
        type: "iswarning",
        position: "is-bottom",
      });
      this.stateData = _.clone(state);
      this.$forceUpdate();
    });
    //! 게임 시작 여부
    this.room.onMessage("startGame", (message) => {
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
        cancelButtonText: "내보내기",
      }).then((result: any) => {
        console.log(result);
        room.send("startGame", {
          value: result.value ? true : false,
        });
      });
    });
    //! 선 고르기
    this.room.onMessage("firstSelect", (message) => {
      this.messageType = "firstSelect";
      this.firstSelectCards = message.cards;
      console.log("Home -> eventRegister -> message", message);
    });
    //! 게임 플레이
    this.room.onMessage("play", (message) => {
      this.messageType = "play";
      console.log("Home -> eventRegister -> message", message);
      this.firstSelectCards = message.cards;
    });

    //! 게임에서 내보내 질때
    this.room.onLeave((code) => {
      console.log("Home -> eventRegister -> code", code);
      this.leaveAction();
    });

    this.room.onMessage("put", (message) => {
      this.messageType = "put";
      this.firstSelectCards = message.cards;
    })
  }

  onSelectCard(num: number) {
    if (!this.room) {
      return;
    }
    console.log(num);
    if (this.gameState === "firstPick") {
      this.room.send("firstPick", {
        sessionId: this.sessionId,
        cards: [num],
      });
    }
  }
}
</script>

<style lang="sass"></style>
