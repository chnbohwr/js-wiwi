import { config } from 'firebase-functions';
import { FlexBubble, FlexMessage } from '@line/bot-sdk';

type Question = {
  title: string,
  question?: string,
  id: string,
  options: Array<string>,
  answer: number,
  desc: string,
}

export const generateTemplate = (questionData: Question):FlexMessage => {
  const flexBubble:FlexBubble = {
    "type": "bubble",
    "header": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "text",
          "text": questionData.title,
          "size": "md",
          "weight": "bold",
          "color": "#ffffff"
        }
      ],
      "backgroundColor": "#79bac1"
    },
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": questionData.options.map(optionText=>({
        "type": "button",
        "action": {
          "type": "message",
          "label": optionText,
          "text": `回答:${optionText}`
        }
      }))
    }
  }

  if(questionData.question){
    flexBubble.hero = {
      "type": "image",
      "url": `${config().domain.url}/pic/${questionData.id}.png`,
      "margin": "none",
      "align": "center",
      "gravity": "center",
      "size": "full",
      "backgroundColor": "#f9f9f9"
    };
  }

  const flexMessage: FlexMessage = {
    type: 'flex',
    altText: 'hi',
    contents: flexBubble
  }

  return flexMessage;
}
