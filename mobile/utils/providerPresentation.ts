import type { ImageSourcePropType } from "react-native";

export type ProviderTypeFilterId =
  | "all"
  | "tvet"
  | "uni"
  | "uot"
  | "cos";

export type ProvinceFilterId =
  | "all"
  | "gauteng"
  | "western-cape"
  | "kwazulu-natal"
  | "eastern-cape"
  | "free-state"
  | "limpopo"
  | "mpumalanga"
  | "north-west"
  | "northern-cape";

export type DetectedProviderKind = "tvet" | "uot" | "uni" | "other";

const TYPE_FILTERS: { id: ProviderTypeFilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "tvet", label: "TVET Colleges" },
  { id: "uni", label: "Public Universities" },
  { id: "uot", label: "Universities of Tech (UoT)" },
  { id: "cos", label: "Centres of Specialisation (CoS)" },
];

export const PROVINCE_OPTIONS: {
  id: ProvinceFilterId;
  label: string;
  short: string;
}[] = [
  { id: "all", label: "All 9 Provinces (South Africa)", short: "All Provinces" },
  { id: "gauteng", label: "Gauteng (GP)", short: "Gauteng" },
  { id: "western-cape", label: "Western Cape (WC)", short: "Western Cape" },
  { id: "kwazulu-natal", label: "KwaZulu-Natal (KZN)", short: "KZN" },
  { id: "eastern-cape", label: "Eastern Cape (EC)", short: "Eastern Cape" },
  { id: "free-state", label: "Free State (FS)", short: "Free State" },
  { id: "limpopo", label: "Limpopo (LP)", short: "Limpopo" },
  { id: "mpumalanga", label: "Mpumalanga (MP)", short: "Mpumalanga" },
  { id: "north-west", label: "North West (NW)", short: "North West" },
  { id: "northern-cape", label: "Northern Cape (NC)", short: "Northern Cape" },
];

const PROVINCE_MATCH: { id: ProvinceFilterId; match: RegExp }[] = [
  {
    id: "gauteng",
    match:
      /gauteng|johannesburg|pretoria|ekurhuleni|soweto|tshwane|benoni|springs|brakpan|midrand|sandton|centurion|daveyton|tembisa/i,
  },
  {
    id: "western-cape",
    match:
      /western cape|cape town|stellenbosch|paarl|george|false bay|muizenberg|khayelitsha|bellville|worcester/i,
  },
  {
    id: "kwazulu-natal",
    match: /kwazulu|kzn|durban|pietermaritzburg|umbilo|umhlanga|richards bay|newcastle/i,
  },
  {
    id: "eastern-cape",
    match: /eastern cape|gqeberha|port elizabeth|east london|mthatha|king william/i,
  },
  {
    id: "free-state",
    match: /free state|bloemfontein|welkom|qwaqwa|sasolburg/i,
  },
  {
    id: "limpopo",
    match: /limpopo|polokwane|tzaneen|thohoyandou|turfloop/i,
  },
  {
    id: "mpumalanga",
    match: /mpumalanga|mbombela|nelspuit|emalahleni|witbank|secunda/i,
  },
  {
    id: "north-west",
    match: /north west|mahikeng|potchefstroom|klerksdorp|rustenburg/i,
  },
  {
    id: "northern-cape",
    match: /northern cape|kimberley|upington|kuruman/i,
  },
];

export function providerTypeFilterDefs() {
  return TYPE_FILTERS;
}

export function detectProviderKind(
  name: string,
  address?: string | null,
): DetectedProviderKind {
  const hay = `${name} ${address ?? ""}`;
  if (/university of technology|\buot\b|technik/i.test(hay)) return "uot";
  if (/tvet|fet college|further education/i.test(hay)) return "tvet";
  if (/university|varsity/i.test(hay)) return "uni";
  if (/college/i.test(hay)) return "tvet";
  return "other";
}

export function isCentreOfSpecialisation(name: string): boolean {
  return /centre of specialisation|\bcos\b|specialisation/i.test(name);
}

export function matchesProviderType(
  name: string,
  address: string | null | undefined,
  filter: ProviderTypeFilterId,
): boolean {
  if (filter === "all") return true;
  if (filter === "cos") return isCentreOfSpecialisation(name);
  const kind = detectProviderKind(name, address);
  if (filter === "tvet") return kind === "tvet";
  if (filter === "uot") return kind === "uot";
  if (filter === "uni") return kind === "uni";
  return true;
}

export function detectProvince(
  name: string,
  address?: string | null,
): ProvinceFilterId | "unknown" {
  const hay = `${name} ${address ?? ""}`;
  for (const row of PROVINCE_MATCH) {
    if (row.match.test(hay)) return row.id;
  }
  return "unknown";
}

export function matchesProvince(
  name: string,
  address: string | null | undefined,
  province: ProvinceFilterId,
): boolean {
  if (province === "all") return true;
  const detected = detectProvince(name, address);
  if (detected === "unknown") return true;
  return detected === province;
}

export function providerTypeBadge(name: string, address?: string | null): string {
  const kind = detectProviderKind(name, address);
  if (kind === "uot") return "University of Technology (UoT)";
  if (kind === "uni") return "Public University";
  return "Public TVET College";
}

export function providerSpecialtyBadge(
  name: string,
  address?: string | null,
): string {
  if (isCentreOfSpecialisation(name)) return "Centre of Specialisation";
  if (/false bay|maritime|coastal/i.test(name)) return "Coastal Maritime Centre";
  if (/tshwane university|tut/i.test(name)) return "Multi-Province";
  if (/ekurhuleni|east tvet/i.test(name)) return "Centre of Specialisation";
  const kind = detectProviderKind(name, address);
  if (kind === "uot") return "World-Class";
  if (kind === "uni") return "Research Intensive";
  return "DHET Accredited";
}

