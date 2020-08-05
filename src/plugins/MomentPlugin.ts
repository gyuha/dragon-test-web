import _Vue from 'vue';
import * as moment from 'moment';
import { Moment } from 'moment';

export function MomentPlugin(Vue: typeof _Vue): void {
  moment.locale('ko');
  Vue.prototype.$moment = moment;
}

declare module 'vue/types/vue' {
  export interface Vue {
    $moment(format?: any): Moment;
  }
}
