import * as line from '@line/bot-sdk';
import * as functions from 'firebase-functions';

const lineConfig = {
  channelAccessToken: functions.config().line.channel.accesstoken,
  channelSecret: functions.config().line.channel.secret,
};

export const lineMiddleware = line.middleware(lineConfig);
export const lineClient = new line.Client(lineConfig);