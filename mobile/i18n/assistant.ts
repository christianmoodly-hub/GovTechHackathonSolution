import { expandSaLocales, resolveLocale } from "./createBundle";

export type AssistantStrings = {
  launcher: string;
  title: string;
  subtitle: string;
  close: string;
  clear: string;
  inputPlaceholder: string;
  send: string;
  greeting: string;
  voiceHint: string;
  thinking: string;
  working: string;
  listening: string;
  transcribing: string;
  holdToTalk: string;
  stopSpeaking: string;
  voiceMessage: string;
  you: string;
  assistant: string;
  offline: string;
  offlineHint: string;
  micDenied: string;
  micFailed: string;
  noSpeech: string;
  voiceNotAvailable: (language: string) => string;
  confirmTitle: string;
  confirmBody: (what: string) => string;
  confirmYes: string;
  confirmNo: string;
  openedScreen: (name: string) => string;
  opened: (title: string) => string;
  wentBack: string;
  searched: (query: string) => string;
  filtered: (name: string, value: string) => string;
  cleared: string;
  saved: (title: string) => string;
  unsaved: (title: string) => string;
  languageSet: (language: string) => string;
  contrastOn: string;
  contrastOff: string;
  textSizeSet: string;
  needSignIn: string;
  notFound: string;
  a11yOpen: string;
  a11yClose: string;
  a11yMic: string;
  a11yTranscript: string;
};

const en: AssistantStrings = {
  launcher: "Ask Khetha",
  title: "Khetha assistant",
  subtitle: "Careers, study and funding",
  close: "Close",
  clear: "Start over",
  inputPlaceholder: "Ask about careers, study or funding…",
  send: "Send",
  greeting:
    "I can help you find careers, qualifications, colleges and bursaries — and I can open them for you. What are you looking for?",
  voiceHint: "Hold the microphone, press and hold volume down, or shake your phone to talk.",
  thinking: "Thinking…",
  working: "Working on it…",
  listening: "Listening… release to send",
  transcribing: "Got it — checking the app…",
  holdToTalk: "Hold to talk",
  stopSpeaking: "Stop speaking",
  voiceMessage: "Voice message",
  you: "You",
  assistant: "Khetha",
  offline: "You are offline",
  offlineHint:
    "I can still move around the app. Try “open bursaries” or “read this screen”.",
  micDenied: "I need microphone permission to listen. Enable it in your phone settings.",
  micFailed: "The microphone did not work. Try typing instead.",
  noSpeech: "I did not hear anything. Hold the button a little longer and try again.",
  voiceNotAvailable: (language) =>
    `Spoken ${language} replies are unavailable right now, so I will show my answers as text.`,
  confirmTitle: "Leave the app?",
  confirmBody: (what) => `Do you want me to ${what}?`,
  confirmYes: "Yes, continue",
  confirmNo: "No, stay here",
  openedScreen: (name) => `Opened ${name}.`,
  opened: (title) => `Opened ${title}.`,
  wentBack: "Went back.",
  searched: (query) => `Searched for ${query}.`,
  filtered: (name, value) => `Set ${name} to ${value}.`,
  cleared: "Cleared the search and filters.",
  saved: (title) => `Saved ${title}.`,
  unsaved: (title) => `Removed ${title} from your saved items.`,
  languageSet: (language) => `Switched to ${language}.`,
  contrastOn: "High contrast is on.",
  contrastOff: "High contrast is off.",
  textSizeSet: "Text size changed.",
  needSignIn: "Sign in first so I can save things for you.",
  notFound: "I could not find that in the app.",
  a11yOpen: "Open the Khetha assistant",
  a11yClose: "Close the Khetha assistant",
  a11yMic: "Hold to speak to the Khetha assistant",
  a11yTranscript: "Conversation with the Khetha assistant",
};

