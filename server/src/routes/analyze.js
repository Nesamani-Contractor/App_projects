const express = require('express');
const multer = require('multer');
const providers = require('../providers');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

const router = express.Router();

router.post('/analyze', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Missing "image" field in the upload.' });
  }

  try {
    const [skinAndMakeup, celebrityMatches] = await Promise.all([
      providers.skinMakeup.analyzeSkinAndMakeup(req.file.buffer),
      providers.celebrityMatch.findCelebrityMatches(req.file.buffer),
    ]);

    return res.json({
      makeupReview: skinAndMakeup.makeupReview,
      skin: skinAndMakeup.skin,
      celebrityMatches,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[analyze] failed:', err);
    return res.status(502).json({ error: 'Face analysis failed. Please try again.' });
  }
});

module.exports = router;
