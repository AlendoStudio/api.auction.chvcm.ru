<template lang="pug">
  div
    b-modal(id="qrCode" title="QR Code")
      div.text-center
        vue-qrcode(:options="{margin: 0, scale: 5}" :value="res.helpers.qrCode")
    b-form
      fieldset(:disabled="res.isSubmit")
        b-form-row
          b-col(md="0")
            b-form-group
              b-form-select(:options="presetGroupOptions" size="sm" v-model="presetGroup")
          b-col(md="0" v-if="isCustomPreset")
            b-form-group
              b-form-select(:options="methodOptions" size="sm" v-model="req.method")
          b-col(md="0" v-if="isCustomPreset && isWithBody")
            b-form-group
              b-form-select(:options="contentTypeOptions" size="sm" v-model="req.contentType")
          b-col(md)
            b-form-group
              b-input-group
                b-link(:href="apidocUrl + req.docs" slot="prepend" target="_blank"
                v-if="!isCustomPreset && req.docs").btn.btn-sm.btn-outline-secondary
                  font-awesome-icon(:icon="icons.question")
                b-form-select(:options="presetOptions" size="sm" v-if="!isCustomPreset" v-model="preset")
                b-input(size="sm" type="text" v-if="isCustomPreset" v-model="req.path")
    b-row
      b-col(md="2")
        b-nav(fill pills vertical).nav-align
          b-nav-item(v-for="item in requestTabOptions" :key="item.value" :active="item.value === requestTab"
          @click="requestTab = item.value") {{ item.text }}
          b-btn(variant="link" :disabled="!isCustomPreset || res.isSubmit"
          @click="req.recaptcha = !req.recaptcha").nav-link
            font-awesome-icon(:icon="reCaptchaToggleIcon")
            =" "
            | reCaptcha v2
      b-col(md)
        b-form(@submit.prevent="onSubmit()" v-if="requestTab === 'form'")
          fieldset(:disabled="res.isSubmit")
            raw-input-component(v-for="item in req.body" :key="item.key" :label="item.key"
            v-if="isWithBody && req.contentType === 'json'" v-model="item.value")
            b-form-group(v-if="isWithBody && req.contentType === 'binary'")
              b-form-file(:placeholder="fileInputLabel" v-model="req.body")
          ace-editor(:editorProps="{$blockScrolling: Infinity}" :fontSize="14" :maxLines="Infinity" :minLines="10"
          mode="json" :onChange="onAceEditorChange" :readOnly="res.isSubmit" theme="monokai"
          v-if="isWithBody && req.contentType === 'json-raw'" :value="req.body" width="100%").mb-3
          vue-recaptcha(@expired="recaptchaToken = null" ref="recaptcha" :sitekey="recaptchaSite" v-if="req.recaptcha"
          @verify="recaptchaToken = $event").mb-3
          b-btn(:disabled="res.isSubmit" type="submit" variant="primary")
            template(v-if="res.isSubmit")
              font-awesome-icon(:icon="icons.spinner" spin)
              =" "
              | Submit
            template(v-else) Submit
          b-btn(@click="cancelRequest()" :disabled="!res.isSubmit" type="button" v-if="res.isSubmit !== null"
          variant="danger").ml-2
            font-awesome-icon(:icon="icons.ban")
            =" "
            | Abort
          b-btn(@click="saveResponse()" type="button" v-if="isResBodyAreArrayBuffer" variant="success").ml-2
            font-awesome-icon(:icon="icons.download")
            =" "
            | Response
          b-btn(type="button" v-b-modal.qrCode v-if="res.helpers.qrCode" variant="success").ml-2
            font-awesome-icon(:icon="icons.qrCode")
            =" "
            | QR Code
          ace-editor(:editorProps="{$blockScrolling: Infinity}" :fontSize="14" :maxLines="Infinity" :minLines="10"
          mode="javascript" name="ace.response" :readOnly="true" :showPrintMargin="false" theme="monokai"
          :value="responseData" width="100%").mt-3.mb-3
        key-value-editor-component(:allowEdit="isCustomPreset" :dictionary="req.params" :disabled="res.isSubmit"
        :key="requestTab" v-if="requestTab === 'params'")
        key-value-editor-component(:allowEdit="isCustomPreset" :dictionary="req.query" :disabled="res.isSubmit"
        :key="requestTab" v-if="requestTab === 'query'")
        key-value-editor-component(:allowEdit="isCustomPreset" :dictionary="req.headers" :disabled="res.isSubmit"
        :key="requestTab" v-if="requestTab === 'headers'")
</template>

