<template lang="pug">
  b-form
    fieldset(:disabled="disabled")
      b-form-row(v-for="item in dictionary" :key="item.id")
        b-col(sm="3")
          b-form-group
            b-input-group
              b-btn(@click="item.enabled = !item.enabled" size="sm" slot="prepend" variant="outline-secondary")
                font-awesome-icon(:icon="item.enabled ? icons.eye : icons.eyeSlash")
              b-input(placeholder="Key" :readonly="!allowEdit" size="sm" type="text" v-model="item.key")
        b-col(sm)
          b-form-group
            b-input-group
              b-input(placeholder="Value" size="sm" type="text" v-model="item.value")
              b-btn(@click="deleteItemById(item.id)" :disabled="!allowEdit" size="sm" slot="append"
              variant="outline-secondary")
                font-awesome-icon(:icon="icons.minus")
      fieldset(:disabled="!allowEdit")
        b-form-row
          b-col(sm="3")
            b-form-group
              b-input-group
                b-btn(@click="enabled = !enabled" size="sm" slot="prepend" variant="outline-secondary")
                  font-awesome-icon(:icon="enabled ? icons.eye : icons.eyeSlash")
                b-input(placeholder="New key" size="sm" type="text" v-model="key")
          b-col(sm)
            b-form-group
              b-input-group
                b-input(placeholder="Value" size="sm" type="text" v-model="value")
                b-btn(@click="addItem()" size="sm" slot="append" variant="outline-secondary")
                  font-awesome-icon(:icon="icons.plus")
</template>

<script lang="ts">
import {
  faEye,
  faEyeSlash,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import cuid from "cuid";
import {Component, Prop, Vue} from "nuxt-property-decorator";

@Component
export default class KeyValueEditorComponent extends Vue {
  public enabled: boolean = true;
  public key: string = "";
  public value: string = "";

  @Prop({
    required: true,
  })
  public allowEdit!: boolean;

  @Prop({
    required: true,
  })
  public dictionary!: Array<{
    enabled: boolean;
    id: string;
    key: string;
    value: string;
  }>;

  @Prop({
    required: true,
    type: null as any,
  })
  public disabled!: boolean | null;

  public get icons() {
    return {
      eye: faEye,
      eyeSlash: faEyeSlash,
      minus: faMinus,
      plus: faPlus,
    };
  }

  public addItem() {
    this.dictionary.push({
      enabled: this.enabled,
      id: cuid(),
      key: this.key,
      value: this.value,
    });
    this.key = "";
    this.value = "";
  }

  public deleteItemById(id: string) {
    const index = this.dictionary.findIndex((x) => x.id === id);
    this.dictionary.splice(index, 1);
  }
}
</script>
