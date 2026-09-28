/**
 * One-time (re-runnable) setup script: indexes a folder of celebrity photos
 * you supply into an AWS Rekognition face collection, so the app can later
 * match a user's scan against it with SearchFacesByImage.
 *
 * You must supply your own photos and have the rights to use them for this
 * purpose - Rekognition does not ship a celebrity database for look-alike
 * matching (that's a different feature, RecognizeCelebrities, which only
 * detects celebrities already present in a photo, not look-alikes for a
 * regular user).
 *
 * Usage:
 *   1. Put photos in server/celebrity-photos/, one clear face per file,
 *      named like "Zendaya.jpg" or "Emma_Stone.jpg" (the filename becomes
 *      the display name, with underscores turned into spaces).
 *   2. npm run build-celebrity-collection
 */
const fs = require('fs');
const path = require('path');
const {
  RekognitionClient,
  CreateCollectionCommand,
  IndexFacesCommand,
} = require('@aws-sdk/client-rekognition');
const config = require('../src/config');

const PHOTOS_DIR = path.join(__dirname, '..', 'celebrity-photos');
const PUBLIC_DIR = path.join(__dirname, '..', 'public', 'celebrities');
const MANIFEST_PATH = path.join(__dirname, '..', 'data', 'celebrities.manifest.json');

const client = new RekognitionClient({
  region: config.aws.region,
  credentials: config.aws.accessKeyId
    ? { accessKeyId: config.aws.accessKeyId, secretAccessKey: config.aws.secretAccessKey }
    : undefined,
});

function slugify(filename) {
  return path.parse(filename).name.replace(/[^a-zA-Z0-9_.\-:]/g, '_');
}

function displayNameFromFilename(filename) {
  return path.parse(filename).name.replace(/_/g, ' ').trim();
}

async function ensureCollection() {
  try {
    await client.send(new CreateCollectionCommand({ CollectionId: config.aws.collectionId }));
    console.log(`Created collection "${config.aws.collectionId}".`);
  } catch (err) {
    if (err.name === 'ResourceAlreadyExistsException') {
      console.log(`Collection "${config.aws.collectionId}" already exists, reusing it.`);
    } else {
      throw err;
    }
  }
}

async function main() {
  if (!fs.existsSync(PHOTOS_DIR)) {
    console.error(`No photos found. Create ${PHOTOS_DIR} and add celebrity photos first.`);
    process.exitCode = 1;
    return;
  }
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });

  const files = fs
    .readdirSync(PHOTOS_DIR)
    .filter((f) => /\.(jpe?g|png)$/i.test(f));

  if (files.length === 0) {
    console.error(`No image files in ${PHOTOS_DIR}.`);
    process.exitCode = 1;
    return;
  }

  await ensureCollection();

  const manifest = fs.existsSync(MANIFEST_PATH)
    ? JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'))
    : {};

  for (const file of files) {
    const externalId = slugify(file);
    const buffer = fs.readFileSync(path.join(PHOTOS_DIR, file));

    const result = await client.send(
      new IndexFacesCommand({
        CollectionId: config.aws.collectionId,
        Image: { Bytes: buffer },
        ExternalImageId: externalId,
        DetectionAttributes: [],
        MaxFaces: 1,
        QualityFilter: 'AUTO',
      })
    );

    if (!result.FaceRecords || result.FaceRecords.length === 0) {
      console.warn(`No face detected in ${file}, skipping.`);
      continue;
    }

    fs.copyFileSync(path.join(PHOTOS_DIR, file), path.join(PUBLIC_DIR, file));
    manifest[externalId] = { name: displayNameFromFilename(file), filename: file };
    console.log(`Indexed ${file} as "${externalId}".`);
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`Wrote ${MANIFEST_PATH}.`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
