declare module "@chenfengyuan/vue-qrcode" {
  import {FunctionalComponentOptions} from "vue";
  import {PropsDefinition} from "vue/types/options";

  interface VueQrcodeProps {}

  const VueQrcode: FunctionalComponentOptions<
    VueQrcodeProps,
    PropsDefinition<VueQrcodeProps>
  >;

  export default VueQrcode;
}
