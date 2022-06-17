// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
   production: false,
  urlFirebase: '[YOUR_FIREBASE_ENDPOINT]',
  urlLogin: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[YOUR_API_KEY]',
  urlGetUser: 'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=[YOUR_API_KEY]',
  urlFiles: 'http://localhost/sistemas-angular/marketplace/src/assets/img/',
  adminFiles: 'http://localhost/sistemas-angular/marketplace/src/assets/img/index.php?key=[YOUR_API_KEY]',
  deleteFiles:'http://localhost/sistemas-angular/marketplace/src/assets/img/delete.php?key=[YOUR_API_KEY]',
  urlRefreshToken: 'https://securetoken.googleapis.com/v1/token?key=[YOUR_API_KEY]',
  urlEmail:'http://localhost/sistemas-angular/admin-angular/src/assets/email/index.php?key=[YOUR_API_KEY]',
  domainMP:'https://mp-angular.tutorialesatualcance.com/',
  nameStore:'Digitalworld Us'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
