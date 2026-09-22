export interface CropImageMatchResult {
  matched: boolean;
  cropKey: string;
  canonicalName: string;
  canonicalNameHi: string;
  category: 'Vegetables' | 'Fruits' | 'Pulses' | 'Grains' | 'Seeds';
  variety: string;
  sideLogo: string;
  photos: string[];
  suggestedPriceRupees?: number;
}

// Curated high-resolution verified photo and logo sets for agricultural commodities
interface CuratedCropPreset {
  cropKey: string;
  canonicalName: string;
  canonicalNameHi: string;
  category: 'Vegetables' | 'Fruits' | 'Pulses' | 'Grains' | 'Seeds';
  variety: string;
  sideLogo: string;
  photos: string[];
  suggestedPriceRupees: number;
  keywords: string[];
}

export const CURATED_CROP_PRESETS: CuratedCropPreset[] = [
  // 1. GREEN PEAS (हरी मटर)
  {
    cropKey: 'peas',
    canonicalName: 'Green Peas (Fresh)',
    canonicalNameHi: 'ताज़ी हरी मटर',
    category: 'Vegetables',
    variety: 'Arkel',
    sideLogo: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592394533824-9440e5d68530?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 55,
    keywords: [
      'green pea',
      'green peas',
      'pea',
      'peas',
      'green peas fresh',
      'green pea fresh',
      'fresh green peas',
      'मटर',
      'हरी मटर',
      'ताज़ी हरी मटर',
      'ताजी हरी मटर',
      'matar',
      'hari matar',
      'arkel',
      'pusa pragati',
      'sweet peas',
    ],
  },

  // 2. ONION (प्याज)
  {
    cropKey: 'onion',
    canonicalName: 'Onion (Nashik Red)',
    canonicalNameHi: 'प्याज (नाशिक लाल)',
    category: 'Vegetables',
    variety: 'Bhima Red',
    sideLogo: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 28,
    keywords: [
      'onion',
      'onions',
      'red onion',
      'white onion',
      'spring onion',
      'shallot',
      'shallots',
      'प्याज',
      'प्याज़',
      'कांदा',
      'kanda',
      'pyaz',
      'pyaaz',
      'dungri',
      'nashik onion',
      'lasalgaon',
    ],
  },

  // 3. POTATO (आलू)
  {
    cropKey: 'potato',
    canonicalName: 'Potato (Jyoti)',
    canonicalNameHi: 'आलू (कुफरी ज्योति)',
    category: 'Vegetables',
    variety: 'Kufri Jyoti',
    sideLogo: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 22,
    keywords: ['potato', 'potatoes', 'आलू', 'कुफरी', 'aloo', 'alu', 'batata', 'kufri', 'chandramukhi', 'chipsona'],
  },

  // 4. TOMATO (टमाटर)
  {
    cropKey: 'tomato',
    canonicalName: 'Tomato (Red Desi)',
    canonicalNameHi: 'टमाटर (लाल देशी)',
    category: 'Vegetables',
    variety: 'Pusa Ruby',
    sideLogo: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 34,
    keywords: ['tomato', 'tomatoes', 'टमाटर', 'tamatar', 'pusa ruby', 'desi tomato', 'hybrid tomato'],
  },

  // 5. FRENCH BEANS (बीन्स / फलियां)
  {
    cropKey: 'beans',
    canonicalName: 'French Beans (Fresh)',
    canonicalNameHi: 'ताज़ी फ्रेंच बीन्स',
    category: 'Vegetables',
    variety: 'Pusa Parvati',
    sideLogo: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 58,
    keywords: ['french bean', 'french beans', 'beans', 'cluster beans', 'guar', 'sem', 'lobia', 'बीन्स', 'फ्रेंच बीन्स', 'ग्वार', 'सेम', 'फलियां', 'cowpea', 'flat beans'],
  },

  // 6. LADYFINGER / OKRA (भिंडी)
  {
    cropKey: 'okra',
    canonicalName: 'Ladyfinger / Okra (Bhindi)',
    canonicalNameHi: 'ताज़ी भिंडी',
    category: 'Vegetables',
    variety: 'Pusa Sawani',
    sideLogo: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 40,
    keywords: ['okra', 'ladyfinger', 'भिंडी', 'bhindi', 'fresh okra', 'lady finger', 'ladyfinger / okra'],
  },

  // 7. BRINJAL / EGGPLANT (बैंगन)
  {
    cropKey: 'brinjal',
    canonicalName: 'Brinjal / Eggplant (Baingan)',
    canonicalNameHi: 'देसी बैंगन',
    category: 'Vegetables',
    variety: 'Pusa Purple',
    sideLogo: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 32,
    keywords: ['brinjal', 'eggplant', 'aubergine', 'बैंगन', 'baingan', 'bataon', 'round purple', 'brinjal (long)'],
  },

  // 8. CABBAGE (पत्तागोभी)
  {
    cropKey: 'cabbage',
    canonicalName: 'Cabbage (Fresh Green)',
    canonicalNameHi: 'हरी पत्तागोभी',
    category: 'Vegetables',
    variety: 'Golden Acre',
    sideLogo: 'https://images.unsplash.com/photo-1611105637996-3c5890835f8d?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1611105637996-3c5890835f8d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 25,
    keywords: ['cabbage', 'पत्तागोभी', 'पत्ता गोभी', 'bandh gobi', 'patta gobhi', 'cabbage (green)', 'cabbage (red)'],
  },

  // 9. CAULIFLOWER (फूलगोभी)
  {
    cropKey: 'cauliflower',
    canonicalName: 'Cauliflower (Snowball)',
    canonicalNameHi: 'फूलगोभी (ताज़ा सफेद)',
    category: 'Vegetables',
    variety: 'Pusa Snowball K-1',
    sideLogo: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 42,
    keywords: ['cauliflower', 'फूलगोभी', 'phool gobi', 'gobi', 'gobhi'],
  },

  // 10. CAPSICUM (शिमला मिर्च)
  {
    cropKey: 'capsicum',
    canonicalName: 'Capsicum (Green Bell Pepper)',
    canonicalNameHi: 'हरी शिमला मिर्च',
    category: 'Vegetables',
    variety: 'California Wonder',
    sideLogo: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 50,
    keywords: ['capsicum', 'bell pepper', 'शिमला मिर्च', 'shimla mirch', 'green capsicum', 'yellow capsicum', 'red capsicum'],
  },

  // 11. SPINACH / PALAK (पालक / मेथी)
  {
    cropKey: 'spinach',
    canonicalName: 'Spinach (Palak Leaves)',
    canonicalNameHi: 'ताज़ी हरी पालक',
    category: 'Vegetables',
    variety: 'All Green',
    sideLogo: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588879460618-9249e7d947d1?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 20,
    keywords: ['spinach', 'पालक', 'palak', 'methi', 'मेथी', 'fenugreek', 'saag', 'spinach (palak)', 'fenugreek leaves'],
  },

  // 12. CORIANDER / MINT (धनिया / पुदीना)
  {
    cropKey: 'coriander',
    canonicalName: 'Coriander / Mint (Dhaniya Leaves)',
    canonicalNameHi: 'ताज़ा हरा धनिया',
    category: 'Vegetables',
    variety: 'Pant Haritima',
    sideLogo: 'https://images.unsplash.com/photo-1588879460618-9249e7d947d1?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1588879460618-9249e7d947d1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 25,
    keywords: ['coriander', 'धनिया', 'dhaniya', 'mint', 'पुदीना', 'pudina', 'kothmir', 'coriander leaves', 'mint leaves'],
  },

  // 13. GOURD / LAUKI (लौकी / तोरई / करेला / कद्दू)
  {
    cropKey: 'gourd',
    canonicalName: 'Bottle Gourd (Lauki)',
    canonicalNameHi: 'ताज़ी हरी लौकी',
    category: 'Vegetables',
    variety: 'Pusa Naveen',
    sideLogo: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 28,
    keywords: [
      'bottle gourd', 'lauki', 'ghia', 'लौकी', 'doodhi', 'karela', 'bitter gourd',
      'करेला', 'torai', 'ridge gourd', 'कद्दू', 'pumpkin', 'sponge gourd', 'snake gourd',
      'pointed gourd', 'parwal', 'ivy gourd', 'kundru', 'ash gourd', 'petha', 'drumstick', 'moringa'
    ],
  },

  // 14. CUCUMBER (खीरा / ककड़ी)
  {
    cropKey: 'cucumber',
    canonicalName: 'Cucumber (Crisp Green)',
    canonicalNameHi: 'ताज़ा खीरा',
    category: 'Vegetables',
    variety: 'Pusa Uday',
    sideLogo: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 30,
    keywords: ['cucumber', 'खीरा', 'kheera', 'kakdi', 'ककड़ी', 'salad cucumber'],
  },

  // 15. CARROT (गाजर)
  {
    cropKey: 'carrot',
    canonicalName: 'Carrot (Red Desi)',
    canonicalNameHi: 'गाजर (लाल देशी)',
    category: 'Vegetables',
    variety: 'Pusa Rudhira',
    sideLogo: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 38,
    keywords: ['carrot', 'carrots', 'गाजर', 'gajar'],
  },

  // 16. RADISH (मूली)
  {
    cropKey: 'radish',
    canonicalName: 'Radish (White Mooli)',
    canonicalNameHi: 'सफेद मूली',
    category: 'Vegetables',
    variety: 'Pusa Chetki',
    sideLogo: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 20,
    keywords: ['radish', 'mooli', 'मूली', 'white radish', 'radish (white mooli)', 'radish (red)'],
  },

  // 17. BEETROOT (चुकंदर)
  {
    cropKey: 'beetroot',
    canonicalName: 'Beetroot (Dark Crimson)',
    canonicalNameHi: 'चुकंदर',
    category: 'Vegetables',
    variety: 'Crimson Globe',
    sideLogo: 'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 35,
    keywords: ['beetroot', 'beet', 'चुकंदर', 'chukandar'],
  },

  // 18. GARLIC (लहसुन)
  {
    cropKey: 'garlic',
    canonicalName: 'Garlic (Ooty Grade A)',
    canonicalNameHi: 'लहसुन (ऊटी विशेष)',
    category: 'Vegetables',
    variety: 'G-282',
    sideLogo: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 140,
    keywords: ['garlic', 'लहसुन', 'लहसून', 'lahsun', 'lasun', 'lehsun', 'garlics'],
  },

  // 19. GINGER (अदरक)
  {
    cropKey: 'ginger',
    canonicalName: 'Ginger (Fresh Organic)',
    canonicalNameHi: 'अदरक (ताज़ा देशी)',
    category: 'Vegetables',
    variety: 'Rio de Janeiro',
    sideLogo: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 85,
    keywords: ['ginger', 'अदरक', 'adrak', 'ale', 'sounth'],
  },

  // 20. CHILLI (मिर्च)
  {
    cropKey: 'chilli',
    canonicalName: 'Green Chilli (Guntur Hot)',
    canonicalNameHi: 'हरी मिर्च (गुंटूर तीखी)',
    category: 'Vegetables',
    variety: 'Guntur Sannam',
    sideLogo: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 65,
    keywords: ['chilli', 'chili', 'मिर्च', 'mirch', 'hari mirch', 'green chilli', 'lal mirch', 'red chilli'],
  },

  // 21. STRAWBERRY (स्ट्रॉबेरी) - ONLY FOR STRAWBERRY!
  {
    cropKey: 'strawberry',
    canonicalName: 'Strawberry (Mahabaleshwar Sweet)',
    canonicalNameHi: 'स्ट्रॉबेरी (महाबलेश्वर)',
    category: 'Fruits',
    variety: 'Sweet Charlie',
    sideLogo: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 160,
    keywords: ['strawberry', 'strawberries', 'स्ट्रॉबेरी', 'mahabaleshwar strawberry'],
  },

  // 22. APPLE (सेब)
  {
    cropKey: 'apple',
    canonicalName: 'Apple (Kinnaur Royal)',
    canonicalNameHi: 'सेब (किन्नौर रॉयल)',
    category: 'Fruits',
    variety: 'Royal Delicious',
    sideLogo: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 120,
    keywords: ['apple', 'apples', 'सेब', 'seb', 'kashmiri apple', 'kinnaur'],
  },

  // 23. MANGO (आम)
  {
    cropKey: 'mango',
    canonicalName: 'Mango (Ratnagiri Alphonso)',
    canonicalNameHi: 'आम (रत्नागिरी हापुस)',
    category: 'Fruits',
    variety: 'Alphonso (Hapus)',
    sideLogo: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 180,
    keywords: ['mango', 'mangoes', 'आम', 'aam', 'alphonso', 'hapus', 'kesar', 'dasheri'],
  },

  // 24. BANANA (केला)
  {
    cropKey: 'banana',
    canonicalName: 'Banana (Jalgaon Grand Naine)',
    canonicalNameHi: 'केला (जलगांव जी-9)',
    category: 'Fruits',
    variety: 'Grand Naine (G-9)',
    sideLogo: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 35,
    keywords: ['banana', 'bananas', 'केला', 'kela', 'jalgaon banana'],
  },

  // 25. GRAPES (अंगूर)
  {
    cropKey: 'grapes',
    canonicalName: 'Grapes (Nashik Seedless)',
    canonicalNameHi: 'अंगूर (नाशिक बेदाना)',
    category: 'Fruits',
    variety: 'Thompson Seedless',
    sideLogo: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 80,
    keywords: ['grapes', 'grape', 'अंगूर', 'angoor', 'black grapes', 'green grapes'],
  },

  // 26. ORANGE (संतरा / मौसम्बी)
  {
    cropKey: 'orange',
    canonicalName: 'Orange (Nagpur Santra)',
    canonicalNameHi: 'संतरा (नागपुरी संतरा)',
    category: 'Fruits',
    variety: 'Nagpur Mandarin',
    sideLogo: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 60,
    keywords: ['orange', 'oranges', 'संतरा', 'santra', 'nagpur orange', 'mosambi', 'kinnow', 'mandarin'],
  },

  // 27. POMEGRANATE (अनार)
  {
    cropKey: 'pomegranate',
    canonicalName: 'Pomegranate (Bhagwa)',
    canonicalNameHi: 'अनार (भगवा)',
    category: 'Fruits',
    variety: 'Bhagwa',
    sideLogo: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 130,
    keywords: ['pomegranate', 'अनार', 'anar', 'bhagwa'],
  },

  // 28. WATERMELON (तरबूज)
  {
    cropKey: 'watermelon',
    canonicalName: 'Watermelon (Sugar Baby)',
    canonicalNameHi: 'तरबूज',
    category: 'Fruits',
    variety: 'Sugar Baby',
    sideLogo: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 22,
    keywords: ['watermelon', 'तरबूज', 'tarbooj', 'kharbooja', 'muskmelon', 'melon'],
  },

  // 29. PAPAYA (पपीता)
  {
    cropKey: 'papaya',
    canonicalName: 'Papaya (Red Lady)',
    canonicalNameHi: 'पपीता',
    category: 'Fruits',
    variety: 'Taiwan Red Lady 786',
    sideLogo: 'https://images.unsplash.com/photo-1617112848923-cc2234396a8d?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1617112848923-cc2234396a8d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 32,
    keywords: ['papaya', 'पपीता', 'papita', 'red lady'],
  },

  // 30. GUAVA (अमरूद)
  {
    cropKey: 'guava',
    canonicalName: 'Guava (Allahabad Safeda)',
    canonicalNameHi: 'अमरूद (सफेदा)',
    category: 'Fruits',
    variety: 'Allahabad Safeda',
    sideLogo: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 45,
    keywords: ['guava', 'अमरूद', 'amrood', 'safeda'],
  },

  // 31. WHEAT (गेहूं)
  {
    cropKey: 'wheat',
    canonicalName: 'Wheat (Sharbati Gold)',
    canonicalNameHi: 'गेहूं (शरबती गोल्ड)',
    category: 'Grains',
    variety: 'Sharbati C-306',
    sideLogo: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 32,
    keywords: ['wheat', 'गेहूं', 'गेहूँ', 'gehu', 'gehun', 'sharbati', 'kanak', 'atta'],
  },

  // 32. RICE / PADDY (चावल / धान)
  {
    cropKey: 'rice',
    canonicalName: 'Rice (Basmati 1121)',
    canonicalNameHi: 'चावल (बासमती 1121)',
    category: 'Grains',
    variety: 'Pusa Basmati 1121',
    sideLogo: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 78,
    keywords: ['rice', 'paddy', 'चावल', 'धान', 'basmati', 'chawal', 'dhan', 'tandool'],
  },

  // 33. CORN / MAIZE (मक्का)
  {
    cropKey: 'corn',
    canonicalName: 'Sweet Corn (Golden Maize)',
    canonicalNameHi: 'मक्का / भुट्टा',
    category: 'Grains',
    variety: 'Sugar 75',
    sideLogo: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 26,
    keywords: ['corn', 'maize', 'मक्का', 'makka', 'bhutta', 'sweet corn'],
  },

  // 34. CHANA (चना)
  {
    cropKey: 'chana',
    canonicalName: 'Chana (Desi Bengal Gram)',
    canonicalNameHi: 'चना (देशी चना)',
    category: 'Pulses',
    variety: 'JG-11',
    sideLogo: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 68,
    keywords: ['chana', 'gram', 'चना', 'chickpea', 'chole', 'bengal gram', 'kala chana'],
  },

  // 35. MOONG (मूंग)
  {
    cropKey: 'moong',
    canonicalName: 'Moong (Green Gram)',
    canonicalNameHi: 'मूंग (साबुत हरी मूंग)',
    category: 'Pulses',
    variety: 'Virat IP-02',
    sideLogo: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 88,
    keywords: ['moong', 'mung', 'मूंग', 'green gram', 'mug'],
  },

  // 36. TOOR / ARHAR (तुअर / अरहर)
  {
    cropKey: 'toor',
    canonicalName: 'Tur / Arhar (Pigeon Pea)',
    canonicalNameHi: 'तुअर / अरहर दाल',
    category: 'Pulses',
    variety: 'BDN-711',
    sideLogo: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 110,
    keywords: ['toor', 'tur', 'arhar', 'तुअर', 'अरहर', 'pigeon pea', 'toor dal', 'arhar dal'],
  },

  // 37. URAD (उड़द)
  {
    cropKey: 'urad',
    canonicalName: 'Urad Dal (Black Gram)',
    canonicalNameHi: 'उड़द (काली उड़द)',
    category: 'Pulses',
    variety: 'T-9',
    sideLogo: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 95,
    keywords: ['urad', 'उड़द', 'urad dal', 'black gram'],
  },

  // 38. RAJMA (राजमा)
  {
    cropKey: 'rajma',
    canonicalName: 'Rajma (Jammu Chitra)',
    canonicalNameHi: 'चित्रा राजमा',
    category: 'Pulses',
    variety: 'Chitra Special',
    sideLogo: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 135,
    keywords: ['rajma', 'राजमा', 'kidney bean', 'kidney beans'],
  },

  // 39. SOYBEAN (सोयाबीन)
  {
    cropKey: 'soybean',
    canonicalName: 'Soybean (Malwa Yellow)',
    canonicalNameHi: 'सोयाबीन (मालवा पीला)',
    category: 'Pulses',
    variety: 'JS-9560',
    sideLogo: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 54,
    keywords: ['soybean', 'soya', 'सोयाबीन', 'soyabean', 'soya bean'],
  },

  // 40. GROUNDNUT (मूंगफली)
  {
    cropKey: 'groundnut',
    canonicalName: 'Groundnut / Peanut',
    canonicalNameHi: 'मूंगफली (सौराष्ट्र बोल्ड)',
    category: 'Pulses',
    variety: 'GG-20',
    sideLogo: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 70,
    keywords: ['groundnut', 'peanut', 'मूंगफली', 'moongphali', 'singdana', 'mungfali'],
  },

  // 41. MUSTARD (सरसों)
  {
    cropKey: 'mustard',
    canonicalName: 'Mustard Seeds (Yellow Sarson)',
    canonicalNameHi: 'सरसों (पीली सरसों)',
    category: 'Grains',
    variety: 'Pusa Mustard 25',
    sideLogo: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 72,
    keywords: ['mustard', 'सरसों', 'सरसो', 'sarson', 'rai', 'yellow mustard'],
  },

  // 42. MILLETS (बाजरा / ज्वार / रागी)
  {
    cropKey: 'millets',
    canonicalName: 'Bajra / Jowar / Ragi',
    canonicalNameHi: 'बाजरा / ज्वार / रागी',
    category: 'Grains',
    variety: 'Desi Hybrid',
    sideLogo: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 26,
    keywords: ['bajra', 'बाजरा', 'jowar', 'ज्वार', 'ragi', 'रागी', 'millet', 'millets', 'barley', 'jau', 'जौ', 'oats', 'जई'],
  },

  // 43. COTTON (कपास)
  {
    cropKey: 'cotton',
    canonicalName: 'Raw Cotton (Kapas Shankar)',
    canonicalNameHi: 'कपास (शंकर कपास)',
    category: 'Grains',
    variety: 'Shankar-6',
    sideLogo: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=800&q=80',
    ],
    suggestedPriceRupees: 90,
    keywords: ['cotton', 'कपास', 'kapas', 'rooi', 'rui', 'raw cotton'],
  },
];

