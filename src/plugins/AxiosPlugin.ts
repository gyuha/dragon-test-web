import Axios, { AxiosResponse, AxiosStatic } from 'axios';
import _Vue from 'vue';

export function AxiosPlugin(Vue: typeof _Vue): void {
  Vue.prototype.$http = Axios;

  Vue.prototype.$httpAuth = (
    method:
      | 'get'
      | 'GET'
      | 'delete'
      | 'DELETE'
      | 'options'
      | 'OPTIONS'
      | 'post'
      | 'POST'
      | 'put'
      | 'PUT'
      | 'patch'
      | 'PATCH'
      | undefined,
    url: string,
    data: any | null = null,
    options: any | null = null
  ): any => {
    const accessToken: string | null = localStorage.getItem('AccessToken');

    if (accessToken === null) {
      alert('잘 못 된 접근 입니다.');
      return undefined;
    }

    // 인증 오류 처리
    Axios.interceptors.response.use(
      (res) => {
        return res;
      },
      (e) => {
        if (401 === e.response.status) {
          localStorage.clear();
          alert('인증 오류.');
          window.location.replace('/');
        } else {
          return Promise.reject(e);
        }
      }
    );

    const headers: any = {
      AccessToken: accessToken,
    };

    // tslint:disable-next-line:forin
    for (const key in options) {
      headers[key] = options[key];
    }

    return Axios({
      method,
      url,
      data,
      headers,
    }).catch((res: AxiosResponse) => {
      console.error(res);
    });
  };
}

declare module 'vue/types/vue' {
  export interface Vue {
    $http: AxiosStatic;
    $httpAuth(
      method: string,
      url: string,
      data?: any | null,
      options?: any | null
    ): // tslint:disable-next-line:ban-types
    Promise<Function>;
  }
}
