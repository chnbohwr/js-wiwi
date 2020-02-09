import { HTTPError } from '@line/bot-sdk';

const handler = (error: any) => {
  if (error instanceof HTTPError) {
    console.error(`HTTP ERROR ${error.statusCode}: ${JSON.stringify(error.originalError.response.data)}`);
  } else {
    console.error(error);
  }
}

export default handler;