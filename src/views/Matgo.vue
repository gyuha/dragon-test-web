<template>
  <div>
    <GameState :value="gameState"></GameState>
    <MatgoCards
      @select="firstCardClick"
      v-if="gameState == 'firstPick'"
      :cards="firstSelectCards"
    ></MatgoCards>
    <div v-if="gameState === 'play' || gameState === 'end'">
      <div class="player-card-group" :class="[oppsiteBg()]">
        <h1>상대 카드({{ opposite.handCardCount }})</h1>
        <MatgoCards :cards="oppositeHandCards"></MatgoCards>

        <h1>상대가 먹은 카드 ({{ opposite.floorCards.length }})</h1>
        <MatgoCards :cards="opposite.floorCards"></MatgoCards>
        <PlayerStatus :status="oppositeStatus"></PlayerStatus>
      </div>

      <div v-if="gameState === 'play'">
        <h1>뒤집힌 카드 ({{ backCardCount }})</h1>
        <MatgoCards
          v-if="backCardCount > 0"
          :cards="[backCard]"
          @select="backCardClick"
        ></MatgoCards>
        <h1>바닥 카드({{ floorCards.length }})</h1>
        <MatgoCards :cards="floorCards"></MatgoCards>
      </div>
      <div v-else-if="gameState === 'end'">
        <h1>점수</h1>
        <h2><b-tag v-if="my.startReady" type="is-dark">시작대기</b-tag></h2>
        <b-button type="is-info" @click="playStart">다음게임</b-button>
        <b-button
          type="is-danger"
          @click="
            playLeave();
            $router.push('/');
          "
          >나가기</b-button
        >
      </div>

      <div class="player-card-group" :class="[myBg()]">
        <h1>먹은 카드 ({{ my.floorCards.length }})</h1>
        <MatgoCards :cards="my.floorCards"></MatgoCards>

        <h1>내 카드 ({{ myHandCards.length }})</h1>
        <MatgoCards @select="handCardClick" :cards="myHandCards"></MatgoCards>
        <PlayerStatus :status="myStatus"></PlayerStatus>
        <h1 />
      </div>
      <PlayCards :cards="playCards"></PlayCards>
    </div>
    <hr />
    <div class="columns">
      <div class="column">
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
        <b-button type="is-info" @click="joinRoom" :disabled="gameState != 'none'"
          >Join Room</b-button
        >
        <b-button type="is-danger" @click="leave" :disabled="gameState == 'none'">Leave</b-button>
        <b-button
          type="is-danger"
          @click="
            playLeave();
            $router.push('/');
          "
          :disabled="gameState == 'play'"
          >Lobby</b-button
        >
      </div>
    </div>
    <b-modal :active.sync="isSelectModalActive" has-modal-card :can-cancel="false">
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
    <hr />
    <json-view :data="stateData" />
    {{ id }} : {{ roomInfo }}
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import * as Colyseus from 'colyseus.js';
// @ts-ignore
import { JSONView } from 'vue-json-component';
import GameState from '@/components/matgo/GameState.vue';
import _ from 'lodash';
import MatgoCards from '@/components/matgo/MatgoCards.vue';
import { MatgoCard, CardType } from '../matgoSchema/MatgoCard';
import { Player } from '@/matgoSchema/Player';
import {
  MessageType,
  RequestMessageCommand,
  ResponseMessageCommand,
  GoStopCommand,
  TurnCommand,
} from '@/matgoSchema/MatgoType';
import { ResponseMessage } from '../matgoSchema/ResponseMessage';
import { RequestMessage } from '@/matgoSchema/RequestMessage';
import PlayCards from '@/components/matgo/PlayCards.vue';
import PlayerStatus from '@/components/matgo/PlayerStatus.vue';
import Axios from 'axios';

@Component({
  props: {},
  components: {
    GameState,
    MatgoCards,
    PlayCards,
    PlayerStatus,
    'json-view': JSONView,
  },
})
export default class Matgo extends Vue {
  @Prop()
  id: string;

