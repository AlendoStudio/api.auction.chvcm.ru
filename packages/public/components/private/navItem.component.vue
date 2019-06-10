<template lang="pug">
  li.nav-item
    nuxt-link(:to="to").nav-link
      slot
</template>

<script lang="ts">
import {Component, Prop, Vue} from "nuxt-property-decorator";

@Component
export default class NavItemComponent extends Vue {
  @Prop({
    required: true,
  })
  public to!: string;
}
</script>