export function providerLocationLabel(
  name: string,
  address?: string | null,
): string {
  if (address?.trim()) {
    const short = address.trim().split(",")[0]?.trim();
    if (short) return short;
  }
  const province = detectProvince(name, address);
  const opt = PROVINCE_OPTIONS.find((p) => p.id === province);
  if (opt && province !== "all") return opt.short;
  return "South Africa";
}

export function providerCampusCount(name: string): string {
  if (/tshwane university|tut/i.test(name)) return "60,000+ Enrolled";
  if (/ekurhuleni east/i.test(name)) return "6 Campuses";
  if (/false bay/i.test(name)) return "5 Campuses";
  const kind = detectProviderKind(name);
  if (kind === "tvet") return "Multi-campus";
  if (kind === "uot") return "Multi-campus";
  return "Main campus";
}

export function providerTagline(name: string): string {
  if (/ekurhuleni east/i.test(name)) {
    return "Empowering youth through artisanal training & green technologies";
  }
  if (/false bay/i.test(name)) {
    return "Leader in maritime excellence, renewable power, and vocational trades";
  }
  if (/tshwane university|tut/i.test(name)) {
    return "The people's university empowering technological invention and career paths";
  }
  const kind = detectProviderKind(name);
  if (kind === "tvet") {
    return "Public TVET pathways for artisans, technicians, and workplace-ready graduates";
  }
  if (kind === "uot") {
    return "Career-focused degrees and diplomas with strong industry and WIL links";
  }
  if (kind === "uni") {
    return "Public university offering nationally accredited academic pathways";
  }
  return "Accredited public learning provider on the DHET / SAQA national register";
}

export function providerCampusFootprint(
  name: string,
  address?: string | null,
): string {
  if (/ekurhuleni east/i.test(name)) {
    return "Springs, Kwa-Thema, Brakpan, Benoni, Daveyton, and Sam Nzima Campus.";
  }
  if (/false bay/i.test(name)) {
    return "Westlake, Muizenberg, Fish Hoek, Mitchells Plain, and Khayelitsha.";
  }
  if (/tshwane university|tut/i.test(name)) {
    return "Pretoria (Main), Ga-Rankuwa, Soshanguve, eMalahleni, Polokwane, and Mbombela.";
  }
  if (address?.trim()) return address.trim();
  return "Campuses across the provider's catchment region.";
}

export function providerFocusAreas(name: string): string[] {
  if (/ekurhuleni east/i.test(name)) {
    return [
      "Solar PV Installation",
      "Mechatronics (CoS)",
      "Electrical Heavy Current",
      "Civil Construction",
    ];
  }
  if (/false bay/i.test(name)) {
    return [
      "Maritime Studies",
      "Renewable Energy",
      "Mechanical Fitting (CoS)",
      "Rigging Apprenticeships",
    ];
  }
  if (/tshwane university|tut/i.test(name)) {
    return [
      "ICT & Artificial Intelligence",
      "Engineering Degrees & Diplomas",
      "Health Sciences & Pharmacy",
      "Management Sciences",
    ];
  }
  const kind = detectProviderKind(name);
  if (kind === "tvet") {
    return [
      "Engineering & Trades",
      "Business Studies",
      "Hospitality",
      "Information Technology",
    ];
  }
  if (kind === "uot") {
    return ["Engineering", "ICT", "Health Sciences", "Management"];
  }
  return ["Undergraduate degrees", "Postgraduate study", "Research", "Community engagement"];
}

export function providerFocusIcons(name: string): string[] {
  if (/ekurhuleni east/i.test(name)) {
    return ["solar_power", "precision_manufacturing", "electrical_services", "construction"];
  }
  if (/false bay/i.test(name)) {
    return ["sailing", "eco", "build", "engineering"];
  }
  if (/tshwane university|tut/i.test(name)) {
    return ["memory", "engineering", "medical_services", "account_balance"];
  }
  return ["school", "engineering", "computer", "work"];
}

export function providerAmenities(
  name: string,
): { icon: string; label: string }[] {
  if (/false bay/i.test(name)) {
    return [
      { icon: "stars", label: "DHET Centre of Specialisation" },
      { icon: "eco", label: "PV GreenCard Centre" },
    ];
  }
  if (/tshwane university|tut/i.test(name)) {
    return [
      { icon: "verified", label: "NSFAS Supported" },
      { icon: "work", label: "Work-Integrated Learning (WIL) Hub" },
    ];
  }
  return [
    { icon: "check_circle", label: "NSFAS Bursaries" },
    { icon: "support_agent", label: "Career Guidance Desk" },
    { icon: "accessible", label: "Disability Support Unit" },
  ];
}

export function providerCtaLabel(name: string, address?: string | null): string {
  const kind = detectProviderKind(name, address);
  if (kind === "uni" || kind === "uot") return "View Faculties & Programmes";
  return "View Campuses & Programmes";
}

export function providerAccent(name: string, address?: string | null): string {
  const kind = detectProviderKind(name, address);
  if (kind === "uot" || kind === "uni") return "#1960A3";
  return "#006A4E";
}

export function providerImage(index: number): ImageSourcePropType {
  const images = [
    require("../assets/stitch/providers/img1.jpg"),
    require("../assets/stitch/providers/img2.jpg"),
    require("../assets/stitch/providers/img3.jpg"),
  ];
  return images[index % images.length];
}