  @Prop()
  token: string;

  client!: Colyseus.Client;
  room: Colyseus.Room | null = null;
  messageType = '';

  stateData = {
    state: 'none',
  };

  firstSelectCards: MatgoCard[] = [];

  my: Player = new Player();
  opposite: Player = new Player();
  myStatus: any;
  oppositeStatus: any;

  myHandCards = [];

  floorCards = [];
  selectCards = [];
  playCards = [];
  backCardCount = 0;
  turn = '';

  backCard: MatgoCard = new MatgoCard();
  oppositeHandCards: MatgoCard[] = [];

  isSelectModalActive = false;

  startDelay = 750; //! 게임을 시작하자 마자 카드를 내면 안 됨 애니메이션 대기 시간이 필요
  playStated = false; //! 게임 시작 중인지 체크

  roomInfo = {};

  created() {
    this.roomInfoLoad();
  }

  beforeDestory() {
    if (this.room) {
      this.room.leave();
    }
  }

  async roomInfoLoad() {
    const host = `//${process.env.VUE_APP_MATGO_SERVER_HOST}`;
    const res = await Axios.get(`${host}/api/matgo/room/${this.id}`);
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

  oppsiteBg() {
    return this.sessionId === (this.stateData as any).turn ? 'next-turn' : 'current-turn';
  }
  myBg() {
    return this.sessionId === (this.stateData as any).turn ? 'current-turn' : 'next-turn';
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
    this.backCard.image = 'back';
  }

  leaveAction() {
    this.stateData = {
      state: 'none',
    };
    this.messageType = '';
    this.room = null;
  }

  leave() {
    if (!this.room) {
      return;
    }
    console.log('leave room', this.room.id);
    this.room.leave();
    this.leaveAction();
  }

  /**
   * 방 접속 하기
   */
  joinRoom() {
    const host = `ws://${process.env.VUE_APP_MATGO_SERVER_HOST}`;
    console.log(host);
    this.client = new Colyseus.Client(host);
    this.client
      .joinOrCreate(this.id, {
        token: this.token,
      })
      .then((room: Colyseus.Room) => {
        console.log(room);
        this.room = room;
        console.log('Home -> joinRoom -> this.room', this.room.state);
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
      this.stateData = _.clone(state);
      if (this.gameState === 'play') {
        this.playCardsDisplay(state);
      }
      this.$forceUpdate();
    });

    //! 게임 시작 여부
    this.room.onMessage(MessageType.startGame, () => {
      this.messageType = 'startGame';
      this.$swal({
        title: '게임 시작',
        text: '사용자가 입장 했습니다.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '시작',
        cancelButtonText: '내보내기',
      }).then((result: any) => {
        console.log(result);
        this.sendMessage(MessageType.startGame, {
          sessionId: this.sessionId,
          command: RequestMessageCommand.put,
          value: [result.value ? 1 : 0],
        });
      });
    });
    //! 선 고르기
    this.room.onMessage(MessageType.firstPick, (message: ResponseMessage) => {
      this.messageType = 'firstSelect';
      this.firstSelectCards = message.cards as MatgoCard[];
      console.log('Home -> eventRegister -> message', message);
    });

    //! 게임 플레이
    this.room.onMessage(MessageType.play, (message: ResponseMessage) => {
      this.messageType = 'play';
      this.onPlayMessage(message);
    });

    //! 게임에서 내보내 질때
    this.room.onLeave((code) => {
      console.log('Home -> eventRegister -> code', code);
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
    _.forEach(state.status, (status: any, key: string) => {
      console.log(key);
      if (this.sessionId == key) {
        this.myStatus = { ...status };
      } else {
        this.oppositeStatus = { ...status };
      }
    });
    this.turn = state.turn;
    this.backCardCount = state.backCardCount;
    this.floorCards = state.floorCards;
    this.oppositeHandCardUpdate();
    this.$forceUpdate();
  }

  firstCardClick(num: number) {
    if (!this.room) {
      return;
    }
    console.log('firstPick: ' + num);
    this.sendMessage(MessageType.firstPick, {
      command: RequestMessageCommand.none,
      sessionId: this.sessionId,
      value: [num],
    });
  }

  /**
   * 손에 있는 카드 치기
   */
  async handCardClick(idx: number) {
    if (this.playStated === false) {
      this.toast('애니메이션이 끝날때 까지 대기..', 'is-danger');
      return;
    }
    if (this.stateData.state !== 'play') {
      return;
    }
    const command: RequestMessageCommand = RequestMessageCommand.put;
    if (!this.room) {
      return;
    }
    if (this.turn !== this.sessionId) {
      this.toast('칠 차례가 아닙니다.', 'is-danger');
      return;
    }

    let ids = this.sameNums(this.myHandCards, idx);

    // 먹을게 2개 이면 그냥 선택한거 치기
    if (ids.length === 2 || ids.length === 4) {
      ids = [idx];
    } else if (ids.length === 3) {
      const sames = this.sameNums(this.floorCards, idx);
      console.log('Home -> handCardClick -> this.floorCards', this.floorCards);
      if (sames.length === 0) {
        // 흔듬 선택
        this.shake(idx);
        return;
      }
    }

    console.log('Home -> onHandCardSelect -> num', idx);
    this.sendMessage(MessageType.play, {
      sessionId: this.sessionId,
      command,
      value: ids,
    });
  }

  async shake(idx: number) {
    const result = await this.$swal({
      title: '흔들까요?',
      icon: 'question',
      confirmButtonText: '예',
      cancelButtonText: '아니요',
      showCancelButton: true,
      allowOutsideClick: false,
    });

    this.sendMessage(MessageType.play, {
      sessionId: this.sessionId,
      command: result ? RequestMessageCommand.shake : RequestMessageCommand.put,
      value: [idx],
    });
  }

  backCardClick(num: number) {
    console.log('Home -> backCardClick -> num', num);
  }

  onPlayMessage(message: ResponseMessage) {
    switch (message.command) {
      case ResponseMessageCommand.handCards:
        this.playStated = false;
        this.myHandCards = message.cards as [];
        setTimeout(this.setStartDelay, this.startDelay);
        break;
      case ResponseMessageCommand.startReady:
        this.playStated = false;
        this.requestMessage(RequestMessageCommand.startBonus);
        setTimeout(this.setStartDelay, this.startDelay);
        break;
      case ResponseMessageCommand.take:
        console.warn(message.playCards);
        this.playCards = message.playCards as [];
        this.turnCommand(message);
        break;
      case ResponseMessageCommand.select:
        this.selectCards = message.cards as [];
        this.isSelectModalActive = true;
        this.playCards = message.playCards as [];
        break;
      case ResponseMessageCommand.kookjin:
        this.playCards = message.playCards as [];
        this.selectKookjin();
        break;
    }
    if (
      message.command !== ResponseMessageCommand.handCards &&
      message.sessionId === this.sessionId
    ) {
      this.requestMessage(RequestMessageCommand.handCards);
    }
  }

  setStartDelay() {
    this.playStated = true;
  }

  requestMessage(req: RequestMessageCommand) {
    this.sendMessage(MessageType.play, {
      sessionId: this.sessionId,
      command: req,
    } as RequestMessage);
  }

  turnCommand(message: ResponseMessage) {
    switch (message.turn) {
      case TurnCommand.complete: //! 턴이 완료 이면 다음턴으로 보낸다.
        if (message.sessionId !== this.sessionId) return;
        this.sendMessage(MessageType.play, {
          command: RequestMessageCommand.turnEnd,
        } as RequestMessage);
        break;
      case TurnCommand.goOrStop:
        this.gostopModal(message);
        break;
      case TurnCommand.chongTong:
        this.chongTongModal(message);
        break;
      case TurnCommand.lastTurnStop:
        this.lastStopModal(message);
        break;
    }
  }

  requestHandCards() {
    this.sendMessage(MessageType.play, {
      sessionId: this.sessionId,
      command: RequestMessageCommand.handCards,
    } as RequestMessage);
  }

  /**
   * 손에 든 같은 숫자의 갯수
   */
  sameNums(cards: MatgoCard[], idx: number): number[] {
    const nums: number[] = [];
    const num = (this.myHandCards[idx] as MatgoCard).num;
    if (cards[idx].cardType === CardType.BOMB) {
      return [idx];
    }
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
      value: [idx],
    } as RequestMessage);
  }

  onGoStop(message: ResponseMessage) {
    if (!message.value) {
      return;
    }
    const command = message.value[0];

    switch (command) {
      case GoStopCommand.go:
        break;
      case GoStopCommand.stop:
        break;
    }
  }

  // 고스톱 모달
  async gostopModal(message: ResponseMessage) {
    if (message.sessionId !== this.sessionId || !message.value) {
      return;
    }
    console.log(message.value);
    const result = await this.$swal({
      title: `${this.myStatus.goCount + 1}고하시겠습니까?<br/>점수: ${
        message.value[0]
      }<br/> 상금 : ${message.value[1]}`,
      icon: 'question',
      confirmButtonText: '예',
      cancelButtonText: '아니요',
      showCancelButton: true,
      allowOutsideClick: false,
    });

    this.sendMessage(MessageType.play, {
      sessionId: this.sessionId,
      command: RequestMessageCommand.goStop,
      value: [result.value ? GoStopCommand.go : GoStopCommand.stop],
    });
  }

  async lastStopModal(message: ResponseMessage) {
    if (message.sessionId !== this.sessionId || !message.value) {
      return;
    }
    console.log(message.value);
    await this.$swal({
      title: `났습니다.<br/>점수: ${message.value[0]}<br/> 상금 : ${message.value[1]}`,
      icon: 'success',
      confirmButtonText: '예',
      allowOutsideClick: false,
    });
  }

  async chongTongModal(message: ResponseMessage) {
    console.log(message);
    const result = await this.$swal({
      title: '총통?',
      icon: 'success',
      confirmButtonText: 'OK',
      cancelButtonText: '아니요',
      showCancelButton: true,
      allowOutsideClick: false,
    });
    console.log(result);
  }

  async selectKookjin() {
    const result = await this.$swal({
      title: '국진을 쌍피로 쓰시겠습니까?',
      icon: 'question',
      confirmButtonText: '예',
      cancelButtonText: '아니요',
      showCancelButton: true,
      allowOutsideClick: false,
    });

    this.sendMessage(MessageType.play, {
      sessionId: this.sessionId,
      command: RequestMessageCommand.kookjin,
      value: [result.value ? 1 : 0],
    });
  }

  toast(message: string, type = 'is-warning') {
    this.$buefy.snackbar.open({
      duration: 500,
      message: message,
      type,
      position: 'is-bottom',
    });
  }

  public sendMessage(type: MessageType, message: RequestMessage) {
    if (this.room) {
      this.room.send(type, message);
    }
  }

  /**
   * 게임 다시 하기
   */
  playStart() {
    this.sendMessage(MessageType.end, {
      command: RequestMessageCommand.playStart,
    } as RequestMessage);
  }

  /**
   * 게임 끝내기
   * @ 그냥 끝내도 되지만.. 서버에서 데이터 정리를 위해서... ^^;
   */
  playLeave() {
    this.sendMessage(MessageType.end, {
      command: RequestMessageCommand.playLeave,
    } as RequestMessage);
  }
}
</script>

<style lang="scss">
.player-card-group {
  padding: 10px;
}

.next-turn {
  background-color: #e6ecdf;
}

.current-turn {
  background-color: #93b88b;
}
</style>
