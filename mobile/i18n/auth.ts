import { expandSaLocales, resolveLocale } from "./createBundle";

export type AuthStrings = {
  // Shared
  or: string;
  helpTitle: string;
  helpBody: string;
  helpTollFree: string;
  helpWhatsapp: string;
  googleSignIn: string;
  errorGeneric: string;

  // Sign-in
  signInTitle: string;
  signInHeadline: string;
  signInSubtitle: string;
  ssoTitle: string;
  ssoSub: string;
  chooseMethod: string;
  methodSaId: string;
  methodMobileEmail: string;
  methodPassport: string;
  fieldSaIdLabel: string;
  fieldSaIdTrailing: string;
  fieldSaIdPlaceholder: string;
  fieldSaIdHint: string;
  fieldPassportLabel: string;
  fieldPassportTrailing: string;
  fieldPassportPlaceholder: string;
  fieldPassportHint: string;
  fieldMobileEmailLabel: string;
  fieldMobileEmailTrailing: string;
  fieldMobileEmailPlaceholder: string;
  fieldMobileEmailHint: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  forgot: string;
  rememberDevice: string;
  rememberDeviceBody: string;
  signInCta: string;
  otpSignIn: string;
  checkInboxTitle: string;
  checkInboxBody: (email: string) => string;
  useDifferentEmail: string;
  biometricTitle: string;
  biometricBody: string;
  biometricEnable: string;
  featureVaultKicker: string;
  featureVaultTitle: string;
  featureTvetKicker: string;
  featureTvetTitle: string;
  registerPrompt: string;
  registerCta: string;
  registerCaption: string;
  guestContinue: string;
  errorSaIdPassportUi: string;
  errorOtpMethod: string;
  errorSignIn: string;
  errorSendLink: string;
  errorGuest: string;

  // Register
  registerTitle: string;
  registerHeadline: string;
  registerSubtitle: string;
  trustFree: string;
  trustFirebase: string;
  stepOf: (step: number, total: number) => string;
  sectionPersonal: string;
  sectionPersonalSub: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  fullNameHint: string;
  docTypeLabel: string;
  docAsylum: string;
  docRsaId: string;
  docPassport: string;
  rsaIdLabel: string;
  passportAsylumLabel: string;
  rsaIdPlaceholder: string;
  documentPlaceholder: string;
  idVerified: string;
  dobLabel: string;
  dobHintFromId: string;
  genderLabel: string;
  genderFemale: string;
  genderMale: string;
  genderPreferNot: string;
  sectionContact: string;
  sectionContactSub: string;
  mobileLabel: string;
  mobilePlaceholder: string;
  mobileHint: string;
  emailLabel: string;
  emailRequired: string;
  emailPlaceholder: string;
  emailHint: string;
  provinceLabel: string;
  sectionSituation: string;
  sectionSituationSub: string;
  sectionSecurity: string;
  sectionSecuritySub: string;
  createPinLabel: string;
  createPinPlaceholder: string;
  confirmPinLabel: string;
  confirmPinPlaceholder: string;
  disabilityCheckTitle: string;
  disabilityCheckBody: string;
  privacyCheckTitle: string;
  privacyCheckBody: string;
  bannerPersonalized: string;
  createAccountCta: string;
  alreadyRegistered: string;
  signInHere: string;
  needHelpRegistering: string;
  helpRegisterBody: (tollFree: string, whatsapp: string) => string;
  errorPinMismatch: string;
  errorAcceptAgreement: string;
  errorRegistration: string;

  // Recover
  recoverTitle: string;
  recoverBack: string;
  recoverLiveLine: string;
  recoverHeadline: string;
  recoverAlt: string;
  recoverBody: string;
  recoverPopia: string;
  stepVerifyIdentity: string;
  stepCreatePin: string;
  channelSms: string;
  channelEmail: string;
  recoverEmailLabel: string;
  recoverIdPhoneLabel: string;
  recoverEmailPlaceholder: string;
  recoverIdPhonePlaceholder: string;
  recoverEmailHint: string;
  recoverIdPhoneHint: string;
  sendResetLink: string;
  sendOtp: string;
  step2Title: string;
  resetEmailSent: string;
  zeroRatedSmsSent: string;
  step2EmailBody: (email: string) => string;
  step2SmsBody: (masked: string) => string;
  otpLabel: string;
  codeExpires: (mm: string, ss: string) => string;
  resendSms: string;
  setNewPinLabel: string;
  setNewPinPlaceholder: string;
  confirmNewPinLabel: string;
  confirmNewPinPlaceholder: string;
  updatePasswordCta: string;
  pinUpdatedTitle: string;
  pinUpdatedBody: string;
  cantAccessPhoneTitle: string;
  cantAccessPhoneBody: string;
  tollFreeHelpline: string;
  whatsappCallback: string;
  langHint: string;
  errorEnterIdentifier: string;
  errorSendReset: string;
  errorEnterOtp: string;
  errorPinsMatch: string;

  // Verify email
  verifyTitle: string;
  verifyHeadline: string;
  verifyBody: (email: string) => string;
  verifyResent: string;
  verifyContinue: string;
  verifyResend: string;
  verifyDifferentAccount: string;
  errorNotVerified: string;
  errorRefreshVerify: string;
  errorResendVerify: string;
};

const en: AuthStrings = {
  or: "or",
  helpTitle: "Need help?",
  helpBody: "Speak to a DHET Career Adviser toll-free.",
  helpTollFree: "Toll-Free Helpline",
  helpWhatsapp: "WhatsApp Callback",
  googleSignIn: "Continue with Google",
  errorGeneric: "Something went wrong. Please try again.",

  signInTitle: "Sign In",
  signInHeadline: "Sign In to Khetha NCAP",
  signInSubtitle:
    "Access your saved questionnaires, APS calculations, bursary applications, and DHET career vault.",
  ssoTitle: "Official DHET Single Sign-On",
  ssoSub: "Zero-Rated (No Data or Airtime Needed)",
  chooseMethod: "Choose Sign-In Method",
  methodSaId: "SA ID",
  methodMobileEmail: "Mobile / Email",
  methodPassport: "Passport /\nRefugee",
  fieldSaIdLabel: "South African ID Number",
  fieldSaIdTrailing: "13 Digits",
  fieldSaIdPlaceholder: "e.g. 050112 5089 088",
  fieldSaIdHint:
    "Official 13-digit identity number as recorded in the National Population Register.",
  fieldPassportLabel: "Passport / Refugee Document",
  fieldPassportTrailing: "Alphanumeric",
  fieldPassportPlaceholder: "e.g. A01234567 or DHA-No",
  fieldPassportHint:
    "Provide your valid Home Affairs-recognized foreign passport or asylum permit number.",
  fieldMobileEmailLabel: "Mobile Phone Number or Email",
  fieldMobileEmailTrailing: "Registered",
  fieldMobileEmailPlaceholder: "e.g. 072 123 4567 or you@email.com",
  fieldMobileEmailHint:
    "Enter the cellular number or email address linked to your Khetha profile.",
  passwordLabel: "Password or 5-Digit PIN",
  passwordPlaceholder: "Enter password or PIN",
  forgot: "Forgot?",
  rememberDevice: "Remember device for offline career access",
  rememberDeviceBody:
    "Allows opening cached CVs, saved qualifications, and APS records without logging in each time.",
  signInCta: "Sign In to NCAP",
  otpSignIn: "Sign in with One-Time PIN (SMS)",
  checkInboxTitle: "Check your inbox",
  checkInboxBody: (email) =>
    `A one-tap sign-in link was sent to ${email}. Open it on this device.`,
  useDifferentEmail: "Use a different email",
  biometricTitle: "Quick Biometric Sign-In",
  biometricBody: "Enable Fingerprint or Face ID for this device",
  biometricEnable: "Enable",
  featureVaultKicker: "Career Vault",
  featureVaultTitle: "Access Stored APS & Bursaries",
  featureTvetKicker: "TVET & Skills",
  featureTvetTitle: "Track Your Artisan Progress",
  registerPrompt: "Don't have a Khetha NCAP profile yet?",
  registerCta: "Register / Create Free Account",
  registerCaption: "Free for all South African citizens and resident learners",
  guestContinue: "Continue as Guest / Explore Careers Without Signing In",
  errorSaIdPassportUi:
    "SA ID and Passport sign-in UI matches the design. Switch to Mobile / Email for live Firebase auth.",
  errorOtpMethod:
    "One-time email / OTP sign-in works from the Mobile / Email tab.",
  errorSignIn: "Could not sign in.",
  errorSendLink: "Could not send sign-in link.",
  errorGuest: "Guest mode failed.",

  registerTitle: "Create Profile",
  registerHeadline: "Create Your Free Khetha Profile",
  registerSubtitle: "Get personalized career, bursary and study guidance.",
  trustFree: "100% Free · Zero-Rated",
  trustFirebase: "Firebase Email Verify",
  stepOf: (step, total) => `Step ${step} of ${total}`,
  sectionPersonal: "Personal Information",
  sectionPersonalSub: "Follow the prompts for particulars below.",
  fullNameLabel: "Full Legal Name & Surname",
  fullNamePlaceholder: "e.g. Lerato Nomvula Shabangu",
  fullNameHint: "As per ID Document / Copy",
  docTypeLabel: "Citizen Document Type",
  docAsylum: "Asylum / Refugee",
  docRsaId: "RSA ID",
  docPassport: "Passport / Foreign",
  rsaIdLabel: "RSA ID Number (13 Digits)",
  passportAsylumLabel: "Passport / Asylum Number",
  rsaIdPlaceholder: "e.g. 7401015800088",
  documentPlaceholder: "Document number",
  idVerified: "ID checksum verified",
  dobLabel: "Date of Birth",
  dobHintFromId: "Filled automatically from your RSA ID (you can still edit it).",
  genderLabel: "Gender",
  genderFemale: "Female",
  genderMale: "Male",
  genderPreferNot: "Prefer not to say",
  sectionContact: "Contact & Province",
  sectionContactSub: "We need primary contact information to serve you.",
  mobileLabel: "Primary Mobile Number",
  mobilePlaceholder: "+27 72 000 0000",
  mobileHint:
    "Used for advisor callbacks. Account verification is emailed by Firebase.",
  emailLabel: "Email Address *",
  emailRequired: "Required",
  emailPlaceholder: "your@emailaddress.co.za",
  emailHint:
    "Firebase will email you a verification link after you create your account.",
  provinceLabel: "Province of Residence",
  sectionSituation: "Your Current Situation",
  sectionSituationSub:
    "Please describe your current education and training options.",
  sectionSecurity: "Security Access",
  sectionSecuritySub: "Create a memorable 6-digit PIN or password",
  createPinLabel: "Create 6-Digit PIN / Password",
  createPinPlaceholder: "Minimum 6 characters",
  confirmPinLabel: "Confirm PIN / Password",
  confirmPinPlaceholder: "Repeat PIN / password",
  disabilityCheckTitle: "I am a person living with a disability",
  disabilityCheckBody:
    "Enables assistive pathways and accessible career guidance options.",
  privacyCheckTitle:
    "DHET Privacy Policy & Service Level Agreement (POPIA Compliant)",
  privacyCheckBody:
    "I agree that anonymized career and aptitude data may be used by DHET to improve national career services.",
  bannerPersonalized:
    "Personalized bursaries, artisan routes, and universities.",
  createAccountCta: "Create Account & Send Verification Email",
  alreadyRegistered: "Already registered with Khetha?",
  signInHere: "Sign-In here",
  needHelpRegistering: "Need help registering?",
  helpRegisterBody: (tollFree, whatsapp) =>
    `Speak to a DHET Career Adviser toll-free at ${tollFree} or SMS ${whatsapp} for a free callback.`,
  errorPinMismatch: "PIN / password confirmation does not match.",
  errorAcceptAgreement: "Please accept the DHET data collection agreement.",
  errorRegistration: "Registration failed.",

  recoverTitle: "Reset Password",
  recoverBack: "Back to Sign In",
  recoverLiveLine: "Live Zero-Rated Line",
  recoverHeadline: "Reset Your Password or PIN",
  recoverAlt: "Setha kabusha iphasiwedi yakho · Khetha NCAP Citizen Access",
  recoverBody:
    "Enter your registered South African ID Number or Mobile Phone. We will send a free zero-rated SMS verification code to safely reset your login credentials.",
  recoverPopia: "POPIA Protected – Zero Airtime or Mobile Data Required",
  stepVerifyIdentity: "Verify Identity",
  stepCreatePin: "Create New PIN",
  channelSms: "Via SMS (Free)",
  channelEmail: "Via Email",
  recoverEmailLabel: "Registered Email Address *",
  recoverIdPhoneLabel: "SA National ID (13 digits) or Cellphone Number *",
  recoverEmailPlaceholder: "e.g. learner@matric.dhet.gov.za",
  recoverIdPhonePlaceholder: "e.g. 020514 5821 088 or 072 000 0000",
  recoverEmailHint: "We'll email a secure Firebase password-reset link.",
  recoverIdPhoneHint:
    "Free carrier lookup for Vodacom, MTN, Telkom, Cell C & Rain",
  sendResetLink: "Send Free Verification / Reset Link",
  sendOtp: "Send Free Verification Code (OTP)",
  step2Title: "Step 2: Enter OTP & Create New PIN",
  resetEmailSent: "Reset email sent",
  zeroRatedSmsSent: "Zero-Rated SMS Sent",
  step2EmailBody: (email) =>
    `We sent password-reset instructions to ${email}. Open the link to set a new password, then sign in.`,
  step2SmsBody: (masked) =>
    `We dispatched a free one-time token to ${masked}.`,
  otpLabel: "6-Digit Verification Code (OTP)",
  codeExpires: (mm, ss) => `Code expires in ${mm}:${ss}`,
  resendSms: "Resend Free SMS (Toll-Free)",
  setNewPinLabel: "Set New 6-Digit PIN / Password",
  setNewPinPlaceholder: "e.g. 582914",
  confirmNewPinLabel: "Confirm New 6-Digit PIN",
  confirmNewPinPlaceholder: "Re-type 6-digit PIN",
  updatePasswordCta: "Update Password & Sign In",
  pinUpdatedTitle: "PIN Updated Successfully!",
  pinUpdatedBody:
    "Redirecting to your Khetha NCAP Career Dashboard in 3 seconds...",
  cantAccessPhoneTitle: "Can't access your registered phone?",
  cantAccessPhoneBody:
    "If your cellphone number has been lost, stolen, or expired, verify your identity directly with our dedicated DHET advisors.",
  tollFreeHelpline: "Toll-Free Helpline",
  whatsappCallback: "WhatsApp Callback",
  langHint:
    "Udinga usizo ngolimi lwakho? · Udinga uncedo ngolwimi lwakho? · Hulp nodig in jou taal?",
  errorEnterIdentifier: "Enter your ID, cellphone, or email to continue.",
  errorSendReset: "Could not send reset instructions.",
  errorEnterOtp: "Enter the 6-digit verification code from your SMS.",
  errorPinsMatch: "PINs must match and be at least 4 digits.",

  verifyTitle: "Verify Email",
  verifyHeadline: "Confirm your email",
  verifyBody: (email) =>
    `We sent a Firebase verification link to ${email}. Open it on this device or any browser, then come back here.`,
  verifyResent: "Another verification email was sent.",
  verifyContinue: "I've verified — continue",
  verifyResend: "Resend verification email",
  verifyDifferentAccount: "Use a different account",
  errorNotVerified:
    "Email not verified yet. Open the link in your inbox, then try again.",
  errorRefreshVerify: "Could not refresh verification status.",
  errorResendVerify: "Could not resend verification email.",
};

