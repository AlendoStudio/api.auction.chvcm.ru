export const ENV_APIDOC_URL: string = process.env.APIDOC_URL as string;
export const ENV_API_ENDPOINT: string = process.env.API_ENDPOINT as string;
export const ENV_RECAPTCHA_SITE: string = process.env.RECAPTCHA_SITE as string;
export const ENV_SOCKET_TRANSPORTS: string[] = (process.env
  .SOCKET_TRANSPORTS as unknown) as string[];
