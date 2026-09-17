# NCAP mobile (Expo)

Passwordless Firebase Auth via email sign-in link, plus three NCAP-style
questionnaire tools.

## Setup

1. Firebase Console → Authentication → enable **Email link (passwordless sign-in)**.
2. Copy env template and set your Firebase web API key (never commit `.env`):

```bash
cd mobile
cp .env.example .env
# Edit .env — set EXPO_PUBLIC_FIREBASE_API_KEY from Firebase Console → Project settings
```

3. Install and run:

```bash
npm install
npx expo start
```

Restrict the web API key in [Google Cloud Console](https://console.cloud.google.com/apis/credentials) (HTTP referrers / Android/iOS app restrictions) and keep Firestore Security Rules locked down.

## Questionnaires

Distinct flows (not one generic form):

| Route | Tool |
|-------|------|
| `/questionnaires/subject-chooser` | Subject Chooser |
| `/questionnaires/career-choice` | Career Choice |
| `/questionnaires/job-fit` | Job Fit |

Each flow has its own question bank and domain weights, a progress bar, scores
answers against occupation keywords from Firestore, shows matched occupations,
and writes to `profiles/{uid}.questionnaireResults` via `updateProfile`.
Returning users see past results on open. Matches open `/occupations/[code]`.