const af: AuthStrings = {
  or: "of",
  helpTitle: "Hulp nodig?",
  helpBody: "Praat tolvry met 'n DHET-loopbaanadviseur.",
  helpTollFree: "Tolvrye Hulplyn",
  helpWhatsapp: "WhatsApp-terugbel",
  googleSignIn: "Gaan voort met Google",
  errorGeneric: "Iets het verkeerd geloop. Probeer asseblief weer.",

  signInTitle: "Teken In",
  signInHeadline: "Teken in by Khetha NCAP",
  signInSubtitle:
    "Kry toegang tot jou gestoorde vraelyste, APS-berekeninge, beursaansoeke en DHET-loopbaankluis.",
  ssoTitle: "Amptelike DHET Enkel-aanmelding",
  ssoSub: "Nul-gegradeer (geen data of lugtyd nodig)",
  chooseMethod: "Kies aanmeldmetode",
  methodSaId: "SA ID",
  methodMobileEmail: "Selfoon / E-pos",
  methodPassport: "Paspoort /\nVlugteling",
  fieldSaIdLabel: "Suid-Afrikaanse ID-nommer",
  fieldSaIdTrailing: "13 Syfers",
  fieldSaIdPlaceholder: "bv. 050112 5089 088",
  fieldSaIdHint:
    "Amptelike 13-syfer-identiteitsnommer soos in die Nasionale Bevolkingsregister.",
  fieldPassportLabel: "Paspoort / Vlugtelingdokument",
  fieldPassportTrailing: "Alfanumeries",
  fieldPassportPlaceholder: "bv. A01234567 of DHA-No",
  fieldPassportHint:
    "Gee jou geldige Binnelandse Sake-erkende buitelandse paspoort of asielpermitnommer.",
  fieldMobileEmailLabel: "Selfoonnommer of E-pos",
  fieldMobileEmailTrailing: "Geregistreer",
  fieldMobileEmailPlaceholder: "bv. 072 123 4567 of jy@email.com",
  fieldMobileEmailHint:
    "Voer die selfoonnommer of e-posadres gekoppel aan jou Khetha-profiel in.",
  passwordLabel: "Wagwoord of 5-syfer PIN",
  passwordPlaceholder: "Voer wagwoord of PIN in",
  forgot: "Vergeet?",
  rememberDevice: "Onthou toestel vir aflyn-loopbaantoegang",
  rememberDeviceBody:
    "Laat toe dat gekaste CV's, gestoorde kwalifikasies en APS-rekords oopgemaak word sonder om elke keer aan te meld.",
  signInCta: "Teken in by NCAP",
  otpSignIn: "Teken in met Eenmalige PIN (SMS)",
  checkInboxTitle: "Kontroleer jou inkassie",
  checkInboxBody: (email) =>
    `'n Een-tik-aanmeldskakel is na ${email} gestuur. Maak dit op hierdie toestel oop.`,
  useDifferentEmail: "Gebruik 'n ander e-pos",
  biometricTitle: "Vinnige biometriese aanmelding",
  biometricBody: "Aktiveer vingerafdruk of Face ID vir hierdie toestel",
  biometricEnable: "Aktiveer",
  featureVaultKicker: "Loopbaankluis",
  featureVaultTitle: "Toegang tot gestoorde APS & Beurse",
  featureTvetKicker: "TVET & Vaardighede",
  featureTvetTitle: "Volg jou ambagsvordering",
  registerPrompt: "Het jy nog nie 'n Khetha NCAP-profiel nie?",
  registerCta: "Registreer / Skep gratis rekening",
  registerCaption:
    "Gratis vir alle Suid-Afrikaanse burgers en inwonende leerders",
  guestContinue: "Gaan voort as gas / Verken loopbane sonder om in te teken",
  errorSaIdPassportUi:
    "SA ID- en paspoort-aanmeld-UI pas by die ontwerp. Skakel oor na Selfoon / E-pos vir lewendige Firebase-stawing.",
  errorOtpMethod:
    "Eenmalige e-pos / OTP-aanmelding werk vanaf die Selfoon / E-pos-oortjie.",
  errorSignIn: "Kon nie inteken nie.",
  errorSendLink: "Kon nie aanmeldskakel stuur nie.",
  errorGuest: "Gasmodus het misluk.",

  registerTitle: "Skep Profiel",
  registerHeadline: "Skep jou gratis Khetha-profiel",
  registerSubtitle:
    "Kry persoonlike loopbaan-, beurs- en studiebegeleiding.",
  trustFree: "100% Gratis · Nul-gegradeer",
  trustFirebase: "Firebase E-posverifikasie",
  stepOf: (step, total) => `Stap ${step} van ${total}`,
  sectionPersonal: "Persoonlike inligting",
  sectionPersonalSub: "Volg die leidrade vir besonderhede hieronder.",
  fullNameLabel: "Volle wettige naam & van",
  fullNamePlaceholder: "bv. Lerato Nomvula Shabangu",
  fullNameHint: "Soos op ID-dokument / afskrif",
  docTypeLabel: "Burgerdokumenttipe",
  docAsylum: "Asiel / Vlugteling",
  docRsaId: "RSA ID",
  docPassport: "Paspoort / Buiteland",
  rsaIdLabel: "RSA ID-nommer (13 syfers)",
  passportAsylumLabel: "Paspoort / Asielnommer",
  rsaIdPlaceholder: "bv. 7401015800088",
  documentPlaceholder: "Dokumentnommer",
  idVerified: "ID-kontrolesom geverifieer",
  dobLabel: "Geboortedatum",
  dobHintFromId:
    "Outomaties ingevul vanaf jou RSA ID (jy kan dit steeds wysig).",
  genderLabel: "Geslag",
  genderFemale: "Vroulik",
  genderMale: "Manlik",
  genderPreferNot: "Verkies om nie te sê nie",
  sectionContact: "Kontak & Provinsie",
  sectionContactSub: "Ons benodig primêre kontakbesonderhede om jou te dien.",
  mobileLabel: "Primêre selfoonnommer",
  mobilePlaceholder: "+27 72 000 0000",
  mobileHint:
    "Gebruik vir adviseur-terugbel. Rekeningverifikasie word per e-pos deur Firebase gestuur.",
  emailLabel: "E-posadres *",
  emailRequired: "Verpligtend",
  emailPlaceholder: "jou@emailadres.co.za",
  emailHint:
    "Firebase sal jou 'n verifikasieskakel e-pos nadat jy jou rekening geskep het.",
  provinceLabel: "Provinsie van verblyf",
  sectionSituation: "Jou huidige situasie",
  sectionSituationSub:
    "Beskryf asseblief jou huidige onderwys- en opleidingsopsies.",
  sectionSecurity: "Sekuriteitstoegang",
  sectionSecuritySub: "Skep 'n onthoubare 6-syfer PIN of wagwoord",
  createPinLabel: "Skep 6-syfer PIN / Wagwoord",
  createPinPlaceholder: "Minimum 6 karakters",
  confirmPinLabel: "Bevestig PIN / Wagwoord",
  confirmPinPlaceholder: "Herhaal PIN / wagwoord",
  disabilityCheckTitle: "Ek is 'n persoon wat met 'n gestremdheid leef",
  disabilityCheckBody:
    "Aktiveer bystandspaaie en toeganklike loopbaanbegeleidingsopsies.",
  privacyCheckTitle:
    "DHET Privaatheidsbeleid & Diensvlakooreenkoms (POPIA-voldoenend)",
  privacyCheckBody:
    "Ek stem saam dat geanonimiseerde loopbaan- en aanlegdata deur DHET gebruik mag word om nasionale loopbaandienste te verbeter.",
  bannerPersonalized:
    "Persoonlike beurse, ambagsroetes en universiteite.",
  createAccountCta: "Skep rekening & stuur verifikasie-e-pos",
  alreadyRegistered: "Reeds by Khetha geregistreer?",
  signInHere: "Teken hier in",
  needHelpRegistering: "Hulp nodig met registrasie?",
  helpRegisterBody: (tollFree, whatsapp) =>
    `Praat tolvry met 'n DHET-loopbaanadviseur by ${tollFree} of SMS ${whatsapp} vir 'n gratis terugbel.`,
  errorPinMismatch: "PIN / wagwoordbevestiging stem nie ooreen nie.",
  errorAcceptAgreement: "Aanvaar asseblief die DHET-data-ooreenkoms.",
  errorRegistration: "Registrasie het misluk.",

  recoverTitle: "Herstel Wagwoord",
  recoverBack: "Terug na Teken In",
  recoverLiveLine: "Lewendige nul-gegradeerde lyn",
  recoverHeadline: "Herstel jou wagwoord of PIN",
  recoverAlt: "Setha kabusha iphasiwedi yakho · Khetha NCAP Burgertoegang",
  recoverBody:
    "Voer jou geregistreerde Suid-Afrikaanse ID-nommer of selfoon in. Ons stuur 'n gratis nul-gegradeerde SMS-verifikasiekode om jou aanmeldbewyse veilig te herstel.",
  recoverPopia: "POPIA-beskerm – geen lugtyd of mobiele data vereis nie",
  stepVerifyIdentity: "Verifieer identiteit",
  stepCreatePin: "Skep nuwe PIN",
  channelSms: "Via SMS (Gratis)",
  channelEmail: "Via E-pos",
  recoverEmailLabel: "Geregistreerde e-posadres *",
  recoverIdPhoneLabel: "SA Nasionale ID (13 syfers) of selfoonnommer *",
  recoverEmailPlaceholder: "bv. leerder@matric.dhet.gov.za",
  recoverIdPhonePlaceholder: "bv. 020514 5821 088 of 072 000 0000",
  recoverEmailHint: "Ons e-pos 'n veilige Firebase-wagwoordherstelskakel.",
  recoverIdPhoneHint:
    "Gratis draeropsoek vir Vodacom, MTN, Telkom, Cell C & Rain",
  sendResetLink: "Stuur gratis verifikasie / herstelskakel",
  sendOtp: "Stuur gratis verifikasiekode (OTP)",
  step2Title: "Stap 2: Voer OTP in & skep nuwe PIN",
  resetEmailSent: "Herstel-e-pos gestuur",
  zeroRatedSmsSent: "Nul-gegradeerde SMS gestuur",
  step2EmailBody: (email) =>
    `Ons het wagwoordherstelinstruksies na ${email} gestuur. Maak die skakel oop om 'n nuwe wagwoord te stel, en teken dan in.`,
  step2SmsBody: (masked) =>
    `Ons het 'n gratis eenmalige teken na ${masked} gestuur.`,
  otpLabel: "6-syfer verifikasiekode (OTP)",
  codeExpires: (mm, ss) => `Kode verval oor ${mm}:${ss}`,
  resendSms: "Stuur gratis SMS weer (Tolvry)",
  setNewPinLabel: "Stel nuwe 6-syfer PIN / Wagwoord",
  setNewPinPlaceholder: "bv. 582914",
  confirmNewPinLabel: "Bevestig nuwe 6-syfer PIN",
  confirmNewPinPlaceholder: "Tik 6-syfer PIN weer",
  updatePasswordCta: "Dateer wagwoord op & teken in",
  pinUpdatedTitle: "PIN suksesvol opgedateer!",
  pinUpdatedBody:
    "Lei jou oor na jou Khetha NCAP-loopbaanpaneelbord oor 3 sekondes...",
  cantAccessPhoneTitle: "Kan nie jou geregistreerde foon bereik nie?",
  cantAccessPhoneBody:
    "As jou selfoonnommer verlore, gesteel of verstryk is, verifieer jou identiteit direk by ons toegewyde DHET-adviseurs.",
  tollFreeHelpline: "Tolvrye Hulplyn",
  whatsappCallback: "WhatsApp-terugbel",
  langHint:
    "Udinga usizo ngolimi lwakho? · Udinga uncedo ngolwimi lwakho? · Hulp nodig in jou taal?",
  errorEnterIdentifier: "Voer jou ID, selfoon of e-pos in om voort te gaan.",
  errorSendReset: "Kon nie herstelinstruksies stuur nie.",
  errorEnterOtp: "Voer die 6-syfer verifikasiekode van jou SMS in.",
  errorPinsMatch: "PIN's moet ooreenstem en minstens 4 syfers wees.",

  verifyTitle: "Verifieer E-pos",
  verifyHeadline: "Bevestig jou e-pos",
  verifyBody: (email) =>
    `Ons het 'n Firebase-verifikasieskakel na ${email} gestuur. Maak dit op hierdie toestel of enige blaaier oop, en kom dan terug hierheen.`,
  verifyResent: "Nog 'n verifikasie-e-pos is gestuur.",
  verifyContinue: "Ek het geverifieer — gaan voort",
  verifyResend: "Stuur verifikasie-e-pos weer",
  verifyDifferentAccount: "Gebruik 'n ander rekening",
  errorNotVerified:
    "E-pos nog nie geverifieer nie. Maak die skakel in jou inkassie oop, en probeer weer.",
  errorRefreshVerify: "Kon nie verifikasiestatus verfris nie.",
  errorResendVerify: "Kon nie verifikasie-e-pos weer stuur nie.",
};

