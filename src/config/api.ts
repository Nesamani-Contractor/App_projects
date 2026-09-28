import { Platform } from 'react-native';

// Dev-only: this app has no deployed backend. The server in /server runs
// locally (see server/README or the setup note in AGENTS.md) and this must
// point at wherever it's reachable from the device running the app:
//  - Web / iOS Simulator on the same machine: http://localhost:4000 works.
//  - A physical phone via Expo Go: replace with your computer's LAN IP,
//    e.g. http://192.168.1.23:4000 (same Wi-Fi network as the phone).
const DEV_LAN_HOST = 'localhost';

export const API_BASE_URL =
  Platform.OS === 'web' ? 'http://localhost:4000' : `http://${DEV_LAN_HOST}:4000`;
