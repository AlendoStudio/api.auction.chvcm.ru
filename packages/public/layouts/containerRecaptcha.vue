<template lang="pug">
  div
    navbar-component
    b-container(fluid).mt-3
      nuxt
</template>

<script lang="ts">
import {Component, Vue} from "nuxt-property-decorator";

import NavbarComponent from "~/components/navbar.component.vue";

@Component({
  components: {
    NavbarComponent,
  },
  head(): any {
    return {
      script: [
        {
          async: "",
          body: true,
          defer: "",
          src:
            "https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit",
        },
      ],
    };
  },
})
export default class ContainerRecaptchaLayout extends Vue {}
</script>
