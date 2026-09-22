export type CropCategory =
  | 'Vegetables'
  | 'Fruits'
  | 'Pulses'
  | 'Grains'
  | 'Seeds'
  | 'Spices'
  | 'Dairy'
  | 'Herbs'
  | 'Cash Crops'
  | 'Flowers';

export const ALL_AGRICULTURAL_CATEGORIES: { value: CropCategory; labelHi: string; labelEn: string }[] = [
  { value: 'Vegetables', labelHi: 'सब्जियाँ (Vegetables)', labelEn: 'Vegetables' },
  { value: 'Fruits', labelHi: 'फल (Fruits)', labelEn: 'Fruits' },
  { value: 'Grains', labelHi: 'अनाज एवं खाद्यान्न (Grains & Cereals)', labelEn: 'Grains & Cereals' },
  { value: 'Pulses', labelHi: 'दालें / दलहन (Pulses & Legumes)', labelEn: 'Pulses & Legumes' },
  { value: 'Seeds', labelHi: 'बीज (Agricultural Seeds)', labelEn: 'Seeds' },
  { value: 'Spices', labelHi: 'मसाले (Spices & Condiments)', labelEn: 'Spices' },
  { value: 'Dairy', labelHi: 'डेयरी व पशुधन (Dairy & Livestock)', labelEn: 'Dairy & Livestock' },
  { value: 'Herbs', labelHi: 'जैविक व औषधीय (Herbs & Medicinal)', labelEn: 'Herbs & Medicinal' },
  { value: 'Cash Crops', labelHi: 'नकदी फसलें (Cash Crops)', labelEn: 'Cash Crops' },
  { value: 'Flowers', labelHi: 'पुष्प एवं बागवानी (Flowers & Floriculture)', labelEn: 'Flowers' },
];