const af: AssistantStrings = {
  launcher: "Vra Khetha",
  title: "Khetha-assistent",
  subtitle: "Loopbane, studie en befondsing",
  close: "Maak toe",
  clear: "Begin oor",
  inputPlaceholder: "Vra oor loopbane, studie of befondsing…",
  send: "Stuur",
  greeting:
    "Ek kan jou help om loopbane, kwalifikasies, kolleges en bursare te vind — en ek kan hulle vir jou oopmaak. Waarna soek jy?",
  voiceHint: "Hou die mikrofoon, hou volume-af in, of skud jou foon om te praat.",
  thinking: "Dink…",
  working: "Besig daarmee…",
  listening: "Luister… los om te stuur",
  transcribing: "Gehoor — ek kyk in die app…",
  holdToTalk: "Hou in om te praat",
  stopSpeaking: "Hou op praat",
  voiceMessage: "Stemboodskap",
  you: "Jy",
  assistant: "Khetha",
  offline: "Jy is vanlyn",
  offlineHint:
    "Ek kan steeds in die app rondbeweeg. Probeer “maak bursare oop” of “lees hierdie skerm”.",
  micDenied:
    "Ek het mikrofoontoestemming nodig om te luister. Skakel dit in jou fooninstellings aan.",
  micFailed: "Die mikrofoon het nie gewerk nie. Probeer eerder tik.",
  noSpeech: "Ek het niks gehoor nie. Hou die knoppie langer in en probeer weer.",
  voiceNotAvailable: (language) =>
    `Gesproke ${language}-antwoorde is nou nie beskikbaar nie, so ek wys my antwoorde as teks.`,
  confirmTitle: "Die app verlaat?",
  confirmBody: (what) => `Wil jy hê ek moet ${what}?`,
  confirmYes: "Ja, gaan voort",
  confirmNo: "Nee, bly hier",
  openedScreen: (name) => `${name} oopgemaak.`,
  opened: (title) => `${title} oopgemaak.`,
  wentBack: "Teruggegaan.",
  searched: (query) => `Gesoek vir ${query}.`,
  filtered: (name, value) => `${name} op ${value} gestel.`,
  cleared: "Die soektog en filters is skoongemaak.",
  saved: (title) => `${title} gestoor.`,
  unsaved: (title) => `${title} uit jou gestoorde items verwyder.`,
  languageSet: (language) => `Oorgeskakel na ${language}.`,
  contrastOn: "Hoë kontras is aan.",
  contrastOff: "Hoë kontras is af.",
  textSizeSet: "Teksgrootte verander.",
  needSignIn: "Meld eers aan sodat ek dinge vir jou kan stoor.",
  notFound: "Ek kon dit nie in die app vind nie.",
  a11yOpen: "Maak die Khetha-assistent oop",
  a11yClose: "Maak die Khetha-assistent toe",
  a11yMic: "Hou in om met die Khetha-assistent te praat",
  a11yTranscript: "Gesprek met die Khetha-assistent",
};

