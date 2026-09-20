/**
 * Fake celebrity look-alike provider for local development, before a real
 * Rekognition collection has been built. See rekognitionProvider.js for the
 * live implementation.
 */
async function findCelebrityMatches(_imageBuffer) {
  return [
    {
      name: 'Sample Celebrity',
      similarity: 91,
      imageUrl: 'https://placehold.co/400x400?text=Celebrity+Match',
    },
  ];
}

module.exports = { findCelebrityMatches };
