import { https, Response } from 'firebase-functions';
import errorHandler from './errorHandler';

import eventHandler from './eventHandler';

export const callback = https.onRequest((request: https.Request, response: Response) => {
  // console.log(request.body.events[0]);
  Promise.all(request.body.events.map(eventHandler)).then(() => {
    response.sendStatus(200);
  }).catch(errorHandler)
});