const zu: AuthStrings = {
  or: "noma",
  helpTitle: "Udinga usizo?",
  helpBody: "Khuluma noma mahhala nomeluleki wezokuqeqesha we-DHET.",
  helpTollFree: "Ucingo Olungakhokhelwa",
  helpWhatsapp: "Ukubuyiselwa kwe-WhatsApp",
  googleSignIn: "Qhubeka nge-Google",
  errorGeneric: "Kukhona okungahambanga kahle. Sicela uzame futhi.",

  signInTitle: "Ngena Ngemvume",
  signInHeadline: "Ngena ku-Khetha NCAP",
  signInSubtitle:
    "Finyelela uhlu lwemibuzo olulondoloziwe, izibalo ze-APS, izicelo zemifundaze, kanye nevault yomsebenzi ye-DHET.",
  ssoTitle: "Ukungena Okukodwa Okusemthethweni kwe-DHET",
  ssoSub: "Kulinganiswa ku-Zero (Akudingeki Idatha noma Isikhathi Somoya)",
  chooseMethod: "Khetha Indlela Yokungena",
  methodSaId: "SA ID",
  methodMobileEmail: "Umakhalekhukhwini / I-imeyili",
  methodPassport: "Ipasipoti /\nUmphaphitheki",
  fieldSaIdLabel: "Inombolo ye-ID yaseNingizimu Afrika",
  fieldSaIdTrailing: "Amadijithi angu-13",
  fieldSaIdPlaceholder: "isib. 050112 5089 088",
  fieldSaIdHint:
    "Inombolo yobunikazi enamadijithi angu-13 njengoba irekhodiwe kuRejista Yesizwe.",
  fieldPassportLabel: "Ipasipoti / Idokhumenti Yomphaphitheki",
  fieldPassportTrailing: "Alphanumeric",
  fieldPassportPlaceholder: "isib. A01234567 noma DHA-No",
  fieldPassportHint:
    "Nikeza inombolo yephasipoti yangaphandle noma imvume yesikhungo esaziwa yi-Home Affairs.",
  fieldMobileEmailLabel: "Inombolo Yocingo noma I-imeyili",
  fieldMobileEmailTrailing: "Ibhalisiwe",
  fieldMobileEmailPlaceholder: "isib. 072 123 4567 noma you@email.com",
  fieldMobileEmailHint:
    "Faka inombolo yeselula noma ikheli le-imeyili elixhunywe kuphrofayela yakho ye-Khetha.",
  passwordLabel: "Iphasiwedi noma i-PIN yamadijithi angu-5",
  passwordPlaceholder: "Faka iphasiwedi noma i-PIN",
  forgot: "Ukhohlwe?",
  rememberDevice: "Khumbula idivayisi yokufinyelela umsebenzi ngaphandle kwe-inthanethi",
  rememberDeviceBody:
    "Ivumela ukuvula ama-CV alondoloziwe, iziqu ezilondoloziwe, namarekhodi e-APS ngaphandle kokungena njalo.",
  signInCta: "Ngena ku-NCAP",
  otpSignIn: "Ngena nge-PIN yesikhathi esisodwa (SMS)",
  checkInboxTitle: "Hlola ibhokisi lakho lokungenayo",
  checkInboxBody: (email) =>
    `Isixhumanisi sokungena ngokuthepha kanye sithunyelwe ku-${email}. Sivule kule divayisi.`,
  useDifferentEmail: "Sebenzisa i-imeyili ehlukile",
  biometricTitle: "Ukungena Okusheshayo Kwe-Biometric",
  biometricBody: "Nika amandla i-Fingerprint noma i-Face ID kule divayisi",
  biometricEnable: "Nika amandla",
  featureVaultKicker: "I-Vault Yomsebenzi",
  featureVaultTitle: "Finyelela i-APS Nezifundazo Ezilondoloziwe",
  featureTvetKicker: "I-TVET Namakhono",
  featureTvetTitle: "Landelela Inqubekelaphambili Yakho Yobuchwepheshe",
  registerPrompt: "Awukabi nephrofayela ye-Khetha NCAP?",
  registerCta: "Bhalisa / Dala I-akhawunti Yamahhala",
  registerCaption:
    "Mahhala kuzo zonke izakhamuzi zaseNingizimu Afrika nabafundi abahlala lapha",
  guestContinue: "Qhubeka njengeSivakashi / Hlola Imisebenzi Ngaphandle Kokungena",
  errorSaIdPassportUi:
    "I-UI yokungena nge-SA ID nephasipoti ifana nomklamo. Shintshela ku-Mobile / Email ukuze usebenzise i-Firebase.",
  errorOtpMethod:
    "Ukungena nge-imeyili / i-OTP yesikhathi esisodwa kusebenza kuthebhu ye-Mobile / Email.",
  errorSignIn: "Akukwazanga ukungena.",
  errorSendLink: "Akukwazanga ukuthumela isixhumanisi sokungena.",
  errorGuest: "Imodi yesivakashi yehlulekile.",

  registerTitle: "Dala Iphrofayela",
  registerHeadline: "Dala Iphrofayela Yakho Yamahhala ye-Khetha",
  registerSubtitle:
    "Thola isiqondiso somsebenzi, imifundaze nokufunda esenzelwe wena.",
  trustFree: "100% Mahhala · Zero-Rated",
  trustFirebase: "Ukuqinisekiswa Kwe-imeyili ye-Firebase",
  stepOf: (step, total) => `Isinyathelo ${step} kwangu-${total}`,
  sectionPersonal: "Ulwazi Lomuntu Siqu",
  sectionPersonalSub: "Landela izikhombisi zemininingwane ngezansi.",
  fullNameLabel: "Igama Eliphelele Nomuntu Nomfazi",
  fullNamePlaceholder: "isib. Lerato Nomvula Shabangu",
  fullNameHint: "Njengokusho kwedokhumenti ye-ID / Ikhophi",
  docTypeLabel: "Uhlobo Lwedokhumenti Yesakhamuzi",
  docAsylum: "Isikhungo / Umphaphitheki",
  docRsaId: "RSA ID",
  docPassport: "Ipasipoti / Yangaphandle",
  rsaIdLabel: "Inombolo ye-RSA ID (Amadijithi angu-13)",
  passportAsylumLabel: "Inombolo Yepasipoti / Yesikhungo",
  rsaIdPlaceholder: "isib. 7401015800088",
  documentPlaceholder: "Inombolo yedokhumenti",
  idVerified: "I-checksum ye-ID iqinisekisiwe",
  dobLabel: "Usuku Lokuzalwa",
  dobHintFromId:
    "Kugcwaliswa ngokuzenzakalelayo kusuka ku-RSA ID yakho (usengayihlela).",
  genderLabel: "Ubulili",
  genderFemale: "Owesifazane",
  genderMale: "Owesilisa",
  genderPreferNot: "Ngikhetha ukungasho",
  sectionContact: "Oxhumana Naye NeSifundazwe",
  sectionContactSub:
    "Sidinga imininingwane yokuxhumana eyinhloko ukuze sikusize.",
  mobileLabel: "Inombolo Yocingo Eyinhloko",
  mobilePlaceholder: "+27 72 000 0000",
  mobileHint:
    "Isetshenziselwa ukubuyiselwa komeluleki. Ukuqinisekiswa kwe-akhawunti kuthunyelwa nge-imeyili ye-Firebase.",
  emailLabel: "Ikheli Le-imeyili *",
  emailRequired: "Kuyadingeka",
  emailPlaceholder: "your@emailaddress.co.za",
  emailHint:
    "I-Firebase izokuthumelela isixhumanisi sokuqinisekisa ngemva kokudala i-akhawunti.",
  provinceLabel: "Isifundazwe Sokuhlala",
  sectionSituation: "Isimo Sakho Samanje",
  sectionSituationSub:
    "Sicela uchaze izinketho zakho zamanje zemfundo nokuqeqeshwa.",
  sectionSecurity: "Ukufinyelela Kokuphepha",
  sectionSecuritySub: "Dala i-PIN yamadijithi angu-6 noma iphasiwedi ekhumbulekayo",
  createPinLabel: "Dala i-PIN / Iphasiwedi yamadijithi angu-6",
  createPinPlaceholder: "Okungenani izinhlamvu ezingu-6",
  confirmPinLabel: "Qinisekisa i-PIN / Iphasiwedi",
  confirmPinPlaceholder: "Phinda i-PIN / iphasiwedi",
  disabilityCheckTitle: "Ngingumuntu ophila nokukhubazeka",
  disabilityCheckBody:
    "Kuvula izindlela zosizo nezinketho zesiqondiso somsebenzi ezifinyelelekayo.",
  privacyCheckTitle:
    "Inqubomgomo Yobumfihlo ye-DHET & Isivumelwano Sezinga Lenkonzo (Iyahambisana ne-POPIA)",
  privacyCheckBody:
    "Ngiyavuma ukuthi idatha yomsebenzi neyobuchule engenawo amagama ingasetshenziswa yi-DHET ukuthuthukisa izinsiza zomsebenzi zikazwelonke.",
  bannerPersonalized:
    "Imifundaze eyenziwe ngeziqu, izindlela zobuchwepheshe, namanyuvesi.",
  createAccountCta: "Dala I-akhawunti & Thumela I-imeyili Yokuqinisekisa",
  alreadyRegistered: "Usuvele ubhalisile ku-Khetha?",
  signInHere: "Ngena lapha",
  needHelpRegistering: "Udinga usizo lokubhalisa?",
  helpRegisterBody: (tollFree, whatsapp) =>
    `Khuluma noma mahhala nomeluleki wezokuqeqesha we-DHET ku-${tollFree} noma i-SMS ${whatsapp} ukuze ubuyiselwe mahhala.`,
  errorPinMismatch: "Ukuqinisekiswa kwe-PIN / iphasiwedi akufani.",
  errorAcceptAgreement: "Sicela wamukele isivumelwano sokuqoqwa kwedatha se-DHET.",
  errorRegistration: "Ukubhalisa kuhlulekile.",

  recoverTitle: "Setha Kabusha Iphasiwedi",
  recoverBack: "Buyela Ekungeneni",
  recoverLiveLine: "Ulayini Ophilayo Zero-Rated",
  recoverHeadline: "Setha kabusha iphasiwedi noma i-PIN yakho",
  recoverAlt: "Setha kabusha iphasiwedi yakho · Khetha NCAP Citizen Access",
  recoverBody:
    "Faka inombolo yakho ye-ID yaseNingizimu Afrika ebhalisiwe noma umakhalekhukhwini. Sizothumela ikhodi yokuqinisekisa ye-SMS yamahhala zero-rated ukuze usethe kabusha ngokuphepha iziqinisekiso zakho zokungena.",
  recoverPopia: "Kuvikelwe yi-POPIA – Akudingeki Isikhathi Somoya noma Idatha",
  stepVerifyIdentity: "Qinisekisa Ubunikazi",
  stepCreatePin: "Dala i-PIN Entsha",
  channelSms: "Nge-SMS (Mahhala)",
  channelEmail: "Nge-imeyili",
  recoverEmailLabel: "Ikheli Le-imeyili Elibhalisiwe *",
  recoverIdPhoneLabel: "I-SA National ID (amadijithi angu-13) noma Inombolo Yeselula *",
  recoverEmailPlaceholder: "isib. learner@matric.dhet.gov.za",
  recoverIdPhonePlaceholder: "isib. 020514 5821 088 noma 072 000 0000",
  recoverEmailHint: "Sizothumela isixhumanisi sokwethula kabusha se-Firebase.",
  recoverIdPhoneHint:
    "Ukubheka inkampani yenethiwekhi mahhala ku-Vodacom, MTN, Telkom, Cell C & Rain",
  sendResetLink: "Thumela Isixhumanisi Sokuqinisekisa / Sokwethula Kabusha",
  sendOtp: "Thumela Ikhodi Yokuqinisekisa Yamahhala (OTP)",
  step2Title: "Isinyathelo 2: Faka i-OTP & Dala i-PIN Entsha",
  resetEmailSent: "I-imeyili yokwethula kabusha ithunyelwe",
  zeroRatedSmsSent: "I-SMS Zero-Rated Ithunyelwe",
  step2EmailBody: (email) =>
    `Sithumele imiyalelo yokwethula kabusha iphasiwedi ku-${email}. Vula isixhumanisi ukuze usethe iphasiwedi entsha, bese ungena.`,
  step2SmsBody: (masked) =>
    `Sithumele ithokheni yesikhathi esisodwa yamahhala ku-${masked}.`,
  otpLabel: "Ikhodi Yokuqinisekisa Yamadijithi Angu-6 (OTP)",
  codeExpires: (mm, ss) => `Ikhodi iphelelwa yisikhathi ngo-${mm}:${ss}`,
  resendSms: "Thumela Kabusha i-SMS Yamahhala (Mahhala)",
  setNewPinLabel: "Setha i-PIN / Iphasiwedi Entsha Yamadijithi Angu-6",
  setNewPinPlaceholder: "isib. 582914",
  confirmNewPinLabel: "Qinisekisa i-PIN Entsha Yamadijithi Angu-6",
  confirmNewPinPlaceholder: "Phinda i-PIN yamadijithi angu-6",
  updatePasswordCta: "Buyekeza Iphasiwedi & Ngena",
  pinUpdatedTitle: "I-PIN Ibuyeziwe Ngempumelelo!",
  pinUpdatedBody:
    "Kuyaqondiswa kudashi bhodi lomsebenzi ye-Khetha NCAP emizuzwaneni engu-3...",
  cantAccessPhoneTitle: "Awukwazi ukufinyelela ucingo olubhalisiwe?",
  cantAccessPhoneBody:
    "Uma inombolo yakho yeselula ilahlekile, yebiwe, noma iphelelwe yisikhathi, qinisekisa ubunikazi bakho ngqo nabeluleki bethu be-DHET.",
  tollFreeHelpline: "Ucingo Olungakhokhelwa",
  whatsappCallback: "Ukubuyiselwa kwe-WhatsApp",
  langHint:
    "Udinga usizo ngolimi lwakho? · Udinga uncedo ngolwimi lwakho? · Hulp nodig in jou taal?",
  errorEnterIdentifier: "Faka i-ID, umakhalekhukhwini, noma i-imeyili yakho ukuze uqhubeke.",
  errorSendReset: "Akukwazanga ukuthumela imiyalelo yokwethula kabusha.",
  errorEnterOtp: "Faka ikhodi yokuqinisekisa yamadijithi angu-6 evela ku-SMS yakho.",
  errorPinsMatch: "Ama-PIN kufanele afane futhi okungenani abe namadijithi angu-4.",

  verifyTitle: "Qinisekisa I-imeyili",
  verifyHeadline: "Qinisekisa i-imeyili yakho",
  verifyBody: (email) =>
    `Sithumele isixhumanisi sokuqinisekisa se-Firebase ku-${email}. Sivule kule divayisi noma kunoma yisiphi isiphequluli, bese ubuyela lapha.`,
  verifyResent: "Enye i-imeyili yokuqinisekisa ithunyelwe.",
  verifyContinue: "Ngiqinisekisile — qhubeka",
  verifyResend: "Thumela kabusha i-imeyili yokuqinisekisa",
  verifyDifferentAccount: "Sebenzisa i-akhawunti ehlukile",
  errorNotVerified:
    "I-imeyili ayikaqinisekiswa. Vula isixhumanisi ebhokisini lakho, bese uzama futhi.",
  errorRefreshVerify: "Akukwazanga ukuvuselela isimo sokuqinisekisa.",
  errorResendVerify: "Akukwazanga ukuthumela kabusha i-imeyili yokuqinisekisa.",
};

