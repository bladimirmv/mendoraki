// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const socketConfig: {
  url: string;
  options: object;
} = { url: 'http://localhost:3000', options: {} };

// eslint-disable-next-line @typescript-eslint/naming-convention
const api_url = localStorage.getItem('api_url');

export const environment = {
  production: false,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  // API_URL: 'http://192.168.0.20:3000',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  API_URL: api_url,

  socketConfig,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