const zu: AssistantStrings = {
  launcher: "Buza uKhetha",
  title: "Umsizi kaKhetha",
  subtitle: "Imisebenzi, ukufunda nokuxhaswa",
  close: "Vala",
  clear: "Qala kabusha",
  inputPlaceholder: "Buza ngemisebenzi, ukufunda noma uxhaso…",
  send: "Thumela",
  greeting:
    "Ngingakusiza uthole imisebenzi, iziqu, amakolishi nemifundaze — futhi ngingakuvulela khona. Udingani?",
  voiceHint:
    "Bambela imakrofoni, cindezele ugcine inkinobho yokwehlisa umsindo, noma unyakazise ifoni ukuze ukhulume.",
  thinking: "Ngicabanga…",
  working: "Ngiyakwenza…",
  listening: "Ngilalele… yeka ukuze uthumele",
  transcribing: "Ngikuzwile — ngiyahlola ohlelweni…",
  holdToTalk: "Bambela ukuze ukhulume",
  stopSpeaking: "Yeka ukukhuluma",
  voiceMessage: "Umyalezo wezwi",
  you: "Wena",
  assistant: "Khetha",
  offline: "Awuxhumekile ku-inthanethi",
  offlineHint:
    "Ngisengakhona ukuhamba kuhlelo. Zama “vula imifundaze” noma “funda lesi sikrini”.",
  micDenied:
    "Ngidinga imvume yemakrofoni ukuze ngilalele. Yivule kuzilungiselelo zefoni yakho.",
  micFailed: "Imakrofoni ayisebenzanga. Zama ukuthayipha esikhundleni salokho.",
  noSpeech: "Angizwanga lutho. Bambela inkinobho isikhathi eside bese uzama futhi.",
  voiceNotAvailable: (language) =>
    `Izimpendulo ezikhulunywayo zesi-${language} azitholakali okwamanje, ngakho ngizobonisa izimpendulo zami njengombhalo.`,
  confirmTitle: "Ushiya uhlelo?",
  confirmBody: (what) => `Ufuna ngi${what}?`,
  confirmYes: "Yebo, qhubeka",
  confirmNo: "Cha, hlala lapha",
  openedScreen: (name) => `Ngivule i-${name}.`,
  opened: (title) => `Ngivule i-${title}.`,
  wentBack: "Ngibuyele emuva.",
  searched: (query) => `Ngicinge i-${query}.`,
  filtered: (name, value) => `Ngisethe i-${name} ku-${value}.`,
  cleared: "Ngisuse ukucinga nezihlungi.",
  saved: (title) => `Ngilondoloze i-${title}.`,
  unsaved: (title) => `Ngisuse i-${title} kokulondoloziwe.`,
  languageSet: (language) => `Ngishintshele ku-${language}.`,
  contrastOn: "Umehluko omkhulu uvulekile.",
  contrastOff: "Umehluko omkhulu uvalekile.",
  textSizeSet: "Usayizi wombhalo ushintshile.",
  needSignIn: "Ngena kuqala ukuze ngikwazi ukukulondolozela izinto.",
  notFound: "Angikutholanga lokho kuhlelo.",
  a11yOpen: "Vula umsizi kaKhetha",
  a11yClose: "Vala umsizi kaKhetha",
  a11yMic: "Bambela ukuze ukhulume nomsizi kaKhetha",
  a11yTranscript: "Ingxoxo nomsizi kaKhetha",
};

const xh: AssistantStrings = {
  launcher: "Buza uKhetha",
  title: "Umncedisi kaKhetha",
  subtitle: "Imisebenzi, izifundo nenkxaso-mali",
  close: "Vala",
  clear: "Qala kwakhona",
  inputPlaceholder: "Buza ngemisebenzi, izifundo okanye inkxaso-mali…",
  send: "Thumela",
  greeting:
    "Ndingakunceda ufumane imisebenzi, iziqinisekiso, iikholeji kunye neebhasari — kwaye ndingakuvulela. Ufuna ntoni?",
  voiceHint:
    "Bamba imakrofoni, cofa ubambe iqhosha lokuthoba isandi, okanye shukumisa ifowuni yakho ukuze uthethe.",
  thinking: "Ndicinga…",
  working: "Ndiyayenza…",
  listening: "Ndimamele… yeka ukuze uthumele",
  transcribing: "Ndikuvile — ndijonga kusetyenziswa…",
  holdToTalk: "Bamba ukuze uthethe",
  stopSpeaking: "Yeka ukuthetha",
  voiceMessage: "Umyalezo welizwi",
  you: "Wena",
  assistant: "Khetha",
  offline: "Awunxibelelananga",
  offlineHint:
    "Ndisenako ukuhamba kwisicelo. Zama “vula iibhasari” okanye “funda esi sikrini”.",
  micDenied:
    "Ndifuna imvume yemakrofoni ukuze ndimamele. Yivule kwiisetingi zefowuni yakho.",
  micFailed: "Imakrofoni ayisebenzanga. Zama ukuchwetheza endaweni yoko.",
  noSpeech: "Andivanga nto. Bamba iqhosha ixesha elide uze uzame kwakhona.",
  voiceNotAvailable: (language) =>
    `Iimpendulo ezithethwayo zesi-${language} azifumaneki ngoku, ngoko ndiza kubonisa iimpendulo zam njengombhalo.`,
  confirmTitle: "Ushiya usetyenziso?",
  confirmBody: (what) => `Ufuna ndi${what}?`,
  confirmYes: "Ewe, qhubeka",
  confirmNo: "Hayi, hlala apha",
  openedScreen: (name) => `Ndivule i-${name}.`,
  opened: (title) => `Ndivule i-${title}.`,
  wentBack: "Ndibuyele umva.",
  searched: (query) => `Ndikhangele i-${query}.`,
  filtered: (name, value) => `Ndibeke i-${name} ku-${value}.`,
  cleared: "Ndisuse ukhangelo neesihluzi.",
  saved: (title) => `Ndigcine i-${title}.`,
  unsaved: (title) => `Ndisuse i-${title} kwizinto ezigciniweyo.`,
  languageSet: (language) => `Nditshintshele ku-${language}.`,
  contrastOn: "Umahluko omkhulu uvulwe.",
  contrastOff: "Umahluko omkhulu uvalwe.",
  textSizeSet: "Ubungakanani bombhalo butshintshile.",
  needSignIn: "Ngena kuqala ukuze ndikwazi ukugcina izinto.",
  notFound: "Andikufumene oko kusetyenziso.",
  a11yOpen: "Vula umncedisi kaKhetha",
  a11yClose: "Vala umncedisi kaKhetha",
  a11yMic: "Bamba ukuze uthethe nomncedisi kaKhetha",
  a11yTranscript: "Incoko nomncedisi kaKhetha",
};

