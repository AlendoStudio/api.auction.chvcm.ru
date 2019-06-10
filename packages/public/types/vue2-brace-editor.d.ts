declare module "vue2-brace-editor" {
  import {FunctionalComponentOptions} from "vue";
  import {PropsDefinition} from "vue/types/options";

  interface AceProps {}

  interface SplitProps extends AceProps {}

  export const Ace: FunctionalComponentOptions<
    AceProps,
    PropsDefinition<AceProps>
  >;

  export const Split: FunctionalComponentOptions<
    SplitProps,
    PropsDefinition<SplitProps>
  >;
}
