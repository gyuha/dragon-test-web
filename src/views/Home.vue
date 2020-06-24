<template>
  <div>
    <h1>ROOM ID : {{ roomId }}</h1>
    <GameState :value="gameState"></GameState>
    <b-button @click="joinRoom">Join Room</b-button>
    <b-button @click="leave">Leave</b-button>
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

@Component({
  props: {},
  components: {
    GameState,
    "json-view": JSONView,
  },
})
export default class Home extends Vue {
  client!: Colyseus.Client;
  room!: Colyseus.Room;
  roomId = "";

  stateData = {
    state: "none"
  };

  get gameState() {
    return this.stateData.state;
  }

  constructor() {
    super();
  }

  leave() {
    console.log("leave room", this.room.id);
    this.stateData = {
      state: "none"
    };
    this.roomId = "";
    this.room.leave();
  }

  joinRoom() {
    this.client = new Colyseus.Client("ws://127.0.0.1:2567");
    this.client
      .joinOrCreate("room1")
      .then((room: Colyseus.Room) => {
        console.log(room);
        this.room = room;
        this.roomId = room.id;
        this.eventRegister();
      })
      .catch((e: unknown) => {
        console.log("JOIN ERROR", e);
      });
  }

  eventRegister() {
    this.room.onStateChange((state: any) => {
      this.$buefy.snackbar.open({
        duration: 500,
        message: "Change state : " + JSON.stringify(state).slice(0, 50),
        type: "iswarning",
        position: "is-bottom"
      });
      this.stateData = _.clone(state);
      this.$forceUpdate();
    });
  }
}
</script>

<style lang="sass"></style>
