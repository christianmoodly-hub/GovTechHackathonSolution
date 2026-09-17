# NCAP mobile (Expo)

Passwordless Firebase Auth via email sign-in link, plus three NCAP-style
questionnaire tools.

## Setup

1. Firebase Console → Authentication → enable **Email link (passwordless sign-in)**.
2. Install and run:

```bash
cd mobile
npm install
npx expo start
```

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