const xh: AuthStrings = {
  or: "okanye",
  helpTitle: "Udinga uncedo?",
  helpBody: "Thetha simahla nomcebisi wekhondo lomsebenzi we-DHET.",
  helpTollFree: "Umxholo Ongakhokhelwayo",
  helpWhatsapp: "Ukubizwa kwakhona kwe-WhatsApp",
  googleSignIn: "Qhubeka nge-Google",
  errorGeneric: "Kukho into engahambanga kakuhle. Nceda uzame kwakhona.",

  signInTitle: "Ngena",
  signInHeadline: "Ngena ku-Khetha NCAP",
  signInSubtitle:
    "Fikelela kwiimibuzo egciniweyo, izibalo ze-APS, izicelo zemali yokufunda, kunye ne-vault yomsebenzi ye-DHET.",
  ssoTitle: "Ukungena Okukodwa Okusemthethweni kwe-DHET",
  ssoSub: "I-Zero-Rated (Akukho Datha okanye Ixesha lomoya elifunekayo)",
  chooseMethod: "Khetha Indlela Yokungena",
  methodSaId: "SA ID",
  methodMobileEmail: "Iselula / I-imeyile",
  methodPassport: "Ipasipoti /\nUmbaleki",
  fieldSaIdLabel: "Inombolo ye-ID yaseMzantsi Afrika",
  fieldSaIdTrailing: "Amanani ali-13",
  fieldSaIdPlaceholder: "umz. 050112 5089 088",
  fieldSaIdHint:
    "Inombolo yesazisi enamagama ali-13 njengoko irekhodiwe kwiRejista yeSizwe.",
  fieldPassportLabel: "Ipasipoti / Uxwebhu Lombaleki",
  fieldPassportTrailing: "Alphanumeric",
  fieldPassportPlaceholder: "umz. A01234567 okanye DHA-No",
  fieldPassportHint:
    "Nika inombolo yephasipoti yangaphandle okanye imvume yokusabela eyamkelweyo yi-Home Affairs.",
  fieldMobileEmailLabel: "Inombolo Yeselula okanye I-imeyile",
  fieldMobileEmailTrailing: "Ibhalisiwe",
  fieldMobileEmailPlaceholder: "umz. 072 123 4567 okanye you@email.com",
  fieldMobileEmailHint:
    "Faka inombolo yeselula okanye idilesi ye-imeyile edityaniswe neprofayile yakho ye-Khetha.",
  passwordLabel: "Igama lokugqitha okanye i-PIN yamanani ama-5",
  passwordPlaceholder: "Faka igama lokugqitha okanye i-PIN",
  forgot: "Ulibele?",
  rememberDevice: "Khumbula isixhobo sokufikelela umsebenzi ngaphandle kwe-intanethi",
  rememberDeviceBody:
    "Ivumela ukuvula ii-CV ezigciniweyo, iziqinisekiso ezigciniweyo, neerekhodi ze-APS ngaphandle kokungena rhoqo.",
  signInCta: "Ngena ku-NCAP",
  otpSignIn: "Ngena nge-PIN yexesha elinye (SMS)",
  checkInboxTitle: "Jonga ibhokisi yakho yokufika",
  checkInboxBody: (email) =>
    `Ikhonkco lokungena ngokucofa kanye lithunyelwe ku-${email}. Livule kwesi sixhobo.`,
  useDifferentEmail: "Sebenzisa i-imeyile eyahlukileyo",
  biometricTitle: "Ukungena Okukhawulezayo kwe-Biometric",
  biometricBody: "Yenza i-Fingerprint okanye i-Face ID kwesi sixhobo",
  biometricEnable: "Yenza",
  featureVaultKicker: "I-Vault Yomsebenzi",
  featureVaultTitle: "Fikelela i-APS Nezimali Zokufunda Ezigciniweyo",
  featureTvetKicker: "I-TVET Nezakhono",
  featureTvetTitle: "Landela Inkqubela Yakho Yobuchule",
  registerPrompt: "Awukabinayo iprofayile ye-Khetha NCAP?",
  registerCta: "Bhalisa / Yenza Iakhawunti Yasimahla",
  registerCaption:
    "Simahla kubo bonke abemi baseMzantsi Afrika nabafundi abahlala apha",
  guestContinue: "Qhubeka njengoNdwendwe / Hlola Imisebenzi Ngaphandle Kokungena",
  errorSaIdPassportUi:
    "I-UI yokungena nge-SA ID nephasipoti ihambelana noyilo. Tshintshela kwi-Mobile / Email ukuze usebenzise i-Firebase.",
  errorOtpMethod:
    "Ukungena nge-imeyile / i-OTP yexesha elinye kusebenza kwithebhu ye-Mobile / Email.",
  errorSignIn: "Ayikwazanga ukungena.",
  errorSendLink: "Ayikwazanga ukuthumela ikhonkco lokungena.",
  errorGuest: "Imowudi yondwendwe ayiphumelelanga.",

  registerTitle: "Yenza Iprofayile",
  registerHeadline: "Yenza Iprofayile Yakho Yasimahla ye-Khetha",
  registerSubtitle:
    "Fumana isikhokelo somsebenzi, imali yokufunda nokufunda esenzelwe wena.",
  trustFree: "100% Simahla · Zero-Rated",
  trustFirebase: "Ukuqinisekiswa Kwe-imeyile ye-Firebase",
  stepOf: (step, total) => `Inyathelo ${step} kwali-${total}`,
  sectionPersonal: "Ulwazi Lomntu",
  sectionPersonalSub: "Landela izikhokelo zeenkcukacha ngezantsi.",
  fullNameLabel: "Igama Elipheleleyo Nefani",
  fullNamePlaceholder: "umz. Lerato Nomvula Shabangu",
  fullNameHint: "Njengokuxwebhu lwe-ID / Ikopi",
  docTypeLabel: "Uhlobo Loxwebhu Lommi",
  docAsylum: "Iasilo / Umbaleki",
  docRsaId: "RSA ID",
  docPassport: "Ipasipoti / Yangaphandle",
  rsaIdLabel: "Inombolo ye-RSA ID (Amanani ali-13)",
  passportAsylumLabel: "Inombolo Yepasipoti / Yeasilo",
  rsaIdPlaceholder: "umz. 7401015800088",
  documentPlaceholder: "Inombolo yoxwebhu",
  idVerified: "I-checksum ye-ID iqinisekisiwe",
  dobLabel: "Umhla Wokuzalwa",
  dobHintFromId:
    "Kugcwaliswa ngokuzenzekelayo ukusuka kwi-RSA ID yakho (usenokuyihlela).",
  genderLabel: "Isini",
  genderFemale: "Ibhinqa",
  genderMale: "Indoda",
  genderPreferNot: "Ndikhetha ukungathethi",
  sectionContact: "Unxibelelwano NePhondo",
  sectionContactSub: "Sidinga iinkcukacha zonxibelelwano eziphambili ukuze sikuncede.",
  mobileLabel: "Inombolo Yeselula Ephambili",
  mobilePlaceholder: "+27 72 000 0000",
  mobileHint:
    "Isetyenziselwa ukubizwa kwakhona komcebisi. Ukuqinisekiswa kweakhawunti kuthunyelwa nge-imeyile ye-Firebase.",
  emailLabel: "Idilesi Ye-imeyile *",
  emailRequired: "Iyafuneka",
  emailPlaceholder: "your@emailaddress.co.za",
  emailHint:
    "I-Firebase izokuthumelela ikhonkco lokuqinisekisa emva kokwenza iakhawunti.",
  provinceLabel: "Iphondo Lokuhlala",
  sectionSituation: "Imeko Yakho Yangoku",
  sectionSituationSub: "Nceda uchaze iinketho zakho zemfundo noqeqesho.",
  sectionSecurity: "Ukufikelela Kokhuseleko",
  sectionSecuritySub: "Yenza i-PIN yamanani ama-6 okanye igama lokugqitha elikhumbulekayo",
  createPinLabel: "Yenza i-PIN / Igama lokugqitha lamanani ama-6",
  createPinPlaceholder: "Ubuncinane oonobumba aba-6",
  confirmPinLabel: "Qinisekisa i-PIN / Igama lokugqitha",
  confirmPinPlaceholder: "Phinda i-PIN / igama lokugqitha",
  disabilityCheckTitle: "Ndingumntu ophila nokukhubazeka",
  disabilityCheckBody:
    "Ivula iindlela zoncedo neenketho zesikhokelo somsebenzi ezifikelelekayo.",
  privacyCheckTitle:
    "Umgaqo-nkqubo Wabucala we-DHET & Isivumelwano Senqanaba Lenkonzo (Iyahambelana ne-POPIA)",
  privacyCheckBody:
    "Ndiyavuma ukuba idatha yomsebenzi neyobuchule engenamagama ingasetyenziswa yi-DHET ukuphucula iinkonzo zomsebenzi zikazwelonke.",
  bannerPersonalized:
    "Izimali zokufunda ezenziwe ngeziqu, iindlela zobuchule, neeyunivesithi.",
  createAccountCta: "Yenza Iakhawunti & Thumela I-imeyile Yokuqinisekisa",
  alreadyRegistered: "Sele ubhalisile ku-Khetha?",
  signInHere: "Ngena apha",
  needHelpRegistering: "Udinga uncedo lokubhalisa?",
  helpRegisterBody: (tollFree, whatsapp) =>
    `Thetha simahla nomcebisi wekhondo lomsebenzi we-DHET ku-${tollFree} okanye i-SMS ${whatsapp} ukuze ubizwe kwakhona simahla.`,
  errorPinMismatch: "Ukuqinisekiswa kwe-PIN / igama lokugqitha akufani.",
  errorAcceptAgreement: "Nceda wamkele isivumelwano sokuqokelela idatha se-DHET.",
  errorRegistration: "Ukubhalisa akuphumelelanga.",

  recoverTitle: "Seta Kwakhona Igama Lokugqitha",
  recoverBack: "Buyela Ekungeneni",
  recoverLiveLine: "Umgca Ophilayo Zero-Rated",
  recoverHeadline: "Seta kwakhona igama lokugqitha okanye i-PIN yakho",
  recoverAlt: "Setha kabusha iphasiwedi yakho · Khetha NCAP Citizen Access",
  recoverBody:
    "Faka inombolo yakho ye-ID yaseMzantsi Afrika ebhalisiweyo okanye iselula. Siza kuthumela ikhowudi yokuqinisekisa ye-SMS yasimahla zero-rated ukuze usete kwakhona ngokukhuselekileyo iziqinisekiso zakho zokungena.",
  recoverPopia: "Ikhuselwe yi-POPIA – Akukho Ixesha lomoya okanye Idatha efunekayo",
  stepVerifyIdentity: "Qinisekisa Isazisi",
  stepCreatePin: "Yenza i-PIN Entsha",
  channelSms: "Nge-SMS (Simahla)",
  channelEmail: "Nge-imeyile",
  recoverEmailLabel: "Idilesi Ye-imeyile Ebhalisiweyo *",
  recoverIdPhoneLabel: "I-SA National ID (amanani ali-13) okanye Inombolo Yeselula *",
  recoverEmailPlaceholder: "umz. learner@matric.dhet.gov.za",
  recoverIdPhonePlaceholder: "umz. 020514 5821 088 okanye 072 000 0000",
  recoverEmailHint: "Siza kuthumela ikhonkco lokuseta kwakhona le-Firebase.",
  recoverIdPhoneHint:
    "Ukukhangela inkampani yenethiwekhi simahla ku-Vodacom, MTN, Telkom, Cell C & Rain",
  sendResetLink: "Thumela Ikhonkco Lokuqinisekisa / Lokuseta Kwakhona",
  sendOtp: "Thumela Ikhowudi Yokuqinisekisa Yasimahla (OTP)",
  step2Title: "Inyathelo 2: Faka i-OTP & Yenza i-PIN Entsha",
  resetEmailSent: "I-imeyile yokuseta kwakhona ithunyelwe",
  zeroRatedSmsSent: "I-SMS Zero-Rated Ithunyelwe",
  step2EmailBody: (email) =>
    `Sithumele imiyalelo yokuseta kwakhona igama lokugqitha ku-${email}. Vula ikhonkco ukuze usete igama lokugqitha elitsha, emva koko ungene.`,
  step2SmsBody: (masked) =>
    `Sithumele ithokheni yexesha elinye yasimahla ku-${masked}.`,
  otpLabel: "Ikhowudi Yokuqinisekisa Yamanani Ama-6 (OTP)",
  codeExpires: (mm, ss) => `Ikhowudi iphelelwa lixesha ngo-${mm}:${ss}`,
  resendSms: "Thumela Kwakhona i-SMS Yasimahla (Simahla)",
  setNewPinLabel: "Seta i-PIN / Igama lokugqitha Elitsha Lamanani Ama-6",
  setNewPinPlaceholder: "umz. 582914",
  confirmNewPinLabel: "Qinisekisa i-PIN Entsha Yamanani Ama-6",
  confirmNewPinPlaceholder: "Phinda i-PIN yamanani ama-6",
  updatePasswordCta: "Hlaziya Igama Lokugqitha & Ngena",
  pinUpdatedTitle: "I-PIN Ihlaziyiwe Ngempumelelo!",
  pinUpdatedBody:
    "Kuyaqondiswa kwideshbhodi yomsebenzi ye-Khetha NCAP kwimizuzwana emi-3...",
  cantAccessPhoneTitle: "Awukwazi ukufikelela ifowuni ebhalisiweyo?",
  cantAccessPhoneBody:
    "Ukuba inombolo yakho yeselula ilahlekile, yibiwe, okanye iphelelwe lixesha, qinisekisa isazisi sakho ngokuthe ngqo nabecebisi bethu be-DHET.",
  tollFreeHelpline: "Umxholo Ongakhokhelwayo",
  whatsappCallback: "Ukubizwa kwakhona kwe-WhatsApp",
  langHint:
    "Udinga usizo ngolimi lwakho? · Udinga uncedo ngolwimi lwakho? · Hulp nodig in jou taal?",
  errorEnterIdentifier: "Faka i-ID, iselula, okanye i-imeyile yakho ukuze uqhubeke.",
  errorSendReset: "Ayikwazanga ukuthumela imiyalelo yokuseta kwakhona.",
  errorEnterOtp: "Faka ikhowudi yokuqinisekisa yamanani ama-6 evela kwi-SMS yakho.",
  errorPinsMatch: "Ii-PIN kufuneka zifane kwaye okungenani zibe namanani ama-4.",

  verifyTitle: "Qinisekisa I-imeyile",
  verifyHeadline: "Qinisekisa i-imeyile yakho",
  verifyBody: (email) =>
    `Sithumele ikhonkco lokuqinisekisa le-Firebase ku-${email}. Livule kwesi sixhobo okanye nakweyiphi ibhrawuza, emva koko ubuyele apha.`,
  verifyResent: "Enye i-imeyile yokuqinisekisa ithunyelwe.",
  verifyContinue: "Ndiqinisekisile — qhubeka",
  verifyResend: "Thumela kwakhona i-imeyile yokuqinisekisa",
  verifyDifferentAccount: "Sebenzisa iakhawunti eyahlukileyo",
  errorNotVerified:
    "I-imeyile ayikaqinisekiswa. Vula ikhonkco kwibhokisi yakho, emva koko uzame kwakhona.",
  errorRefreshVerify: "Ayikwazanga ukuhlaziya isimo sokuqinisekisa.",
  errorResendVerify: "Ayikwazanga ukuthumela kwakhona i-imeyile yokuqinisekisa.",
};

