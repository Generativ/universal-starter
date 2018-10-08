import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import * as functions from 'firebase-functions';
import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { enableProdMode } from '@angular/core';
import { renderModuleFactory } from '@angular/platform-server';
// Express Engine
import {ngExpressEngine} from '@nguniversal/express-engine';
// Import module map for lazy loading
import {provideModuleMap} from '@nguniversal/module-map-ngfactory-loader';
// import { AppServerModuleNgFactory } from '../functions/dist-server/main';

enableProdMode();

// const index = fs
//   .readFileSync(path.resolve(__dirname, './dist/browser/index.html'), 'utf8')
//   .toString();
const {AppServerModuleNgFactory, LAZY_MODULE_MAP} = require(__dirname + '/dist/server/main');

const app: express.Express = express();

// const PORT = process.env.PORT || 4000;
const DIST_FOLDER = path.join(__dirname, 'dist');

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', path.join(DIST_FOLDER, 'browser'));

// Server static files from /browser
app.get('*.*', express.static(path.join(DIST_FOLDER, 'browser'), {
  maxAge: '1y'
}));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render('index', { req });
});

// app.get('**', function(req, res) {
//   renderModuleFactory(AppServerModuleNgFactory, {
//     url: req.path,
//     document: index
//   }).then(html => res.status(200).send(html))
//   .catch(e => console.log(e));
// });

export let ssrapp = functions.https.onRequest(app);
