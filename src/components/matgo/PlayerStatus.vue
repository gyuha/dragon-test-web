<template>
  <b-field grouped group-multiline>
    <div class="control">
      <b-taglist attached>
        <b-tag type="is-dark">점수</b-tag>
        <b-tag type="is-info">{{ status.score }}</b-tag>
      </b-taglist>
    </div>
    <div class="control">
      <b-taglist attached>
        <b-tag type="is-dark">고</b-tag>
        <b-tag type="is-info">{{ status.goCount }}</b-tag>
      </b-taglist>
    </div>
    <div class="control">
      <b-taglist attached>
        <b-tag type="is-dark">흔듬</b-tag>
        <b-tag type="is-info">{{ status.shake }}</b-tag>
      </b-taglist>
    </div>
    <div class="control">
      <b-taglist attached>
        <b-tag type="is-dark">청단</b-tag>
        <b-tag type="is-info">{{ status.cheongDan }}</b-tag>
      </b-taglist>
    </div>
    <div class="control">
      <b-taglist attached>
        <b-tag type="is-dark">초단</b-tag>
        <b-tag type="is-info">{{ status.choDan }}</b-tag>
      </b-taglist>
    </div>
    <div class="control">
      <b-taglist attached>
        <b-tag type="is-dark">홍단</b-tag>
        <b-tag type="is-info">{{ status.hongDan }}</b-tag>
      </b-taglist>
    </div>
    <div class="control">
      <b-taglist attached>
        <b-tag type="is-dark">고도리</b-tag>
        <b-tag type="is-info">{{ status.godori }}</b-tag>
      </b-taglist>
    </div>
    <div class="control">
      <b-taglist attached>
        <b-tag type="is-dark">광박</b-tag>
        <b-tag type="is-info">{{ status.kwangBak }}</b-tag>
      </b-taglist>
    </div>
    <div class="control">
      <b-taglist attached>
        <b-tag type="is-dark">피박</b-tag>
        <b-tag type="is-info">{{ status.peeBak }}</b-tag>
      </b-taglist>
    </div>
  </b-field>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
@Component({
  props: {
    status: {
      type: Object
    }
  },
  components: {}
})
export default class PlayerStatus extends Vue {}
</script>

<style lang="sass"></style>
