/**
 * Fake skin + makeup provider so the app is fully testable before real API
 * credentials exist. Mirrors the shape a real provider must return - see
 * perfectCorpProvider.js for the live implementation.
 */
async function analyzeSkinAndMakeup(_imageBuffer) {
  return {
    makeupReview: {
      summary:
        'Your base and blush are blended beautifully. A couple of quick touch-ups will make everything look fresher through the day.',
      overallScore: 82,
      touchUps: [
        {
          id: 'touchup-concealer',
          area: 'Under-eye',
          issue: 'Slight concealer creasing near the inner corners.',
          suggestion: 'Set with a small amount of translucent powder using a damp sponge, pressing rather than swiping.',
        },
        {
          id: 'touchup-blend',
          area: 'Jawline',
          issue: 'Faint foundation line where it meets your neck.',
          suggestion: 'Blend a few drops of foundation down onto the neck with a damp beauty sponge to soften the edge.',
        },
        {
          id: 'touchup-lip',
          area: 'Lips',
          issue: 'Lip color has faded toward the center.',
          suggestion: 'Blot and reapply just the center of the lips, then press lips together to diffuse the edges.',
        },
      ],
    },
    skin: {
      overallScore: 78,
      concerns: [
        {
          id: 'concern-hydration',
          label: 'Hydration',
          severity: 'moderate',
          score: 68,
          recommendation: 'Skin is showing early tightness around the cheeks - add a hydrating serum with hyaluronic acid before makeup.',
        },
        {
          id: 'concern-dark-circles',
          label: 'Dark Circles',
          severity: 'low',
          score: 74,
          recommendation: 'Mild under-eye discoloration - a peach-toned color corrector before concealer will neutralize it.',
        },
        {
          id: 'concern-texture',
          label: 'Texture',
          severity: 'low',
          score: 85,
          recommendation: 'Texture is mostly smooth - a light mist after makeup will keep it looking fresh, not powdery.',
        },
        {
          id: 'concern-oiliness',
          label: 'T-Zone Oiliness',
          severity: 'moderate',
          score: 70,
          recommendation: 'Some shine building in the T-zone - blotting papers midday will help more than adding powder.',
        },
      ],
    },
  };
}

module.exports = { analyzeSkinAndMakeup };
