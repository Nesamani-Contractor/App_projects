// Mirrors the abridged schema in the Face Score PRD (Call 1: the scan).
export const scanToolSchema = {
  name: 'record_scan',
  description: 'Record the structured result of a facial and color analysis scan.',
  input_schema: {
    type: 'object',
    additionalProperties: false,
    required: ['image_quality', 'face_shape', 'features', 'color', 'skin', 'hair'],
    properties: {
      image_quality: {
        type: 'object',
        additionalProperties: false,
        required: ['usable', 'issues'],
        properties: {
          usable: { type: 'boolean' },
          issues: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['uneven_lighting', 'blurry', 'too_dark', 'too_bright', 'face_partially_out_of_frame', 'occluded', 'extreme_angle', 'none'],
            },
          },
        },
      },
      face_shape: {
        type: 'object',
        additionalProperties: false,
        required: ['value', 'confidence'],
        properties: {
          value: { type: 'string', enum: ['Oval', 'Round', 'Square', 'Heart', 'Diamond', 'Oblong', 'Triangle'] },
          confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
        },
      },
      features: {
        type: 'object',
        additionalProperties: false,
        required: ['eye_shape', 'brow_shape', 'lip_shape', 'nose', 'cheekbones', 'jawline'],
        properties: {
          eye_shape: { type: 'string', enum: ['Almond', 'Round', 'Narrow', 'Hooded', 'Monolid', 'Downturned', 'Upturned'] },
          brow_shape: { type: 'string', enum: ['Straight', 'Soft_Angled', 'Hard_Angled', 'Rounded'] },
          lip_shape: { type: 'string', enum: ['Full', 'Thin', 'Balanced', 'Bow', 'Wide'] },
          nose: { type: 'string', enum: ['Narrow', 'Balanced', 'Broad'] },
          cheekbones: { type: 'string', enum: ['High', 'Balanced', 'Low'] },
          jawline: { type: 'string', enum: ['Soft', 'Defined', 'Angular'] },
        },
      },
      color: {
        type: 'object',
        additionalProperties: false,
        required: ['undertone', 'depth', 'contrast', 'season', 'sub_season', 'best_colors_hex', 'avoid_colors_hex', 'best_metals', 'confidence'],
        properties: {
          undertone: { type: 'string', enum: ['Warm', 'Cool', 'Neutral', 'Olive'] },
          depth: { type: 'string', enum: ['Light', 'Medium', 'Tan', 'Deep'] },
          contrast: { type: 'string', enum: ['Low', 'Medium', 'High'] },
          season: { type: 'string', enum: ['Spring', 'Summer', 'Autumn', 'Winter'] },
          sub_season: { type: 'string', enum: ['Light', 'True', 'Bright', 'Soft', 'Deep', 'Warm', 'Cool'] },
          best_colors_hex: { type: 'array', minItems: 8, maxItems: 12, items: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' } },
          avoid_colors_hex: { type: 'array', minItems: 1, maxItems: 6, items: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' } },
          best_metals: { type: 'string', enum: ['Gold', 'Silver', 'Rose_Gold', 'Both'] },
          confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
        },
      },
      skin: {
        type: 'object',
        additionalProperties: false,
        required: ['apparent_type', 'observations', 'strengths'],
        properties: {
          apparent_type: { type: 'string', enum: ['Oily', 'Dry', 'Combination', 'Normal', 'Unclear'] },
          observations: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              required: ['area', 'concern', 'level'],
              properties: {
                area: { type: 'string', enum: ['t_zone', 'cheeks', 'under_eye', 'forehead', 'chin'] },
                concern: { type: 'string', enum: ['shine', 'dryness', 'redness', 'uneven_tone', 'texture', 'dark_circles', 'puffiness', 'fine_lines', 'blemishes'] },
                level: { type: 'string', enum: ['mild', 'moderate', 'noticeable'] },
              },
            },
          },
          strengths: { type: 'array', items: { type: 'string' } },
        },
      },
      hair: {
        type: 'object',
        additionalProperties: false,
        required: ['color', 'visible_length'],
        properties: {
          color: { type: 'string' },
          visible_length: { type: 'string', enum: ['Short', 'Medium', 'Long', 'Not_Visible'] },
        },
      },
    },
  },
};
