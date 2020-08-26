import { registerAs } from '@nestjs/config';

export default registerAs('conversation', () => ({
  path: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  json: JSON.parse(process.env.GOOGLE_DIALOGFLOW_JSON),
  lang: process.env.GOOGLE_DIALOGFLOW_LANGUAGE,
  project: JSON.parse(process.env.GOOGLE_DIALOGFLOW_JSON)['project_id']
}))