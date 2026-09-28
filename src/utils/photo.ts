import * as FileSystem from 'expo-file-system/legacy';

// expo-camera / expo-image-picker return a `data:` URI on web (already
// base64) and a `file://` URI on native (needs reading off disk).
export const photoUriToBase64 = async (uri: string): Promise<string> => {
  if (uri.startsWith('data:')) {
    const comma = uri.indexOf(',');
    return comma >= 0 ? uri.slice(comma + 1) : uri;
  }
  return FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
};
