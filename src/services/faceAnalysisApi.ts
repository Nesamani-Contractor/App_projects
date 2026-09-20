import { API_BASE_URL } from '../config/env';
import { FaceAnalysisResult } from '../types/faceAnalysis';

export class FaceAnalysisError extends Error {}

export async function analyzeFace(photoUri: string): Promise<FaceAnalysisResult> {
  const formData = new FormData();
  // React Native's fetch/FormData accepts this {uri, name, type} shape in
  // place of a Blob for uploading a local file.
  formData.append('image', {
    uri: photoUri,
    name: 'scan.jpg',
    type: 'image/jpeg',
  } as unknown as Blob);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' },
    });
  } catch {
    throw new FaceAnalysisError('Could not reach the analysis server. Check your connection and try again.');
  }

  if (!response.ok) {
    const message = await response.text().catch(() => '');
    throw new FaceAnalysisError(message || `Analysis failed (${response.status}).`);
  }

  return (await response.json()) as FaceAnalysisResult;
}
