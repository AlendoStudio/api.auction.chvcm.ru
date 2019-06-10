<template lang="pug">
  b-row
    b-col(md="2")
      b-nav(fill pills vertical).nav-align
        b-btn(@click="clearEvents()" :disabed="!events.length" variant="outline-danger").mb-3
          font-awesome-icon(:icon="icons.trashAlt")
          =" "
          | Clear
        b-nav-item(v-for="item in events" :active="selectedEvent && item.id === selectedEvent.id"
        @click="selectedEvent = item" :key="item.id") {{ item.event }}
    b-col(md)
      b-form
        b-btn(@click="connect()" type="button" variant="primary") Connect
        b-btn(@click="disconnect()" type="button" variant="secondary").ml-2 Disconnect
        b-form-group.mt-3
          b-form-checkbox(v-model="hidePingPong") Hide Ping/Pong
        ace-editor(:editorProps="{$blockScrolling: Infinity}" :fontSize="14" :maxLines="Infinity" :minLines="10"
        mode="javascript" name="ace.response" :readOnly="true" :showPrintMargin="false" theme="monokai"
        :value="eventData" width="100%").mb-3
</template>

<script lang="ts">
import {faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import cuid from "cuid";
import {Component, Vue} from "nuxt-property-decorator";
import io from "socket.io-client";
import {Ace as AceEditor} from "vue2-brace-editor";

import "brace/mode/javascript";
import "brace/theme/monokai";

import {ENV_API_ENDPOINT, ENV_SOCKET_TRANSPORTS} from "~/src/env";
import {isoDateReplacer} from "~/src/isoDateReplacer";
import {authToken, baseUrl} from "~/src/localStorage";

interface IEvent {
  date: Date;
  event: string;
  id: string;
  payload?: string;
}

@Component({
  components: {
    AceEditor,
  },
  head() {
    return {
      title: "Listener",
    };
  },
  layout: "container",
})
export default class PageListener extends Vue {
  public events: IEvent[] = [];
  public hidePingPong: boolean = true;
  public selectedEvent: IEvent | null = null;
  public socket = io.connect(baseUrl() || ENV_API_ENDPOINT, {
    autoConnect: false,
    query: {
      token: authToken(),
    },
    transports: ENV_SOCKET_TRANSPORTS,
  });

  public get icons() {
    return {
      trashAlt: faTrashAlt,
    };
  }

  public get eventData() {
    return this.selectedEvent
      ? [
          `// Date: ${this.selectedEvent.date.toString()}`,
          this.selectedEvent.payload
            ? `\n\n${this.selectedEvent.payload}`
            : null,
          "\n",
        ]
          .filter((v) => !!v)
          .join("")
      : [
          `// Press "Connect" and select event to view payload`,
          `// You must have correct "Base URL" and "Auth token" (see Environment)`,
          "",
        ].join("\n");
  }

  public beforeDestroy() {
    if (this.socket) {
      this.disconnect();
    }
  }

  public created() {
    this.socket.on("connect", () => {
      this.events.unshift({date: new Date(), event: "connect", id: cuid()});
    });

    this.socket.on("connect_error", (error: Error) => {
      this.events.unshift({
        date: new Date(),
        event: "connect_error",
        id: cuid(),
        payload: JSON.stringify(error, null, 2),
      });
    });

    this.socket.on("connect_timeout", (timeout: number) => {
      this.events.unshift({
        date: new Date(),
        event: "connect_timeout",
        id: cuid(),
        payload: JSON.stringify({timeout}, null, 2),
      });
    });

    this.socket.on("error", (error: Error) => {
      this.events.unshift({
        date: new Date(),
        event: "error",
        id: cuid(),
        payload:
          typeof error === "object"
            ? JSON.stringify(error, null, 2)
            : JSON.stringify({error}, null, 2),
      });
    });

    this.socket.on("disconnect", (reason: string) => {
      this.events.unshift({
        date: new Date(),
        event: "disconnect",
        id: cuid(),
        payload: JSON.stringify({reason}, null, 2),
      });
    });

    this.socket.on("reconnect", (attemptNumber: number) => {
      this.events.unshift({
        date: new Date(),
        event: "reconnect",
        id: cuid(),
        payload: JSON.stringify({attemptNumber}, null, 2),
      });
    });

    this.socket.on("reconnect_attempt", (attemptNumber: number) => {
      this.events.unshift({
        date: new Date(),
        event: "reconnect_attempt",
        id: cuid(),
        payload: JSON.stringify({attemptNumber}, null, 2),
      });
    });

    this.socket.on("reconnecting", (attemptNumber: number) => {
      this.events.unshift({
        date: new Date(),
        event: "reconnecting",
        id: cuid(),
        payload: JSON.stringify({attemptNumber}, null, 2),
      });
    });

    this.socket.on("reconnect_error", (error: Error) => {
      this.events.unshift({
        date: new Date(),
        event: "reconnect_error",
        id: cuid(),
        payload: JSON.stringify(error, null, 2),
      });
    });

    this.socket.on("reconnect_failed", () => {
      this.events.unshift({
        date: new Date(),
        event: "reconnect_failed",
        id: cuid(),
      });
    });

    this.socket.on("ping", () => {
      if (!this.hidePingPong) {
        this.events.unshift({date: new Date(), event: "ping", id: cuid()});
      }
    });

    this.socket.on("pong", (latency: number) => {
      if (!this.hidePingPong) {
        this.events.unshift({
          date: new Date(),
          event: "pong",
          id: cuid(),
          payload: JSON.stringify({latency}, null, 2),
        });
      }
    });

    this.socket.on("lot", (lot: object) => {
      this.events.unshift({
        date: new Date(),
        event: "lot",
        id: cuid(),
        payload: isoDateReplacer(JSON.stringify(lot, null, 2)),
      });
    });
  }

  public clearEvents() {
    this.selectedEvent = null;
    this.events = [];
  }

  public connect() {
    this.socket.connect();
  }

  public disconnect() {
    this.socket.disconnect();
  }
}
</script>

<style lang="css" scoped>
.nav-align {
  text-align: center;
}
</style>
