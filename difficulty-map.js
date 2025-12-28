// difficulty-map.js
// Edit/extend this file later to tune country difficulty factors.

(function () {
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // Weighting for final difficulty (0..1 before mapping to 1..5)
  const WEIGHTS = {
    familiarity: 0.40,
    geo: 0.30,
    region: 0.20,
    name: 0.10
  };

  // Familiarity buckets (0 easy .. 1 hard)
  const FAMILIARITY_BUCKETS = {
    very_familiar: 0.05,
    familiar: 0.18,
    medium: 0.45,
    uncommon: 0.70,
    rare: 0.90
  };

  const VERY_FAMILIAR = [
    "United States of America", "Canada", "Mexico",
    "Brazil", "Argentina", "Chile", "Colombia", "Peru",
    "United Kingdom", "Ireland", "France", "Spain", "Portugal", "Italy",
    "Germany", "Netherlands", "Belgium", "Switzerland", "Austria", "Poland",
    "Norway", "Sweden", "Finland", "Denmark",
    "Russia", "Ukraine", "Turkey", "Greece",
    "China", "India", "Japan", "South Korea", "Indonesia",
    "Australia", "New Zealand",
    "Saudi Arabia", "Iran", "Iraq", "Israel", "Egypt",
    "South Africa", "Nigeria", "Kenya", "Ethiopia", "Morocco", "Algeria", "Tunisia"
  ];

  const FAMILIAR = [
    "Romania", "Bulgaria", "Hungary", "Czechia", "Slovakia", "Croatia", "Serbia",
    "Slovenia", "Bosnia and Herzegovina", "Albania", "North Macedonia",
    "Lithuania", "Latvia", "Estonia",
    "Belarus", "Moldova",
    "Georgia", "Armenia", "Azerbaijan",
    "United Arab Emirates", "Qatar", "Kuwait", "Jordan", "Lebanon", "Syria",
    "Pakistan", "Bangladesh", "Sri Lanka", "Nepal", "Myanmar", "Thailand", "Vietnam",
    "Philippines", "Malaysia", "Singapore",
    "Venezuela", "Ecuador", "Bolivia", "Uruguay", "Paraguay",
    "Ghana", "Senegal", "Tanzania", "Uganda", "Cameroon", "Ivory Coast"
  ];

  const UNCOMMON = [
    "Montenegro",
    "Luxembourg", "Andorra", "Liechtenstein", "Monaco", "San Marino",
    "Mongolia", "Laos", "Cambodia", "Brunei",
    "Oman", "Yemen", "Bahrain",
    "Botswana", "Namibia", "Zambia", "Zimbabwe", "Mozambique", "Angola",
    "Benin", "Togo", "Burkina Faso", "Niger", "Mali", "Chad",
    "Somalia", "Eritrea", "Djibouti", "Guinea", "Guinea-Bissau", "Gabon",
    "Papua New Guinea", "Fiji", "Solomon Islands", "Vanuatu"
  ];

  const RARE = [
    "Eswatini", "Lesotho",
    "Cabo Verde", "Sao Tome and Principe", "Comoros", "Seychelles", "Mauritius",
    "Gambia", "Equatorial Guinea",
    "Central African Republic", "South Sudan",
    "Timor-Leste", "Bhutan", "Maldives",
    "Nauru", "Tuvalu"
  ];

  // Confusable names (used for name ambiguity heuristics)
  const CONFUSABLE_NAME_GROUPS = [
    ["Congo", "Democratic Republic of the Congo"],
    ["Niger", "Nigeria"],
    ["Guinea", "Guinea-Bissau", "Equatorial Guinea", "Papua New Guinea"],
    ["Sudan", "South Sudan"],
    ["Austria", "Australia"],
    ["Georgia", "Jordan"]
  ];

  // Manual overrides per country name (optional)
  // Values are 0..1 where 1 means harder.
  const OVERRIDES = {
    "Nauru": { geo: 1.0, familiarity: 1.0 },
    "Tuvalu": { geo: 1.0, familiarity: 1.0 },
    "Monaco": { geo: 1.0 },
    "Singapore": { geo: 0.85 },
    "Gambia": { geo: 0.75, name: 0.75 },
    "Qatar": { geo: 0.65 },
    "Bahrain": { geo: 0.9 },
    "Maldives": { geo: 1.0 },
    "Comoros": { geo: 0.9 },
    "Sao Tome and Principe": { geo: 0.9, familiarity: 0.95 }
  };

  function familiarityScore(name) {
    if (VERY_FAMILIAR.includes(name)) return FAMILIARITY_BUCKETS.very_familiar;
    if (FAMILIAR.includes(name)) return FAMILIARITY_BUCKETS.familiar;
    if (UNCOMMON.includes(name)) return FAMILIARITY_BUCKETS.uncommon;
    if (RARE.includes(name)) return FAMILIARITY_BUCKETS.rare;
    return FAMILIARITY_BUCKETS.medium;
  }

  function nameAmbiguityBoost(name) {
    let boost = 0;
    const lower = (name || "").toLowerCase();

    for (const group of CONFUSABLE_NAME_GROUPS) {
      const found = group.some(x => (x || "").toLowerCase() === lower);
      if (found) boost = Math.max(boost, 0.7);
    }
    if (/\b(north|south|central|democratic|republic)\b/i.test(name)) boost = Math.max(boost, 0.45);
    return clamp(boost, 0, 1);
  }

  window.DIFFICULTY_MAP = { WEIGHTS, OVERRIDES, familiarityScore, nameAmbiguityBoost, clamp };
})();
