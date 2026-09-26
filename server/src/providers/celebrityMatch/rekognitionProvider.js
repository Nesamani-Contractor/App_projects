const fs = require('fs');
const path = require('path');
const { RekognitionClient, SearchFacesByImageCommand } = require('@aws-sdk/client-rekognition');
const config = require('../../config');

const client = new RekognitionClient({
  region: config.aws.region,
  credentials: config.aws.accessKeyId
    ? { accessKeyId: config.aws.accessKeyId, secretAccessKey: config.aws.secretAccessKey }
    : undefined,
});

const MANIFEST_PATH = path.join(__dirname, '..', '..', '..', 'data', 'celebrities.manifest.json');

// Maps the ExternalImageId stored in the Rekognition collection back to a
// display name + a photo we can actually show in the app (Rekognition only
// returns face metadata, never the image itself). Built by
// scripts/buildCelebrityCollection.js.
function loadManifest() {
  try {
    const raw = fs.readFileSync(MANIFEST_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function findCelebrityMatches(imageBuffer) {
  const manifest = loadManifest();

  const command = new SearchFacesByImageCommand({
    CollectionId: config.aws.collectionId,
    Image: { Bytes: imageBuffer },
    MaxFaces: 3,
    FaceMatchThreshold: 60,
  });

  let response;
  try {
    response = await client.send(command);
  } catch (err) {
    if (err.name === 'InvalidParameterException') {
      // No face detected in the supplied image, or collection is empty.
      return [];
    }
    throw err;
  }

  const matches = response.FaceMatches || [];
  return matches
    .map((match) => {
      const externalId = match.Face?.ExternalImageId;
      const entry = externalId ? manifest[externalId] : undefined;
      if (!entry) return null;
      return {
        name: entry.name,
        similarity: Math.round(match.Similarity || 0),
        imageUrl: `${config.publicBaseUrl}/celebrities/${entry.filename}`,
      };
    })
    .filter(Boolean);
}

module.exports = { findCelebrityMatches };
