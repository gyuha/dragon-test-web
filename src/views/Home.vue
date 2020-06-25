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
    state: "none"
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

  leave() {
    if (!this.room) {
      return;
    }
    console.log("leave room", this.room.id);
    this.stateData = {
      state: "none"
    };
    this.messageType = "";
    this.room.leave();
    this.room = null;
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
    this.room.onStateChange((state: any) => {
      console.log("Home -> eventRegister -> state", state.state);
      this.$buefy.snackbar.open({
        duration: 500,
        message: "Change state : " + JSON.stringify(state).slice(0, 50),
        type: "iswarning",
        position: "is-bottom"
      });
      this.stateData = _.clone(state);
      this.$forceUpdate();
    });
    //! 게임 시작 여부
    this.room.onMessage("startGame", (message) => {
      this.messageType = "startGame";
      console.log("Home -> eventRegister -> message", message);
      this.$swal('test');
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
  }

  onSelectCard(num: number) {
    if (!this.room) {
      return;
    }
    console.log(num);
    if (this.gameState === "firstPick") {
      this.room.send("firstPick", {
        sessionId: this.sessionId,
        value: [num],
      });
    }
  }
}
</script>

<style lang="sass"></style>
