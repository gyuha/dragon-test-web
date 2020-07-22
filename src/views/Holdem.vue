<template>
  <div>
    <HoldemState value="0"></HoldemState>
    <h1>Community Cards</h1>
    <HoldemCards :cards="[]"></HoldemCards>
    <hr />
    <json-view :data="stateData" />
    {{ id }} : {{ roomInfo }}
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import HoldemState from '@/components/holdem/HoldemState.vue';
import HoldemCards from '@/components/holdem/HoldemCards.vue';
import * as Colyseus from 'colyseus.js';
import Axios from 'axios';
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JSONView } from 'vue-json-component';

@Component({
  props: {
    id: String,
  },
  components: {
    HoldemState,
    HoldemCards,
    'json-view': JSONView,
  },
})
export default class Holdem extends Vue {
  client!: Colyseus.Client;
  room: Colyseus.Room | null = null;
  messageType = '';
  stateData = {
    state: 0,
  };
  roomInfo = {};

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

  onMount() {
    this.joinRoom();
  }

  async roomInfoLoad() {
    const host = `//${process.env.VUE_APP_SERVER_HOST}`;
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
    return this.stateData.state;
  }

  /**
   * 방 접속 하기
   */
  async joinRoom() {
    const host = `ws://${process.env.VUE_APP_SERVER_HOST}`;
    console.log(host);
    this.client = new Colyseus.Client(host);
    this.client
      .joinOrCreate(this.$props.id)
      .then((room: Colyseus.Room) => {
        console.log(room);
        this.room = room;
        // console.log('Home -> joinRoom -> this.room', this.room.state);
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
      console.log(state);
      // this.stateData = _.clone(state);
      // if (this.gameState === 'play') {
      //   this.playCardsDisplay(state);
      // }
      this.$forceUpdate();
    });
  }
}
</script>

<style lang="scss"></style>
