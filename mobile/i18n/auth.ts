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