const nso: AuthStrings = {
  or: "goba",
  helpTitle: "O nyaka thušo?",
  helpBody: "Bolela mahala le molekgotla wa mošomo wa DHET.",
  helpTollFree: "Mogala wa Mahala",
  helpWhatsapp: "Go bitšwa gape ka WhatsApp",
  googleSignIn: "Tšwela pele ka Google",
  errorGeneric: "Go na le se se sa tsamaego gabotse. Hle leka gape.",

  signInTitle: "Tsena",
  signInHeadline: "Tsena go Khetha NCAP",
  signInSubtitle:
    "Fihlelela dipotšišo tše di bolokilwego, dipalo tša APS, dikgopelo tša dibursari, le vault ya mošomo ya DHET.",
  ssoTitle: "Go Tsena ga Tee ga Semmušo ga DHET",
  ssoSub: "Zero-Rated (Ga go nyakewe Data goba Nako ya Moyeng)",
  chooseMethod: "Kgetha Mokgwa wa go Tsena",
  methodSaId: "SA ID",
  methodMobileEmail: "Selefonou / Imeile",
  methodPassport: "Pasporoto /\nMophaphathegi",
  fieldSaIdLabel: "Nomoro ya ID ya Afrika Borwa",
  fieldSaIdTrailing: "Dinomoro tše 13",
  fieldSaIdPlaceholder: "mohl. 050112 5089 088",
  fieldSaIdHint:
    "Nomoro ya boitšhupo ya dinomoro tše 13 bjalo ka ge e ngwadilwe Rejistareng ya Setšhaba.",
  fieldPassportLabel: "Pasporoto / Tokumente ya Mophaphathegi",
  fieldPassportTrailing: "Alphanumeric",
  fieldPassportPlaceholder: "mohl. A01234567 goba DHA-No",
  fieldPassportHint:
    "Nea nomoro ya pasporoto ya ka ntle goba tumello ya setulo seo se amogelwago ke Home Affairs.",
  fieldMobileEmailLabel: "Nomoro ya Selefonou goba Imeile",
  fieldMobileEmailTrailing: "E ngwadisitswe",
  fieldMobileEmailPlaceholder: "mohl. 072 123 4567 goba you@email.com",
  fieldMobileEmailHint:
    "Tsenya nomoro ya selefonou goba aterese ya imeile ye e kgokaganywago le profaele ya gago ya Khetha.",
  passwordLabel: "Phasewete goba PIN ya dinomoro tše 5",
  passwordPlaceholder: "Tsenya phasewete goba PIN",
  forgot: "O lebetše?",
  rememberDevice: "Gopola sedirišwa bakeng sa go fihlelela mošomo ntle le inthanete",
  rememberDeviceBody:
    "E dumelela go bula di-CV tše di bolokilwego, dikwalifikaseo tše di bolokilwego, le direkhoto tša APS ntle le go tsena ka moka.",
  signInCta: "Tsena go NCAP",
  otpSignIn: "Tsena ka PIN ya Nako e Tee (SMS)",
  checkInboxTitle: "Lekola lepokisi la gago la go amogela",
  checkInboxBody: (email) =>
    `Kgokagano ya go tsena ka go thatha gatee e rometšwe go ${email}. E bule sedirišweng se.`,
  useDifferentEmail: "Šomiša imeile e fapanego",
  biometricTitle: "Go Tsena ka Biometric ka Pelo",
  biometricBody: "Dumelela Fingerprint goba Face ID sedirišweng se",
  biometricEnable: "Dumelela",
  featureVaultKicker: "Vault ya Mošomo",
  featureVaultTitle: "Fihlelela APS le Dibursari tše di Bolokilwego",
  featureTvetKicker: "TVET le Mabokgoni",
  featureTvetTitle: "Latela Tšwelopele ya gago ya Botsebi",
  registerPrompt: "Ga o sa na le profaele ya Khetha NCAP?",
  registerCta: "Ngwadiša / Hlama Akhaonto ya Mahala",
  registerCaption:
    "Mahala go baagi ka moka ba Afrika Borwa le baithuti ba ba dulago mo",
  guestContinue: "Tšwela pele bjalo ka Moeng / Hlahloba Mešomo Ntle le go Tsena",
  errorSaIdPassportUi:
    "UI ya go tsena ka SA ID le pasporoto e swana le thulaganyo. Fetogela go Mobile / Email bakeng sa Firebase.",
  errorOtpMethod:
    "Go tsena ka imeile / OTP ya nako e tee go šoma go thebu ya Mobile / Email.",
  errorSignIn: "Ga se ya kgona go tsena.",
  errorSendLink: "Ga se ya kgona go roma kgokagano ya go tsena.",
  errorGuest: "Mokgwa wa moeng o padile.",

  registerTitle: "Hlama Profaele",
  registerHeadline: "Hlama Profaele ya gago ya Mahala ya Khetha",
  registerSubtitle:
    "Hwetša keletšo ya mošomo, dibursari le thuto ye e dirilwego ka wena.",
  trustFree: "100% Mahala · Zero-Rated",
  trustFirebase: "Go Netefatša Imeile ya Firebase",
  stepOf: (step, total) => `Kgato ${step} ya ${total}`,
  sectionPersonal: "Tshedimošo ya Motho",
  sectionPersonalSub: "Latela ditaelo tša dintlha ka fase.",
  fullNameLabel: "Leina le Felelego le Sefane",
  fullNamePlaceholder: "mohl. Lerato Nomvula Shabangu",
  fullNameHint: "Bjalo ka Tokumente ya ID / Kopi",
  docTypeLabel: "Mohuta wa Tokumente ya Moagi",
  docAsylum: "Setulo / Mophaphathegi",
  docRsaId: "RSA ID",
  docPassport: "Pasporoto / Ya ka Ntle",
  rsaIdLabel: "Nomoro ya RSA ID (Dinomoro tše 13)",
  passportAsylumLabel: "Nomoro ya Pasporoto / Setulo",
  rsaIdPlaceholder: "mohl. 7401015800088",
  documentPlaceholder: "Nomoro ya tokumente",
  idVerified: "Checksum ya ID e netefaditšwe",
  dobLabel: "Letšatši la Matswalo",
  dobHintFromId:
    "E tlatšwa ka go itiriša go tšwa go RSA ID ya gago (o sa kgona go e lokiša).",
  genderLabel: "Bong",
  genderFemale: "Mosadi",
  genderMale: "Monna",
  genderPreferNot: "Ke kgetha go se bolele",
  sectionContact: "Kgokagano le Profense",
  sectionContactSub: "Re nyaka tshedimošo ya kgokagano ya mathomo go go thuša.",
  mobileLabel: "Nomoro ya Selefonou ya Mathomo",
  mobilePlaceholder: "+27 72 000 0000",
  mobileHint:
    "E šomišwa bakeng sa go bitšwa gape ga molekgotla. Go netefatša akhaonto go romelwa ka imeile ya Firebase.",
  emailLabel: "Aterese ya Imeile *",
  emailRequired: "E a nyakega",
  emailPlaceholder: "your@emailaddress.co.za",
  emailHint:
    "Firebase e tla go romela kgokagano ya go netefatša ka morago ga go hlama akhaonto.",
  provinceLabel: "Profense ya Bodulo",
  sectionSituation: "Seemong sa gago sa Bjale",
  sectionSituationSub:
    "Hle hlalosa dikgetho tša gago tša thuto le tlhahlo tša bjale.",
  sectionSecurity: "Go Fihlelela Tšhireletšo",
  sectionSecuritySub: "Hlama PIN ya dinomoro tše 6 goba phasewete ye e gopolwang",
  createPinLabel: "Hlama PIN / Phasewete ya Dinomoro tše 6",
  createPinPlaceholder: "Bonyenyane ditlhaka tše 6",
  confirmPinLabel: "Netefatša PIN / Phasewete",
  confirmPinPlaceholder: "Bušeletša PIN / phasewete",
  disabilityCheckTitle: "Ke motho yo a phelago ka bogole",
  disabilityCheckBody:
    "E bula ditsela tša thušo le dikgetho tša keletšo ya mošomo tše di fihlelelwago.",
  privacyCheckTitle:
    "Pholisi ya Sephiri ya DHET & Tumellano ya Maemo a Tirelo (E dumelana le POPIA)",
  privacyCheckBody:
    "Ke dumela gore data ya mošomo le bokgoni ye e se nago maina e ka šomišwa ke DHET go kaonafatša ditirelo tša mošomo tša naga.",
  bannerPersonalized:
    "Dibursari tše di dirilwego ka wena, ditsela tša botsebi, le diyunibesithi.",
  createAccountCta: "Hlama Akhaonto & Roma Imeile ya go Netefatša",
  alreadyRegistered: "O šetše o ngwadisitswe go Khetha?",
  signInHere: "Tsena mo",
  needHelpRegistering: "O nyaka thušo ya go ngwadiša?",
  helpRegisterBody: (tollFree, whatsapp) =>
    `Bolela mahala le molekgotla wa mošomo wa DHET go ${tollFree} goba SMS ${whatsapp} bakeng sa go bitšwa gape mahala.`,
  errorPinMismatch: "Go netefatša PIN / phasewete ga go swane.",
  errorAcceptAgreement: "Hle amogela tumellano ya go kgoboketša data ya DHET.",
  errorRegistration: "Go ngwadiša go padile.",

  recoverTitle: "Bea Phasewete Leswa",
  recoverBack: "Boela go Tsena",
  recoverLiveLine: "Mogala wa Zero-Rated wo o Phelago",
  recoverHeadline: "Bea phasewete goba PIN ya gago leswa",
  recoverAlt: "Setha kabusha iphasiwedi yakho · Khetha NCAP Citizen Access",
  recoverBody:
    "Tsenya nomoro ya gago ya ID ya Afrika Borwa ye e ngwadisitswego goba selefonou. Re tla roma khoutu ya go netefatša ya SMS ya mahala zero-rated go bea leswa ka tšhireletšo ditšhupetšo tša gago tša go tsena.",
  recoverPopia: "E šireleditswe ke POPIA – Ga go nyakewe Nako ya Moyeng goba Data",
  stepVerifyIdentity: "Netefatša Boitšhupo",
  stepCreatePin: "Hlama PIN e Mpsha",
  channelSms: "Ka SMS (Mahala)",
  channelEmail: "Ka Imeile",
  recoverEmailLabel: "Aterese ya Imeile ye e Ngwadisitswego *",
  recoverIdPhoneLabel: "SA National ID (dinomoro tše 13) goba Nomoro ya Selefonou *",
  recoverEmailPlaceholder: "mohl. learner@matric.dhet.gov.za",
  recoverIdPhonePlaceholder: "mohl. 020514 5821 088 goba 072 000 0000",
  recoverEmailHint: "Re tla roma kgokagano ya go bea phasewete leswa ya Firebase.",
  recoverIdPhoneHint:
    "Go nyaka mokgathi wa neteweke mahala go Vodacom, MTN, Telkom, Cell C & Rain",
  sendResetLink: "Roma Kgokagano ya go Netefatša / go Bea Leswa",
  sendOtp: "Roma Khoutu ya go Netefatša ya Mahala (OTP)",
  step2Title: "Kgato 2: Tsenya OTP & Hlama PIN e Mpsha",
  resetEmailSent: "Imeile ya go bea leswa e rometšwe",
  zeroRatedSmsSent: "SMS ya Zero-Rated e Rometšwe",
  step2EmailBody: (email) =>
    `Re rometše ditaelo tša go bea phasewete leswa go ${email}. Bula kgokagano go bea phasewete e mpsha, ke moka o tsene.`,
  step2SmsBody: (masked) =>
    `Re rometše token ya nako e tee ya mahala go ${masked}.`,
  otpLabel: "Khoutu ya go Netefatša ya Dinomoro tše 6 (OTP)",
  codeExpires: (mm, ss) => `Khoutu e fela ka ${mm}:${ss}`,
  resendSms: "Roma SMS ya Mahala Gape (Mahala)",
  setNewPinLabel: "Bea PIN / Phasewete e Mpsha ya Dinomoro tše 6",
  setNewPinPlaceholder: "mohl. 582914",
  confirmNewPinLabel: "Netefatša PIN e Mpsha ya Dinomoro tše 6",
  confirmNewPinPlaceholder: "Ngwala PIN ya dinomoro tše 6 gape",
  updatePasswordCta: "Mpshafatša Phasewete & Tsena",
  pinUpdatedTitle: "PIN e Mpshafaditšwe ka Katlego!",
  pinUpdatedBody:
    "Go iša dashboard ya mošomo ya Khetha NCAP ka metsotswana e 3...",
  cantAccessPhoneTitle: "Ga o kgone go fihlelela founo ye e ngwadisitswego?",
  cantAccessPhoneBody:
    "Ge e ba nomoro ya gago ya selefonou e lahlegile, e utswitswe, goba e fedile, netefatša boitšhupo bja gago thwii le bakgokaganyi ba rena ba DHET.",
  tollFreeHelpline: "Mogala wa Mahala",
  whatsappCallback: "Go bitšwa gape ka WhatsApp",
  langHint:
    "Udinga usizo ngolimi lwakho? · Udinga uncedo ngolwimi lwakho? · Hulp nodig in jou taal?",
  errorEnterIdentifier: "Tsenya ID, selefonou, goba imeile ya gago go tšwela pele.",
  errorSendReset: "Ga se ya kgona go roma ditaelo tša go bea leswa.",
  errorEnterOtp: "Tsenya khoutu ya go netefatša ya dinomoro tše 6 go tšwa go SMS ya gago.",
  errorPinsMatch: "Di-PIN di swanetše go swana ebile bonyenyane di be le dinomoro tše 4.",

  verifyTitle: "Netefatša Imeile",
  verifyHeadline: "Netefatša imeile ya gago",
  verifyBody: (email) =>
    `Re rometše kgokagano ya go netefatša ya Firebase go ${email}. E bule sedirišweng se goba browser efe goba efe, ke moka o boele mo.`,
  verifyResent: "Imeile e nngwe ya go netefatša e rometšwe.",
  verifyContinue: "Ke netefaditše — tšwela pele",
  verifyResend: "Roma imeile ya go netefatša gape",
  verifyDifferentAccount: "Šomiša akhaonto e fapanego",
  errorNotVerified:
    "Imeile ga e so netefatšwe. Bula kgokagano lepokising la gago, ke moka o leke gape.",
  errorRefreshVerify: "Ga se ya kgona go mpshafatša maemo a go netefatša.",
  errorResendVerify: "Ga se ya kgona go roma imeile ya go netefatša gape.",
};

