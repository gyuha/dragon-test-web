<template>
  <div class="lobby">
    {{ user }}
    <h1>무명 맞고</h1>
    <b-carousel-list v-model="page" :data="matgoRooms" :arrow-hover="false" :items-to-show="6">
      <template slot="item" slot-scope="props">
        <router-link :to="'/matgo/' + props.list.id + '/' + token">
          <div class="thecard">
            <!--
            <div class="card-img">
              <img :src="'/img/cards/' + props.list.icon + '.png'" />
            </div>
            -->
            <div class="card-caption">
              <span class="date"> {{ props.list.name }} / {{ props.list.grade }}</span>
              <h2>점 {{ props.list.point }}</h2>
              <p>최소금액 : {{ props.list.money }}</p>
            </div>
            <div class="card-outmore">
              <h5>Play</h5>
              <b-icon icon="play" size="is-small"> </b-icon>
            </div>
          </div>
        </router-link>
      </template>
    </b-carousel-list>
    <h1>텍사스 홀덤</h1>
    <b-carousel-list v-model="page" :data="holdemRooms" :arrow-hover="false" :items-to-show="6">
      <template slot="item" slot-scope="props">
        <router-link :to="'/holdem/' + props.list.id + '/' + token">
          <div class="thecard">
            <!--
            <div class="card-img">
              <img :src="'/img/pokers/' + props.list.icon + '.png'" />
            </div>
            -->
            <div class="card-caption">
              <span class="date"> {{ props.list.name }} / {{ props.list.grade }}</span>
              <h2>점 {{ props.list.point }}</h2>
              <p>최소금액 : {{ props.list.money }}</p>
            </div>
            <div class="card-outmore">
              <h5>Play</h5>
              <b-icon icon="play" size="is-small"> </b-icon>
            </div>
          </div>
        </router-link>
      </template>
    </b-carousel-list>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

interface MatgoRooms {
  id: string;
  level: number;
  name: string;
  grade: string;
  icon: string;
  point: number;
  money: number;
}

interface HoldemRooms {
  id: string;
  level: number;
  name: string;
  grade: string;
  icon: string;
  point: number;
  money: number;
}

@Component({
  props: {},
  components: {},
})
export default class Lobby extends Vue {
  @Prop()
  token: string;

  matgoRooms: MatgoRooms[] = [];
  holdemRooms: HoldemRooms[] = [];
  page = 0;

  mounted() {
    this.matgoLobby();
    this.holdemLobby();
    this.userInfo();
  }

  user = {};

  async userInfo() {
    const url = `//${process.env.VUE_APP_DRAGON_SERVER_HOST}/api/user/info/${this.token}`;
    const res = await this.$http.get(url);
    if (!res || res.data.result !== 0) {
      this.$swal('auth error');
      return;
    }
    this.user = res.data.data;
  }

  async matgoLobby() {
    console.log(process.env.VUE_APP_MATGO_SERVER_HOST);
    const url = `//${process.env.VUE_APP_MATGO_SERVER_HOST}/api/matgo/rooms`;
    const res = await this.$http.get(url);
    console.log(res);
    this.matgoRooms = [];
    for (const key in res.data) {
      console.log('Lobby -> loadLobby -> room', res.data[key]);
      res.data[key].id = key;
      this.matgoRooms.push(res.data[key]);
    }
  }

  async holdemLobby() {
    const url = `//${process.env.VUE_APP_HOLDEM_SERVER_HOST}/api/holdem/rooms`;
    const res = await this.$http.get(url);
    console.log(res);
    this.holdemRooms = [];
    for (const key in res.data) {
      console.log('Lobby -> loadLobby -> room', res.data[key]);
      res.data[key].id = key;
      this.holdemRooms.push(res.data[key]);
    }
  }
}
</script>

<style lang="scss">
.lobby {
  h1 {
    line-height: 300%;
    font-size: 50px;
    font-weight: 900;
  }
  a {
    color: currentColor;
    text-decoration: none;
  }

  p {
    font-size: 13px;
  }

  a:hover .card-outmore {
    background: #2c3e50;
    color: #fff;
  }

  a:hover .thecard {
    box-shadow: 0 10px 50px rgba(0, 0, 0, 0.6);
  }

  .thecard {
    width: 90%;
    margin: 5% auto;
    box-shadow: 0 1px 30px rgba(0, 0, 0, 0.4);
    display: block;
    transition: 400ms ease;
  }

  .card-img img {
    width: 100%;
    border-radius: 4px 4px 0px 0px;
  }

  .card-caption {
    position: relative;
    background: #ffffff;
    padding: 15px 25px 5px 25px;
    border-radius: 0px 0px 4px 4px;
  }

  .card-outmore {
    padding: 10px 25px 10px 25px;
    border-radius: 0px 0px 4px 4px;
    border-top: 1px solid #e0e0e0;
    background: #efefef;
    color: #222;
    display: inline-table;
    width: 100%;
    box-sizing: border-box;
    transition: 400ms ease;
  }
  .card-outmore h5 {
    float: left;
  }
  .card-outmore i {
    float: right;
  }

  span.date {
    font-size: 10px;
  }

  h2 {
    font-size: 22px;
  }

  h5 {
    margin: 0;
  }

  #like-btn {
    font-size: 18px;
    background: #446cb3;
    color: #fff;
    padding: 13px 15px;
    border-radius: 50em;
    position: absolute;
    right: 20px;
    top: -22px;
    box-shadow: 0 2px 1px rgba(0, 0, 0, 0.2);
    transition: 400ms ease;
  }

  #like-btn:hover {
    font-size: 18px;
    background: #3b5998;
    color: #fff;
    padding: 13px 15px;
    border-radius: 50em;
    position: absolute;
    right: 20px;
    top: -22px;
    box-shadow: 0 4px 5px rgba(0, 0, 0, 0.3);
  }

  #outmore-icon {
    border: 1px solid;
    padding: 1px 6px;
    border-radius: 50em;
  }
}
</style>
