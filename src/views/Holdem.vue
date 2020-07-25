<template>
  <div>
    <HoldemState :value="gameState"></HoldemState>
    <div class="card">
      <h1>Community Cards</h1>
      <HoldemCards :update="updateDt" :cards="stateData.boardCards"></HoldemCards>
    </div>
    <div v-for="(player, idx) in players" :key="idx">
      <Player
        :sessionId="sessionId"
        :myCards="myCards"
        :currentPosition="stateData.currentPosition"
        :update="updateDt"
        :player="player"
      ></Player>
    </div>
    <hr />
    <json-view :data="stateData" :maxDepth="1" />
    {{ id }} : {{ roomInfo }}
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import HoldemState from '@/components/holdem/HoldemState.vue';
import HoldemCards from '@/components/holdem/HoldemCards.vue';
import Player from '@/components/holdem/Player.vue';
import * as Colyseus from 'colyseus.js';
import Axios from 'axios';
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JSONView } from 'vue-json-component';
import { MessageType } from '@/holdemSchema/MessageType';
import { ResponseMessage } from '@/holdemSchema/ResponseMessage';
import { ResponseMessageCommand } from '@/holdemSchema/ResponseMessageCommand';

@Component({
  props: {
    id: String,
  },
  components: {
    HoldemState,
    HoldemCards,
    Player,
    'json-view': JSONView,
  },
})
export default class Holdem extends Vue {
  client!: Colyseus.Client;
  room: Colyseus.Room | null = null;
  messageType = '';
  stateData = {
    turnState: 0,
    boardCards: [],
    players: [],
    currentPosition: 0,
  };
  roomInfo = {};
  myCards: string[] = [];
  players = [];
  updateDt = 0;

  constructor() {
    super();
  }

  beforeDestory() {
    if (this.room) {
      this.room.leave();
    }
  }

  created() {
    this.roomInfoLoad();
  }

  mounted() {
    this.joinRoom();
  }

  async roomInfoLoad() {
    const host = `//${process.env.VUE_APP_HOLDEM_SERVER_HOST}`;
    const res = await Axios.get(`${host}/api/holdem/room/${this.$props.id}`);
    this.roomInfo = res.data;
  }

  get roomId() {
    return this.room ? this.room.id : '';
  }

  get sessionId() {
    return this.room ? this.room.sessionId : '';
  }

  get gameState() {
    return this.stateData.turnState;
  }

  /**
   * 방 접속 하기
   */
  async joinRoom() {
    const host = `ws://${process.env.VUE_APP_HOLDEM_SERVER_HOST}`;
    this.client = new Colyseus.Client(host);
    this.client
      .joinOrCreate(this.$props.id)
      .then((room: Colyseus.Room) => {
        this.room = room;
        this.eventRegister();
      })
      .catch((e: unknown) => {
        console.log('JOIN ERROR', e);
      });
  }

  eventRegister() {
    if (!this.room) {
      return;
    }
    this.room.onStateChange((state: any) => {
      this.stateData = { ...state };
      this.players = this.stateData.players;
      this.updateDt = +new Date().getTime();
      this.$forceUpdate();
    });

    this.room.onMessage(MessageType.play, (message: ResponseMessage) => {
      this.messageType = 'play';
      this.onPlayMessage(message);
    });
  }

  onPlayMessage(message: ResponseMessage) {
    console.log(message);
    switch (message.command) {
      case ResponseMessageCommand.take:
        this.myCards = message.cards;
        break;
    }
  }
}
</script>

<style lang="scss"></style>
