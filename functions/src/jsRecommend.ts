import { lineClient } from './lineUtils';
import { ReplyableEvent, TextMessage } from '@line/bot-sdk';
import { toJson } from 'rss-converter';

type RSSItem = {
  title: string,
  link: string,
}

const jsRecommend = async (event: ReplyableEvent) => {
  const helloText = '😂JS-WIWI 來為您推薦文章😂\n系統每半天抓取一次，所以大概半天抽一次才有不同的可以看\n\n'
  console.time('get rss feed');
  let feed = await toJson('https://rsshub.app/juejin/category/frontend');
  const echo: TextMessage = {
    type: 'text',
    text: helloText + feed.items.map((d: RSSItem) => `${d.title}\n${d.link}`).join('\n\n')
  };
  console.timeEnd('get rss feed');
  return lineClient.replyMessage(event.replyToken, echo);
}

export default jsRecommend;