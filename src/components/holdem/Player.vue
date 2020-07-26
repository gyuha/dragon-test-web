<template>
  <div class="player-box-container" :class="{ 'player-box-container-enable': currentPlayer() }">
    <div class="player-box no-box">{{ player.positionNumber + 1 }}.</div>
    <div class="player-box avatar-box">
      <img
        class="avatar"
        :src="player.avatar"
        :class="{ 'avatar-enable': sessionId === player.sessionId }"
      />
      <b-tag v-if="player.playState !== 0" type="is-info"> {{ printPlayState() }} </b-tag>
      {{ player.name }}
    </div>
    <div class="player-box">
      <HoldemCards v-if="me" :update="update" :cards="myCards"></HoldemCards>
      <HoldemCards v-else :update="update" :cards="player.comfirmCards"></HoldemCards>
      <b-tag v-if="player.isDie" type="is-danger"> 다이 </b-tag>
    </div>
    <div class="player-box">
      <div class="buttons">
        <b-button @click="sendPlayMessage(0)" :disabled="buttonDisable(0)" type="is-primary"
          >다이</b-button
        >
        <b-button @click="sendPlayMessage(1)" :disabled="buttonDisable(1)" type="is-success"
          >체크</b-button
        >
        <b-button @click="sendPlayMessage(2)" :disabled="buttonDisable(2)" type="is-success"
          >삥</b-button
        >
        <b-button @click="sendPlayMessage(3)" :disabled="buttonDisable(3)" type="is-info"
          >콜</b-button
        >
        <b-button @click="sendPlayMessage(4)" :disabled="buttonDisable(4)" type="is-info"
          >따당</b-button
        >
        <b-button @click="sendPlayMessage(5)" :disabled="buttonDisable(5)" type="is-warning"
          >하프</b-button
        >
        <b-button @click="sendPlayMessage(6)" :disabled="buttonDisable(6)" type="is-danger"
          >올인</b-button
        >
      </div>
      <b-field grouped group-multiline>
        <div class="control">
          <b-taglist attached>
            <b-tag type="is-dark">소지금</b-tag>
            <b-tag type="is-info">{{ player.amount }}</b-tag>
          </b-taglist>
        </div>
        <div class="control">
          <b-taglist attached>
            <b-tag type="is-dark">현재턴 배팅액</b-tag>
            <b-tag type="is-info">{{ player.currentTurnBetAmount }}</b-tag>
          </b-taglist>
        </div>
        <div class="control">
          <b-taglist attached>
            <b-tag type="is-dark">판 배팅액</b-tag>
            <b-tag type="is-info">{{ player.betAmount }}</b-tag>
          </b-taglist>
        </div>
        <div class="control">
          <b-taglist attached>
            <b-tag type="is-dark">나가기</b-tag>
            <b-tag type="is-info">{{ player.existReserve ? 'Yes' : 'No' }}</b-tag>
          </b-taglist>
        </div>
      </b-field>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import HoldemCards from './HoldemCards.vue';

@Component({
  components: {
    HoldemCards,
  },
})
export default class Player extends Vue {
  @Prop(Object)
  player: any;

  @Prop(Number)
  currentPosition: number;

  @Prop(Number)
  update: number;

  @Prop(Array)
  myCards: string[];

  @Prop(String)
  sessionId: string;

  printPlayState(): string {
    switch (this.$props.player.playState) {
      case 0:
        return 'None';
      case 1:
        return 'Ready';
      case 2:
        return 'S.B';
      case 3:
        return 'B.B';
      case 4:
        return 'Play';
    }
    return '';
  }

  get me() {
    return this.player.sessionId === this.sessionId;
  }

  @Watch('update')
  updateData() {
    this.$forceUpdate();
  }

  buttonDisable(num: number): boolean {
    if (!this.currentPlayer() || this.sessionId !== this.player.sessionId) {
      return true;
    }
    // if (this.sessionId === this.player.sessionId) {
    //   return true;
    // }
    return !this.player.buttons[num];
  }

  currentPlayer() {
    return this.player.positionNumber === this.currentPosition;
  }

  sendPlayMessage(command: number) {
    console.log('Player -> sendPlayMessage -> command', command);
    this.$emit('playMessage', {
      sessionId: this.sessionId,
      command,
    });
  }
}
</script>

<style lang="scss">
.player-box-container {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  border-bottom: 2px solid #ddd;
  padding: 15px;
  &-enable {
    background-color: #cdffd5;
  }
}

.player-box {
  display: inline;
}
.avatar-box {
  width: 120px;
  text-align: center;

  .avatar {
    margin: 5px;
    display: block;
    width: 90px;
    border-radius: 50%;

    &-enable {
      border: 8px solid red;
    }
  }
}
.no-box {
  font-size: 18px;
  font-weight: bold;
}
</style>
