// Bounding boxes: [[swLat, swLon], [neLat, neLon]]
export type RegionBounds = [[number, number], [number, number]]
export type RegionType = 'continent' | 'country' | 'adminArea'

export interface Region {
  id: string
  name: string
  type: RegionType
  parentId: string | null
  bounds: RegionBounds
}

// ─── Query helpers ────────────────────────────────────────────────────────────

export const getContinents = (): Region[] =>
  REGIONS.filter((r) => r.type === 'continent')

export const getCountriesFor = (continentId: string): Region[] =>
  REGIONS.filter((r) => r.type === 'country' && r.parentId === continentId)

export const getAdminAreasFor = (countryId: string): Region[] =>
  REGIONS.filter((r) => r.type === 'adminArea' && r.parentId === countryId)

/** Returns true when lat/lon falls inside bounds. Handles antimeridian crossing. */
export const isEventInRegion = (
  lat: number,
  lon: number,
  bounds: RegionBounds,
): boolean => {
  const [[swLat, swLon], [neLat, neLon]] = bounds
  if (lat < swLat || lat > neLat) return false
  // Antimeridian crossing: swLon > neLon (e.g. Russia spanning 27°E → 180°)
  if (swLon > neLon) return lon >= swLon || lon <= neLon
  return lon >= swLon && lon <= neLon
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const REGIONS: Region[] = [
  // ── Continents ──────────────────────────────────────────────────────────────
  { id: 'north-america', name: 'North America', type: 'continent', parentId: null, bounds: [[7, -168], [84, -52]] },
  { id: 'south-america', name: 'South America', type: 'continent', parentId: null, bounds: [[-56, -82], [13, -34]] },
  { id: 'europe',        name: 'Europe',        type: 'continent', parentId: null, bounds: [[35, -25], [72, 45]] },
  { id: 'africa',        name: 'Africa',        type: 'continent', parentId: null, bounds: [[-35, -18], [38, 52]] },
  { id: 'asia',          name: 'Asia',          type: 'continent', parentId: null, bounds: [[1, 25], [78, 180]] },
  { id: 'oceania',       name: 'Oceania',       type: 'continent', parentId: null, bounds: [[-50, 110], [0, 180]] },
  { id: 'antarctica',    name: 'Antarctica',    type: 'continent', parentId: null, bounds: [[-90, -180], [-60, 180]] },

  // ── North America — Countries ────────────────────────────────────────────────
  { id: 'usa',                name: 'United States',      type: 'country', parentId: 'north-america', bounds: [[18, -180], [72, -66]] },
  { id: 'canada',             name: 'Canada',             type: 'country', parentId: 'north-america', bounds: [[42, -141], [84, -52]] },
  { id: 'mexico',             name: 'Mexico',             type: 'country', parentId: 'north-america', bounds: [[14, -118], [33, -87]] },
  { id: 'guatemala',          name: 'Guatemala',          type: 'country', parentId: 'north-america', bounds: [[13, -92], [18, -88]] },
  { id: 'belize',             name: 'Belize',             type: 'country', parentId: 'north-america', bounds: [[15, -89], [18, -87]] },
  { id: 'honduras',           name: 'Honduras',           type: 'country', parentId: 'north-america', bounds: [[13, -90], [16, -83]] },
  { id: 'el-salvador',        name: 'El Salvador',        type: 'country', parentId: 'north-america', bounds: [[13, -90], [14, -87]] },
  { id: 'nicaragua',          name: 'Nicaragua',          type: 'country', parentId: 'north-america', bounds: [[11, -88], [15, -83]] },
  { id: 'costa-rica',         name: 'Costa Rica',         type: 'country', parentId: 'north-america', bounds: [[8, -86], [11, -82]] },
  { id: 'panama',             name: 'Panama',             type: 'country', parentId: 'north-america', bounds: [[7, -83], [10, -77]] },
  { id: 'cuba',               name: 'Cuba',               type: 'country', parentId: 'north-america', bounds: [[19, -85], [23, -74]] },
  { id: 'jamaica',            name: 'Jamaica',            type: 'country', parentId: 'north-america', bounds: [[17, -78], [19, -76]] },
  { id: 'haiti',              name: 'Haiti',              type: 'country', parentId: 'north-america', bounds: [[18, -74], [20, -72]] },
  { id: 'dominican-republic', name: 'Dominican Republic', type: 'country', parentId: 'north-america', bounds: [[18, -72], [20, -68]] },
  { id: 'puerto-rico',        name: 'Puerto Rico',        type: 'country', parentId: 'north-america', bounds: [[17, -67], [19, -65]] },
  { id: 'trinidad-tobago',    name: 'Trinidad & Tobago',  type: 'country', parentId: 'north-america', bounds: [[10, -62], [11, -60]] },

  // ── South America — Countries ────────────────────────────────────────────────
  { id: 'brazil',    name: 'Brazil',    type: 'country', parentId: 'south-america', bounds: [[-34, -74], [6, -34]] },
  { id: 'argentina', name: 'Argentina', type: 'country', parentId: 'south-america', bounds: [[-55, -74], [-21, -53]] },
  { id: 'chile',     name: 'Chile',     type: 'country', parentId: 'south-america', bounds: [[-56, -76], [-17, -66]] },
  { id: 'colombia',  name: 'Colombia',  type: 'country', parentId: 'south-america', bounds: [[-4, -79], [13, -67]] },
  { id: 'peru',      name: 'Peru',      type: 'country', parentId: 'south-america', bounds: [[-18, -81], [1, -68]] },
  { id: 'venezuela', name: 'Venezuela', type: 'country', parentId: 'south-america', bounds: [[1, -73], [12, -60]] },
  { id: 'ecuador',   name: 'Ecuador',   type: 'country', parentId: 'south-america', bounds: [[-5, -81], [2, -75]] },
  { id: 'bolivia',   name: 'Bolivia',   type: 'country', parentId: 'south-america', bounds: [[-23, -70], [-9, -57]] },
  { id: 'paraguay',  name: 'Paraguay',  type: 'country', parentId: 'south-america', bounds: [[-28, -62], [-19, -54]] },
  { id: 'uruguay',   name: 'Uruguay',   type: 'country', parentId: 'south-america', bounds: [[-35, -59], [-30, -53]] },

  // ── Europe — Countries ───────────────────────────────────────────────────────
  { id: 'uk',          name: 'United Kingdom', type: 'country', parentId: 'europe', bounds: [[49, -9],  [61, 2]] },
  { id: 'france',      name: 'France',         type: 'country', parentId: 'europe', bounds: [[42, -5],  [51, 10]] },
  { id: 'germany',     name: 'Germany',        type: 'country', parentId: 'europe', bounds: [[47, 6],   [55, 15]] },
  { id: 'italy',       name: 'Italy',          type: 'country', parentId: 'europe', bounds: [[36, 6],   [47, 19]] },
  { id: 'spain',       name: 'Spain',          type: 'country', parentId: 'europe', bounds: [[36, -9],  [44, 5]] },
  { id: 'portugal',    name: 'Portugal',       type: 'country', parentId: 'europe', bounds: [[37, -9],  [42, -6]] },
  { id: 'netherlands', name: 'Netherlands',    type: 'country', parentId: 'europe', bounds: [[50, 3],   [54, 8]] },
  { id: 'belgium',     name: 'Belgium',        type: 'country', parentId: 'europe', bounds: [[49, 3],   [52, 7]] },
  { id: 'switzerland', name: 'Switzerland',    type: 'country', parentId: 'europe', bounds: [[45, 6],   [48, 11]] },
  { id: 'austria',     name: 'Austria',        type: 'country', parentId: 'europe', bounds: [[46, 9],   [49, 18]] },
  { id: 'norway',      name: 'Norway',         type: 'country', parentId: 'europe', bounds: [[57, 4],   [71, 32]] },
  { id: 'sweden',      name: 'Sweden',         type: 'country', parentId: 'europe', bounds: [[55, 11],  [69, 25]] },
  { id: 'denmark',     name: 'Denmark',        type: 'country', parentId: 'europe', bounds: [[54, 8],   [58, 15]] },
  { id: 'finland',     name: 'Finland',        type: 'country', parentId: 'europe', bounds: [[60, 20],  [70, 32]] },
  { id: 'poland',      name: 'Poland',         type: 'country', parentId: 'europe', bounds: [[49, 14],  [55, 25]] },
  { id: 'greece',      name: 'Greece',         type: 'country', parentId: 'europe', bounds: [[35, 20],  [42, 28]] },
  { id: 'turkey',      name: 'Turkey',         type: 'country', parentId: 'europe', bounds: [[36, 26],  [42, 45]] },
  { id: 'ukraine',     name: 'Ukraine',        type: 'country', parentId: 'europe', bounds: [[44, 22],  [53, 40]] },
  { id: 'romania',     name: 'Romania',        type: 'country', parentId: 'europe', bounds: [[43, 22],  [48, 30]] },
  { id: 'russia',      name: 'Russia',         type: 'country', parentId: 'europe', bounds: [[41, 27],  [82, 180]] },
  { id: 'iceland',     name: 'Iceland',        type: 'country', parentId: 'europe', bounds: [[63, -25], [67, -12]] },

  // ── Africa — Countries ───────────────────────────────────────────────────────
  { id: 'south-africa', name: 'South Africa', type: 'country', parentId: 'africa', bounds: [[-35, 17], [-22, 33]] },
  { id: 'nigeria',      name: 'Nigeria',      type: 'country', parentId: 'africa', bounds: [[4, 3],    [14, 15]] },
  { id: 'egypt',        name: 'Egypt',        type: 'country', parentId: 'africa', bounds: [[22, 25],  [32, 37]] },
  { id: 'ethiopia',     name: 'Ethiopia',     type: 'country', parentId: 'africa', bounds: [[3, 33],   [15, 48]] },
  { id: 'kenya',        name: 'Kenya',        type: 'country', parentId: 'africa', bounds: [[-5, 34],  [5, 42]] },
  { id: 'morocco',      name: 'Morocco',      type: 'country', parentId: 'africa', bounds: [[27, -13], [36, 1]] },
  { id: 'ghana',        name: 'Ghana',        type: 'country', parentId: 'africa', bounds: [[4, -4],   [11, 2]] },
  { id: 'tanzania',     name: 'Tanzania',     type: 'country', parentId: 'africa', bounds: [[-11, 30], [0, 41]] },
  { id: 'algeria',      name: 'Algeria',      type: 'country', parentId: 'africa', bounds: [[19, -9],  [38, 9]] },
  { id: 'cameroon',     name: 'Cameroon',     type: 'country', parentId: 'africa', bounds: [[2, 9],    [13, 17]] },
  { id: 'dr-congo',     name: 'DR Congo',     type: 'country', parentId: 'africa', bounds: [[-14, 12], [6, 32]] },
  { id: 'mozambique',   name: 'Mozambique',   type: 'country', parentId: 'africa', bounds: [[-27, 32], [-10, 41]] },

  // ── Asia — Countries ─────────────────────────────────────────────────────────
  { id: 'china',        name: 'China',         type: 'country', parentId: 'asia', bounds: [[18, 73],  [54, 135]] },
  { id: 'japan',        name: 'Japan',         type: 'country', parentId: 'asia', bounds: [[24, 123], [46, 146]] },
  { id: 'south-korea',  name: 'South Korea',   type: 'country', parentId: 'asia', bounds: [[33, 126], [39, 130]] },
  { id: 'india',        name: 'India',         type: 'country', parentId: 'asia', bounds: [[6, 68],   [36, 98]] },
  { id: 'indonesia',    name: 'Indonesia',     type: 'country', parentId: 'asia', bounds: [[-11, 96], [6, 141]] },
  { id: 'philippines',  name: 'Philippines',   type: 'country', parentId: 'asia', bounds: [[5, 117],  [21, 127]] },
  { id: 'vietnam',      name: 'Vietnam',       type: 'country', parentId: 'asia', bounds: [[8, 103],  [24, 110]] },
  { id: 'thailand',     name: 'Thailand',      type: 'country', parentId: 'asia', bounds: [[5, 98],   [21, 106]] },
  { id: 'pakistan',     name: 'Pakistan',      type: 'country', parentId: 'asia', bounds: [[23, 61],  [37, 78]] },
  { id: 'iran',         name: 'Iran',          type: 'country', parentId: 'asia', bounds: [[25, 44],  [40, 64]] },
  { id: 'saudi-arabia', name: 'Saudi Arabia',  type: 'country', parentId: 'asia', bounds: [[16, 36],  [32, 56]] },
  { id: 'iraq',         name: 'Iraq',          type: 'country', parentId: 'asia', bounds: [[29, 39],  [38, 49]] },
  { id: 'israel',       name: 'Israel',        type: 'country', parentId: 'asia', bounds: [[29, 34],  [34, 36]] },
  { id: 'nepal',        name: 'Nepal',         type: 'country', parentId: 'asia', bounds: [[26, 80],  [31, 88]] },
  { id: 'myanmar',      name: 'Myanmar',       type: 'country', parentId: 'asia', bounds: [[10, 93],  [29, 101]] },
  { id: 'taiwan',       name: 'Taiwan',        type: 'country', parentId: 'asia', bounds: [[21, 120], [26, 122]] },
  { id: 'kazakhstan',   name: 'Kazakhstan',    type: 'country', parentId: 'asia', bounds: [[41, 51],  [56, 88]] },
  { id: 'afghanistan',  name: 'Afghanistan',   type: 'country', parentId: 'asia', bounds: [[29, 61],  [39, 75]] },
  { id: 'bangladesh',   name: 'Bangladesh',    type: 'country', parentId: 'asia', bounds: [[20, 88],  [27, 93]] },
  { id: 'malaysia',     name: 'Malaysia',      type: 'country', parentId: 'asia', bounds: [[1, 100],  [7, 120]] },

  // ── Oceania — Countries ──────────────────────────────────────────────────────
  { id: 'australia',       name: 'Australia',        type: 'country', parentId: 'oceania', bounds: [[-44, 114], [-10, 154]] },
  { id: 'new-zealand',     name: 'New Zealand',      type: 'country', parentId: 'oceania', bounds: [[-48, 166], [-34, 178]] },
  { id: 'papua-ng',        name: 'Papua New Guinea', type: 'country', parentId: 'oceania', bounds: [[-12, 141], [0, 156]] },
  { id: 'solomon-islands', name: 'Solomon Islands',  type: 'country', parentId: 'oceania', bounds: [[-12, 155], [-5, 164]] },
  { id: 'vanuatu',         name: 'Vanuatu',          type: 'country', parentId: 'oceania', bounds: [[-21, 166], [-13, 171]] },
  { id: 'tonga',           name: 'Tonga',            type: 'country', parentId: 'oceania', bounds: [[-22, -176], [-15, -173]] },
  { id: 'fiji',            name: 'Fiji',             type: 'country', parentId: 'oceania', bounds: [[-22, 177], [-16, -178]] },

  // ── US States (adminArea under 'usa') ────────────────────────────────────────
  { id: 'us-al', name: 'Alabama',        type: 'adminArea', parentId: 'usa', bounds: [[30.14, -88.47], [35.00, -84.89]] },
  { id: 'us-ak', name: 'Alaska',         type: 'adminArea', parentId: 'usa', bounds: [[51.21, -179.14], [71.35, -129.99]] },
  { id: 'us-az', name: 'Arizona',        type: 'adminArea', parentId: 'usa', bounds: [[31.33, -114.82], [37.00, -109.04]] },
  { id: 'us-ar', name: 'Arkansas',       type: 'adminArea', parentId: 'usa', bounds: [[33.00, -94.62], [36.50, -89.64]] },
  { id: 'us-ca', name: 'California',     type: 'adminArea', parentId: 'usa', bounds: [[32.53, -124.41], [42.01, -114.13]] },
  { id: 'us-co', name: 'Colorado',       type: 'adminArea', parentId: 'usa', bounds: [[36.99, -109.06], [41.00, -102.04]] },
  { id: 'us-ct', name: 'Connecticut',    type: 'adminArea', parentId: 'usa', bounds: [[40.95, -73.73], [42.05, -71.79]] },
  { id: 'us-de', name: 'Delaware',       type: 'adminArea', parentId: 'usa', bounds: [[38.45, -75.79], [39.84, -75.05]] },
  { id: 'us-fl', name: 'Florida',        type: 'adminArea', parentId: 'usa', bounds: [[24.52, -87.63], [31.00, -80.03]] },
  { id: 'us-ga', name: 'Georgia',        type: 'adminArea', parentId: 'usa', bounds: [[30.36, -85.61], [35.00, -80.84]] },
  { id: 'us-hi', name: 'Hawaii',         type: 'adminArea', parentId: 'usa', bounds: [[18.91, -160.25], [22.24, -154.81]] },
  { id: 'us-id', name: 'Idaho',          type: 'adminArea', parentId: 'usa', bounds: [[41.99, -117.24], [49.00, -111.04]] },
  { id: 'us-il', name: 'Illinois',       type: 'adminArea', parentId: 'usa', bounds: [[36.97, -91.51], [42.51, -87.02]] },
  { id: 'us-in', name: 'Indiana',        type: 'adminArea', parentId: 'usa', bounds: [[37.77, -88.10], [41.76, -84.79]] },
  { id: 'us-ia', name: 'Iowa',           type: 'adminArea', parentId: 'usa', bounds: [[40.38, -96.64], [43.50, -90.14]] },
  { id: 'us-ks', name: 'Kansas',         type: 'adminArea', parentId: 'usa', bounds: [[36.99, -102.05], [40.00, -94.59]] },
  { id: 'us-ky', name: 'Kentucky',       type: 'adminArea', parentId: 'usa', bounds: [[36.50, -89.57], [39.15, -81.96]] },
  { id: 'us-la', name: 'Louisiana',      type: 'adminArea', parentId: 'usa', bounds: [[28.93, -94.04], [33.02, -88.82]] },
  { id: 'us-me', name: 'Maine',          type: 'adminArea', parentId: 'usa', bounds: [[43.06, -71.08], [47.46, -66.95]] },
  { id: 'us-md', name: 'Maryland',       type: 'adminArea', parentId: 'usa', bounds: [[37.91, -79.49], [39.72, -74.99]] },
  { id: 'us-ma', name: 'Massachusetts',  type: 'adminArea', parentId: 'usa', bounds: [[41.24, -73.50], [42.89, -69.93]] },
  { id: 'us-mi', name: 'Michigan',       type: 'adminArea', parentId: 'usa', bounds: [[41.70, -90.42], [48.19, -82.44]] },
  { id: 'us-mn', name: 'Minnesota',      type: 'adminArea', parentId: 'usa', bounds: [[43.50, -97.24], [49.38, -89.49]] },
  { id: 'us-ms', name: 'Mississippi',    type: 'adminArea', parentId: 'usa', bounds: [[30.18, -91.65], [35.00, -88.10]] },
  { id: 'us-mo', name: 'Missouri',       type: 'adminArea', parentId: 'usa', bounds: [[35.99, -95.77], [40.61, -89.10]] },
  { id: 'us-mt', name: 'Montana',        type: 'adminArea', parentId: 'usa', bounds: [[44.36, -116.05], [49.00, -104.04]] },
  { id: 'us-ne', name: 'Nebraska',       type: 'adminArea', parentId: 'usa', bounds: [[40.00, -104.05], [43.00, -95.31]] },
  { id: 'us-nv', name: 'Nevada',         type: 'adminArea', parentId: 'usa', bounds: [[35.00, -120.00], [42.00, -114.04]] },
  { id: 'us-nh', name: 'New Hampshire',  type: 'adminArea', parentId: 'usa', bounds: [[42.70, -72.56], [45.31, -70.61]] },
  { id: 'us-nj', name: 'New Jersey',     type: 'adminArea', parentId: 'usa', bounds: [[38.93, -75.56], [41.36, -73.89]] },
  { id: 'us-nm', name: 'New Mexico',     type: 'adminArea', parentId: 'usa', bounds: [[31.33, -109.05], [37.00, -103.00]] },
  { id: 'us-ny', name: 'New York',       type: 'adminArea', parentId: 'usa', bounds: [[40.50, -79.76], [45.02, -71.86]] },
  { id: 'us-nc', name: 'North Carolina', type: 'adminArea', parentId: 'usa', bounds: [[33.84, -84.32], [36.59, -75.46]] },
  { id: 'us-nd', name: 'North Dakota',   type: 'adminArea', parentId: 'usa', bounds: [[45.93, -104.05], [49.00, -96.55]] },
  { id: 'us-oh', name: 'Ohio',           type: 'adminArea', parentId: 'usa', bounds: [[38.40, -84.82], [41.98, -80.52]] },
  { id: 'us-ok', name: 'Oklahoma',       type: 'adminArea', parentId: 'usa', bounds: [[33.62, -103.00], [37.00, -94.43]] },
  { id: 'us-or', name: 'Oregon',         type: 'adminArea', parentId: 'usa', bounds: [[41.99, -124.57], [46.24, -116.46]] },
  { id: 'us-pa', name: 'Pennsylvania',   type: 'adminArea', parentId: 'usa', bounds: [[39.72, -80.52], [42.27, -74.69]] },
  { id: 'us-ri', name: 'Rhode Island',   type: 'adminArea', parentId: 'usa', bounds: [[41.15, -71.91], [42.02, -71.12]] },
  { id: 'us-sc', name: 'South Carolina', type: 'adminArea', parentId: 'usa', bounds: [[32.03, -83.35], [35.22, -78.54]] },
  { id: 'us-sd', name: 'South Dakota',   type: 'adminArea', parentId: 'usa', bounds: [[42.48, -104.06], [45.94, -96.44]] },
  { id: 'us-tn', name: 'Tennessee',      type: 'adminArea', parentId: 'usa', bounds: [[34.98, -90.31], [36.68, -81.65]] },
  { id: 'us-tx', name: 'Texas',          type: 'adminArea', parentId: 'usa', bounds: [[25.84, -106.65], [36.50, -93.51]] },
  { id: 'us-ut', name: 'Utah',           type: 'adminArea', parentId: 'usa', bounds: [[36.99, -114.05], [42.00, -109.04]] },
  { id: 'us-vt', name: 'Vermont',        type: 'adminArea', parentId: 'usa', bounds: [[42.73, -73.44], [45.02, -71.46]] },
  { id: 'us-va', name: 'Virginia',       type: 'adminArea', parentId: 'usa', bounds: [[36.54, -83.68], [39.47, -75.17]] },
  { id: 'us-wa', name: 'Washington',     type: 'adminArea', parentId: 'usa', bounds: [[45.54, -124.76], [49.00, -116.92]] },
  { id: 'us-wv', name: 'West Virginia',  type: 'adminArea', parentId: 'usa', bounds: [[37.20, -82.65], [40.64, -77.72]] },
  { id: 'us-wi', name: 'Wisconsin',      type: 'adminArea', parentId: 'usa', bounds: [[42.49, -92.89], [47.08, -86.25]] },
  { id: 'us-wy', name: 'Wyoming',        type: 'adminArea', parentId: 'usa', bounds: [[40.99, -111.06], [45.01, -104.05]] },
]
