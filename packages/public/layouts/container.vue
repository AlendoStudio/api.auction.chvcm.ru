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
})
export default class ContainerLayout extends Vue {}
</script>
