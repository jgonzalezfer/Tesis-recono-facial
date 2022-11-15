// Este archivo puede ser reemplazado durante la construcción utilizando el array `fileReplacements`.
// `ng build` reemplaza `environment.ts` con `environment.prod.ts`.
// La lista de reemplazos de archivos se puede encontrar en `angular.json`.

export const environment = {
  firebase: {
    projectId: 'tesis-reco-facial',
    appId: '1:821652951086:web:fb51fbfcc3b2bda3b20fbf',
    databaseURL: 'https://tesis-reco-facial-default-rtdb.firebaseio.com',
    storageBucket: 'tesis-reco-facial.appspot.com',
    locationId: 'us-central',
    apiKey: 'AIzaSyAWu80RGIPW7bmnvmqVK_2HlmsyPOBnA3U',
    authDomain: 'tesis-reco-facial.firebaseapp.com',
    messagingSenderId: '821652951086',
    measurementId: 'G-6PP29NMYZJ',
  },
  production: false
};

/*
 * Para facilitar la depuración en modo de desarrollo, puedes importar el siguiente archivo
 * para ignorar los marcos de pila de error relacionados con la zona, como `zone.run`, `zoneDelegate.invokeTask`.
 *
 * Esta importación debe ser comentada en el modo de producción porque tendrá un impacto negativo
 * en el rendimiento si se lanza un error.
 */
// import 'zone.js/plugins/zone-error'; // Incluido con Angular CLI.