const nso: AssistantStrings = {
  launcher: "Botšiša Khetha",
  title: "Mothuši wa Khetha",
  subtitle: "Mešomo, dithuto le thušo ya tšhelete",
  close: "Tswalela",
  clear: "Thoma gape",
  inputPlaceholder: "Botšiša ka mešomo, dithuto goba thušo ya tšhelete…",
  send: "Romela",
  greeting:
    "Nka go thuša go hwetša mešomo, mangwalo a thuto, dikholetše le dithušo tša thuto — gomme nka go bulela. O nyaka eng?",
  voiceHint:
    "Swara maekrofouno, gatelela wa theoša modumo, goba šišinya mogala wa gago gore o bolele.",
  thinking: "Ke nagana…",
  working: "Ke e dira…",
  listening: "Ke theeleditše… lokolla gore o romele",
  transcribing: "Ke kwele — ke lekola ka gare ga sedirišwa…",
  holdToTalk: "Swara gore o bolele",
  stopSpeaking: "Emiša go bolela",
  voiceMessage: "Molaetša wa lentšu",
  you: "Wena",
  assistant: "Khetha",
  offline: "Ga o kgokagane",
  offlineHint:
    "Ke sa kgona go sepela ka gare ga sedirišwa. Leka “bula dithušo tša thuto” goba “bala sekirini se”.",
  micDenied:
    "Ke nyaka tumelelo ya maekrofouno gore ke theeletše. E bulele ka dipeakanyong tša mogala wa gago.",
  micFailed: "Maekrofouno ga a šome. Leka go tlanya go e emela.",
  noSpeech: "Ga ke kwe selo. Swara konopo nako ye telele gomme o leke gape.",
  voiceNotAvailable: (language) =>
    `Dikarabo tša ${language} tše di bolelwago ga di hwetšagale gabjale, ka gona ke tla bontšha dikarabo tša ka bjalo ka sengwalwa.`,
  confirmTitle: "Tlogela sedirišwa?",
  confirmBody: (what) => `O nyaka gore ke ${what}?`,
  confirmYes: "Ee, tšwela pele",
  confirmNo: "Aowa, dula mo",
  openedScreen: (name) => `Ke bule ${name}.`,
  opened: (title) => `Ke bule ${title}.`,
  wentBack: "Ke boetše morago.",
  searched: (query) => `Ke nyakile ${query}.`,
  filtered: (name, value) => `Ke beile ${name} go ${value}.`,
  cleared: "Ke hlwekišitše nyako le dihlagola.",
  saved: (title) => `Ke bolokile ${title}.`,
  unsaved: (title) => `Ke tlošitše ${title} go dilo tše bolokilwego.`,
  languageSet: (language) => `Ke fetogetše go ${language}.`,
  contrastOn: "Phapano ye kgolo e bulegile.",
  contrastOff: "Phapano ye kgolo e tswaletšwe.",
  textSizeSet: "Bogolo bja sengwalwa bo fetogile.",
  needSignIn: "Tsena pele gore ke kgone go go bolokela dilo.",
  notFound: "Ga ke e hwetše ka gare ga sedirišwa.",
  a11yOpen: "Bula mothuši wa Khetha",
  a11yClose: "Tswalela mothuši wa Khetha",
  a11yMic: "Swara gore o bolele le mothuši wa Khetha",
  a11yTranscript: "Poledišano le mothuši wa Khetha",
};