const ve: AuthStrings = {
  or: "kana",
  helpTitle: "Ni khou ṱoḓa thuso?",
  helpBody: "Amba mahala na mulelekanyi wa mushumo wa DHET.",
  helpTollFree: "Lufungo lwa Mahala",
  helpWhatsapp: "U vhidzwa hafhu nga WhatsApp",
  googleSignIn: "Bvela phanda nga Google",
  errorGeneric: "Hu na zwi songo tshimbilaho zwavhudi. Ni khou humbela u linga hafhu.",

  signInTitle: "Dzhenani",
  signInHeadline: "Dzhenani kha Khetha NCAP",
  signInSubtitle:
    "Swikelelani mibudziso yo vhulungiwaho, u vhala ha APS, khumbelo dza thuso ya u guda, na vault ya mushumo ya DHET.",
  ssoTitle: "U Dzhena ha Tee ha Semushi ha DHET",
  ssoSub: "Zero-Rated (A hu ṱoḓei Data kana Tshifhinga tsha Muya)",
  chooseMethod: "Nangani Ndila ya u Dzhena",
  methodSaId: "SA ID",
  methodMobileEmail: "Selefoni / Imeili",
  methodPassport: "Phasipoto /\nMuphalelwa",
  fieldSaIdLabel: "Nomboro ya ID ya Afrika Tshipembe",
  fieldSaIdTrailing: "Nomboro dza 13",
  fieldSaIdPlaceholder: "sa. 050112 5089 088",
  fieldSaIdHint:
    "Nomboro ya u ḓivhadzwa ya nomboro dza 13 sa zwe zwa ṅwaliwa Rejistara ya Lushaka.",
  fieldPassportLabel: "Phasipoto / Ṅwalo wa Muphalelwa",
  fieldPassportTrailing: "Alphanumeric",
  fieldPassportPlaceholder: "sa. A01234567 kana DHA-No",
  fieldPassportHint:
    "Neani nomboro ya phasipoto ya nnḓa kana thendelo ya u ṱoḓa vhudzulo yo ḓivhiwaho nga Home Affairs.",
  fieldMobileEmailLabel: "Nomboro ya Selefoni kana Imeili",
  fieldMobileEmailTrailing: "Yo ṅwaliswa",
  fieldMobileEmailPlaceholder: "sa. 072 123 4567 kana you@email.com",
  fieldMobileEmailHint:
    "Ṅwalani nomboro ya selefoni kana aḓiresi ya imeili yo ṱumanyiwaho na phrofaule yanu ya Khetha.",
  passwordLabel: "Phasiwede kana PIN ya nomboro dza 5",
  passwordPlaceholder: "Ṅwalani phasiwede kana PIN",
  forgot: "No hangwa?",
  rememberDevice: "Humbulani tshishumiswa tsha u swikelela mushumo nnda ha inthanethe",
  rememberDeviceBody:
    "I tendela u vula dzi-CV dzo vhulungiwaho, zwiga zwo vhulungiwaho, na rekhodu dza APS nnda ha u dzhena tshifhinga tshoṱhe.",
  signInCta: "Dzhenani kha NCAP",
  otpSignIn: "Dzhenani nga PIN ya Tshifhinga tshi Tee (SMS)",
  checkInboxTitle: "Sedzani bhokisi yanu ya u ṱanganedza",
  checkInboxBody: (email) =>
    `Thumanyo ya u dzhena nga u kitikita luthihi yo rumelwa kha ${email}. I vulani kha itshi tshishumiswa.`,
  useDifferentEmail: "Shumisani imeili i fhambanaho",
  biometricTitle: "U Dzhena ha Biometric ha u ṱavhanya",
  biometricBody: "Tendelani Fingerprint kana Face ID kha itshi tshishumiswa",
  biometricEnable: "Tendelani",
  featureVaultKicker: "Vault ya Mushumo",
  featureVaultTitle: "Swikelelani APS na Thuso ya u Guda yo Vhulungiwaho",
  featureTvetKicker: "TVET na Vhukoni",
  featureTvetTitle: "Teveledzani Mvelaphanda yanu ya Vhufundi",
  registerPrompt: "A ni athu vha na phrofaule ya Khetha NCAP?",
  registerCta: "Ṅwalisani / Vhumani Akhaunthu ya Mahala",
  registerCaption:
    "Mahala kha vhadzulapo vhoṱhe vha Afrika Tshipembe na vhagudi vhane vha dzula hafha",
  guestContinue: "Bvelani phanda sa Mueni / Ṱolani Mishumo Nnda ha u Dzhena",
  errorSaIdPassportUi:
    "UI ya u dzhena nga SA ID na phasipoto i tshi fanana na tshivhumbeo. Shandukani kha Mobile / Email u itela Firebase.",
  errorOtpMethod:
    "U dzhena nga imeili / OTP ya tshifhinga tshi tee zwi shuma kha thebu ya Mobile / Email.",
  errorSignIn: "A zwo ngo kona u dzhena.",
  errorSendLink: "A zwo ngo kona u ruma thumanyo ya u dzhena.",
  errorGuest: "Modu ya mueni yo kundelwa.",

  registerTitle: "Vhumani Phrofaule",
  registerHeadline: "Vhumani Phrofaule yanu ya Mahala ya Khetha",
  registerSubtitle:
    "Wani ndaedzo ya mushumo, thuso ya u guda na u guda yo itelwaho inwi.",
  trustFree: "100% Mahala · Zero-Rated",
  trustFirebase: "U Khwaṱhisedza Imeili ya Firebase",
  stepOf: (step, total) => `Tshiteṅwa ${step} tsha ${total}`,
  sectionPersonal: "Mafhungo a Muthu",
  sectionPersonalSub: "Teveledzani ndaedzo dza zwidodombedzwa fhasi.",
  fullNameLabel: "Dzina ḽo Fhelelaho na Tshifani",
  fullNamePlaceholder: "sa. Lerato Nomvula Shabangu",
  fullNameHint: "Sa Ṅwalo wa ID / Khopi",
  docTypeLabel: "Lushaka lwa Ṅwalo wa Mudzulapo",
  docAsylum: "Vhudzulo / Muphalelwa",
  docRsaId: "RSA ID",
  docPassport: "Phasipoto / Ya Nnḓa",
  rsaIdLabel: "Nomboro ya RSA ID (Nomboro dza 13)",
  passportAsylumLabel: "Nomboro ya Phasipoto / Vhudzulo",
  rsaIdPlaceholder: "sa. 7401015800088",
  documentPlaceholder: "Nomboro ya ṅwalo",
  idVerified: "Checksum ya ID yo khwaṱhisedzwa",
  dobLabel: "Duvha ḽa u Bebiwa",
  dobHintFromId:
    "I ḓadziswa nga u ḓiitela u bva kha RSA ID yanu (ni kha ḓi nga i khwinisa).",
  genderLabel: "Mbeu",
  genderFemale: "Musadzi",
  genderMale: "Munna",
  genderPreferNot: "Ndi nanga u sa amba",
  sectionContact: "Vhukwamani na Phurovhinsi",
  sectionContactSub: "Ri ṱoḓa mafhungo a vhukwamani a u thoma u itela u ni thusa.",
  mobileLabel: "Nomboro ya Selefoni ya u Thoma",
  mobilePlaceholder: "+27 72 000 0000",
  mobileHint:
    "I shumiswa kha u vhidzwa hafhu ha mulelekanyi. U khwaṱhisedza akhaunthu zwi rumelwa nga imeili ya Firebase.",
  emailLabel: "Aḓiresi ya Imeili *",
  emailRequired: "Zwi a ṱoḓea",
  emailPlaceholder: "your@emailaddress.co.za",
  emailHint:
    "Firebase i ḓo ni rumela thumanyo ya u khwaṱhisedza nga murahu ha u vhuma akhaunthu.",
  provinceLabel: "Phurovhinsi ya u Dzula",
  sectionSituation: "Tshimo tshanu tsha Zwino",
  sectionSituationSub:
    "Ni khou humbela u ṱalusa khetho dzanu dza pfunzo na u gudiswa.",
  sectionSecurity: "U Swikelela Tshireledzo",
  sectionSecuritySub: "Vhumani PIN ya nomboro dza 6 kana phasiwede i humbuliwaho",
  createPinLabel: "Vhumani PIN / Phasiwede ya Nomboro dza 6",
  createPinPlaceholder: "Hu si fhasi ha nḓaḓa dza 6",
  confirmPinLabel: "Khwaṱhisedzani PIN / Phasiwede",
  confirmPinPlaceholder: "Dovholani PIN / phasiwede",
  disabilityCheckTitle: "Ndi muthu ane a tshi tshila nga vhukundi",
  disabilityCheckBody:
    "I vula ndila dza thuso na khetho dza ndaedzo ya mushumo dzo swikelelaho.",
  privacyCheckTitle:
    "Pholisi ya Tshiphiri ya DHET & Thendelano ya Maimo a Tshumelo (I tendelana na POPIA)",
  privacyCheckBody:
    "Ndi a tenda uri data ya mushumo na vhukoni i songo vha na madzina i nga shumiswa nga DHET u khwinisa tshumelo dza mushumo dza lushaka.",
  bannerPersonalized:
    "Thuso ya u guda yo itelwaho inwi, ndila dza vhufundi, na yunivesithi.",
  createAccountCta: "Vhumani Akhaunthu & Rumelani Imeili ya u Khwaṱhisedza",
  alreadyRegistered: "No no ṅwaliswa kha Khetha?",
  signInHere: "Dzhenani hafha",
  needHelpRegistering: "Ni khou ṱoḓa thuso ya u ṅwalisa?",
  helpRegisterBody: (tollFree, whatsapp) =>
    `Amba mahala na mulelekanyi wa mushumo wa DHET kha ${tollFree} kana SMS ${whatsapp} u itela u vhidzwa hafhu mahala.`,
  errorPinMismatch: "U khwaṱhisedza PIN / phasiwede a zwi fani.",
  errorAcceptAgreement: "Ni khou humbela u tendela thendelano ya u kuvhanganya data ya DHET.",
  errorRegistration: "U ṅwalisa ho kundelwa.",

  recoverTitle: "Vheani Phasiwede Hafhu",
  recoverBack: "Vhuyelani kha u Dzhena",
  recoverLiveLine: "Lufungo lwa Zero-Rated lune lwa Tshila",
  recoverHeadline: "Vheani phasiwede kana PIN yanu hafhu",
  recoverAlt: "Setha kabusha iphasiwedi yakho · Khetha NCAP Citizen Access",
  recoverBody:
    "Ṅwalani nomboro yanu ya ID ya Afrika Tshipembe yo ṅwaliswaho kana selefoni. Ri ḓo ruma khoudu ya u khwaṱhisedza ya SMS ya mahala zero-rated u itela u vhea hafhu nga tshireledzo zwitatisi zwanu zwa u dzhena.",
  recoverPopia: "Yo tsireledzwa nga POPIA – A hu ṱoḓei Tshifhinga tsha Muya kana Data",
  stepVerifyIdentity: "Khwaṱhisedzani Vhuḓifari",
  stepCreatePin: "Vhumani PIN Ntswa",
  channelSms: "Nga SMS (Mahala)",
  channelEmail: "Nga Imeili",
  recoverEmailLabel: "Aḓiresi ya Imeili yo Ṅwaliswaho *",
  recoverIdPhoneLabel: "SA National ID (nomboro dza 13) kana Nomboro ya Selefoni *",
  recoverEmailPlaceholder: "sa. learner@matric.dhet.gov.za",
  recoverIdPhonePlaceholder: "sa. 020514 5821 088 kana 072 000 0000",
  recoverEmailHint: "Ri ḓo ruma thumanyo ya u vhea phasiwede hafhu ya Firebase.",
  recoverIdPhoneHint:
    "U ṱoḓa mukamupanzi wa neteweke mahala kha Vodacom, MTN, Telkom, Cell C & Rain",
  sendResetLink: "Rumelani Thumanyo ya u Khwaṱhisedza / u Vhea Hafhu",
  sendOtp: "Rumelani Khoudu ya u Khwaṱhisedza ya Mahala (OTP)",
  step2Title: "Tshiteṅwa 2: Ṅwalani OTP & Vhumani PIN Ntswa",
  resetEmailSent: "Imeili ya u vhea hafhu yo rumelwa",
  zeroRatedSmsSent: "SMS ya Zero-Rated yo Rumelwa",
  step2EmailBody: (email) =>
    `Ro ruma ndaedzo dza u vhea phasiwede hafhu kha ${email}. Vulani thumanyo u itela u vhea phasiwede ntswa, nga murahu ni dzhene.`,
  step2SmsBody: (masked) =>
    `Ro ruma thokheni ya tshifhinga tshi tee ya mahala kha ${masked}.`,
  otpLabel: "Khoudu ya u Khwaṱhisedza ya Nomboro dza 6 (OTP)",
  codeExpires: (mm, ss) => `Khoudu i fhela nga ${mm}:${ss}`,
  resendSms: "Rumelani SMS ya Mahala Hafhu (Mahala)",
  setNewPinLabel: "Vheani PIN / Phasiwede Ntswa ya Nomboro dza 6",
  setNewPinPlaceholder: "sa. 582914",
  confirmNewPinLabel: "Khwaṱhisedzani PIN Ntswa ya Nomboro dza 6",
  confirmNewPinPlaceholder: "Ṅwalani PIN ya nomboro dza 6 hafhu",
  updatePasswordCta: "Khwinisani Phasiwede & Dzhenani",
  pinUpdatedTitle: "PIN yo Khwiniswa nga Vhukuma!",
  pinUpdatedBody:
    "Hu khou isa kha dashi bhodi ya mushumo ya Khetha NCAP nga mitsukukumba ya 3...",
  cantAccessPhoneTitle: "A ni koni u swikelela founo yo ṅwaliswaho?",
  cantAccessPhoneBody:
    "Arali nomboro yanu ya selefoni yo xela, yo whiwa, kana yo fhela, khwaṱhisedzani vhuḓifari hanu thwiṱhi na vhalelekanyi vhashu vha DHET.",
  tollFreeHelpline: "Lufungo lwa Mahala",
  whatsappCallback: "U vhidzwa hafhu nga WhatsApp",
  langHint:
    "Udinga usizo ngolimi lwakho? · Udinga uncedo ngolwimi lwakho? · Hulp nodig in jou taal?",
  errorEnterIdentifier: "Ṅwalani ID, selefoni, kana imeili yanu u itela u bvela phanda.",
  errorSendReset: "A zwo ngo kona u ruma ndaedzo dza u vhea hafhu.",
  errorEnterOtp: "Ṅwalani khoudu ya u khwaṱhisedza ya nomboro dza 6 u bva kha SMS yanu.",
  errorPinsMatch: "Dzi-PIN dzi tea u fana nahone hu si fhasi ha nomboro dza 4.",

  verifyTitle: "Khwaṱhisedzani Imeili",
  verifyHeadline: "Khwaṱhisedzani imeili yanu",
  verifyBody: (email) =>
    `Ro ruma thumanyo ya u khwaṱhisedza ya Firebase kha ${email}. I vulani kha itshi tshishumiswa kana browser iṅwe na iṅwe, nga murahu ni vhuyele hafha.`,
  verifyResent: "Iṅwe imeili ya u khwaṱhisedza yo rumelwa.",
  verifyContinue: "Ndo khwaṱhisedza — bvelani phanda",
  verifyResend: "Rumelani imeili ya u khwaṱhisedza hafhu",
  verifyDifferentAccount: "Shumisani akhaunthu i fhambanaho",
  errorNotVerified:
    "Imeili a yo ngo khwaṱhisedzwa. Vulani thumanyo kha bhokisi yanu, nga murahu ni linge hafhu.",
  errorRefreshVerify: "A zwo ngo kona u khwinisa tshimo tsha u khwaṱhisedza.",
  errorResendVerify: "A zwo ngo kona u ruma imeili ya u khwaṱhisedza hafhu.",
};