<script lang="ts">
import VueQrcode from "@chenfengyuan/vue-qrcode";
import {
  faBan,
  faDownload,
  faLock,
  faQrcode,
  faQuestion,
  faSpinner,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";
import axios, {AxiosRequestConfig, CancelTokenSource, Method} from "axios";
import cuid from "cuid";
import {saveAs} from "file-saver";
import {Component, Vue, Watch} from "nuxt-property-decorator";
import prettyMs from "pretty-ms";
import qs from "qs";
import VueRecaptcha from "vue-recaptcha";
import {Ace as AceEditor} from "vue2-brace-editor";
import MimeType from "whatwg-mimetype";

import "brace/mode/javascript";
import "brace/mode/json";
import "brace/theme/monokai";

import KeyValueEditorComponent from "~/components/keyValueEditor.component.vue";
import RawInputComponent from "~/components/rawInput.component.vue";

import {ENV_API_ENDPOINT, ENV_APIDOC_URL, ENV_RECAPTCHA_SITE} from "~/src/env";
import {isoDateReplacer} from "~/src/isoDateReplacer";
import {
  authToken,
  baseUrl,
  purgatoryToken,
  setAuthToken,
  setPurgatoryToken,
} from "~/src/localStorage";
import presets from "~/src/requesterPresets";

interface IDictionary {
  enabled: boolean;
  id: string;
  key: string;
  value: string;
}

interface IReq {
  body: any;
  contentType: string;
  dosc: string;
  headers: IDictionary[];
  method: string;
  params: IDictionary[];
  path: string;
  query: IDictionary[];
  recaptcha: boolean;
}

interface IRes {
  body: any;
  helpers: {
    fileName?: string;
    qrCode?: string;
  };
  isSubmit: boolean | null;
  method: string;
  source: CancelTokenSource;
  status: string;
  time: number;
  url: string;
}

@Component({
  components: {
    AceEditor,
    KeyValueEditorComponent,
    RawInputComponent,
    VueQrcode,
    VueRecaptcha,
  },
  head() {
    return {
      title: "Requester",
    };
  },
  layout: "containerRecaptcha",
})
export default class PageRequester extends Vue {
  public preset: string | null = null;
  public presetGroup: string = "";
  public recaptchaSite: string = ENV_RECAPTCHA_SITE;
  public recaptchaToken: string | null = null;
  public req: IReq = {
    body: [],
    contentType: "json",
    dosc: "",
    headers: [],
    method: "",
    params: [],
    path: "",
    query: [],
    recaptcha: false,
  };
  public requestTab: string = "form";
  public res: IRes = {
    body: undefined,
    helpers: {
      fileName: undefined,
      qrCode: undefined,
    },
    isSubmit: null,
    method: "",
    source: null as any,
    status: "",
    time: 0,
    url: "",
  };

  @Watch("preset")
  public onPresetChanged() {
    if (!this.preset) {
      if (this.req.contentType === "json") {
        this.req.contentType = "json-raw";
      }
    } else {
      const req = Object.assign(
        {
          body: [],
          contentType: "json",
          headers: [],
          params: [],
          query: [],
          recaptcha: false,
        },
        JSON.parse(JSON.stringify(presets[this.presetGroup][this.preset])),
      );
      for (const key of ["params", "headers", "query"]) {
        for (const pair of req[key]) {
          pair.id = cuid();
        }
      }
      if (req.contentType === "binary") {
        req.body = null;
      } else {
        for (const item of req.body) {
          if (item.value.type === "undefined") {
            item.value.data = undefined;
          } else if (item.value.type === "date") {
            item.value.data = new Date(item.value.data);
          }
        }
      }
      this.req = req;
    }
  }

  @Watch("presetGroup")
  public onPresetGroupChanged() {
    this.preset = this.isCustomPreset ? null : this.presetOptions[0].value;
  }

  @Watch("req.body")
  public onReqBodyChanged() {
    if (
      this.req.body instanceof File &&
      this.preset === "PUT /entities/:id/attachments/:name"
    ) {
      for (const item of this.req.params) {
        if (item.key === ":name") {
          item.value = this.fileInputLabel;
          break;
        }
      }
    }
  }

  @Watch("req.contentType")
  public onReqContentTypeChanged(
    newContentType: string,
    oldContentType: string,
  ) {
    if (newContentType === "binary") {
      this.req.body = null;
    }
    if (newContentType === "json-raw" && oldContentType === "binary") {
      this.req.body = "";
    }
    if (newContentType === "json-raw" && oldContentType === "json") {
      this.req.body = this.isWithBody
        ? `${JSON.stringify(this.bodyAsJson, null, 2)}\n`
        : "";
    }
  }

  @Watch("req.recaptcha")
  public onReqRecaptchaChanged() {
    this.recaptchaToken = null;
  }

  @Watch("requestTab")
  public onRequestTabChanged() {
    this.recaptchaToken = null;
  }

  @Watch("responseData")
  public onResponseDataChanged() {
    if (this.requestTab === "form") {
      (window as any).ace.edit("ace.response").gotoLine(1, 0);
    }
  }

  public get icons() {
    return {
      ban: faBan,
      download: faDownload,
      qrCode: faQrcode,
      question: faQuestion,
      spinner: faSpinner,
    };
  }

  public get apidocUrl() {
    return ENV_APIDOC_URL;
  }

  public get bodyAsJson() {
    const result: {[key: string]: string} = {};
    for (const item of this.req.body) {
      result[item.key] = item.value.data;
    }
    return result;
  }

  public get contentTypeOptions() {
    return [
      {text: "Json", value: "json-raw"},
      {text: "Binary", value: "binary"},
    ];
  }

  public get fileInputLabel() {
    return this.req.body instanceof File
      ? this.req.body.name
      : "Choose a file...";
  }

  public get isCustomPreset() {
    return this.presetGroup === "custom";
  }

  public get isResBodyAreArrayBuffer() {
    return this.res.body instanceof ArrayBuffer;
  }

  public get isWithBody() {
    return this.req.method !== "get" && this.req.method !== "delete";
  }

  public get methodOptions() {
    return ["get", "post", "put", "patch", "delete"].map((m) => ({
      text: m.toUpperCase(),
      value: m,
    }));
  }

  public get presetGroupOptions() {
    return [
      ...Object.keys(presets).map((g) => ({text: g, value: g})),
      {text: "Custom", value: "custom"},
    ];
  }

  public get presetOptions() {
    if (this.isCustomPreset) {
      return [];
    }
    return Object.keys(presets[this.presetGroup]).map((p) => ({
      text: p,
      value: p,
    }));
  }

  public get reCaptchaToggleIcon() {
    return this.req.recaptcha ? faLock : faUnlock;
  }

  public get responseData() {
    return this.res.isSubmit === null
      ? `// Press "Submit" to view response\n`
      : [
          `// ${this.res.method.toUpperCase()} ${this.res.url}`,
          this.res.isSubmit ? null : `\n// Status: ${this.res.status}`,
          this.res.isSubmit
            ? null
            : `\n// Time: ${prettyMs(this.res.time, {
                separateMilliseconds: true,
              })}`,
          this.res.isSubmit ||
          this.res.body === undefined ||
          this.res.body instanceof ArrayBuffer
            ? null
            : `\n\n${this.res.body}`,
          "\n",
        ]
          .filter((v) => !!v)
          .join("");
  }

  public get requestTabOptions() {
    return [
      {text: "Form", value: "form"},
      {text: "Params", value: "params"},
      {text: "Query", value: "query"},
      {text: "Headers", value: "headers"},
    ];
  }

  public beforeDestroy() {
    this.cancelRequest();
  }

  public created() {
    this.presetGroup = "Utils";
  }

  public afterSuccessJsonResponse(body: any) {
    if (!body) {
      return;
    }
    if (this.preset === "POST /entities" || this.preset === "PUT /signin") {
      setAuthToken(body.token);
      setPurgatoryToken();
    }
    if (this.preset === "POST /signin") {
      if (body.tfa) {
        setPurgatoryToken(body.token);
        setAuthToken();
      } else {
        setAuthToken(body.token);
        setPurgatoryToken();
      }
    }
    if (this.preset === "PUT /user/tfa/otp" && body.keyuri) {
      this.res.helpers.qrCode = body.keyuri;
    }
  }

  public cancelRequest() {
    if (this.res.source) {
      this.res.source.cancel("Aborted by user");
    }
  }

  public generateAxiosConfig() {
    this.res.method = this.req.method;
    this.res.url = this.req.path;
    this.req.params
      .filter((param) => param.enabled)
      .map((param) => {
        if (
          this.preset === "GET /entities/:id/attachments/:name" &&
          param.key === ":name"
        ) {
          this.res.helpers.fileName = param.value;
        }
        this.res.url = this.res.url.replace(
          param.key,
          encodeURIComponent(param.value),
        );
      });

    const config: AxiosRequestConfig = {
      baseURL: baseUrl() || ENV_API_ENDPOINT,
      cancelToken: this.res.source.token,
      headers: {
        ...this.keyValueToObject(this.req.headers),
        "content-type": this.req.contentType.startsWith("json")
          ? "application/json"
          : "application/octet-stream",
      },
      maxContentLength: -1,
      method: this.req.method as Method,
      params: this.keyValueToObject(this.req.query),
      paramsSerializer(params) {
        return qs.stringify(params);
      },
      responseType: "arraybuffer",
      url: this.res.url,
    };

    for (const key in config.headers) {
      if (!config.headers.hasOwnProperty(key)) {
        continue;
      }
      config.headers[key] = config.headers[key].replace(
        "{{authToken}}",
        authToken(),
      );
      config.headers[key] = config.headers[key].replace(
        "{{purgatoryToken}}",
        purgatoryToken(),
      );
    }

    if (this.isWithBody) {
      if (this.req.contentType === "json") {
        config.data = this.bodyAsJson;
      }
      if (this.req.contentType === "json-raw") {
        config.data = JSON.parse(this.req.body);
      }
      if (this.req.contentType === "binary") {
        config.data = this.req.body;
      }
    }

    if (this.req.recaptcha && this.recaptchaToken) {
      let recaptchaTokenInBody = false;
      if (this.isWithBody) {
        if (this.req.contentType.startsWith("json")) {
          if (config.data instanceof Object) {
            config.data["g-recaptcha-response"] = this.recaptchaToken;
            recaptchaTokenInBody = true;
          }
        }
      }
      if (!this.isWithBody || !recaptchaTokenInBody) {
        config.params["g-recaptcha-response"] = this.recaptchaToken;
      }
    }

    if (this.req.contentType.startsWith("json")) {
      config.data = JSON.stringify(config.data);
    }

    const query = qs.stringify(config.params);
    if (query) {
      this.res.url = `${this.res.url}?${query}`;
    }
    this.res.url = decodeURI(this.res.url);

    return config;
  }

  public keyValueToObject(dictionary: IDictionary[]) {
    const result: {[key: string]: string} = {};
    for (const item of dictionary) {
      if (item.enabled) {
        result[item.key] = item.value;
      }
    }
    return result;
  }

  public onAceEditorChange(newValue: string) {
    this.req.body = newValue;
  }

  public async onSubmit() {
    this.resetResponse();
    this.res.isSubmit = true;
    try {
      const config = this.generateAxiosConfig();
      const axiosInstance = axios.create();
      axiosInstance.interceptors.request.use((request) => {
        this.setResponseTimeNow();
        return request;
      });
      axiosInstance.interceptors.response.use(
        (response) => {
          this.setResponseTimeDiff();
          return response;
        },
        (error) => {
          this.setResponseTimeDiff();
          return Promise.reject(error);
        },
      );
      const res = await axiosInstance(config);

      this.res.status = `${res.status} ${res.statusText}`;
      this.res.body = this.parseResponse(
        res.data,
        res.headers["content-type"],
        true,
      );
    } catch (error) {
      this.res.status = error.response
        ? `${error.response.status} ${error.response.statusText}`
        : error.message;
      this.res.body =
        (error.response &&
          this.parseResponse(
            error.response.data,
            error.response.headers["content-type"],
          )) ||
        undefined;
    } finally {
      this.res.isSubmit = false;
      this.recaptchaToken = null;
      if (this.req.recaptcha) {
        (this.$refs.recaptcha as any).reset();
      }
    }
  }

  public parseResponse(
    data: any,
    contentType: string,
    success: boolean = false,
  ) {
    if (!contentType) {
      return undefined;
    }
    const mimeType = new MimeType(contentType);
    if (mimeType.essence === "application/json") {
      const body = JSON.parse(
        new TextDecoder(mimeType.parameters.get("charset") || "utf-8").decode(
          data,
        ),
      );
      if (success) {
        this.afterSuccessJsonResponse(body);
      }
      return isoDateReplacer(JSON.stringify(body, null, 2));
    }
    if (mimeType.essence === "application/octet-stream") {
      return data;
    }
    return undefined;
  }

  public resetResponse() {
    this.res.body = undefined;
    this.res.time = 0;
    this.res.source = axios.CancelToken.source();
    this.res.helpers.fileName = undefined;
    this.res.helpers.qrCode = undefined;
  }

  public saveResponse() {
    saveAs(
      new Blob([this.res.body], {type: "application/octet-stream"}),
      this.res.helpers.fileName,
    );
  }

  public setResponseTimeDiff() {
    this.res.time = performance.now() - this.res.time;
  }

  public setResponseTimeNow() {
    this.res.time = performance.now();
  }
}
</script>

<style lang="css" scoped>
.nav-align {
  text-align: center;
}
</style>
