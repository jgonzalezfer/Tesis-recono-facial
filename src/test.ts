// Este archivo es requerido por karma.conf.js y carga recursivamente todos los archivos .spec y framework

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: {
  context(path: string, deep?: boolean, filter?: RegExp): {
    <T>(id: string): T;
    keys(): string[];
  };
};

// En primer lugar, inicialice el entorno de pruebas de Angular.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

// Encontramos todas las pruebas.
const context = require.context('./', true, /\.spec\.ts$/);
// Cargar los módulos.
context.keys().map(context);
