<template lang="pug">
  div
    navbar-component
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
export default class NoContainerLayout extends Vue {}
</script>
