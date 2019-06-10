<template lang="pug">
  b-navbar(toggleable="md" type="dark" variant="dark")
    nuxt-link(to="/").navbar-brand API
    b-navbar-toggle(target="nav_collapse")
      font-awesome-icon(:icon="icons.bars")
    b-collapse(id="nav_collapse" is-nav)
      b-navbar-nav
        nav-item-component(to="/requester")
          font-awesome-icon(:icon="icons.userAstronaut")
          =" "
          | Requester
        nav-item-component(to="/listener")
          font-awesome-icon(:icon="icons.userGraduate")
          =" "
          | Listener
        nav-item-component(to="/environment")
          font-awesome-icon(:icon="icons.userCog")
          =" "
          | Environment
</template>

<script lang="ts">
import {
  faBars,
  faUserAstronaut,
  faUserCog,
  faUserGraduate,
} from "@fortawesome/free-solid-svg-icons";
import {Component, Vue} from "nuxt-property-decorator";

import NavItemComponent from "./private/navItem.component.vue";

@Component({
  components: {
    NavItemComponent,
  },
})
export default class NavbarComponent extends Vue {
  public get icons() {
    return {
      bars: faBars,
      userAstronaut: faUserAstronaut,
      userCog: faUserCog,
      userGraduate: faUserGraduate,
    };
  }
}
</script>
