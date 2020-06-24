/* eslint-disable @typescript-eslint/no-unused-vars */
<template>
  <div>
    <b-button @click="connectServer">Connect</b-button>
    <b-button @click="joinRoom">Join Room</b-button>
    <hr />
    <json-view :data="jsonData" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import * as Colyseus from "colyseus.js";
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JSONView } from "vue-json-component";

@Component({
  props: {},
  components: {
    "json-view": JSONView
  }
})
export default class Home extends Vue {
  client!: Colyseus.Client;

  jsonData: unknown = {
    name: "data"
  };

  constructor() {
    super();
  }

  connectServer() {
    this.client = new Colyseus.Client("ws://127.0.0.1:2567");
    this.jsonData = this.client;
  }

  joinRoom() {
    this.client
      .joinOrCreate("room1")
      .then((room: Colyseus.Room) => {
        console.log(room.sessionId, "joined", room.name);
      })
      .catch((e: unknown) => {
        console.log("JOIN ERROR", e);
        this.jsonData = e;
      });
  }

  // eventRegister(room: Colyseus.Room) {
  //   room.onStateChange((state) => {

  //   });
  // }
}
</script>

<style lang="sass"></style>