/**
 * Intelligent crop image & logo matcher:
 * Given any crop name (e.g. "Green Peas Fresh", "onion", "red onion", "आलू", "ताज़ी हरी मटर", etc.),
 * this function finds the exact or closest matching crop preset and returns its verified photos and logo!
 */
export function matchCropImagesByName(inputName: string): CropImageMatchResult {
  if (!inputName || !inputName.trim()) {
    const def = CURATED_CROP_PRESETS[0]; // Green Peas
    return {
      matched: false,
      cropKey: 'generic',
      canonicalName: inputName,
      canonicalNameHi: inputName,
      category: 'Vegetables',
      variety: 'Local Harvest',
      sideLogo: def.sideLogo,
      photos: [...def.photos],
      suggestedPriceRupees: 35,
    };
  }

  const raw = inputName.trim();
  const normalized = raw
    .toLowerCase()
    .replace(/[()#,\-_[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = normalized.split(' ').filter((w) => w.length >= 2);

  // 1. Direct/Sub-string match on Curated Crop Presets
  for (const preset of CURATED_CROP_PRESETS) {
    for (const kw of preset.keywords) {
      const kwLower = kw.toLowerCase();
      // Exact match or contains keyword as full phrase
      if (
        normalized === kwLower ||
        normalized.includes(kwLower) ||
        raw.includes(kw) ||
        kwLower.includes(normalized)
      ) {
        return {
          matched: true,
          cropKey: preset.cropKey,
          canonicalName: preset.canonicalName,
          canonicalNameHi: preset.canonicalNameHi,
          category: preset.category,
          variety: preset.variety,
          sideLogo: preset.sideLogo,
          photos: [...preset.photos],
          suggestedPriceRupees: preset.suggestedPriceRupees,
        };
      }

      // Check word token matching
      for (const w of words) {
        if (
          w === kwLower ||
          (kwLower.startsWith(w) && w.length >= 3 && kwLower.length <= w.length + 3) ||
          (w.startsWith(kwLower) && kwLower.length >= 3)
        ) {
          return {
            matched: true,
            cropKey: preset.cropKey,
            canonicalName: preset.canonicalName,
            canonicalNameHi: preset.canonicalNameHi,
            category: preset.category,
            variety: preset.variety,
            sideLogo: preset.sideLogo,
            photos: [...preset.photos],
            suggestedPriceRupees: preset.suggestedPriceRupees,
          };
        }
      }
    }
  }

  // 2. Fallback to Green Peas or Onion default
  const fallback = CURATED_CROP_PRESETS[0];
  return {
    matched: false,
    cropKey: 'custom',
    canonicalName: raw,
    canonicalNameHi: raw,
    category: 'Vegetables',
    variety: 'Local Harvest',
    sideLogo: fallback.sideLogo,
    photos: [...fallback.photos],
    suggestedPriceRupees: 35,
  };
}

/**
 * Returns the exact logo URL corresponding to the crop name.
 * e.g. getCropLogoUrl('Green Peas Fresh') -> green peas photo URL
 * e.g. getCropLogoUrl('Onion') -> onion photo URL
 */
export function getCropLogoUrl(cropName: string, fallbackUrl?: string): string {
  if (!cropName || !cropName.trim()) {
    return fallbackUrl || CURATED_CROP_PRESETS[0].sideLogo;
  }
  const match = matchCropImagesByName(cropName);
  if (match.matched) {
    return match.sideLogo;
  }
  return fallbackUrl || CURATED_CROP_PRESETS[0].sideLogo;
}

/**
 * Returns verified photos list corresponding to the crop name.
 */
export function getCropPhotosByName(cropName: string, fallbackPhotos?: string[]): string[] {
  if (!cropName || !cropName.trim()) {
    return fallbackPhotos || CURATED_CROP_PRESETS[0].photos;
  }
  const match = matchCropImagesByName(cropName);
  if (match.matched) {
    return match.photos;
  }
  return fallbackPhotos && fallbackPhotos.length >= 2 ? fallbackPhotos : CURATED_CROP_PRESETS[0].photos;
}