const ve: AssistantStrings = {
  launcher: "Vhudzisa Khetha",
  title: "Muthusi wa Khetha",
  subtitle: "Mishumo, pfunzo na thikhedzo ya tshelede",
  close: "Vala",
  clear: "Thoma hafhu",
  inputPlaceholder: "Vhudzisa nga mishumo, pfunzo kana thikhedzo ya tshelede…",
  send: "Rumela",
  greeting:
    "Ndi nga ni thusa u wana mishumo, zwiitisi zwa pfunzo, dzikholedzhi na dzibursary — nahone ndi nga ni vulela. Ni khou toda mini?",
  voiceHint:
    "Farani maikirofoni, tsikelelani khou tsa mubvumo, kana ningisani luṱingo lwaṋu uri ni ambe.",
  thinking: "Ndi khou humbula…",
  working: "Ndi khou i ita…",
  listening: "Ndi khou thetshelesa… litshani uri ni rumele",
  transcribing: "Ndo pfa — ndi khou lavhelesa kha aputshikhesheni…",
  holdToTalk: "Farani uri ni ambe",
  stopSpeaking: "Imani u amba",
  voiceMessage: "Mulaedza wa ipfi",
  you: "Inwi",
  assistant: "Khetha",
  offline: "A ni ṱanganeli",
  offlineHint:
    "Ndi kha ḓi kona u tshimbila kha aputshikhesheni. Lingedzani “vulani dzibursary” kana “vhalani sikirini heḽi”.",
  micDenied:
    "Ndi ṱoḓa thendelo ya maikirofoni uri ndi thetshelese. I vulele kha zwidzudzanyo zwa luṱingo lwaṋu.",
  micFailed: "Maikirofoni a songo shuma. Lingedzani u ṱhaipa.",
  noSpeech: "A tho ngo pfa tshithu. Farani bathini lwa tshifhinga tshilapfu ni lingedze hafhu.",
  voiceNotAvailable: (language) =>
    `Phindulo dza ${language} dzi ambiwaho a dzi wanali zwino, ngauralo ndi ḓo sumbedza phindulo dzanga sa maṅwalwa.`,
  confirmTitle: "Ni ṱutshela aputshikhesheni?",
  confirmBody: (what) => `Ni ṱoḓa uri ndi ${what}?`,
  confirmYes: "Ee, bvelani phanḓa",
  confirmNo: "Hai, dzulani hafha",
  openedScreen: (name) => `Ndo vula ${name}.`,
  opened: (title) => `Ndo vula ${title}.`,
  wentBack: "Ndo humela murahu.",
  searched: (query) => `Ndo ṱoḓa ${query}.`,
  filtered: (name, value) => `Ndo vhea ${name} kha ${value}.`,
  cleared: "Ndo bvisa ṱhoḓo na zwikhethi.",
  saved: (title) => `Ndo vhulunga ${title}.`,
  unsaved: (title) => `Ndo bvisa ${title} kha zwo vhulungwaho.`,
  languageSet: (language) => `Ndo shandukela kha ${language}.`,
  contrastOn: "Phambano khulu yo vulwa.",
  contrastOff: "Phambano khulu yo valwa.",
  textSizeSet: "Saizi ya maṅwalwa yo shanduka.",
  needSignIn: "Dzheneni u thoma uri ndi kone u ni vhulungela zwithu.",
  notFound: "A tho ngo zwi wana kha aputshikhesheni.",
  a11yOpen: "Vulani muthusi wa Khetha",
  a11yClose: "Valani muthusi wa Khetha",
  a11yMic: "Farani uri ni ambe na muthusi wa Khetha",
  a11yTranscript: "Nyambedzano na muthusi wa Khetha",
};

