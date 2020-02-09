import {https} from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import { lineMiddleware } from './lineUtils';

import eventHandler from './eventHandler';

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.post('/callback', lineMiddleware, (req, res) => {
  Promise.all(req.body.events.map(eventHandler))
  .then(()=>{
    res.sendStatus(200);
  })
  .catch(console.error);
});

// Expose Express API as a single Cloud Function:
export const widgets = https.onRequest(app);