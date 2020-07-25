<template>
  <div class="player-box-container">
    <div class="player-box no-box">{{ player.positionNumber + 1 }}.</div>
    <div class="player-box avatar-box">
      <img class="avatar" :src="player.avatar" />
      {{ player.name }}
    </div>
    <div class="player-box">
      <HoldemCards :cards="player.comfirmCards"></HoldemCards>
    </div>
    <div class="player-box">
      <div class="buttons">
        <b-button type="is-primary">다이</b-button>
        <b-button type="is-success">체크</b-button>
        <b-button type="is-link">삥</b-button>
        <b-button type="is-info">따당</b-button>
        <b-button type="is-warning">하프</b-button>
        <b-button type="is-danger">올인</b-button>
      </div>
      <b-field grouped group-multiline>
        <div class="control">
          <b-taglist attached>
            <b-tag type="is-dark">playState</b-tag>
            <b-tag type="is-info">{{ printPlayState() }}</b-tag>
          </b-taglist>
        </div>
        <div class="control">
          <b-taglist attached>
            <b-tag type="is-dark">chips</b-tag>
            <b-tag type="is-info">{{ player.chips }}</b-tag>
          </b-taglist>
        </div>
        <div class="control">
          <b-taglist attached>
            <b-tag type="is-dark">chipsOut</b-tag>
            <b-tag type="is-info">{{ player.chipsOut }}</b-tag>
          </b-taglist>
        </div>
        <div class="control">
          <b-taglist attached>
            <b-tag type="is-dark">나가기 예약</b-tag>
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
    }
    return '';
  }

  @Watch('sessionId')
  updateData() {
    this.$forceUpdate();
  }
}
</script>

<style lang="scss">
.player-box-container {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  border-bottom: 2px solid #ddd;
  margin: 20px;
}

.player-box {
  display: inline;
}
.avatar-box {
  width: 120px;
  text-align: center;

  .avatar {
    padding-left: 5px;
    margin: 5px;
    display: block;
    width: 90px;
    border-radius: 50%;
  }
}
.no-box {
  font-size: 18px;
  font-weight: bold;
}
</style>
