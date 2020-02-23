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

export const generateQuestionTemplate = (questionData: Question):FlexMessage => {
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
      "backgroundColor": "#79bac1",
      "contents": [
        {
          "type": "text",
          "text": questionData.options.join('\n'),
          "style": "normal",
          "wrap": true,
          "color": "#ffffff"
        }
      ]
    },
    "footer": {
      "type": "box",
      "layout": "horizontal",
      "contents": questionData.options.map(optionText=>({
        "type": "button",
        "action": {
          "type": "message",
          "label": optionText[0],
          "text": `回答:${optionText[0]}`
        },
        "margin": "xs",
        "color": "#2a7886",
        "style": "primary"
      })),
      "backgroundColor": "#79bac1"
    }
  }
  if(questionData.question){
    flexBubble.hero = {
      "type": "image",
      "url": `${config().domain.url}/pic/${questionData.id}.png`,
      "size": "full",
      "backgroundColor": "#f9f9f9",
      "aspectMode": "fit",
      "margin": "none",
      "align": "center",
      "gravity": "center",
      "flex": 1,
      "aspectRatio": "3:1",
      "action": {
        "type": "uri",
        "label":"View details",
        "uri": `${config().domain.url}/pic/${questionData.id}.png`
      }
    };
  }
  const flexMessage: FlexMessage = {
    type: 'flex',
    altText: '看來你的裝置沒有辦法顯示我的訊息，要不要用手機瞧瞧',
    contents: flexBubble
  }
  // console.log(flexMessage)
  return flexMessage;
}


export const generateAnswerTemplate = (displayName: string, desc: string):FlexMessage => {
  const flexBubble:FlexBubble = {
    "type": "bubble",
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "text",
          "text": `恭喜${displayName}答對`,
          "color": "#ffffff"
        },
        {
          "type": "separator",
          "margin": "md",
          "color": "#79bac1"
        },
        {
          "type": "text",
          "text": "講解:",
          "color": "#ffffff"
        },
        {
          "type": "separator",
          "margin": "md",
          "color": "#79bac1"
        },
        {
          "type": "text",
          "text": desc,
          "wrap": true,
          "color": "#ffffff"
        }
      ],
      "backgroundColor": "#79bac1"
    },
    "footer": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "button",
          "action": {
            "type": "message",
            "label": "再出一題~我要挑戰",
            "text": "出題"
          },
          "style": "primary",
          "color": "#2a7886"
        },
        {
          "type": "button",
          "action": {
            "type": "message",
            "label": "查看積分",
            "text": "積分"
          },
          "style": "primary",
          "color": "#2a7886",
          "margin": "md"
        }
      ],
      "backgroundColor": "#79bac1"
    },
    "styles": {
      "header": {
        "backgroundColor": "#79bac1"
      },
      "body": {
        "backgroundColor": "#79bac1"
      }
    }
  }
  const flexMessage: FlexMessage = {
    type: 'flex',
    altText: '看來你的裝置沒有辦法顯示我的訊息，要不要用手機瞧瞧',
    contents: flexBubble
  }
  return flexMessage;
}