<template lang="pug">
  div
    b-popover(placement="bottomleft" target="authTokenDebugBtn" triggers="click blur")
      template(slot="title") Notice: You are leaving site!
      a(:href="authTokenDebugUrl" target="_blank") jwt.io
      =" "
      | is an external resource. Use it only for debug and don't share tokens.
    b-form
      b-form-group(:description="baseUrlDescription" label="Base URL" label-for="baseUrl")
        b-input(id="baseUrl" :placeholder="baseUrlPlaceholder" v-model="baseUrl")
      b-form-group(:description="authTokenDescription" label="Auth token" label-for="authToken")
        b-input-group
          b-input(id="authToken" v-model="authToken")
          b-input-group-append
            b-btn(id="authTokenDebugBtn" variant="outline-danger")
              font-awesome-icon(:icon="icons.bug")
      b-form-group(:description="purgatoryTokenDescription" label="Purgatory token" label-for="purgatoryToken")
        b-input(id="purgatoryToken" v-model="purgatoryToken")
</template>

<script lang="ts">
import {faBug} from "@fortawesome/free-solid-svg-icons";
import {Component, Vue, Watch} from "nuxt-property-decorator";
import * as qs from "qs";

import {ENV_API_ENDPOINT} from "~/src/env";
import {
  authToken,
  baseUrl,
  purgatoryToken,
  setAuthToken,
  setBaseUrl,
  setPurgatoryToken,
} from "~/src/localStorage";

@Component({
  head() {
    return {
      title: "Environment",
    };
  },
  layout: "container",
})
export default class PageEnvironment extends Vue {
  public authToken = authToken();
  public baseUrl = baseUrl();
  public purgatoryToken = purgatoryToken();

  @Watch("authToken")
  public onAuthTokenChanged() {
    setAuthToken(this.authToken);
  }

  @Watch("baseUrl")
  public onBaseUrlChanged() {
    setBaseUrl(this.baseUrl);
  }

  @Watch("purgatoryToken")
  public onPurgatoryTokenChanged() {
    setPurgatoryToken(this.purgatoryToken);
  }

  public get icons() {
    return {
      bug: faBug,
    };
  }

  public get authTokenDebugUrl() {
    return this.authToken
      ? `https://jwt.io/?${qs.stringify({access_token: this.authToken})}`
      : "https://jwt.io";
  }

  public get authTokenDescription() {
    return "Requester: Can be used as {{authToken}} variable in Headers section";
  }

  public get baseUrlDescription() {
    return "Absolute URL to server including API version";
  }

  public get baseUrlPlaceholder() {
    return ENV_API_ENDPOINT;
  }

  public get purgatoryTokenDescription() {
    return "Requester: Can be used as {{purgatoryToken}} variable in Headers section";
  }
}
</script>
