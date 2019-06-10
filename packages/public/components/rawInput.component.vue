<template lang="pug">
  div
    date-modal-editor-component(@ok="setValueData($event)" ref="dateModelEditor" :value="value.data")
    interval-modal-editor-component(@ok="setValueData($event)" ref="intervalModelEditor" :value="value.data")
    b-form-group(:label="label" :label-for="id")
      b-input-group
        b-dropdown(size="sm" slot="prepend" variant="outline-secondary")
          font-awesome-icon(:icon="getIconForType(value.type)" slot="button-content")
          template(v-for="item in typeOptions")
            b-dropdown-item(@click.prevent="setValueType(item.value)" :key="item.value" v-if="item.text !== '---'")
              font-awesome-icon(:icon="getIconForType(item.value)")
              =" "
              | {{ item.text }}
            b-dropdown-divider(:key="item.value" v-else)
        input(@change="setValueData($event.target.value)" :id="id" :placeholder="isNullableType ? tempValueData: ''"
        :readonly="isNullableType" type="text" v-if="!isBigPicture"
        :value="valueDataAsString").form-control.form-control-sm
        textarea(@change="setValueData($event.target.value)" :id="id" rows="2" v-else
        :value="valueDataAsString").form-control.form-control-sm
        b-btn(@click="bigPicture = !bigPicture" size="sm" slot="append" v-if="value.type === 'text'"
        variant="outline-secondary")
          font-awesome-icon(:icon="bigPictureIcon")
        b-btn(@click="setValueData(String(!value.data))" size="sm" slot="append" v-if="value.type === 'boolean'"
        variant="outline-secondary")
          font-awesome-icon(:icon="booleanToggleIcon")
        b-btn(@click="$refs.dateModelEditor.show()" size="sm" slot="append" v-if="value.type === 'date'"
        variant="outline-secondary")
          font-awesome-icon(:icon="icons.search")
        b-btn(@click="$refs.intervalModelEditor.show()" size="sm" slot="append" v-if="value.type === 'interval'"
        variant="outline-secondary")
          font-awesome-icon(:icon="icons.search")
      small(v-if="valueDataAsStringDate").form-text.text-muted {{ valueDataAsStringDate }}
</template>

<script lang="ts">
import {
  faBold,
  faCalendarAlt,
  faClock,
  faCompress,
  faExpand,
  faFont,
  faListOl,
  faSearch,
  faSkullCrossbones,
  faTimes,
  faToggleOff,
  faToggleOn,
} from "@fortawesome/free-solid-svg-icons";
import cuid from "cuid";
import {Component, Prop, Vue, Watch} from "nuxt-property-decorator";

import {PostgresInterval} from "~/src/postgresInterval";

import DateModalEditorComponent from "./private/dateModalEditor.component.vue";
import IntervalModalEditorComponent from "./private/intervalModalEditor.component.vue";

@Component({
  components: {
    DateModalEditorComponent,
    IntervalModalEditorComponent,
  },
})
export default class RawInputComponent extends Vue {
  public bigPicture: boolean = false;
  public id: string = cuid();
  public tempValueData: string = "";

  @Prop({
    required: true,
  })
  public label!: string;

  @Prop({
    required: true,
  })
  public value!: {
    data: any;
    type: string;
  };

  @Watch("value")
  public onValueChanged() {
    if (!this.isNullableType) {
      this.tempValueData = this.valueDataAsString;
    }
  }

  public get icons() {
    return {
      search: faSearch,
    };
  }

  public get bigPictureIcon() {
    return this.bigPicture ? faCompress : faExpand;
  }

  public get booleanToggleIcon() {
    return this.value.data ? faToggleOn : faToggleOff;
  }

  public get isBigPicture() {
    return this.bigPicture && this.value.type === "text";
  }

  public get isNullableType() {
    return ["undefined", "null"].some((x) => x === this.value.type);
  }

  public get typeOptions() {
    return [
      {text: "Text", value: "text"},
      {text: "Number", value: "number"},
      {text: "Boolean", value: "boolean"},
      {text: "---", value: "separator1"},
      {text: "Date", value: "date"},
      {text: "Interval", value: "interval"},
      {text: "---", value: "separator2"},
      {text: "Null", value: "null"},
      {text: "Undefined", value: "undefined"},
    ];
  }

  public get valueDataAsString() {
    if (this.isNullableType) {
      return "";
    }
    if (this.value.type === "date") {
      return isNaN(this.value.data.getTime())
        ? ""
        : this.value.data.toISOString();
    }
    if (this.value.type === "interval") {
      return PostgresInterval.fromObject(this.value.data).toPostgresOutput();
    }
    return String(this.value.data);
  }

  public get valueDataAsStringDate() {
    return this.value.type !== "date" || isNaN(this.value.data.getTime())
      ? ""
      : this.value.data.toString();
  }

  public created() {
    this.tempValueData = this.valueDataAsString;
  }

  public getIconForType(type: string) {
    switch (type) {
      case "text":
        return faFont;
      case "number":
        return faListOl;
      case "boolean":
        return faBold;
      case "date":
        return faCalendarAlt;
      case "interval":
        return faClock;
      case "null":
        return faTimes;
      case "undefined":
        return faSkullCrossbones;
    }
  }

  public setValueData(newData: any, newType?: string) {
    newType = newType || this.value.type;
    if (newType === "text") {
      this.$emit("input", {data: newData, type: newType});
    } else if (newType === "number") {
      this.$emit("input", {data: parseFloat(newData), type: newType});
    } else if (newType === "boolean") {
      this.$emit("input", {
        data: ["yes", "y", "t", "1", "true"].some(
          (x) => x === newData.toLowerCase(),
        ),
        type: newType,
      });
    } else if (newType === "date") {
      this.$emit("input", {data: new Date(newData), type: newType});
    } else if (newType === "interval") {
      this.$emit("input", {
        data: PostgresInterval.fromPostgresOutput(newData).toJSON(),
        type: newType,
      });
    }
  }

  public setValueType(newType: string) {
    if (newType === "undefined") {
      this.$emit("input", {data: undefined, type: newType});
    } else if (newType === "null") {
      this.$emit("input", {data: null, type: newType});
    } else {
      this.setValueData(this.tempValueData, newType);
    }
  }
}
</script>

<style lang="css" scoped>
textarea {
  min-height: calc(1.8125rem + 2px);
}
</style>
