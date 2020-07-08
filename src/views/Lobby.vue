<template>
  <div>
    <h1>맞고</h1>
    <b-carousel-list v-model="page" :data="items" :arrow-hover="false">
      <template slot="item" slot-scope="props">
        <router-link :to="'/matgo/' + props.list.id">
          <div class="thecard">
            <div class="card-img">
              <img :src="'/img/cards/' + props.list.icon + '.png'" />
            </div>
            <div class="card-caption">
              <span class="date">
                {{ props.list.name }} / {{ props.list.grade }}</span
              >
              <h1>점 {{ props.list.point }}</h1>
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
import { Vue, Component } from "vue-property-decorator";
import Axios from "axios";

interface LoobyData {
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
  components: {}
})
export default class Lobby extends Vue {
  items: LoobyData[] = [];
  page = 0;
  mounted() {
    this.loadLobby();
  }

  async loadLobby() {
    const url = `//${process.env.VUE_APP_SERVER_HOST}/api/lobby/rooms`;
    const res = await Axios.get(url);
    console.log(res);
    this.items = [];
    for (const key in res.data) {
      console.log("Lobby -> loadLobby -> room", res.data[key]);
      res.data[key].id = key;
      this.items.push(res.data[key]);
    }
  }
}
</script>

<style lang="scss">
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

.card-img {
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

h1 {
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
</style>
