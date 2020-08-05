import _Vue from 'vue';
import _, { LoDashStatic } from 'lodash';

export function LodashPlugin(Vue: typeof _Vue): void {
  Vue.prototype.$_ = _;
}

declare module 'vue/types/vue' {
  export interface Vue {
    $_: LoDashStatic;
  }
}
