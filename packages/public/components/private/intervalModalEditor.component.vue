<template lang="pug">
  b-modal(@ok="onOk()" ref="modal" @shown="onShown()" title="Interval editor")
    b-form
      b-form-row
        b-col(sm="4")
          b-form-group(label="Years" :label-for="`${id}.years`")
            b-input(:id="`${id}.years`" min="0" size="sm" step="1" type="number" v-model.number="localValue.years")
        b-col(sm="4")
          b-form-group(label="Months" :label-for="`${id}.months`")
            b-input(:id="`${id}.months`" min="0" size="sm" step="1" type="number" v-model.number="localValue.months")
        b-col(sm="4")
          b-form-group(label="Days" :label-for="`${id}.days`")
            b-input(:id="`${id}.days`" min="0" size="sm" step="1" type="number" v-model.number="localValue.days")
      b-form-row
        b-col(sm="6")
          b-form-group(label="Hours" :label-for="`${id}.hours`")
            b-input(:id="`${id}.hours`" min="0" size="sm" step="1" type="number" v-model.number="localValue.hours")
        b-col(sm="6")
          b-form-group(label="Minutes" :label-for="`${id}.minutes`")
            b-input(:id="`${id}.minutes`" min="0" size="sm" step="1" type="number" v-model.number="localValue.minutes")
      b-form-row
        b-col(sm="6")
          b-form-group(label="Seconds" :label-for="`${id}.seconds`")
            b-input(:id="`${id}.seconds`" min="0" size="sm" step="1" type="number" v-model.number="localValue.seconds")
        b-col(sm="6")
          b-form-group(label="Milliseconds" :label-for="`${id}.milliseconds`")
            b-input(:id="`${id}.milliseconds`" min="0" step="1" size="sm" type="number"
            v-model.number="localValue.milliseconds")
      small.form-text.text-muted {{ localValueAsPostgresOutput }}
</template>

<script lang="ts">
import cuid from "cuid";
import {Component, Prop, Vue} from "nuxt-property-decorator";

import {Interval} from "~/src/interval";
import {PostgresInterval} from "~/src/postgresInterval";

@Component
export default class IntervalModalEditorComponent extends Vue {
  public id: string = cuid();
  public localValue: Interval = {};

  @Prop({
    required: true,
    type: null as any,
  })
  public value!: Interval;

  public get localValueAsPostgresOutput() {
    return PostgresInterval.fromObject(this.localValue).toPostgresOutput();
  }

  public onOk() {
    this.$emit("ok", this.localValueAsPostgresOutput);
  }

  public onShown() {
    this.localValue = {
      days: this.value.days || 0,
      hours: this.value.hours || 0,
      milliseconds: this.value.milliseconds || 0,
      minutes: this.value.minutes || 0,
      months: this.value.months || 0,
      seconds: this.value.seconds || 0,
      years: this.value.years || 0,
    };
  }

  public show() {
    (this.$refs.modal as any).show();
  }
}
</script>
