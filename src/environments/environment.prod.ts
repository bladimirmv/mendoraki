const socketConfig: {
  url: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  options: {};
} = { url: 'http://localhost:3000', options: {} };

export const environment = {
  production: true,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  API_URL: 'http://localhost:3000',
  // API_URL: 'https://d513-181-188-162-134.ngrok.io',
  socketConfig,
};
