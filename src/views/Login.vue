<template>
  <section class="hero is-primary is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-5-tablet is-4-desktop is-3-widescreen">
            <h1>Dragon Games</h1>
            <form @submit.prevent="login" class="box">
              <div class="field">
                <label for="" class="label">ID</label>
                <div class="control has-icons-left">
                  <input
                    v-model="form.id"
                    placeholder="e.g. home@gmail.com"
                    class="input"
                    required
                  />
                  <span class="icon is-small is-left">
                    <i class="fa fa-envelope"></i>
                  </span>
                </div>
              </div>
              <div class="field">
                <label for="" class="label">Password</label>
                <div class="control has-icons-left">
                  <input
                    v-model="form.password"
                    type="password"
                    placeholder="*******"
                    class="input"
                    required
                  />
                  <span class="icon is-small is-left">
                    <i class="fa fa-lock"></i>
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="checkbox">
                  <input type="checkbox" />
                  Remember me
                </label>
              </div>
              <div class="field">
                <button type="submit" class="button is-success">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    {{ form }}
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component({
  props: {},
  components: {},
})
export default class Login extends Vue {
  form = {
    id: '',
    password: '',
  };

  async login() {
    const url = `//${process.env.VUE_APP_DRAGON_SERVER_HOST}/api/auth/login`;
    const res = await this.$http({
      url,
      method: 'POST',
      data: this.form,
    });
    if (!res) {
      this.$swal('error', 'error');
      return;
    }
    if (res.data.result === 0) {
      this.$router.push('/lobby/'+res.data.data.token);
    }
  }
}
</script>

<style lang="sass"></style>
