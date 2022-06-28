const socketConfig: {
  url: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  options: {};
} = { url: 'http://localhost:3000', options: {} };
// eslint-disable-next-line @typescript-eslint/naming-convention
const api_url = localStorage.getItem('api_url');

export const environment = {
  production: true,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  // API_URL: 'http://192.168.0.20:3000',

  // eslint-disable-next-line @typescript-eslint/naming-convention
  API_URL: api_url,
  socketConfig,
};
