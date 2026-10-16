import type { LocalizedText, Product, Variant } from '../types'

/**
 * Edit this file to change products, prices and images.
 * price = selling price (₹), mrp = printed price (₹, shown struck through).
 */

const img = (id: string): string =>
  `https://images.unsplash.com/photo-${id}?w=800&q=70&auto=format&fit=crop`

const IMG = {
  wheat: img('1574323347407-f5e1ad6d020b'),
  field: img('1500382017468-9049fed747ef'),
  farm: img('1574943320219-553eb213f72d'),
  farm2: img('1625246333195-78d9c38ad449'),
  veg: img('1464226184884-fa280b87c399'),
  tomato: img('1592924357228-91a4daadcfea'),
  tomato2: img('1601004890684-d8cbf643f5f2'),
  chilli: img('1583663848850-46af132dc08e'),
  seeds: img('1523348837708-15d4a09cfac2'),
  seeds2: img('1587049352846-4a222e784d38'),
  seedling: img('1416879595882-3373a0480b5b'),
  greens: img('1605000797499-95a51c5269ae'),
  crop: img('1518977676601-b53f82aba655'),
}

const packLabel = (kg: number): LocalizedText =>
  kg < 1
    ? { en: `${kg * 1000} g Packet`, hi: `${kg * 1000} ग्राम पैकेट` }
    : { en: `${kg} kg Packet`, hi: `${kg} किलो पैकेट` }

const boraLabel = (kg: number): LocalizedText => ({
  en: `${kg} kg Bora (sack)`,
  hi: `${kg} किलो बोरा`,
})

/** prices: [250 g, 1 kg, 5 kg, bora] as [price, mrp] pairs */
const variants = (
  id: string,
  boraKg: number,
  p: [[number, number], [number, number], [number, number], [number, number]],
): Variant[] => {
  const kgs = [0.25, 1, 5, boraKg]
  return kgs.map((kg, i) => ({
    id: `${id}-${i === 3 ? `bora${kg}` : `${kg === 0.25 ? '250g' : `${kg}kg`}`}`,
    label: i === 3 ? boraLabel(kg) : packLabel(kg),
    weightKg: kg,
    price: p[i][0],
    mrp: p[i][1],
  }))
}

