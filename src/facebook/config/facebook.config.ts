import { registerAs } from '@nestjs/config';

export default registerAs('facebook', () => ({
  token: process.env.FACEBOOK_TOKEN,
  apiVersion: process.env.FACEBOOK_API_VERSION,
  timeoutForSequentialAttachments: parseInt(process.env.FACEBOOK_TIMEOUT_FOR_ATTACHMENTS),
  repliesLimit: parseInt(process.env.FACEBOOK_QUICK_REPLIES_LIMIT),
  cardsLimit: parseInt(process.env.FACEBOOK_CARDS_LIMIT),
  cardsButtonsLimit: parseInt(process.env.FACEBOOK_CARDS_BUTTONS_LIMIT),
  verifyToken: process.env.FACEBOOK_VERIFY_TOKEN,
  welcomeFileKey: process.env.WELCOME_FILE_KEY,
  memeFolder: process.env.MEME_FOLDER
}))