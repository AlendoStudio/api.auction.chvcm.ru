<template lang="pug">
  b-modal(@ok="onOk()" ref="modal" @shown="onShown()" title="Date editor")
    b-form
      b-form-row
        b-col(sm="4")
          b-form-group(label="Year" :label-for="`${id}.year`")
            b-input(:id="`${id}.year`" max="9999" min="1000" size="sm" step="1" type="number"
            v-model.number="localValue.year")
        b-col(sm="4")
          b-form-group(label="Month" :label-for="`${id}.month`")
            b-form-select(:id="`${id}.month`" :options="monthOptions" size="sm" v-model="localValue.month")
        b-col(sm="4")
          b-form-group(label="Day" :label-for="`${id}.date`")
            b-input(:id="`${id}.date`" :max="maxDaysInMonth" min="1" size="sm" step="1" type="number"
            v-model.number="localValue.date")
      b-form-row
        b-col(sm="6")
          b-form-group(label="Hours" :label-for="`${id}.hours`")
            b-input(:id="`${id}.hours`" max="23" min="0" size="sm" step="1" type="number"
            v-model.number="localValue.hours")
        b-col(sm="6")
          b-form-group(label="Minutes" :label-for="`${id}.minutes`")
            b-input(:id="`${id}.minutes`" max="59" min="0" size="sm" step="1" type="number"
            v-model.number="localValue.minutes")
      b-form-row
        b-col(sm="6")
          b-form-group(label="Seconds" :label-for="`${id}.seconds`")
            b-input(:id="`${id}.seconds`" max="59" min="0" size="sm" step="1" type="number"
            v-model.number="localValue.seconds")
        b-col(sm="6")
          b-form-group(label="Milliseconds" :label-for="`${id}.milliseconds`")
            b-input(:id="`${id}.milliseconds`" max="999" min="0" size="sm" step="1" type="number"
            v-model.number="localValue.milliseconds")
      small.form-text.text-muted {{ localValueAsDate.toString() }}
</template>

<script lang="ts">
import cuid from "cuid";
import {Component, Prop, Vue, Watch} from "nuxt-property-decorator";

interface IDate {
  date: number;
  hours: number;
  milliseconds: number;
  minutes: number;
  month: number;
  seconds: number;
  year: number;
}

@Component
export default class DateModalEditorComponent extends Vue {
  public id: string = cuid();
  public localValue: IDate = {} as any;

  @Prop({
    required: true,
    type: null as any,
  })
  public value!: Date;

  @Watch("localValue", {
    deep: true,
  })
  public onLocalValueChanged() {
    this.resetDate();
  }

  public get localValueAsDate() {
    return new Date(
      this.localValue.year,
      this.localValue.month,
      this.localValue.date,
      this.localValue.hours,
      this.localValue.minutes,
      this.localValue.seconds,
      this.localValue.milliseconds,
    );
  }

  public get maxDaysInMonth() {
    return new Date(
      this.localValue.year,
      this.localValue.month + 1,
      0,
    ).getDate();
  }

  public get monthOptions() {
    const {format} = Intl.DateTimeFormat("en", {month: "long"});
    return [...Array(12).keys()].map((value) => ({
      text: format(new Date(1970, value)),
      value,
    }));
  }

  public onOk() {
    this.$emit("ok", this.localValueAsDate.toISOString());
  }

  public onShown() {
    const validDate = isNaN(this.value.getTime())
      ? (() => {
          const now = new Date();
          now.setSeconds(0, 0);
          return now;
        })()
      : this.value;
    this.localValue = {
      date: validDate.getDate(),
      hours: validDate.getHours(),
      milliseconds: validDate.getMilliseconds(),
      minutes: validDate.getMinutes(),
      month: validDate.getMonth(),
      seconds: validDate.getSeconds(),
      year: validDate.getFullYear(),
    };
  }

  public resetDate() {
    if (this.localValue.date > this.maxDaysInMonth) {
      this.localValue.date = this.maxDaysInMonth;
    }
  }

  public show() {
    (this.$refs.modal as any).show();
  }
}
</script>