export const products: Product[] = [
  {
    id: 'wheat',
    category: 'cereals',
    name: { en: 'Wheat Seed HD-2967', hi: 'गेहूं बीज HD-2967' },
    description: {
      en: 'High-yielding, rust-resistant wheat variety suited to timely sowing in the plains. Certified, treated seed.',
      hi: 'अधिक पैदावार देने वाली, रतुआ रोग प्रतिरोधी गेहूं किस्म। समय पर बुवाई के लिए उपयुक्त। प्रमाणित, उपचारित बीज।',
    },
    images: [IMG.wheat, IMG.field, IMG.seeds],
    season: 'rabi',
    badge: { en: 'Best Seller', hi: 'सबसे ज़्यादा बिकने वाला' },
    variants: variants('wheat', 40, [[22, 28], [58, 70], [275, 330], [2150, 2600]]),
    inStock: true,
    sowingInfo: {
      seedRatePerAcre: { en: '40–50 kg per acre', hi: '40–50 किलो प्रति एकड़' },
      duration: { en: '135–145 days', hi: '135–145 दिन' },
    },
  },
  {
    id: 'paddy',
    category: 'cereals',
    name: { en: 'Paddy Seed PB-1509 (Basmati)', hi: 'धान बीज PB-1509 (बासमती)' },
    description: {
      en: 'Early-maturing aromatic basmati paddy with long slender grains. Saves water and fits a wheat rotation.',
      hi: 'जल्दी पकने वाली खुशबूदार बासमती धान, लंबे पतले दाने। पानी की बचत और गेहूं की बुवाई समय पर।',
    },
    images: [IMG.farm2, IMG.field, IMG.seeds2],
    season: 'kharif',
    badge: { en: 'Certified', hi: 'प्रमाणित' },
    variants: variants('paddy', 25, [[28, 35], [72, 90], [340, 420], [1650, 2000]]),
    inStock: true,
    sowingInfo: {
      seedRatePerAcre: { en: '8–10 kg per acre (nursery)', hi: '8–10 किलो प्रति एकड़ (नर्सरी)' },
      duration: { en: '120–125 days', hi: '120–125 दिन' },
    },
  },
  {
    id: 'maize',
    category: 'cereals',
    name: { en: 'Hybrid Maize Seed', hi: 'हाइब्रिड मक्का बीज' },
    description: {
      en: 'Vigorous hybrid maize with strong stalks and bold, full cobs. Performs well in kharif and spring.',
      hi: 'मज़बूत तने और बड़े भुट्टों वाला हाइब्रिड मक्का। खरीफ और बसंत दोनों में अच्छी पैदावार।',
    },
    images: [IMG.farm, IMG.crop, IMG.seeds],
    season: 'kharif',
    variants: variants('maize', 25, [[85, 100], [320, 380], [1550, 1800], [7400, 8500]]),
    inStock: true,
    sowingInfo: {
      seedRatePerAcre: { en: '8 kg per acre', hi: '8 किलो प्रति एकड़' },
      duration: { en: '90–100 days', hi: '90–100 दिन' },
    },
  },
  {
    id: 'mustard',
    category: 'oilseeds',
    name: { en: 'Mustard Seed Pusa Bold', hi: 'सरसों बीज पूसा बोल्ड' },
    description: {
      en: 'Bold-seeded mustard with high oil content and good tolerance to cold. Ideal for rabi sowing.',
      hi: 'मोटे दाने वाली सरसों, तेल की मात्रा अधिक और ठंड सहने की क्षमता अच्छी। रबी बुवाई के लिए उत्तम।',
    },
    images: [IMG.field, IMG.seeds2, IMG.farm],
    season: 'rabi',
    variants: variants('mustard', 25, [[45, 55], [150, 180], [720, 850], [3400, 4000]]),
    inStock: true,
    sowingInfo: {
      seedRatePerAcre: { en: '1.5–2 kg per acre', hi: '1.5–2 किलो प्रति एकड़' },
      duration: { en: '120–140 days', hi: '120–140 दिन' },
    },
  },
  {
    id: 'chana',
    category: 'pulses',
    name: { en: 'Chana (Gram) Seed JG-16', hi: 'चना बीज JG-16' },
    description: {
      en: 'Wilt-tolerant desi chana with bold golden grains. Needs little irrigation and improves soil fertility.',
      hi: 'उकठा रोग सहने वाला देसी चना, सुनहरे मोटे दाने। कम सिंचाई में तैयार, मिट्टी की उर्वरता बढ़ाता है।',
    },
    images: [IMG.seeds, IMG.crop, IMG.field],
    season: 'rabi',
    badge: { en: 'Low water', hi: 'कम पानी' },
    variants: variants('chana', 30, [[35, 45], [110, 135], [520, 620], [3000, 3600]]),
    inStock: true,
    sowingInfo: {
      seedRatePerAcre: { en: '30–35 kg per acre', hi: '30–35 किलो प्रति एकड़' },
      duration: { en: '110–120 days', hi: '110–120 दिन' },
    },
  },
  {
    id: 'arhar',
    category: 'pulses',
    name: { en: 'Arhar (Tur) Seed', hi: 'अरहर बीज' },
    description: {
      en: 'Medium-duration arhar with good pod setting. Works well as an intercrop with maize or sorghum.',
      hi: 'मध्यम अवधि की अरहर, फलियाँ अच्छी लगती हैं। मक्का या ज्वार के साथ अंतर-फसल के लिए उपयुक्त।',
    },
    images: [IMG.seeds2, IMG.farm2, IMG.crop],
    season: 'kharif',
    variants: variants('arhar', 25, [[60, 75], [190, 230], [900, 1080], [4300, 5200]]),
    inStock: true,
    sowingInfo: {
      seedRatePerAcre: { en: '6–8 kg per acre', hi: '6–8 किलो प्रति एकड़' },
      duration: { en: '150–180 days', hi: '150–180 दिन' },
    },
  },
  {
    id: 'moong',
    category: 'pulses',
    name: { en: 'Moong Seed (Summer)', hi: 'मूंग बीज (ग्रीष्मकालीन)' },
    description: {
      en: 'Short-duration moong that fits between wheat and paddy. Yellow-mosaic tolerant.',
      hi: 'कम समय में तैयार होने वाली मूंग, गेहूं और धान के बीच की खाली अवधि के लिए। पीला मोज़ेक सहनशील।',
    },
    images: [IMG.greens, IMG.seeds, IMG.seedling],
    season: 'zaid',
    badge: { en: 'Only 65 days', hi: 'सिर्फ़ 65 दिन' },
    variants: variants('moong', 25, [[65, 80], [210, 250], [1000, 1200], [4800, 5700]]),
    inStock: true,
    sowingInfo: {
      seedRatePerAcre: { en: '8–10 kg per acre', hi: '8–10 किलो प्रति एकड़' },
      duration: { en: '60–65 days', hi: '60–65 दिन' },
    },
  },
  {
    id: 'tomato',
    category: 'vegetables',
    name: { en: 'Tomato Seed (Pusa Ruby)', hi: 'टमाटर बीज (पूसा रूबी)' },
    description: {
      en: 'Firm, deep-red fruits with long shelf life. Heavy bearer, good for local market and mandi.',
      hi: 'ठोस, गहरे लाल फल, लंबे समय तक टिकाऊ। भरपूर फल, स्थानीय बाज़ार और मंडी के लिए बढ़िया।',
    },
    images: [IMG.tomato, IMG.tomato2, IMG.veg],
    season: 'rabi',
    badge: { en: 'High yield', hi: 'ज़्यादा पैदावार' },
    variants: variants('tomato', 25, [[800, 950], [2999, 3499], [14000, 16500], [65000, 76000]]),
    inStock: true,
    sowingInfo: {
      seedRatePerAcre: { en: '100–150 g per acre', hi: '100–150 ग्राम प्रति एकड़' },
      duration: { en: '110–130 days', hi: '110–130 दिन' },
    },
  },
  {
    id: 'chilli',
    category: 'vegetables',
    name: { en: 'Green Chilli Seed (Pusa Jwala)', hi: 'हरी मिर्च बीज (पूसा ज्वाला)' },
    description: {
      en: 'Pungent, slender green chilli with continuous picking over many weeks.',
      hi: 'तीखी, पतली हरी मिर्च, कई हफ़्तों तक लगातार तुड़ाई।',
    },
    images: [IMG.chilli, IMG.veg, IMG.seedling],
    season: 'kharif',
    variants: variants('chilli', 25, [[900, 1050], [3400, 3999], [16000, 18900], [75000, 88000]]),
    inStock: true,
    sowingInfo: {
      seedRatePerAcre: { en: '150–200 g per acre', hi: '150–200 ग्राम प्रति एकड़' },
      duration: { en: '150–180 days', hi: '150–180 दिन' },
    },
  },
  {
    id: 'brinjal',
    category: 'vegetables',
    name: { en: 'Brinjal Seed (Pusa Purple Long)', hi: 'बैंगन बीज (पूसा पर्पल लॉन्ग)' },
    description: {
      en: 'Glossy long purple brinjal, tender with few seeds. Tolerant to fruit and shoot borer.',
      hi: 'चमकदार लंबा बैंगनी बैंगन, कोमल और कम बीज वाला। फल व तना छेदक के प्रति सहनशील।',
    },
    images: [IMG.veg, IMG.greens, IMG.seedling],
    season: 'kharif',
    variants: variants('brinjal', 25, [[1050, 1250], [3900, 4600], [18500, 21500], [88000, 102000]]),
    inStock: true,
    sowingInfo: {
      seedRatePerAcre: { en: '200–250 g per acre', hi: '200–250 ग्राम प्रति एकड़' },
      duration: { en: '120–150 days', hi: '120–150 दिन' },
    },
  },
  {
    id: 'bhindi',
    category: 'vegetables',
    name: { en: 'Bhindi (Okra) Seed', hi: 'भिंडी बीज' },
    description: {
      en: 'Dark green, tender okra, resistant to yellow vein mosaic. Great summer income crop.',
      hi: 'गहरी हरी, कोमल भिंडी, पीली नस मोज़ेक रोग प्रतिरोधी। गर्मी की बढ़िया कमाई वाली फसल।',
    },
    images: [IMG.greens, IMG.veg, IMG.seeds],
    season: 'zaid',
    badge: { en: 'Summer special', hi: 'गर्मी की खास' },
    variants: variants('bhindi', 25, [[190, 230], [680, 800], [3200, 3800], [14500, 17000]]),
    inStock: true,
    sowingInfo: {
      seedRatePerAcre: { en: '4–5 kg per acre', hi: '4–5 किलो प्रति एकड़' },
      duration: { en: '60–70 days to first picking', hi: 'पहली तुड़ाई 60–70 दिन' },
    },
  },
  {
    id: 'cauliflower',
    category: 'vegetables',
    name: { en: 'Cauliflower Seed (Snowball)', hi: 'फूलगोभी बीज (स्नोबॉल)' },
    description: {
      en: 'Compact white curds with good cover leaves. Uniform heads for a better mandi price.',
      hi: 'ठोस सफ़ेद फूल, पत्तियों से ढके हुए। एक जैसे आकार के फूल, मंडी में बेहतर दाम।',
    },
    images: [IMG.veg, IMG.farm, IMG.greens],
    season: 'rabi',
    variants: variants('cauliflower', 25, [[1300, 1550], [4900, 5800], [23500, 27000], [112000, 130000]]),
    inStock: false,
    sowingInfo: {
      seedRatePerAcre: { en: '200–250 g per acre', hi: '200–250 ग्राम प्रति एकड़' },
      duration: { en: '90–110 days', hi: '90–110 दिन' },
    },
  },
]