const ts: AuthStrings = {
  or: "kumbe",
  helpTitle: "U lava mpfuno?",
  helpBody: "Vulavula mahala na mucekeli wa ntirho wa DHET.",
  helpTollFree: "Riqingho ra Mahala",
  helpWhatsapp: "Ku vitaniwa nakambe hi WhatsApp",
  googleSignIn: "Yisa emahlweni hi Google",
  errorGeneric: "Ku na leswi nga fambangiki kahle. Hi kombela u ringeta nakambe.",

  signInTitle: "Nghena",
  signInHeadline: "Nghena eka Khetha NCAP",
  signInSubtitle:
    "Fikelela swivutiso leswi hlayisiweke, ku hlayela ka APS, swikombelo swa mali yo dyondza, na vault ya ntirho ya DHET.",
  ssoTitle: "Ku Nghena ka Xin'we ka Ximfumo ka DHET",
  ssoSub: "Zero-Rated (A swi lavi Data kumbe Nkarhi wa Moya)",
  chooseMethod: "Hlawula Ndlela yo Nghena",
  methodSaId: "SA ID",
  methodMobileEmail: "Riqingho / Imeyili",
  methodPassport: "Pasipoto /\nMuphaleleri",
  fieldSaIdLabel: "Nomboro ya ID ya Afrika Dzonga",
  fieldSaIdTrailing: "Tinomboro ta 13",
  fieldSaIdPlaceholder: "xik. 050112 5089 088",
  fieldSaIdHint:
    "Nomboro ya vutihlamuleri ya tinomboro ta 13 tanihi leswi tsariweke eka Rejistara ya Rixaka.",
  fieldPassportLabel: "Pasipoto / Dokhumente ya Muphaleleri",
  fieldPassportTrailing: "Alphanumeric",
  fieldPassportPlaceholder: "xik. A01234567 kumbe DHA-No",
  fieldPassportHint:
    "Nyika nomboro ya pasipoto ya le handle kumbe mpfumelelo wa vutshamo leyi amukeriwaka hi Home Affairs.",
  fieldMobileEmailLabel: "Nomboro ya Riqingho kumbe Imeyili",
  fieldMobileEmailTrailing: "Yi tsarisiwile",
  fieldMobileEmailPlaceholder: "xik. 072 123 4567 kumbe you@email.com",
  fieldMobileEmailHint:
    "Nghenisa nomboro ya riqingho kumbe adirese ya imeyili leyi khomisiweke na phurofayile ya wena ya Khetha.",
  passwordLabel: "Phasiwedi kumbe PIN ya tinomboro ta 5",
  passwordPlaceholder: "Nghenisa phasiwedi kumbe PIN",
  forgot: "U rivalile?",
  rememberDevice: "Tsundzuka xitirhisiwa xo fikelela ntirho handle ka inthanete",
  rememberDeviceBody:
    "Yi pfumelela ku pfula ti-CV leti hlayisiweke, switifiketi leswi hlayisiweke, na tirekhodi ta APS handle ko nghena nkarhi na nkarhi.",
  signInCta: "Nghena eka NCAP",
  otpSignIn: "Nghena hi PIN ya Nkarhi wun'we (SMS)",
  checkInboxTitle: "Kambela bhokisi ra wena ra ku amukela",
  checkInboxBody: (email) =>
    `Linki yo nghena hi ku tshikelela kan'we yi rhumeriwile eka ${email}. Yi pfula eka xitirhisiwa lexi.`,
  useDifferentEmail: "Tirhisa imeyili leyi hambaneke",
  biometricTitle: "Ku Nghena hi Biometric hi ku Hatlisa",
  biometricBody: "Pfumelela Fingerprint kumbe Face ID eka xitirhisiwa lexi",
  biometricEnable: "Pfumelela",
  featureVaultKicker: "Vault ya Ntirho",
  featureVaultTitle: "Fikelela APS na Mali yo Dyondza leyi Hlayisiweke",
  featureTvetKicker: "TVET na Vuswikoti",
  featureTvetTitle: "Landzelela Ndzulamiso wa wena wa Vutshila",
  registerPrompt: "A wu si va na phurofayile ya Khetha NCAP?",
  registerCta: "Tsarisa / Endla Akhawunti ya Mahala",
  registerCaption:
    "Mahala eka vaaki hinkwavo va Afrika Dzonga na vadyondzi lava tshamaka laha",
  guestContinue: "Yisa emahlweni tanihi Muendzi / Lava Mintirho Handle ko Nghena",
  errorSaIdPassportUi:
    "UI yo nghena hi SA ID na pasipoto yi fana na dizayini. Cincela eka Mobile / Email leswaku u tirhisa Firebase.",
  errorOtpMethod:
    "Ku nghena hi imeyili / OTP ya nkarhi wun'we ku tirha eka thebu ya Mobile / Email.",
  errorSignIn: "A swi kotanga ku nghena.",
  errorSendLink: "A swi kotanga ku rhumela linki yo nghena.",
  errorGuest: "Modu ya muendzi yi tsandzekile.",

  registerTitle: "Endla Phurofayile",
  registerHeadline: "Endla Phurofayile ya wena ya Mahala ya Khetha",
  registerSubtitle:
    "Kuma ndziviso ya ntirho, mali yo dyondza na dyondzo leyi endleriweke wena.",
  trustFree: "100% Mahala · Zero-Rated",
  trustFirebase: "Ku Tiyisisa Imeyili ya Firebase",
  stepOf: (step, total) => `Goza ${step} ra ${total}`,
  sectionPersonal: "Vuxokoxoko bya Munhu",
  sectionPersonalSub: "Landzelela swiletelo swa vuxokoxoko laha hansi.",
  fullNameLabel: "Vito leri Hetisekeke na Siveni",
  fullNamePlaceholder: "xik. Lerato Nomvula Shabangu",
  fullNameHint: "Tanihi Dokhumente ya ID / Khopi",
  docTypeLabel: "Muxaka wa Dokhumente ya Muaki",
  docAsylum: "Vutshamo / Muphaleleri",
  docRsaId: "RSA ID",
  docPassport: "Pasipoto / Ya le Handle",
  rsaIdLabel: "Nomboro ya RSA ID (Tinomboro ta 13)",
  passportAsylumLabel: "Nomboro ya Pasipoto / Vutshamo",
  rsaIdPlaceholder: "xik. 7401015800088",
  documentPlaceholder: "Nomboro ya dokhumente",
  idVerified: "Checksum ya ID yi tiyisisiwile",
  dobLabel: "Siku ra Ku Velekiwa",
  dobHintFromId:
    "Yi tatisiwa hi ku tiendlekela kusuka eka RSA ID ya wena (u ha swi kota ku yi lunghisa).",
  genderLabel: "Rimbewu",
  genderFemale: "Wansati",
  genderMale: "Wanuna",
  genderPreferNot: "Ndzi hlawula ku nga vulavuli",
  sectionContact: "Vuhlanganisi na Xifundzhankulu",
  sectionContactSub: "Hi lava vuxokoxoko bya vuhlanganisi bya sungula leswaku hi ku pfuna.",
  mobileLabel: "Nomboro ya Riqingho ya Sungula",
  mobilePlaceholder: "+27 72 000 0000",
  mobileHint:
    "Yi tirhisiwa eka ku vitaniwa nakambe ka mucekeli. Ku tiyisisa akhawunti ku rhumeriwa hi imeyili ya Firebase.",
  emailLabel: "Adirese ya Imeyili *",
  emailRequired: "Ya laveka",
  emailPlaceholder: "your@emailaddress.co.za",
  emailHint:
    "Firebase yi ta ku rhumela linki yo tiyisisa endzhaku ka ku endla akhawunti.",
  provinceLabel: "Xifundzhankulu xa Ku Tshama",
  sectionSituation: "Xiyimo xa wena xa Sweswi",
  sectionSituationSub:
    "Hi kombela u hlamusela swihlawulekisi swa wena swa dyondzo na vuleteri.",
  sectionSecurity: "Ku Fikelela Vuhlayiseki",
  sectionSecuritySub: "Endla PIN ya tinomboro ta 6 kumbe phasiwedi leyi tsundzukiwaka",
  createPinLabel: "Endla PIN / Phasiwedi ya Tinomboro ta 6",
  createPinPlaceholder: "A swi ri ehansi ka maletere ya 6",
  confirmPinLabel: "Tiyisisa PIN / Phasiwedi",
  confirmPinPlaceholder: "Phindza PIN / phasiwedi",
  disabilityCheckTitle: "Ndzi munhu loyi a hanya hi vusweti",
  disabilityCheckBody:
    "Yi pfula tindlela ta mpfuno na swihlawulekisi swa ndziviso ya ntirho leswi fikelelekaka.",
  privacyCheckTitle:
    "Pholisi ya Xihundla xa DHET & Ntwanano wa Xiyimo xa Vukorhokeri (Yi pfumelelana na POPIA)",
  privacyCheckBody:
    "Ndzi pfumelela leswaku data ya ntirho na vuswikoti leyi nga riki na mavito yi nga tirhisiwa hi DHET ku antswisa vukorhokeri bya ntirho bya tiko.",
  bannerPersonalized:
    "Mali yo dyondza leyi endleriweke wena, tindlela ta vutshila, na tiyunivesiti.",
  createAccountCta: "Endla Akhawunti & Rhumela Imeyili yo Tiyisisa",
  alreadyRegistered: "U tsarisiwile eka Khetha?",
  signInHere: "Nghena laha",
  needHelpRegistering: "U lava mpfuno wo tsarisa?",
  helpRegisterBody: (tollFree, whatsapp) =>
    `Vulavula mahala na mucekeli wa ntirho wa DHET eka ${tollFree} kumbe SMS ${whatsapp} leswaku u vitaniwa nakambe mahala.`,
  errorPinMismatch: "Ku tiyisisa PIN / phasiwedi a swi fani.",
  errorAcceptAgreement: "Hi kombela u amukela ntwanano wo hlengeleta data wa DHET.",
  errorRegistration: "Ku tsarisa ku tsandzekile.",

  recoverTitle: "Veka Phasiwedi Nakambe",
  recoverBack: "Vuyela eka Ku Nghena",
  recoverLiveLine: "Riqingho ra Zero-Rated leri Hanyaka",
  recoverHeadline: "Veka phasiwedi kumbe PIN ya wena nakambe",
  recoverAlt: "Setha kabusha iphasiwedi yakho · Khetha NCAP Citizen Access",
  recoverBody:
    "Nghenisa nomboro ya wena ya ID ya Afrika Dzonga leyi tsarisiweke kumbe riqingho. Hi ta rhumela khoudu yo tiyisisa ya SMS ya mahala zero-rated leswaku u veka nakambe hi vuhlayiseki switifiketi swa wena swo nghena.",
  recoverPopia: "Yi sirheleliwile hi POPIA – A swi lavi Nkarhi wa Moya kumbe Data",
  stepVerifyIdentity: "Tiyisisa Vutihlamuleri",
  stepCreatePin: "Endla PIN Leyintshwa",
  channelSms: "Hi SMS (Mahala)",
  channelEmail: "Hi Imeyili",
  recoverEmailLabel: "Adirese ya Imeyili leyi Tsarisiweke *",
  recoverIdPhoneLabel: "SA National ID (tinomboro ta 13) kumbe Nomboro ya Riqingho *",
  recoverEmailPlaceholder: "xik. learner@matric.dhet.gov.za",
  recoverIdPhonePlaceholder: "xik. 020514 5821 088 kumbe 072 000 0000",
  recoverEmailHint: "Hi ta rhumela linki yo veka phasiwedi nakambe ya Firebase.",
  recoverIdPhoneHint:
    "Ku lava nkampani ya neteweke mahala eka Vodacom, MTN, Telkom, Cell C & Rain",
  sendResetLink: "Rhumela Linki yo Tiyisisa / yo Veka Nakambe",
  sendOtp: "Rhumela Khoudu yo Tiyisisa ya Mahala (OTP)",
  step2Title: "Goza 2: Nghenisa OTP & Endla PIN Leyintshwa",
  resetEmailSent: "Imeyili yo veka nakambe yi rhumeriwile",
  zeroRatedSmsSent: "SMS ya Zero-Rated Yi Rhumeriwile",
  step2EmailBody: (email) =>
    `Hi rhumele swiletelo swo veka phasiwedi nakambe eka ${email}. Pfula linki leswaku u veka phasiwedi leyintshwa, endzhaku u nghena.`,
  step2SmsBody: (masked) =>
    `Hi rhumele thokheni ya nkarhi wun'we ya mahala eka ${masked}.`,
  otpLabel: "Khoudu yo Tiyisisa ya Tinomboro ta 6 (OTP)",
  codeExpires: (mm, ss) => `Khoudu yi hela hi ${mm}:${ss}`,
  resendSms: "Rhumela SMS ya Mahala Nakambe (Mahala)",
  setNewPinLabel: "Veka PIN / Phasiwedi Leyintshwa ya Tinomboro ta 6",
  setNewPinPlaceholder: "xik. 582914",
  confirmNewPinLabel: "Tiyisisa PIN Leyintshwa ya Tinomboro ta 6",
  confirmNewPinPlaceholder: "Tsala PIN ya tinomboro ta 6 nakambe",
  updatePasswordCta: "Antswisa Phasiwedi & Nghena",
  pinUpdatedTitle: "PIN Yi Antswisiwile hi Ku Humelela!",
  pinUpdatedBody:
    "Ku yisiwa eka dashi bhodi ya ntirho ya Khetha NCAP hi tiphepha ta 3...",
  cantAccessPhoneTitle: "A wu koti ku fikelela riqingho leri tsarisiweke?",
  cantAccessPhoneBody:
    "Loko nomboro ya wena ya riqingho yi lahlekile, yi yiviwile, kumbe yi herile, tiyisisa vutihlamuleri bya wena hi ku kongoma na vacekeri va hina va DHET.",
  tollFreeHelpline: "Riqingho ra Mahala",
  whatsappCallback: "Ku vitaniwa nakambe hi WhatsApp",
  langHint:
    "Udinga usizo ngolimi lwakho? · Udinga uncedo ngolwimi lwakho? · Hulp nodig in jou taal?",
  errorEnterIdentifier: "Nghenisa ID, riqingho, kumbe imeyili ya wena leswaku u yisa emahlweni.",
  errorSendReset: "A swi kotanga ku rhumela swiletelo swo veka nakambe.",
  errorEnterOtp: "Nghenisa khoudu yo tiyisisa ya tinomboro ta 6 kusuka eka SMS ya wena.",
  errorPinsMatch: "Ti-PIN ti fanele ti fana naswona a ti ri ehansi ka tinomboro ta 4.",

  verifyTitle: "Tiyisisa Imeyili",
  verifyHeadline: "Tiyisisa imeyili ya wena",
  verifyBody: (email) =>
    `Hi rhumele linki yo tiyisisa ya Firebase eka ${email}. Yi pfula eka xitirhisiwa lexi kumbe browser yin'wana ni yin'wana, endzhaku u vuya laha.`,
  verifyResent: "Imeyili yin'wana yo tiyisisa yi rhumeriwile.",
  verifyContinue: "Ndzi tiyisisile — yisa emahlweni",
  verifyResend: "Rhumela imeyili yo tiyisisa nakambe",
  verifyDifferentAccount: "Tirhisa akhawunti leyi hambaneke",
  errorNotVerified:
    "Imeyili a yi si tiyisisiwa. Pfula linki eka bhokisi ra wena, endzhaku u ringeta nakambe.",
  errorRefreshVerify: "A swi kotanga ku antswisa xiyimo xo tiyisisa.",
  errorResendVerify: "A swi kotanga ku rhumela imeyili yo tiyisisa nakambe.",
};

const BUNDLE = expandSaLocales({ en, af, zu, xh, nso, ve, ts });

export function getAuthStrings(
  locale: string | null | undefined,
): AuthStrings {
  return BUNDLE[resolveLocale(locale)];
}

