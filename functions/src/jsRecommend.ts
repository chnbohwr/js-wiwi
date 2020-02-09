import { lineClient } from './lineUtils';
import { ReplyableEvent, TextMessage } from '@line/bot-sdk';

const jsRecommend = async (event: ReplyableEvent) => {
  const echo: TextMessage = {
    type: 'text',
    text: '抱歉，我本來想抓稀土掘金，可是他的 api 被保護起來了，如果你們有辦法拿到請通知我，而且最幹的是，我已經輸入信用卡給 firebase 了...'
  };
  return lineClient.replyMessage(event.replyToken, echo);
}

export default jsRecommend;