const ts: AssistantStrings = {
  launcher: "Vutisa Khetha",
  title: "Mupfuni wa Khetha",
  subtitle: "Mintirho, dyondzo na mpfuno wa mali",
  close: "Pfala",
  clear: "Sungula nakambe",
  inputPlaceholder: "Vutisa hi mintirho, dyondzo kumbe mpfuno wa mali…",
  send: "Rhumela",
  greeting:
    "Ndzi nga ku pfuna ku kuma mintirho, swikombiso swa dyondzo, tikholichi na tibursary — naswona ndzi nga ku pfulela. U lava yini?",
  voiceHint:
    "Khoma maykirofoni, tshikilela u hunguta mpfumawulo, kumbe ninginisa riqingho ra wena ku vulavula.",
  thinking: "Ndzi ehleketa…",
  working: "Ndzi yi endla…",
  listening: "Ndzi yingisela… tshika ku rhumela",
  transcribing: "Ndzi twile — ndzi kambela eka app…",
  holdToTalk: "Khoma ku vulavula",
  stopSpeaking: "Tshika ku vulavula",
  voiceMessage: "Rungula ra rito",
  you: "Wena",
  assistant: "Khetha",
  offline: "A wu hlanganisiwi",
  offlineHint:
    "Ndzi kotile ku famba eka app. Ringeta “pfula tibursary” kumbe “hlaya xikirini lexi”.",
  micDenied:
    "Ndzi lava mpfumelelo wa maykirofoni ku yingisela. Yi pfule eka switirhisiwa swa riqingho ra wena.",
  micFailed: "Maykirofoni a wu tirhi. Ringeta ku thayipa.",
  noSpeech: "A ndzi twanga nchumu. Khoma butoni ku ringana nkarhi wo leha kutani u ringeta nakambe.",
  voiceNotAvailable: (language) =>
    `Tinhlamulo ta ${language} leti vulavuriwaka a ti kumeki sweswi, hikwalaho ndzi ta kombisa tinhlamulo ta mina tanihi matsalwa.`,
  confirmTitle: "U suka eka app?",
  confirmBody: (what) => `U lava leswaku ndzi ${what}?`,
  confirmYes: "Ina, ya emahlweni",
  confirmNo: "E-e, tshama laha",
  openedScreen: (name) => `Ndzi pfule ${name}.`,
  opened: (title) => `Ndzi pfule ${title}.`,
  wentBack: "Ndzi tlhelele endzhaku.",
  searched: (query) => `Ndzi lavile ${query}.`,
  filtered: (name, value) => `Ndzi vekile ${name} eka ${value}.`,
  cleared: "Ndzi susile ku lavisisa na swihluvi.",
  saved: (title) => `Ndzi hlayisile ${title}.`,
  unsaved: (title) => `Ndzi susile ${title} eka leswi hlayisiweke.`,
  languageSet: (language) => `Ndzi cincele eka ${language}.`,
  contrastOn: "Ku hambana lekukulu ku pfuliwile.",
  contrastOff: "Ku hambana lekukulu ku pfariwile.",
  textSizeSet: "Saizi ya matsalwa yi cincile.",
  needSignIn: "Nghena ku sungula leswaku ndzi kota ku ku hlayisela swilo.",
  notFound: "A ndzi swi kumangi eka app.",
  a11yOpen: "Pfula mupfuni wa Khetha",
  a11yClose: "Pfala mupfuni wa Khetha",
  a11yMic: "Khoma ku vulavula na mupfuni wa Khetha",
  a11yTranscript: "Mbulavurisano na mupfuni wa Khetha",
};

const ASSISTANT_I18N = expandSaLocales<AssistantStrings>({
  en,
  af,
  zu,
  xh,
  nso,
  ve,
  ts,
});

export function getAssistantStrings(
  locale: string | null | undefined,
): AssistantStrings {
  return ASSISTANT_I18N[resolveLocale(locale)];
}
