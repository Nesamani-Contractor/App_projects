require('dotenv').config();

function required(name, value) {
  if (!value) {
    // eslint-disable-next-line no-console
    console.warn(`[config] ${name} is not set - the related provider will fail until it is.`);
  }
  return value;
}

module.exports = {
  port: Number(process.env.PORT) || 4000,
  publicBaseUrl: process.env.PUBLIC_BASE_URL || 'http://localhost:4000',

  skinMakeupProvider: process.env.SKIN_MAKEUP_PROVIDER || 'mock',
  perfectCorp: {
    clientId: process.env.PERFECTCORP_CLIENT_ID || '',
    clientSecret: process.env.PERFECTCORP_CLIENT_SECRET || '',
    apiBase: process.env.PERFECTCORP_API_BASE || 'https://yce-api-01.perfectcorp.com',
  },

  celebrityMatchProvider: process.env.CELEBRITY_MATCH_PROVIDER || 'mock',
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    collectionId: process.env.REKOGNITION_COLLECTION_ID || 'shine-me-celebrities',
  },

  _validate() {
    if (this.skinMakeupProvider === 'perfectcorp') {
      required('PERFECTCORP_CLIENT_ID', this.perfectCorp.clientId);
      required('PERFECTCORP_CLIENT_SECRET', this.perfectCorp.clientSecret);
    }
    if (this.celebrityMatchProvider === 'rekognition') {
      required('AWS_ACCESS_KEY_ID', this.aws.accessKeyId);
      required('AWS_SECRET_ACCESS_KEY', this.aws.secretAccessKey);
    }
  },
};
