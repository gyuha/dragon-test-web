<template>
  <div>
    {{ id }}
    <HoldemState :value="gameState"></HoldemState>
    <div class="card">
      <h1>Community Cards</h1>
      <HoldemCards :update="updateDt" :cards="stateData.boardCards"></HoldemCards>
      <h2>배팅액 : {{ stateData.betAmount }}</h2>
    </div>
    <div v-for="(player, idx) in players" :key="idx">
      <Player
        :sessionId="sessionId"
        :myCards="myCards"
        :myRank="myRank"
        :currentPosition="stateData.currentPosition"
        :update="updateDt"
        :player="player"
        :gameState="gameState"
        @playMessage="playMessage"
      ></Player>
    </div>
    <hr />
    <json-view :data="stateData" />
    {{ id }} : {{ roomInfo }}
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import HoldemState from '@/components/holdem/HoldemState.vue';
import HoldemCards from '@/components/holdem/HoldemCards.vue';
import Player from '@/components/holdem/Player.vue';
import * as Colyseus from 'colyseus.js';
import Axios from 'axios';
// @ts-ignore
import { JSONView } from 'vue-json-component';
import { MessageType } from '@/holdemSchema/MessageType';
import { ResponseMessage } from '@/holdemSchema/ResponseMessage';
import { ResponseMessageCommand } from '@/holdemSchema/ResponseMessageCommand';
import { RequestMessage } from '@/holdemSchema/RequestMessage';
import { HoldemTurnState } from '@/holdemSchema/HoldemTypes';
import { jsonHighlight } from '../libs/jsonHighlight';
import '@/libs/pre.css';

@Component({
  props: {},
  components: {
    HoldemState,
    HoldemCards,
    Player,
    'json-view': JSONView,
  },
  beforeRouteLeave(to, from, next) {
    // @ts-ignore
    this.room.leave();
    next();
  },
})
export default class Holdem extends Vue {
  @Prop()
  id: string;

  @Prop()
  token: string;

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
  myRank = 0;
  players = [];
  updateDt = 0;

  commandText = ['none', '다이', '체크', '삥', '콜', '따당', '하프', '올인', '나가기 예약'];

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
    const res = await Axios.get(`${host}/api/holdem/room/${this.id}`);
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

  sessionPlayer(sessionId: string) {
    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i] as any;
      if (player.sessionId === sessionId) {
        return this.players[i];
      }
    }
    return null;
  }

  gameEnd() {
    if (this.stateData.turnState !== HoldemTurnState.FINISHED) {
      return;
    }
    for (let i = 0; i < this.stateData.players.length; i++) {
      const player: any = this.stateData.players[i];
      if (player.sessionId === this.sessionId) {
        if (player.amount === 0) {
          // this.$swal('END');
          this.beforeDestory();
          setTimeout(() => {
            this.$router.push('/');
          }, 2000);
          return;
        }
      }
    }
  }

  /**
   * 방 접속 하기
   */
  async joinRoom() {
    const host = `ws://${process.env.VUE_APP_HOLDEM_SERVER_HOST}`;
    this.client = new Colyseus.Client(host);
    this.client
      .joinOrCreate(this.id, {
        token: this.token,
      })
      .then((room: Colyseus.Room) => {
        this.room = room;
        this.eventRegister();
      })
      .catch(async (e: unknown) => {
        await this.$swal({ title: 'Error', html: jsonHighlight(e) });
        // this.$router.push('/lobby/' + this.token);
        location.href = '/lobby/' + this.token;
        // location.reload();
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
      this.gameEnd();
      this.$forceUpdate();
    });

    this.room.onMessage(MessageType.play, (message: ResponseMessage) => {
      this.messageType = 'play';
      this.onPlayMessage(message);
    });

    this.room.onMessage(MessageType.error, (message: ResponseMessage) => {
      console.log(message);
      this.messageType = 'error';
      this.$router.push('/lobby/' + this.token);
    });

    this.room.onMessage(MessageType.jackpot, (message: ResponseMessage) => {
      this.toast(String(JSON.stringify(message)), undefined, 10000);
    });

    //! 게임에서 내보내 질때
    this.room.onLeave((code) => {
      console.log(code);
      // this.$swal('나가요~');
      this.$router.push('/lobby/' + this.token);
    });
  }

  onPlayMessage(message: ResponseMessage) {
    switch (message.command) {
      case ResponseMessageCommand.take:
        this.myCards = message.cards as string[];
        if (message.value) {
          this.myRank = message.value[0];
        }
        break;
      case ResponseMessageCommand.result:
        if (message.value) {
          this.myRank = message.value[0];
        }
        break;
      case ResponseMessageCommand.play:
        console.warn(message);
        if (message.sessionId) {
          console.log(this.sessionPlayer(message.sessionId));
          const player = this.sessionPlayer(message.sessionId) as any;
          if (!player) {
            return;
          }
          this.$swal({
            title:
              String(message.playCommand) + '.' + this.commandText[Number(message.playCommand)],
            html: `<img src="/img/avatar/${player.avatar}.png" width="110"/> <h1 style="font-size: 30px">${player.name}</h1>`,
            timer: 1000,
            showConfirmButton: false,
          });
        }
        // this.toast(String(message.playCommand));
        // this.$swal({ title: 'Game over', text: JSON.stringify(message.results), timer: 2000 });
        break;
      case ResponseMessageCommand.end:
        this.$swal({ title: 'Game over', text: JSON.stringify(message.results), timer: 2000 });
        break;
    }
  }

  sendMessage(type: MessageType, message: RequestMessage) {
    if (this.room) {
      this.room.send(type, message);
    }
  }

  playMessage(message: RequestMessage) {
    console.log(message);
    this.sendMessage(MessageType.play, message);
  }

  toast(message: string, type = 'is-warning', duration = 1000) {
    this.$buefy.snackbar.open({
      duration,
      message: message,
      type,
      position: 'is-bottom',
    });
  }
}
</script>

<style lang="scss">
h2 {
  font-weight: 400;
  font-size: 30px;
}
</style>
