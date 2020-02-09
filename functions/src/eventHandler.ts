import jsRecommend from './jsRecommend';
import { MessageEvent } from '@line/bot-sdk';
const quiz = require('./quiz');

const { getQuestion, answerQuestion, showScore } = quiz;

const eventHandler = async (event: MessageEvent) => {
  console.log('in event handler function');

  if (event.message.type==='text' && event.message.text === '抽') {
    return jsRecommend(event);
  }

  if (event.message.type==='text' && event.message.text === '出題') {
    return getQuestion(event)
  }

  if (event.message.type==='text' && event.message.text.indexOf('回答:') === 0) {
    return answerQuestion(event);
  }

  if (event.message.type==='text' && event.message.text.indexOf('積分') === 0) {
    return showScore(event);
  }
}





export default eventHandler;