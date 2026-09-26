const config = require('../config');

function loadSkinMakeupProvider() {
  if (config.skinMakeupProvider === 'perfectcorp') {
    return require('./skinMakeup/perfectCorpProvider');
  }
  return require('./skinMakeup/mockProvider');
}

function loadCelebrityMatchProvider() {
  if (config.celebrityMatchProvider === 'rekognition') {
    return require('./celebrityMatch/rekognitionProvider');
  }
  return require('./celebrityMatch/mockProvider');
}

module.exports = {
  skinMakeup: loadSkinMakeupProvider(),
  celebrityMatch: loadCelebrityMatchProvider(),
};
