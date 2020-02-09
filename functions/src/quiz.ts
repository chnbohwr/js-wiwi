import * as admin from 'firebase-admin';
import quizJson from './quiz.json';
import fireStore from './fireStore';
import { lineClient } from './lineUtils';
import { EventSource, TemplateMessage, TextMessage, MessageEvent, } from '@line/bot-sdk';

const shuffle = (array: Array<any>) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const getFireStoreSource = (source: EventSource) => {
  switch (source.type) {
    case 'room':
      return source.roomId;
    case 'group':
      return source.groupId;
    default:
      return source.userId;
  }
}

const getSourceUserId = (source: EventSource): string => {
  return source.userId || 'can not find user id';
}

exports.getQuestion = async (event: MessageEvent) => {
  console.log('in get question function');
  const document = fireStore.collection('quiz').doc(getFireStoreSource(event.source));
  const dbQuizData = await document.get();
  if (dbQuizData.exists) {
    const message: TextMessage = {
      type: 'text',
      text: '遊戲還沒結束，別重複出題'
    };
    return lineClient.replyMessage(event.replyToken, message);
  }
  console.log('check question status done');
  // firestore add question id
  const randomQuestion = Object.assign({}, quizJson[Math.floor(Math.random() * quizJson.length)]);
  // save now question to database
  randomQuestion.o = shuffle(randomQuestion.o);
  const gameMessage: TemplateMessage = {
    type: 'template',
    altText: `題目類型:${randomQuestion.c}\r\n${randomQuestion.q}\r\n${randomQuestion.o.toString()}`,
    template: {
      type: 'buttons',
      text: `題目類型:${randomQuestion.c}\r\n${randomQuestion.q}\r\n\r\n點選下方按鈕回答！！`,
      actions: randomQuestion.o.map(questionText => ({
        type: 'message',
        label: questionText,
        text: `回答:${questionText}`
      }))
    }
  };
  console.log('generate question done');
  return lineClient.replyMessage(event.replyToken, gameMessage)
    .then(() => document.set({ quizId: randomQuestion.id }));
}

const updateScore = async (event: MessageEvent) => {
  console.log('in update score function');
  const document = fireStore.collection('score').doc(getFireStoreSource(event.source));
  const dataInstance = await document.get();
  if (!dataInstance.exists) {
    const d1 = {
      [getSourceUserId(event.source)]: 100
    };
    return document.set(d1)
  }
  const data = dataInstance.data() || {};
  if (!data[getSourceUserId(event.source)]) {
    const d2: { [key: string]: any } = {};
    d2[getSourceUserId(event.source)] = 100;
    return document.update(d2)
  }
  const d3: { [key: string]: any } = {};
  d3[getSourceUserId(event.source)] = admin.firestore.FieldValue.increment(100);
  return document.update(d3);
}

exports.answerQuestion = async (event: MessageEvent) => {
  // check if event message type
  if (event.message.type !== 'text') {
    throw new Error('answerQuestion function can not accept non text event');
  }
  if (!event.source.userId) {
    throw new Error('answerQuestion function can not accept event no userId');
  }
  const document = fireStore.collection('quiz').doc(getFireStoreSource(event.source));
  const dbQuizData = await document.get();
  if (!dbQuizData.exists) {
    const outMessage: TextMessage = {
      type: 'text',
      text: '搶答截止了，請重新出題'
    };
    return lineClient.replyMessage(event.replyToken, outMessage);
  }
  const quizId = (dbQuizData.data() || {}).quizId;
  const question = quizJson.find(quizData => quizData.id === quizId) || quizJson[0];
  const rightAnswer = question.o[0];
  const userAnswer = (event.message.text || '').substr(3, 99);
  if (userAnswer === rightAnswer) {
    document.delete().catch(console.error);
    const profile = await lineClient.getProfile(event.source.userId);
    const rightMessage: TemplateMessage = {
      type: 'template',
      altText: `恭喜${profile.displayName}答對，獲得 100 積分`,
      template: {
        type: 'buttons',
        text: `恭喜${profile.displayName}答對，獲得 100 積分`,
        actions: [{
          type: 'message',
          label: '再出一題，我要挑戰',
          text: `出題`
        }]
      }
    };
    updateScore(event).catch(console.error);
    return lineClient.replyMessage(event.replyToken, rightMessage);
  }
  const wrongMessage: TextMessage = {
    type: 'text',
    text: '答錯，試試看別的答案吧'
  };
  return lineClient.replyMessage(event.replyToken, wrongMessage);
}

exports.showScore = async (event: MessageEvent) => {
  const document = fireStore.collection('score').doc(getFireStoreSource(event.source));
  const dataInstance = await document.get();
  if (!dataInstance.exists) {
    const message: TemplateMessage = {
      type: 'template',
      altText: `目前還沒有積分，要出題讓大家玩嗎？`,
      template: {
        type: 'buttons',
        text: `目前還沒有積分，要出題讓大家玩嗎？`,
        actions: [{
          type: 'message',
          label: '我要挑戰',
          text: `出題`
        },
        {
          type: 'message',
          label: '查看大家積分',
          text: `積分`
        }]
      }
    };
    return lineClient.replyMessage(event.replyToken, message);
  }

  const scoreData = dataInstance.data() || {};

  const userProfiles = await Promise.all(Object.keys(scoreData).map(userId => lineClient.getProfile(userId)));
  const textArr = userProfiles.map(userProfile => `${userProfile.displayName}: ${scoreData[userProfile.userId]} 分`);
  const scoreMessage: TextMessage = {
    type: 'text',
    text: `公布積分🤣獲得一萬積分可以請你喝飲料\r\n${textArr.join('\r\n')}`,
  }
  return lineClient.replyMessage(event.replyToken, scoreMessage);
}