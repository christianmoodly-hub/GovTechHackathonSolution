# Qfrency TTS proxy

Cloud Function `synthesizeSpeech` keeps the Qfrency API key on the server and
returns base64 WAV audio to the mobile app.

## Setup

1. Request access from CSIR: **info@qfrency.com** (AccountID, API key, tokens).
2. Install and build:

```bash
cd functions
npm install
npm run build
```

3. Store the secret (do not commit it):

```bash
firebase functions:secrets:set QFRENCY_API_KEY
```

4. Deploy:

```bash
firebase deploy --only functions
```

Callable name: `synthesizeSpeech`  
Region: `us-central1` (must match `getFirebaseFunctions()` in the mobile app)

## Request / response

```json
// request.data
{ "text": "Molo", "locale": "xh" }

// response.data
{ "wav64": "<base64 WAV>", "voiceCode": "xho-ZA-dnn-zoleka", "locale": "xh" }
```
