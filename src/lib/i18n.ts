import { findProbabilisticCropMatch } from './fuzzyMatcher';

export type Language =
  | 'hi' // हिन्दी (Hindi)
  | 'en' // English
  | 'pa' // ਪੰਜਾਬੀ (Punjabi)
  | 'mr' // मराठी (Marathi)
  | 'gu' // ગુજરાતી (Gujarati)
  | 'bn' // বাংলা (Bengali)
  | 'te' // తెలుగు (Telugu)
  | 'ta' // தமிழ் (Tamil)
  | 'kn' // ಕನ್ನಡ (Kannada)
  | 'ml' // മലയാളം (Malayalam)
  | 'or'; // ଓଡ଼ିଆ (Odia)

export interface LanguageMeta {
  code: Language;
  name: string;
  nativeName: string;
  region: string;
  flagEmoji: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', region: 'राष्ट्रीय / North', flagEmoji: '🇮🇳' },
  { code: 'en', name: 'English', nativeName: 'English', region: 'Global / India', flagEmoji: '🌐' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', region: 'North / Punjab', flagEmoji: '🌾' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', region: 'West / Maharashtra', flagEmoji: '🚩' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', region: 'West / Gujarat', flagEmoji: '🦁' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', region: 'East / West Bengal', flagEmoji: '🐯' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', region: 'South / Andhra & Telangana', flagEmoji: '☀️' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', region: 'South / Tamil Nadu', flagEmoji: '🛕' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', region: 'South / Karnataka', flagEmoji: '🐘' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', region: 'South / Kerala', flagEmoji: '🌴' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', region: 'East / Odisha', flagEmoji: '🌊' },
];

export interface TranslationSchema {

  // Navigation & General
  appName: string;
  subTitle: string;
  tagline: string;
  activeRoleLabel: string;
  navHome: string;
  navFarmer: string;
  navFPO: string;
  navBuyer: string;
  navHub: string;
  navTransporter: string;
  navAdmin: string;
  cartTitle: string;
  cartButton: string;
  checkout: string;
  translatorTitle: string;
  translatorBtn: string;
  selectLanguage: string;
  kisanPlatformBadge: string;

  // Roles
  roleFarmer: string;
  roleFPO: string;
  roleBuyer: string;
  roleHub: string;
  roleTransporter: string;
  roleAdmin: string;
  roleFarmerSub: string;
  roleFPOSub: string;
  roleBuyerSub: string;
  roleHubSub: string;
  roleTransporterSub: string;
  roleAdminSub: string;
  selectDashboard: string;
  integratedRolesCount: string;

  // Hero Section
  heroBadge: string;
  heroTitle: string;
  heroDesc: string;
  heroCTA: string;
  ivrCTA: string;
  tollFreeNotice: string;
  statMiddlemen: string;
  statMiddlemenSub: string;
  statCvGrading: string;
  statCvGradingSub: string;
  statAiEngines: string;
  statAiEnginesSub: string;
  statIvrPhone: string;
  statIvrPhoneSub: string;

  // Ticker
  liveMandiTicker: string;
  tickerCrop1: string;
  tickerCrop2: string;
  tickerCrop3: string;
  tickerCrop4: string;
  tickerCrop5: string;
  tickerCrop6: string;

  // Marketplace
  marketplaceTitle: string;
  marketplaceSubtitle: string;
  filterAll: string;
  filterGradeA: string;
  filterOrganic: string;
  pricePerKg: string;
  availableQty: string;
  gradeLabel: string;
  locationLabel: string;
  farmerLabel: string;
  addToCart: string;
  buyNow: string;
  categoryVeg: string;
  categoryTubers: string;
  categoryGrains: string;
  organicBadge: string;
  cvTrustScore: string;
  fairPriceAiTag: string;

  // Fair Price AI & IVR
  fairPriceHeader: string;
  ivrHeader: string;
  ivrSubtitle: string;
  press1: string;
  press2: string;
  press3: string;
  simulatedCall: string;
  callSuccess: string;

  // Farmer Portal
  farmerPortalTitle: string;
  farmerWelcome: string;
  farmerSubtitle: string;
  btnListProduce: string;
  btnIvrService: string;
  farmerStatActive: string;
  farmerStatPriceGain: string;
  farmerStatEscrow: string;
  myListingsTitle: string;
  colCrop: string;
  colQty: string;
  colPrice: string;
  colGrade: string;
  colLocation: string;
  colStatus: string;
  statusVerified: string;
  statusPooled: string;
  addModalTitle: string;
  cropNamePlaceholder: string;
  qtyPlaceholder: string;
  pricePlaceholder: string;
  saveProduceBtn: string;
  cancelBtn: string;
  gradeA: string;
  gradeExport: string;

  // FPO Portal
  fpoTitle: string;
  fpoGroupName: string;
  fpoSubtitle: string;
  fpoStatSupply: string;
  fpoStatSupplySub: string;
  fpoStatLots: string;
  fpoStatLotsSub: string;
  fpoStatRfqs: string;
  fpoStatRfqsSub: string;
  virtualLotsTitle: string;
  lockLotBtn: string;
  lockedBadge: string;
  poolingActive: string;
  institutionalDemandTitle: string;
  fulfillmentLabel: string;

  // Buyer Portal
  buyerTitle: string;
  buyerSubtitle: string;
  btnPostReq: string;
  buyerStatContracts: string;
  buyerStatEscrow: string;
  buyerStatQuality: string;
  buyerOrdersTitle: string;
  reqModalTitle: string;
  submitReqBtn: string;

  // Hub Operator Portal
  hubTitle: string;
  hubName: string;
  hubSubtitle: string;
  hubCropSelect: string;
  hubLotSize: string;
  btnRunCv: string;
  analyzingCv: string;
  cvResultsTitle: string;
  confidenceScore: string;
  ripenessScore: string;
  defectScore: string;
  fssaiStatus: string;
  storageTemp: string;
  shelfLife: string;
  qrGeneratedLabel: string;
  printQrBtn: string;

  // Transporter Portal
  transporterTitle: string;
  transporterSubtitle: string;
  fleetMetricsTitle: string;
  distanceLabel: string;
  etaLabel: string;
  fuelSavingsLabel: string;
  multiStopTitle: string;
  pickupOtpLabel: string;
  deliveryOtpLabel: string;
  otpVerifyTitle: string;
  otpVerifyPlaceholder: string;
  btnVerifyOtp: string;

  // Admin Governance
  adminTitle: string;
  adminHeading: string;
  adminSubtitle: string;
  adminStatGmv: string;
  adminStatWaste: string;
  adminStatIncome: string;
  adminStatMandis: string;
  recentLedgerTitle: string;
  colOrderId: string;
  colBuyer: string;
  colFarmer: string;
  colAmount: string;
  colDelivery: string;
  aiEnginesTitle: string;

  // Cart Drawer
  cartEmpty: string;
  cartSubtotal: string;
  logisticsFee: string;
  gstTax: string;
  totalAmount: string;
  proceedOrder: string;
  orderSuccessTitle: string;
  orderSuccessDesc: string;
  smartContractIdLabel: string;
  escrowStatusLabel: string;
  escrowLockedText: string;
  closeBtn: string;

  // Footer
  footerMission: string;
  aiEnginesCore: string;
  userRolesFooter: string;
  helplineTitle: string;
  helplineDesc: string;
  allIndiaLangs247: string;

  // India Translator Modal
  translatorHeader: string;
  translatorSub: string;
  sourceLangLabel: string;
  targetLangLabel: string;
  inputPlaceholder: string;
  translatedOutputPlaceholder: string;
  quickAgriPhrasesTitle: string;
  phrase1: string;
  phrase2: string;
  phrase3: string;
  phrase4: string;
  phrase5: string;
  btnTranslate: string;
  btnListen: string;
  btnCopy: string;
  copiedNotice: string;
  btnClear: string;
  swapLanguages: string;

  // Common UI
  currencySymbol: string;
  paiseSuffix: string;
  statusAvailable: string;
  statusInTransit: string;
  statusDelivered: string;
  // Keys from main / dashboard portals
  agmarknetConnected?: string;
  aiAnalyzing?: string;
  buyerActiveOrdersHeader?: string;
  buyerHeaderBadge?: string;
  buyerHeaderSub?: string;
  buyerPostReqBtn?: string;
  buyerRecurringContractsHeader?: string;
  buyerStatActiveOrders?: string;
  buyerStatFPOGuarantee?: string;
  buyerStatGPSLogistics?: string;
  buyerStatMandiSavings?: string;
  buyerStatRecurringContracts?: string;
  buyerStatTotalPurchase?: string;
  buyerWelcome?: string;
  cvGradingTitle?: string;
  farmerAddNewCrop?: string;
  farmerBadge?: string;
  fpoAcceptCommitmentBtn?: string;
  fpoFulfilledPercent?: string;
  fpoHeaderBadge?: string;
  fpoHeaderSub?: string;
  fpoLockLotBtn?: string;
  fpoLotLockedStatus?: string;
  fpoSectionBuyerReqs?: string;
  fpoSectionVirtualLots?: string;
  fpoStatBargaining?: string;
  fpoStatBuyerReqs?: string;
  fpoStatMembersIncluded?: string;
  fpoStatReadySupply?: string;
  fpoStatTotalSupply?: string;
  fpoStatVirtualLots?: string;
  gradeResults?: string;
  helplineText?: string;
  ivrGuideHeader?: string;
  ivrGuideSub?: string;
  keypad1Desc?: string;
  keypad1Sub?: string;
  keypad1Title?: string;
  keypad2Desc?: string;
  keypad2Sub?: string;
  keypad2Title?: string;
  keypad3Desc?: string;
  keypad3Sub?: string;
  keypad3Title?: string;
  myRegisteredCrops?: string;
  qrGenerated?: string;
  selectDashboardTitle?: string;
  statAIEngines?: string;
  statAIEnginesDesc?: string;
  statActiveListings?: string;
  statCVGrading?: string;
  statCVGradingDesc?: string;
  statEarnedIncome?: string;
  statEscrowProtected?: string;
  statMiddlemenDesc?: string;
  statNoInternet?: string;
  statNoInternetDesc?: string;
  statSmartContracts?: string;
  statVerifiedByAI?: string;
  statZeroCommission?: string;
  uploadPrompt?: string;
}

export const translations: Record<Language, TranslationSchema> = {
  hi: {
    // Navigation & General
    appName: "Nira",
    subTitle: "कृषि से सीधे खरीदार तक — बिना बिचौलियों के",
    tagline: "भारत का पहला AI संचालित प्रत्यक्ष कृषि बाज़ार और रसद मंच",
    activeRoleLabel: "सक्रिय भूमिका",
    navHome: "कृषि बाज़ार",
    navFarmer: "किसान पोर्टल",
    navFPO: "एफपीओ समूह",
    navBuyer: "प्रत्यक्ष खरीदार",
    navHub: "गुणवत्ता जाँच केंद्र",
    navTransporter: "परिवहन एवं रसद",
    navAdmin: "राष्ट्रीय मंडी शासन",
    cartTitle: "आपकी खरीदारी टोकरी",
    cartButton: "खरीदारी टोकरी",
    checkout: "सुरक्षित अनुबंध भुगतान",
    translatorTitle: "भारत बहुभाषी अनुवादक",
    translatorBtn: "🇮🇳 अनुवादक (Translator)",
    selectLanguage: "भाषा चुनें",
    kisanPlatformBadge: "किसान दिवस एग्री-टेक मंच",

    // Roles
    roleFarmer: "किसान पोर्टल",
    roleFPO: "एफपीओ समूह प्रबंधक",
    roleBuyer: "थोक एवं खुदरा खरीदार",
    roleHub: "माइक्रो-हब जाँच अधिकारी",
    roleTransporter: "रसद एवं परिवहन भागीदार",
    roleAdmin: "मंत्रालय एवं नीति प्रशासन",
    roleFarmerSub: "न्यायसंगत मूल्य एवं IVR",
    roleFPOSub: "वर्चुअल लॉट एकत्रीकरण",
    roleBuyerSub: "थोक मांग एवं अनुबंध",
    roleHubSub: "CV ग्रेडिंग एवं QR",
    roleTransporterSub: "मार्ग अनुकूलन एवं OTP",
    roleAdminSub: "राष्ट्रीय मंडी शासन",
    selectDashboard: "उपयोगकर्ता डैशबोर्ड का चयन करें",
    integratedRolesCount: "6 एकीकृत भूमिकाएँ",

    // Hero Section
    heroBadge: "SIH 2026 PS 26033 • किसान दिवस समर्पित प्रत्यक्ष कृषि मंच",
    heroTitle: "किसानों की उपज का सीधा न्यायसंगत दाम, AI की शक्ति से",
    heroDesc: "बिचौलियों के बिना प्रत्यक्ष बिक्री, कंप्यूटर विज़न स्वचालित गुणवत्ता ग्रेडिंग, मांग पूर्वानुमान और 0% पोस्ट-हार्वेस्ट बर्बादी।",
    heroCTA: "ताज़ा फसलें देखें",
    ivrCTA: "फोन से बेचें (IVR सेवा)",
    tollFreeNotice: "टोल-फ्री IVR वॉयस हेल्पलाइन: 1800-KISAN-AI (कीपैड फोन फसल पंजीकरण)",
    statMiddlemen: "0%",
    statMiddlemenSub: "बिचौलिया कमीशन (प्रत्यक्ष किसान एस्क्रौ)",
    statCvGrading: "99.4%",
    statCvGradingSub: "कंप्यूटर विज़न ग्रेडिंग (FSSAI प्रमाणीकरण)",
    statAiEngines: "6 AI",
    statAiEnginesSub: "स्मार्ट कृषि इंजन (न्यायसंगत मूल्य + रसद)",
    statIvrPhone: "IVR/SMS",
    statIvrPhoneSub: "बिना इंटरनेट सहायता (कीपैड फोन सेवा)",

    // Ticker
    liveMandiTicker: "सद्य मंडी भाव (एगमार्कनेट लाइव डेटा):",
    tickerCrop1: "टमाटर (उच्चतम श्रेणी A+)",
    tickerCrop2: "नाशिक लाल प्याज",
    tickerCrop3: "इन्दौर ज्योति आलू",
    tickerCrop4: "शरबाती प्रीमियम गेहूं",
    tickerCrop5: "पीला सोयाबीन",
    tickerCrop6: "देसी लहसुन",

    // Marketplace
    marketplaceTitle: "सत्यापित ताज़ा फसल बाज़ार",
    marketplaceSubtitle: "सत्यापित कंप्यूटर विज़न ग्रेडिंग और पारदर्शी एस्क्रौ के साथ ताज़ी फसल खरीदें",
    filterAll: "सभी फसलें",
    filterGradeA: "उच्चतम ग्रेड A / A+ केवल",
    filterOrganic: "जैविक फसलें केवल",
    pricePerKg: "प्रति किग्रा",
    availableQty: "उपलब्ध मात्रा",
    gradeLabel: "गुणवत्ता श्रेणी",
    locationLabel: "स्थान एवं संकलन हब",
    farmerLabel: "उत्पादक किसान / FPO",
    addToCart: "टोकरी में जोड़ें",
    buyNow: "अभी खरीदें",
    categoryVeg: "सब्जियाँ",
    categoryTubers: "कंदमूल",
    categoryGrains: "अनाज",
    organicBadge: "100% जैविक",
    cvTrustScore: "CV विश्वासांक",
    fairPriceAiTag: "Fair Price AI मूल्य",

    // Fair Price AI & IVR
    fairPriceHeader: "न्यायसंगत मूल्य AI — मंडी न्यूनतम समर्थन से बेहतर मूल्य",
    ivrHeader: "स्मार्टफोन नहीं? डायल करें 1800-KISAN-AI (फ़ोन कीपैड सेवा)",
    ivrSubtitle: "कीपैड बटन दबाएं या बोलकर फसल बेचें — तुरंत SMS पुष्टिकरण",
    press1: "1: टमाटर दर्ज करने हेतु",
    press2: "2: प्याज दर्ज करने हेतु",
    press3: "3: आलू दर्ज करने हेतु",
    simulatedCall: "कीपैड सेवा चलाएं",
    callSuccess: "SMS संदेश प्रेषित! आपकी फसल सफलता से दर्ज हो गई है।",

    // Farmer Portal
    farmerPortalTitle: "प्रत्यक्ष किसान पोर्टल • 0% मध्यस्थ कमीशन",
    farmerWelcome: "नमस्ते",
    farmerSubtitle: "आपकी फसल सीधे सत्यापित खरीदारों को न्यायसंगत मूल्य पर बेची जाती है",
    btnListProduce: "नयी फसल दर्ज करें",
    btnIvrService: "IVR वॉयस सेवा",
    farmerStatActive: "सक्रिय फसल लिस्टिंग",
    farmerStatPriceGain: "न्यायसंगत मूल्य लाभ",
    farmerStatEscrow: "एस्क्रौ में सुरक्षित राशि",
    myListingsTitle: "आपकी पंजीकृत फसलें (Active Listings)",
    colCrop: "फसल का नाम",
    colQty: "मात्रा",
    colPrice: "मूल्य",
    colGrade: "गुणवत्ता ग्रेड",
    colLocation: "संकलन हब",
    colStatus: "स्थिति",
    statusVerified: "सत्यापित फसल",
    statusPooled: "पूल में शामिल",
    addModalTitle: "नयी फसल बाज़ार में जोड़ें",
    cropNamePlaceholder: "फसल का नाम (उदा. नासिक प्याज)",
    qtyPlaceholder: "मात्रा (किग्रा)",
    pricePlaceholder: "आधार मूल्य (₹/किग्रा)",
    saveProduceBtn: "फसल प्रकाशित करें",
    cancelBtn: "रद्द करें",
    gradeA: "उच्चतम श्रेणी A+",
    gradeExport: "निर्यात श्रेणी",

    // FPO Portal
    fpoTitle: "सहयाद्री किसान उत्पादक FPO समूह",
    fpoGroupName: "एफपीओ वर्चुअल लॉट एकत्रीकरण केंद्र",
    fpoSubtitle: "142 सदस्य किसान एकत्रित (सामूहिक सौदेबाज़ी क्षमता)",
    fpoStatSupply: "कुल एफपीओ एकत्रित आपूर्ति",
    fpoStatSupplySub: "+42% बेहतर मूल्य सौदेबाज़ी",
    fpoStatLots: "सक्रिय वर्चुअल लॉट",
    fpoStatLotsSub: "86 सदस्य किसान शामिल हैं",
    fpoStatRfqs: "संस्थागत मांग प्रस्ताव",
    fpoStatRfqsSub: "प्रत्यक्ष आपूर्ति हेतु तैयार",
    virtualLotsTitle: "सक्रिय वर्चुअल लॉट एकत्रीकरण",
    lockLotBtn: "लॉट लॉक करें",
    lockedBadge: "लॉट लॉक किया गया",
    poolingActive: "पूल एकत्र जारी",
    institutionalDemandTitle: "थोक खरीदार संस्थागत मांग (RFQs)",
    fulfillmentLabel: "मांग पूर्ति",

    // Buyer Portal
    buyerTitle: "प्रत्यक्ष खरीदार पोर्टल",
    buyerSubtitle: "कंप्यूटर विज़न प्रमाणित ताज़ी फसलें — बिचौलियों के बिना प्रत्यक्ष खरीद",
    btnPostReq: "थोक फसल मांग पोस्ट करें",
    buyerStatContracts: "सक्रिय स्मार्ट अनुबंध",
    buyerStatEscrow: "एस्क्रौ में जमा राशि",
    buyerStatQuality: "CV गुणवत्ता उत्तीर्ण दर",
    buyerOrdersTitle: "हालिया अनुबंध एवं खरीद आदेश",
    reqModalTitle: "नयी थोक खरीद मांग प्रेषित करें",
    submitReqBtn: "मांग प्रकाशित करें",

    // Hub Operator Portal
    hubTitle: "नासिक संकलन हब #04",
    hubName: "माइक्रो-हब कंप्यूटर विज़न ग्रेडिंग केंद्र",
    hubSubtitle: "गुणवत्ता जांच, QR टैगिंग एवं कोल्ड-स्टोरेज प्रबंधन",
    hubCropSelect: "फसल का चयन करें",
    hubLotSize: "लॉट मात्रा (किग्रा)",
    btnRunCv: "कंप्यूटर विज़न AI जांच चलाएं",
    analyzingCv: "AI गुणवत्ता विश्लेषण जारी है...",
    cvResultsTitle: "गुणवत्ता परीक्षण परिणाम",
    confidenceScore: "CV विश्वासांक",
    ripenessScore: "रंग परिपक्वता",
    defectScore: "दोष दर",
    fssaiStatus: "FSSAI प्रमाणीकरण",
    storageTemp: "सुझाया गया तापमान",
    shelfLife: "अनुमानित शेल्फ-लाइफ",
    qrGeneratedLabel: "हब QR लेबल तैयार",
    printQrBtn: "QR लेबल प्रिंट व टैग करें",

    // Transporter Portal
    transporterTitle: "रसद एवं स्मार्ट मार्ग अनुकूलन डेस्क",
    transporterSubtitle: "मल्टी-स्टॉप पिकअप एवं सुरक्षित OTP डिजिटल हैंडशेक",
    fleetMetricsTitle: "आज का AI मार्ग प्रदर्शन",
    distanceLabel: "कुल दूरी",
    etaLabel: "अनुमानित समय",
    fuelSavingsLabel: "ईंधन बचत",
    multiStopTitle: "अनुकूलित मल्टी-स्टॉप पिकअप व डिलीवरी मार्ग",
    pickupOtpLabel: "पिकअप OTP",
    deliveryOtpLabel: "डिलीवरी OTP",
    otpVerifyTitle: "सुरक्षित OTP हैंडशेक सत्यापन",
    otpVerifyPlaceholder: "4-अंकीय OTP दर्ज करें (उदा. 4829)",
    btnVerifyOtp: "OTP सत्यापित करें",

    // Admin Governance
    adminTitle: "SIH 2026 PS 26033 राष्ट्रीय मंडी शासन",
    adminHeading: "मंत्रालय एवं राष्ट्रीय मंडी शासन कक्ष",
    adminSubtitle: "उपभोक्ता मामले, खाद्य और सार्वजनिक वितरण मंत्रालय — प्रत्यक्ष कृषि व्यापार निगरानी",
    adminStatGmv: "कुल राष्ट्रीय कृषि व्यापार (GMV)",
    adminStatWaste: "बचाई गई फसल बर्बादी",
    adminStatIncome: "किसानों की शुद्ध आय वृद्धि",
    adminStatMandis: "सक्रिय डिजिटल हब",
    recentLedgerTitle: "पारदर्शी राष्ट्रीय लेनदेन खाता (Audit Ledger)",
    colOrderId: "अनुबंध आईडी",
    colBuyer: "खरीदार",
    colFarmer: "उत्पादक / FPO",
    colAmount: "भुगतान राशि",
    colDelivery: "वितरण प्रकार",
    aiEnginesTitle: "एकीकृत AI कृषि इंजन स्थिति (Realtime Health)",

    // Cart Drawer
    cartEmpty: "आपकी टोकरी अभी खाली है",
    cartSubtotal: "उप-कुल राशि",
    logisticsFee: "स्मार्ट रसद एवं परिवहन शुल्क",
    gstTax: "जीएसटी (0% कृषि छूट)",
    totalAmount: "कुल भुगतेय राशि",
    proceedOrder: "स्मार्ट अनुबंध निष्पादित करें",
    orderSuccessTitle: "ऑर्डर अनुबंध सफलतापूर्वक निष्पादित!",
    orderSuccessDesc: "किसान और हब ऑपरेटर को स्वचालित प्रेषण आदेश भेज दिया गया है।",
    smartContractIdLabel: "स्मार्ट कॉन्ट्रैक्ट आईडी",
    escrowStatusLabel: "एस्क्रौ स्थिति",
    escrowLockedText: "निष्पादित (Locked in Escrow)",
    closeBtn: "पूर्ण करें (Close)",

    // Footer
    footerMission: "किसान दिवस समर्पित प्रत्यक्ष कृषि आपूर्ति एवं रसद प्रणाली। Smart India Hackathon 2026 Problem Statement 26033 (उपभोक्ता मामले, खाद्य एवं सार्वजनिक वितरण मंत्रालय)।",
    aiEnginesCore: "AI इंजन कोर (6 AI Engines)",
    userRolesFooter: "उपयोगकर्ता भूमिकाएं (6 Personas)",
    helplineTitle: "हेल्पलाइन एवं सहायता",
    helplineDesc: "किसान टोल-फ्री IVR हेल्पलाइन: 1800-KISAN-AI",
    allIndiaLangs247: "24x7 सभी भारतीय भाषाओं में उपलब्ध",

    // India Translator Modal
    translatorHeader: "🇮🇳 भारत बहुभाषी कृषि अनुवादक (All-India Multi-Language Translator)",
    translatorSub: "भारत की प्रमुख भाषाओं में कृषि शब्द, मंडी भाव, अनुबंध और किसान संदेशों का त्वरित अनुवाद।",
    sourceLangLabel: "स्रोत भाषा (From)",
    targetLangLabel: "लक्षित भाषा (To)",
    inputPlaceholder: "अनुवाद करने हेतु कृषि प्रश्न, फसल विवरण या संदेश दर्ज करें...",
    translatedOutputPlaceholder: "अनुवादित पाठ यहाँ प्रदर्शित होगा...",
    quickAgriPhrasesTitle: "त्वरित कृषि वाक्य (Quick Presets):",
    phrase1: "आज नासिक मंडी में टमाटर का थोक भाव क्या है?",
    phrase2: "फसल कंप्यूटर विज़न AI द्वारा प्रमाणित और ग्रेड A+ है।",
    phrase3: "स्मार्ट अनुबंध भुगतान सुरक्षित रूप से किसान एस्क्रौ में जमा है।",
    phrase4: "वाहन पिकअप के लिए हब पर 4829 OTP प्रस्तुत करें।",
    phrase5: "एफपीओ समूह में 500 किग्रा गेहूं का वर्चुअल पूल बनाया गया।",
    btnTranslate: "अनुवाद करें (Translate)",
    btnListen: "सुनें (Speak)",
    btnCopy: "कॉपी करें (Copy)",
    copiedNotice: "कॉपी किया गया!",
    btnClear: "साफ करें (Clear)",
    swapLanguages: "भाषाएं बदलें",

    // Common UI
    currencySymbol: "₹",
    paiseSuffix: "पैसे",
    statusAvailable: "उपलब्ध",
    statusInTransit: "परिवहन में",
    statusDelivered: "सफलतापूर्वक हस्तांतरित",
    agmarknetConnected: "एगमार्कनेट AI मंडी से जुड़ा",
    aiAnalyzing: "AI गुणवत्ता विश्लेषण जारी है...",
    buyerActiveOrdersHeader: "आपके सक्रिय ऑर्डर एवं लाइव ट्रैकिंग",
    buyerHeaderBadge: "प्रत्यक्ष खरीदार पोर्टल",
    buyerHeaderSub: "कंप्यूटर विज़न प्रमाणित ताज़ी फसलें — बिचौलियों के बिना प्रत्यक्ष खरीद",
    buyerPostReqBtn: "+ थोक आवश्यकता प्रस्ताव भेजें",
    buyerRecurringContractsHeader: "आवर्ती फार्म आपूर्ति अनुबंध (स्मार्ट अनुबंध)",
    buyerStatActiveOrders: "सक्रिय ऑर्डर",
    buyerStatFPOGuarantee: "सहयाद्री FPO गारंटीकृत",
    buyerStatGPSLogistics: "GPS लाइव रसद ट्रैकिंग",
    buyerStatMandiSavings: "38% मंडी लागत बचत",
    buyerStatRecurringContracts: "आवर्ती फार्म आपूर्ति अनुबंध",
    buyerStatTotalPurchase: "कुल खरीद मूल्य",
    buyerWelcome: "नमस्ते",
    cvGradingTitle: "कंप्यूटर विज़न AI फसल गुणवत्ता परीक्षण",
    farmerAddNewCrop: "नयी फसल दर्ज करें",
    farmerBadge: "प्रत्यक्ष किसान पोर्टल • 0% मध्यस्थ कमीशन",
    fpoAcceptCommitmentBtn: "आपूर्ति प्रतिबद्धता स्वीकार करें",
    fpoFulfilledPercent: "पूर्ति की गई मात्रा",
    fpoHeaderBadge: "एफपीओ वर्चुअल लॉट एकत्रीकरण केंद्र",
    fpoHeaderSub: "प्रबंधक: Sanjay Deshmukh • 142 सदस्य किसान एकत्रित (सामूहिक सौदेबाजी क्षमता)",
    fpoLockLotBtn: "लॉट सुरक्षित करें एवं मांग प्रस्ताव भेजें",
    fpoLotLockedStatus: "लॉट सुरक्षित एवं प्रेषित",
    fpoSectionBuyerReqs: "थोक खरीदार मांग प्रस्ताव",
    fpoSectionVirtualLots: "वर्चुअल एकत्रित फसल लॉट",
    fpoStatBargaining: "+42% बेहतर मूल्य सौदेबाज़ी",
    fpoStatBuyerReqs: "संस्थागत मांग प्रस्ताव",
    fpoStatMembersIncluded: "86 सदस्य किसान शामिल हैं",
    fpoStatReadySupply: "प्रत्यक्ष आपूर्ति हेतु तैयार",
    fpoStatTotalSupply: "कुल एफपीओ एकत्रित आपूर्ति",
    fpoStatVirtualLots: "सक्रिय वर्चुअल लॉट",
    gradeResults: "गुणवत्ता परीक्षण परिणाम:",
    helplineText: "टोल-फ्री IVR वॉयस हेल्पलाइन: 1800-KISAN-AI (कीपैड फोन फसल पंजीकरण)",
    ivrGuideHeader: "टोल-फ्री IVR वॉयस सेवा निर्देशिका (1800-KISAN-AI)",
    ivrGuideSub: "बिना इंटरनेट वाले साधारण कीपैड फोन से फसल दर्ज करने हेतु निःशुल्क हेल्पलाइन निर्देश",
    keypad1Desc: "टोल-फ्री नंबर पर 1 दबाकर अपनी फसल और मात्रा वॉयस मैसेज द्वारा दर्ज करें।",
    keypad1Sub: "फसल बिक्री पंजीकरण",
    keypad1Title: "कीपैड बटन 1",
    keypad2Desc: "टोल-फ्री नंबर पर 2 दबाकर अपने निकटतम मंडी का रीयल-टाइम AI न्यूनतम समर्थन मूल्य सुनें।",
    keypad2Sub: "सद्य मंडी भाव (Agmarknet)",
    keypad2Title: "कीपैड बटन 2",
    keypad3Desc: "टोल-फ्री नंबर पर 3 दबाकर अपने बैंक खाते और लंबित प्रत्यक्ष भुगतान की स्थिति जानें।",
    keypad3Sub: "खाता शेष एवं एस्क्रौ स्टेटस",
    keypad3Title: "कीपैड बटन 3",
    myRegisteredCrops: "आपकी पंजीकृत फसलें",
    qrGenerated: "हब QR लेबल तैयार किया गया",
    selectDashboardTitle: "उपयोगकर्ता डैशबोर्ड का चयन करें",
    statAIEngines: "स्मार्ट कृषि इंजन",
    statAIEnginesDesc: "न्यायसंगत मूल्य + रसद",
    statActiveListings: "सक्रिय बाज़ार फसलें",
    statCVGrading: "कंप्यूटर विज़न ग्रेडिंग",
    statCVGradingDesc: "FSSAI प्रमाणीकरण",
    statEarnedIncome: "कुल प्रत्यक्ष अर्जित आय",
    statEscrowProtected: "सुरक्षित एस्क्रौ भुगतान",
    statMiddlemenDesc: "प्रत्यक्ष किसान एस्क्रौ",
    statNoInternet: "बिना इंटरनेट सहायता",
    statNoInternetDesc: "कीपैड फोन सेवा",
    statSmartContracts: "प्राप्त स्मार्ट अनुबंध",
    statVerifiedByAI: "Fair Price AI द्वारा सत्यापित",
    statZeroCommission: "शून्य कमीशन",
    uploadPrompt: "फसल की फोटो अपलोड करें (या AI परीक्षण चलाएं)",
  },

  en: {
    // Navigation & General
    appName: "Nira",
    subTitle: "Direct Farm-to-Buyer Platform — Zero Middlemen",
    tagline: "India's First AI-Powered Agri Supply Chain & Logistics Engine",
    activeRoleLabel: "Active Role",
    navHome: "Marketplace",
    navFarmer: "Farmer Desk",
    navFPO: "FPO Aggregator",
    navBuyer: "Direct Buyer",
    navHub: "Hub Inspector",
    navTransporter: "Transporter Fleet",
    navAdmin: "National Governance",
    cartTitle: "Your Shopping Cart",
    cartButton: "Shopping Cart",
    checkout: "Proceed to Checkout",
    translatorTitle: "All-India Multi-Language Translator",
    translatorBtn: "🇮🇳 Translator",
    selectLanguage: "Select Language",
    kisanPlatformBadge: "Kisan Diwas Agri-Tech Platform",

    // Roles
    roleFarmer: "Farmer Desk",
    roleFPO: "FPO Manager",
    roleBuyer: "Direct Buyer",
    roleHub: "Hub Operator",
    roleTransporter: "Transporter Fleet",
    roleAdmin: "Gov Governance",
    roleFarmerSub: "Fair Price & IVR",
    roleFPOSub: "Virtual Lot Aggregation",
    roleBuyerSub: "Bulk Demand & Contracts",
    roleHubSub: "CV Grading & QR",
    roleTransporterSub: "Route Optimization & OTP",
    roleAdminSub: "National Mandi Governance",
    selectDashboard: "Select User Persona Dashboard",
    integratedRolesCount: "6 Integrated Roles",

    // Hero Section
    heroBadge: "SIH 2026 PS 26033 • Kisan Diwas Dedicated Direct Agri Platform",
    heroTitle: "Fair Prices for Farmers Powered by AI Transparency",
    heroDesc: "Direct disintermediation, computer vision grading, AI demand forecasting, and zero post-harvest food waste.",
    heroCTA: "Explore Produce",
    ivrCTA: "Sell via Phone (IVR Simulator)",
    tollFreeNotice: "Toll-Free IVR Voice Helpline: 1800-KISAN-AI (Keypad Phone Crop Registration)",
    statMiddlemen: "0%",
    statMiddlemenSub: "Middlemen Commission (Direct Farmer Escrow)",
    statCvGrading: "99.4%",
    statCvGradingSub: "Computer Vision Grading (FSSAI Certified)",
    statAiEngines: "6 AI",
    statAiEnginesSub: "Smart Agri Engines (Fair Price + Logistics)",
    statIvrPhone: "IVR/SMS",
    statIvrPhoneSub: "Offline Service (Feature Phone Keypad Support)",

    // Ticker
    liveMandiTicker: "Live Mandi Prices (Agmarknet Realtime Feed):",
    tickerCrop1: "Fresh Tomato (Grade A+)",
    tickerCrop2: "Nashik Red Onion",
    tickerCrop3: "Indore Jyoti Potato",
    tickerCrop4: "Sharbati Premium Wheat",
    tickerCrop5: "Yellow Soybean",
    tickerCrop6: "Desi Organic Garlic",

    // Marketplace
    marketplaceTitle: "Verified Fresh Produce Marketplace",
    marketplaceSubtitle: "Purchase certified crops directly from farmers with transparent escrow and CV inspection",
    filterAll: "All Crops",
    filterGradeA: "Grade A / A+ Only",
    filterOrganic: "Organic Only",
    pricePerKg: "per kg",
    availableQty: "Available Quantity",
    gradeLabel: "Quality Grade",
    locationLabel: "Location / Hub",
    farmerLabel: "Farmer / FPO",
    addToCart: "Add to Cart",
    buyNow: "Buy Now",
    categoryVeg: "Vegetables",
    categoryTubers: "Tubers",
    categoryGrains: "Grains",
    organicBadge: "100% Organic",
    cvTrustScore: "CV Trust Score",
    fairPriceAiTag: "Fair Price AI",

    // Fair Price AI & IVR
    fairPriceHeader: "Fair Price AI Engine — Beyond Standard Mandi MSP",
    ivrHeader: "No Smartphone? Dial 1800-KISAN-AI (IVR Service)",
    ivrSubtitle: "Use keypad inputs or voice to list produce — Instant SMS Confirmation",
    press1: "1: Register Tomatoes",
    press2: "2: Register Onions",
    press3: "3: Register Potatoes",
    simulatedCall: "Simulate Keypad Press",
    callSuccess: "SMS Sent! Produce registered successfully.",

    // Farmer Portal
    farmerPortalTitle: "Direct Farmer Portal • 0% Middlemen Commission",
    farmerWelcome: "Welcome",
    farmerSubtitle: "Your crops are sold directly to verified buyers at guaranteed fair algorithmic prices",
    btnListProduce: "List New Produce",
    btnIvrService: "IVR Voice Service",
    farmerStatActive: "Active Crop Listings",
    farmerStatPriceGain: "Fair Price Advantage",
    farmerStatEscrow: "Secure Escrow Balance",
    myListingsTitle: "Your Registered Produce (Active Listings)",
    colCrop: "Crop Name",
    colQty: "Quantity",
    colPrice: "Price",
    colGrade: "Quality Grade",
    colLocation: "Hub Location",
    colStatus: "Status",
    statusVerified: "Verified Crop",
    statusPooled: "Pooled in Lot",
    addModalTitle: "List New Crop on Marketplace",
    cropNamePlaceholder: "Crop Name (e.g. Nashik Onions)",
    qtyPlaceholder: "Quantity (kg)",
    pricePlaceholder: "Base Price (₹/kg)",
    saveProduceBtn: "Publish Produce",
    cancelBtn: "Cancel",
    gradeA: "Premium Grade A+",
    gradeExport: "Export Quality",

    // FPO Portal
    fpoTitle: "Sahyadri Farmers Producer Company (FPO)",
    fpoGroupName: "FPO Virtual Lot Aggregation Center",
    fpoSubtitle: "142 Member Farmers Aggregated (Collective Bargaining Strength)",
    fpoStatSupply: "Total FPO Pooled Supply",
    fpoStatSupplySub: "+42% Higher Price Bargaining",
    fpoStatLots: "Active Virtual Lots",
    fpoStatLotsSub: "86 Member Farmers Included",
    fpoStatRfqs: "Institutional Demands",
    fpoStatRfqsSub: "Ready for Direct Supply",
    virtualLotsTitle: "Active Virtual Lot Aggregation",
    lockLotBtn: "Lock Lot",
    lockedBadge: "Lot Locked",
    poolingActive: "Pooling in Progress",
    institutionalDemandTitle: "Institutional Bulk Buyer Demands (RFQs)",
    fulfillmentLabel: "Fulfillment",

    // Buyer Portal
    buyerTitle: "Direct Buyer Portal",
    buyerSubtitle: "Computer Vision Certified Fresh Crops — Zero Middlemen Disintermediation",
    btnPostReq: "Post Bulk Requirement",
    buyerStatContracts: "Active Smart Contracts",
    buyerStatEscrow: "Locked Escrow Deposit",
    buyerStatQuality: "CV Quality Pass Rate",
    buyerOrdersTitle: "Recent Contracts & Procurement Orders",
    reqModalTitle: "Submit New Bulk Produce Requirement",
    submitReqBtn: "Publish Requirement",

    // Hub Operator Portal
    hubTitle: "Nashik Collection Micro-Hub #04",
    hubName: "Micro-Hub Computer Vision Grading Desk",
    hubSubtitle: "Quality Verification, QR Tagging & Cold-Storage Logistics",
    hubCropSelect: "Select Produce Lot",
    hubLotSize: "Lot Quantity (kg)",
    btnRunCv: "Run Computer Vision AI Inspection",
    analyzingCv: "AI Model Analyzing Defect Ratio & Color...",
    cvResultsTitle: "Quality Inspection Result",
    confidenceScore: "CV Confidence",
    ripenessScore: "Ripeness Ratio",
    defectScore: "Defect Ratio",
    fssaiStatus: "FSSAI Compliance",
    storageTemp: "Recommended Temp",
    shelfLife: "Est. Shelf-Life",
    qrGeneratedLabel: "Hub QR Tag Generated",
    printQrBtn: "Print & Tag QR Code",

    // Transporter Portal
    transporterTitle: "Logistics & Smart Route Optimizer Desk",
    transporterSubtitle: "Multi-stop Aggregation & Secure OTP Digital Handshake",
    fleetMetricsTitle: "Today's AI Route Performance",
    distanceLabel: "Total Distance",
    etaLabel: "Estimated Time",
    fuelSavingsLabel: "Fuel Savings",
    multiStopTitle: "Optimized Multi-Stop Pickup & Delivery Stops",
    pickupOtpLabel: "Pickup OTP",
    deliveryOtpLabel: "Delivery OTP",
    otpVerifyTitle: "Secure OTP Handshake Verification",
    otpVerifyPlaceholder: "Enter 4-digit OTP (e.g. 4829)",
    btnVerifyOtp: "Verify Handshake OTP",

    // Admin Governance
    adminTitle: "SIH 2026 PS 26033 National Mandi Governance",
    adminHeading: "Ministry & National Mandi Governance Control Room",
    adminSubtitle: "Ministry of Consumer Affairs, Food & Public Distribution — Direct Agri Trade Oversight",
    adminStatGmv: "Total National Agri GMV",
    adminStatWaste: "Post-Harvest Waste Prevented",
    adminStatIncome: "Farmer Net Income Gain",
    adminStatMandis: "Active Digital Micro-Hubs",
    recentLedgerTitle: "Transparent National Trade Ledger (Audit Trail)",
    colOrderId: "Contract ID",
    colBuyer: "Buyer",
    colFarmer: "Farmer / FPO",
    colAmount: "Amount",
    colDelivery: "Delivery Type",
    aiEnginesTitle: "Integrated AI Engines Realtime Health",

    // Cart Drawer
    cartEmpty: "Your cart is currently empty",
    cartSubtotal: "Subtotal",
    logisticsFee: "Smart Logistics Fee",
    gstTax: "GST (0% Exempt Agri)",
    totalAmount: "Total Amount",
    proceedOrder: "Execute Smart Contract",
    orderSuccessTitle: "Order Contract Successfully Executed!",
    orderSuccessDesc: "Automated dispatch order has been transmitted to farmer and micro-hub operator.",
    smartContractIdLabel: "Smart Contract ID",
    escrowStatusLabel: "Escrow Status",
    escrowLockedText: "Executed (Locked in Escrow)",
    closeBtn: "Close Contract",

    // Footer
    footerMission: "Kisan Diwas dedicated direct agricultural supply chain and logistics system. Smart India Hackathon 2026 Problem Statement 26033 (Ministry of Consumer Affairs, Food & Public Distribution).",
    aiEnginesCore: "AI Engine Core (6 AI Engines)",
    userRolesFooter: "User Personas (6 Personas)",
    helplineTitle: "Helpline & Support",
    helplineDesc: "Farmer Toll-Free IVR Helpline: 1800-KISAN-AI",
    allIndiaLangs247: "Available 24x7 in All Indian Languages",

    // India Translator Modal
    translatorHeader: "🇮🇳 All-India Multi-Language Agricultural Translator",
    translatorSub: "Instantly translate agricultural terms, mandi rates, smart contracts, and farmer queries across Indian languages.",
    sourceLangLabel: "Source Language (From)",
    targetLangLabel: "Target Language (To)",
    inputPlaceholder: "Enter agricultural question, crop listing description or message to translate...",
    translatedOutputPlaceholder: "Translated text will appear here...",
    quickAgriPhrasesTitle: "Quick Agricultural Phrases:",
    phrase1: "What is today's wholesale mandi price for tomatoes?",
    phrase2: "Produce inspected with Computer Vision AI and graded A+.",
    phrase3: "Smart contract payment securely deposited in farmer escrow.",
    phrase4: "Present OTP 4829 at the collection hub for vehicle pickup.",
    phrase5: "Virtual pool of 500kg wheat formed under FPO cooperative.",
    btnTranslate: "Translate",
    btnListen: "Listen (Speak)",
    btnCopy: "Copy Text",
    copiedNotice: "Copied to clipboard!",
    btnClear: "Clear",
    swapLanguages: "Swap Languages",

    // Common UI
    currencySymbol: "₹",
    paiseSuffix: "paise",
    statusAvailable: "Available",
    statusInTransit: "In Transit",
    statusDelivered: "Delivered",
    agmarknetConnected: "Agmarknet AI Mandi Connected",
    aiAnalyzing: "AI Model Analyzing Defect Ratio & Color Standard...",
    buyerActiveOrdersHeader: "Your Active Orders & Live Tracking",
    buyerHeaderBadge: "Direct Buyer Portal",
    buyerHeaderSub: "Computer Vision Certified Fresh Crops — Direct Purchase Without Middlemen",
    buyerPostReqBtn: "+ Post Bulk Demand Request",
    buyerRecurringContractsHeader: "Recurring Farm Supply Contracts (Smart Contracts)",
    buyerStatActiveOrders: "Active Orders",
    buyerStatFPOGuarantee: "Sahyadri FPO Guaranteed",
    buyerStatGPSLogistics: "GPS Live Logistics Tracking",
    buyerStatMandiSavings: "38% Mandi Cost Savings",
    buyerStatRecurringContracts: "Recurring Farm Supply Contracts",
    buyerStatTotalPurchase: "Total Purchase Value",
    buyerWelcome: "Welcome",
    cvGradingTitle: "Computer Vision AI Quality Grading",
    farmerAddNewCrop: "+ Register New Crop",
    farmerBadge: "Direct Farmer Portal • 0% Middleman Commission",
    fpoAcceptCommitmentBtn: "Accept Supply Commitment",
    fpoFulfilledPercent: "Fulfilled Quantity",
    fpoHeaderBadge: "FPO Virtual Lot Aggregation Center",
    fpoHeaderSub: "Manager: Sanjay Deshmukh • 142 Member Farmers Pooled (Collective Bargaining Power)",
    fpoLockLotBtn: "Lock Lot & Send Demand Offer",
    fpoLotLockedStatus: "Lot Secured & Dispatched",
    fpoSectionBuyerReqs: "Bulk Buyer Demand Requests",
    fpoSectionVirtualLots: "Virtual Aggregated Crop Lots",
    fpoStatBargaining: "+42% Better Price Bargaining",
    fpoStatBuyerReqs: "Institutional Buyer Requests",
    fpoStatMembersIncluded: "86 Member Farmers Included",
    fpoStatReadySupply: "Ready for Direct Supply",
    fpoStatTotalSupply: "Total FPO Aggregated Supply",
    fpoStatVirtualLots: "Active Virtual Lots",
    gradeResults: "Quality Inspection Result:",
    helplineText: "Toll-Free IVR Voice Helpline: 1800-KISAN-AI (Keypad Phone Crop Registration)",
    ivrGuideHeader: "Toll-Free IVR Voice Service Directory (1800-KISAN-AI)",
    ivrGuideSub: "Helpline instructions for registering crops using standard keypad feature phones without internet",
    keypad1Desc: "Press 1 on toll-free call to record your crop type and quantity via voice message.",
    keypad1Sub: "Crop Sale Registration",
    keypad1Title: "Keypad Button 1",
    keypad2Desc: "Press 2 on toll-free call to hear real-time AI minimum support price for your nearest mandi.",
    keypad2Sub: "Live Mandi Rates (Agmarknet)",
    keypad2Title: "Keypad Button 2",
    keypad3Desc: "Press 3 on toll-free call to check your bank account balance and pending payout status.",
    keypad3Sub: "Account Balance & Escrow Status",
    keypad3Title: "Keypad Button 3",
    myRegisteredCrops: "Your Registered Crops",
    qrGenerated: "Hub QR Tag Generated",
    selectDashboardTitle: "Select User Dashboard Persona",
    statAIEngines: "Smart Agri Engines",
    statAIEnginesDesc: "Fair Price + Logistics",
    statActiveListings: "Active Market Listings",
    statCVGrading: "Computer Vision Grading",
    statCVGradingDesc: "FSSAI Certification",
    statEarnedIncome: "Total Direct Earned Income",
    statEscrowProtected: "Protected Escrow Payment",
    statMiddlemenDesc: "Direct Farmer Escrow",
    statNoInternet: "No Internet Assistance",
    statNoInternetDesc: "Keypad Phone Service",
    statSmartContracts: "Smart Contracts Executed",
    statVerifiedByAI: "Verified by Fair Price AI",
    statZeroCommission: "Zero Commission",
    uploadPrompt: "Upload produce photo (or run AI Simulation)",
  },

  pa: {
    // Punjabi
    appName: "Nira",
    subTitle: "ਖੇਤਾਂ ਤੋਂ ਸਿੱਧਾ ਖਰੀਦਦਾਰ ਤੱਕ — ਬਿਨਾਂ ਵਿਚੋਲਿਆਂ ਦੇ",
    tagline: "ਭਾਰਤ ਦਾ ਪਹਿਲਾ AI ਸੰਚਾਲਿਤ ਸਿੱਧਾ ਖੇਤੀਬਾੜੀ ਮੰਡੀ ਅਤੇ ਲੌਜਿਸਟਿਕਸ ਮੰਚ",
    activeRoleLabel: "ਸਰਗਰਮ ਭੂਮਿਕਾ",
    navHome: "ਖੇਤੀ ਮੰਡੀ",
    navFarmer: "ਕਿਸਾਨ ਪੋਰਟਲ",
    navFPO: "ਐਫਪੀਓ ਸਮੂਹ",
    navBuyer: "ਸਿੱਧਾ ਖਰੀਦਦਾਰ",
    navHub: "ਕੁਆਲਿਟੀ ਜਾਂਚ ਕੇਂਦਰ",
    navTransporter: "ਆਵਾਜਾਈ ਅਤੇ ਲੌਜਿਸਟਿਕਸ",
    navAdmin: "ਰਾਸ਼ਟਰੀ ਮੰਡੀ ਸ਼ਾਸਨ",
    cartTitle: "ਤੁਹਾਡੀ ਖਰੀਦਦਾਰੀ ਟੋਕਰੀ",
    cartButton: "ਖਰੀਦਦਾਰੀ ਟੋਕਰੀ",
    checkout: "ਸੁਰੱਖਿਅਤ ਇਕਰਾਰਨਾਮਾ ਭੁਗਤਾਨ",
    translatorTitle: "ਭਾਰਤ ਬਹੁਭਾਸ਼ੀ ਅਨੁਵਾਦਕ",
    translatorBtn: "🇮🇳 ਅਨੁਵਾਦਕ (Translator)",
    selectLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ",
    kisanPlatformBadge: "ਕਿਸਾਨ ਦਿਵਸ ਐਗਰੀ-ਟੈਕ ਮੰਚ",

    roleFarmer: "ਕਿਸਾਨ ਪੋਰਟਲ",
    roleFPO: "ਐਫਪੀਓ ਮੈਨੇਜਰ",
    roleBuyer: "ਸਿੱਧਾ ਖਰੀਦਦਾਰ",
    roleHub: "ਮਾਈਕ੍ਰੋ-ਹੱਬ ਅਧਿਕਾਰੀ",
    roleTransporter: "ਲੌਜਿਸਟਿਕਸ ਅਤੇ ਟਰਾਂਸਪੋਰਟਰ",
    roleAdmin: "ਸਰਕਾਰੀ ਪ੍ਰਸ਼ਾਸਨ",
    roleFarmerSub: "ਵਾਜਬ ਮੁੱਲ ਅਤੇ IVR",
    roleFPOSub: "ਵਰਚੁਅਲ ਲਾਟ ਇਕੱਤਰੀਕਰਨ",
    roleBuyerSub: "ਥੋਕ ਮੰਗ ਅਤੇ ਇਕਰਾਰਨਾਮਾ",
    roleHubSub: "CV ਗ੍ਰੇਡਿੰਗ ਅਤੇ QR",
    roleTransporterSub: "ਰੂਟ ਅਨੁਕੂਲਨ ਅਤੇ OTP",
    roleAdminSub: "ਰਾਸ਼ਟਰੀ ਮੰਡੀ ਪ੍ਰਸ਼ਾਸਨ",
    selectDashboard: "ਉਪਭੋਗਤਾ ਡੈਸ਼ਬੋਰਡ ਚੁਣੋ",
    integratedRolesCount: "6 ਏਕੀਕ੍ਰਿਤ ਭੂਮਿਕਾਵਾਂ",

    heroBadge: "SIH 2026 PS 26033 • ਕਿਸਾਨ ਦਿਵਸ ਸਮਰਪਿਤ ਸਿੱਧਾ ਖੇਤੀ ਮੰਚ",
    heroTitle: "ਕਿਸਾਨਾਂ ਦੀ ਫਸਲ ਦਾ ਸਿੱਧਾ ਵਾਜਬ ਮੁੱਲ, AI ਦੀ ਤਾਕਤ ਨਾਲ",
    heroDesc: "ਵਿਚੋਲਿਆਂ ਤੋਂ ਬਿਨਾਂ ਸਿੱਧੀ ਵਿਕਰੀ, ਕੰਪਿਊਟਰ ਵਿਜ਼ਨ ਆਟੋਮੈਟਿਕ ਕੁਆਲਿਟੀ ਗ੍ਰੇਡਿੰਗ ਅਤੇ 0% ਫਸਲ ਬਰਬਾਦੀ।",
    heroCTA: "ਤਾਜ਼ਾ ਫਸਲਾਂ ਦੇਖੋ",
    ivrCTA: "ਫੋਨ ਰਾਹੀਂ ਵੇਚੋ (IVR ਸੇਵਾ)",
    tollFreeNotice: "ਟੋਲ-ਫ੍ਰੀ IVR ਵੌਇਸ ਹੈਲਪਲਾਈਨ: 1800-KISAN-AI (ਕੀਪੈਡ ਫੋਨ ਰਜਿਸਟ੍ਰੇਸ਼ਨ)",
    statMiddlemen: "0%",
    statMiddlemenSub: "ਵਿਚੋਲੀਆ ਕਮਿਸ਼ਨ (ਸਿੱਧਾ ਕਿਸਾਨ ਐਸਕਰੋ)",
    statCvGrading: "99.4%",
    statCvGradingSub: "ਕੰਪਿਊਟਰ ਵਿਜ਼ਨ ਗ੍ਰੇਡਿੰਗ (FSSAI ਪ੍ਰਮਾਣਿਤ)",
    statAiEngines: "6 AI",
    statAiEnginesSub: "ਸਮਾਰਟ ਐਗਰੀ ਇੰਜਣ (ਵਾਜਬ ਮੁੱਲ + ਰੂਟ)",
    statIvrPhone: "IVR/SMS",
    statIvrPhoneSub: "ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ ਸੇਵਾ (ਕੀਪੈਡ ਫੋਨ ਸਹਾਇਤਾ)",

    liveMandiTicker: "ਲਾਈਵ ਮੰਡੀ ਭਾਅ (Agmarknet ਰੀਅਲਟਾਈਮ):",
    tickerCrop1: "ਤਾਜ਼ਾ ਟਮਾਟਰ (ਗ੍ਰੇਡ A+)",
    tickerCrop2: "ਨਾਸਿਕ ਲਾਲ ਪਿਆਜ਼",
    tickerCrop3: "ਇੰਦੌਰ ਜੋਤੀ ਆਲੂ",
    tickerCrop4: "ਸ਼ਰਬਤੀ ਪ੍ਰੀਮੀਅਮ ਕਣਕ",
    tickerCrop5: "ਪੀਲਾ ਸੋਇਆਬੀਨ",
    tickerCrop6: "ਦੇਸੀ ਲਸਣ",

    marketplaceTitle: "ਪ੍ਰਮਾਣਿਤ ਤਾਜ਼ੀ ਫਸਲ ਮੰਡੀ",
    marketplaceSubtitle: "ਪ੍ਰਮਾਣਿਤ ਕੁਆਲਿਟੀ ਅਤੇ ਪਾਰਦਰਸ਼ੀ ਐਸਕਰੋ ਨਾਲ ਤਾਜ਼ੀ ਫਸਲ ਖਰੀਦੋ",
    filterAll: "ਸਾਰੀਆਂ ਫਸਲਾਂ",
    filterGradeA: "ਸਿਰਫ਼ ਗ੍ਰੇਡ A / A+",
    filterOrganic: "ਸਿਰਫ਼ ਜੈਵਿਕ ਫਸਲਾਂ",
    pricePerKg: "ਪ੍ਰਤੀ ਕਿੱਲੋ",
    availableQty: "ਉਪਲਬਧ ਮਾਤਰਾ",
    gradeLabel: "ਕੁਆਲਿਟੀ ਗ੍ਰੇਡ",
    locationLabel: "ਸਥਾਨ / ਹੱਬ",
    farmerLabel: "ਕਿਸਾਨ / ਐਫਪੀਓ",
    addToCart: "ਟੋਕਰੀ ਵਿੱਚ ਸ਼ਾਮਲ ਕਰੋ",
    buyNow: "ਹੁਣੇ ਖਰੀਦੋ",
    categoryVeg: "ਸਬਜ਼ੀਆਂ",
    categoryTubers: "ਕੰਦਮੂਲ",
    categoryGrains: "ਅਨਾਜ",
    organicBadge: "100% ਜੈਵਿਕ",
    cvTrustScore: "CV ਵਿਸ਼ਵਾਸ ਸਕੋਰ",
    fairPriceAiTag: "Fair Price AI ਮੁੱਲ",

    fairPriceHeader: "ਵਾਜਬ ਮੁੱਲ AI ਇੰਜਣ — ਸਰਕਾਰੀ ਐਮਐਸਪੀ ਤੋਂ ਬਿਹਤਰ ਭਾਅ",
    ivrHeader: "ਸਮਾਰਟਫੋਨ ਨਹੀਂ? ਡਾਇਲ ਕਰੋ 1800-KISAN-AI (ਕੀਪੈਡ ਸੇਵਾ)",
    ivrSubtitle: "ਕੀਪੈਡ ਬਟਨ ਦਬਾਓ ਜਾਂ ਬੋਲ ਕੇ ਫਸਲ ਵੇਚੋ — ਤੁਰੰਤ SMS ਪੁਸ਼ਟੀ",
    press1: "1: ਟਮਾਟਰ ਦਰਜ ਕਰਨ ਲਈ",
    press2: "2: ਪਿਆਜ਼ ਦਰਜ ਕਰਨ ਲਈ",
    press3: "3: ਆਲੂ ਦਰਜ ਕਰਨ ਲਈ",
    simulatedCall: "ਕੀਪੈਡ ਸੇਵਾ ਚਲਾਓ",
    callSuccess: "SMS ਭੇਜਿਆ ਗਿਆ! ਫਸਲ ਸਫਲਤਾਪੂਰਵਕ ਦਰਜ ਹੋ ਗਈ।",

    farmerPortalTitle: "ਸਿੱਧਾ ਕਿਸਾਨ ਪੋਰਟਲ • 0% ਵਿਚੋਲੀਆ ਕਮਿਸ਼ਨ",
    farmerWelcome: "ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ",
    farmerSubtitle: "ਤੁਹਾਡੀ ਫਸਲ ਸਿੱਧੀ ਪ੍ਰਮਾਣਿਤ ਖਰੀਦਦਾਰਾਂ ਨੂੰ ਵਾਜਬ ਮੁੱਲ ਉੱਤੇ ਵਿਕਦੀ ਹੈ",
    btnListProduce: "ਨਵੀਂ ਫਸਲ ਦਰਜ ਕਰੋ",
    btnIvrService: "IVR ਵੌਇਸ ਸੇਵਾ",
    farmerStatActive: "ਸਰਗਰਮ ਫਸਲ ਸੂਚੀਆਂ",
    farmerStatPriceGain: "ਵਾਜਬ ਮੁੱਲ ਵਾਧਾ",
    farmerStatEscrow: "ਐਸਕਰੋ ਵਿੱਚ ਸੁਰੱਖਿਅਤ ਰਕਮ",
    myListingsTitle: "ਤੁਹਾਡੀਆਂ ਰਜਿਸਟਰਡ ਫਸਲਾਂ",
    colCrop: "ਫਸਲ ਦਾ ਨਾਂ",
    colQty: "ਮਾਤਰਾ",
    colPrice: "ਮੁੱਲ",
    colGrade: "ਕੁਆਲਿਟੀ ਗ੍ਰੇਡ",
    colLocation: "ਹੱਬ ਸਥਾਨ",
    colStatus: "ਸਥਿਤੀ",
    statusVerified: "ਪ੍ਰਮਾਣਿਤ ਫਸਲ",
    statusPooled: "ਪੂਲ ਵਿੱਚ ਸ਼ਾਮਲ",
    addModalTitle: "ਮੰਡੀ ਵਿੱਚ ਨਵੀਂ ਫਸਲ ਸ਼ਾਮਲ ਕਰੋ",
    cropNamePlaceholder: "ਫਸਲ ਦਾ ਨਾਂ (ਜਿਵੇਂ ਸ਼ਰਬਤੀ ਕਣਕ)",
    qtyPlaceholder: "ਮਾਤਰਾ (ਕਿੱਲੋ)",
    pricePlaceholder: "ਬੇਸ ਪ੍ਰਤੀ ਕਿੱਲੋ ਭਾਅ (₹)",
    saveProduceBtn: "ਫਸਲ ਪ੍ਰਕਾਸ਼ਿਤ ਕਰੋ",
    cancelBtn: "ਰੱਦ ਕਰੋ",
    gradeA: "ਉੱਚਤਮ ਗ੍ਰੇਡ A+",
    gradeExport: "ਨਿਰਯਾਤ ਗ੍ਰੇਡ",

    fpoTitle: "ਸਹਿਯਾਦਰੀ ਕਿਸਾਨ ਉਤਪਾਦਕ ਐਫਪੀਓ",
    fpoGroupName: "ਐਫਪੀਓ ਵਰਚੁਅਲ ਲਾਟ ਇਕੱਤਰੀਕਰਨ ਕੇਂਦਰ",
    fpoSubtitle: "142 ਮੈਂਬਰ ਕਿਸਾਨ ਇਕੱਠੇ (ਸਮੂਹਿਕ ਸੌਦੇਬਾਜ਼ੀ ਤਾਕਤ)",
    fpoStatSupply: "ਕੁੱਲ ਐਫਪੀਓ ਇਕੱਠੀ ਸਪਲਾਈ",
    fpoStatSupplySub: "+42% ਬਿਹਤਰ ਮੁੱਲ ਸੌਦੇਬਾਜ਼ੀ",
    fpoStatLots: "ਸਰਗਰਮ ਵਰਚੁਅਲ ਲਾਟ",
    fpoStatLotsSub: "86 ਮੈਂਬਰ ਕਿਸਾਨ ਸ਼ਾਮਲ ਹਨ",
    fpoStatRfqs: "ਸੰਸਥਾਗਤ ਮੰਗ ਪੇਸ਼ਕਸ਼ਾਂ",
    fpoStatRfqsSub: "ਸਿੱਧੀ ਸਪਲਾਈ ਲਈ ਤਿਆਰ",
    virtualLotsTitle: "ਸਰਗਰਮ ਵਰਚੁਅਲ ਲਾਟ ਇਕੱਤਰੀਕਰਨ",
    lockLotBtn: "ਲਾਟ ਲਾਕ ਕਰੋ",
    lockedBadge: "ਲਾਟ ਲਾਕ ਕੀਤੀ ਗਈ",
    poolingActive: "ਪੂਲਿੰਗ ਜਾਰੀ ਹੈ",
    institutionalDemandTitle: "ਸੰਸਥਾਗਤ ਖਰੀਦਦਾਰ ਮੰਗਾਂ (RFQs)",
    fulfillmentLabel: "ਮੰਗ ਪੂਰਤੀ",

    buyerTitle: "ਸਿੱਧਾ ਖਰੀਦਦਾਰ ਪੋਰਟਲ",
    buyerSubtitle: "ਕੰਪਿਊਟਰ ਵਿਜ਼ਨ ਪ੍ਰਮਾਣਿਤ ਤਾਜ਼ੀਆਂ ਫਸਲਾਂ — ਸਿੱਧੀ ਖਰੀਦ",
    btnPostReq: "ਥੋਕ ਮੰਗ ਪੋਸਟ ਕਰੋ",
    buyerStatContracts: "ਸਰਗਰਮ ਸਮਾਰਟ ਇਕਰਾਰਨਾਮੇ",
    buyerStatEscrow: "ਐਸਕਰੋ ਜਮ੍ਹਾਂ ਰਕਮ",
    buyerStatQuality: "CV ਕੁਆਲਿਟੀ ਪਾਸ ਦਰ",
    buyerOrdersTitle: "ਹਾਲੀਆ ਇਕਰਾਰਨਾਮੇ ਅਤੇ ਆਰਡਰ",
    reqModalTitle: "ਨਵੀਂ ਥੋਕ ਖਰੀਦ ਮੰਗ ਦਰਜ ਕਰੋ",
    submitReqBtn: "ਮੰਗ ਪ੍ਰਕਾਸ਼ਿਤ ਕਰੋ",

    hubTitle: "ਨਾਸਿਕ ਸੰਗ੍ਰਹਿ ਹੱਬ #04",
    hubName: "ਮਾਈਕ੍ਰੋ-ਹੱਬ ਕੰਪਿਊਟਰ ਵਿਜ਼ਨ ਗ੍ਰੇਡਿੰਗ ਡੈਸਕ",
    hubSubtitle: "ਕੁਆਲਿਟੀ ਜਾਂਚ, QR ਟੈਗਿੰਗ ਅਤੇ ਕੋਲਡ-ਸਟੋਰੇਜ ਪ੍ਰਬੰਧਨ",
    hubCropSelect: "ਫਸਲ ਚੁਣੋ",
    hubLotSize: "ਲਾਟ ਮਾਤਰਾ (ਕਿੱਲੋ)",
    btnRunCv: "ਕੰਪਿਊਟਰ ਵਿਜ਼ਨ AI ਜਾਂਚ ਚਲਾਓ",
    analyzingCv: "AI ਕੁਆਲਿਟੀ ਵਿਸ਼ਲੇਸ਼ਣ ਜਾਰੀ ਹੈ...",
    cvResultsTitle: "ਕੁਆਲਿਟੀ ਜਾਂਚ ਨਤੀਜੇ",
    confidenceScore: "CV ਵਿਸ਼ਵਾਸ",
    ripenessScore: "ਪੱਕਣ ਦਾ ਅਨੁਪਾਤ",
    defectScore: "ਨੁਕਸ ਦਰ",
    fssaiStatus: "FSSAI ਪ੍ਰਮਾਣੀਕਰਨ",
    storageTemp: "ਸੁਝਾਇਆ ਗਿਆ ਤਾਪਮਾਨ",
    shelfLife: "ਅਨੁਮਾਨਿਤ ਸ਼ੈਲਫ-ਲਾਈਫ",
    qrGeneratedLabel: "ਹੱਬ QR ਲੇਬਲ ਤਿਆਰ",
    printQrBtn: "QR ਲੇਬਲ ਪ੍ਰਿੰਟ ਅਤੇ ਟੈਗ ਕਰੋ",

    transporterTitle: "ਲੌਜਿਸਟਿਕਸ ਅਤੇ ਸਮਾਰਟ ਰੂਟ ਡੈਸਕ",
    transporterSubtitle: "ਮਲਟੀ-ਸਟਾਪ ਪਿਕਅੱਪ ਅਤੇ ਸੁਰੱਖਿਅਤ OTP ਡਿਜੀਟਲ ਹੈਂਡਸ਼ੇਕ",
    fleetMetricsTitle: "ਅੱਜ ਦਾ AI ਰੂਟ ਪ੍ਰਦਰਸ਼ਨ",
    distanceLabel: "ਕੁੱਲ ਦੂਰੀ",
    etaLabel: "ਅਨੁਮਾਨਿਤ ਸਮਾਂ",
    fuelSavingsLabel: "ਤੇਲ ਬੱਚਤ",
    multiStopTitle: "ਅਨੁਕੂਲਿਤ ਮਲਟੀ-ਸਟਾਪ ਪਿਕਅੱਪ ਅਤੇ ਡਿਲੀਵਰੀ ਰੂਟ",
    pickupOtpLabel: "ਪਿਕਅੱਪ OTP",
    deliveryOtpLabel: "ਡਿਲੀਵਰੀ OTP",
    otpVerifyTitle: "ਸੁਰੱਖਿਅਤ OTP ਹੈਂਡਸ਼ੇਕ ਤਸਦੀਕ",
    otpVerifyPlaceholder: "4-ਅੰਕੀ OTP ਦਰਜ ਕਰੋ (ਜਿਵੇਂ 4829)",
    btnVerifyOtp: "OTP ਤਸਦੀਕ ਕਰੋ",

    adminTitle: "SIH 2026 PS 26033 ਰਾਸ਼ਟਰੀ ਮੰਡੀ ਸ਼ਾਸਨ",
    adminHeading: "ਮੰਤਰਾਲਾ ਅਤੇ ਰਾਸ਼ਟਰੀ ਮੰਡੀ ਸ਼ਾਸਨ ਕੰਟਰੋਲ ਰੂਮ",
    adminSubtitle: "ਖਪਤਕਾਰ ਮਾਮਲੇ, ਖੁਰਾਕ ਅਤੇ ਜਨਤਕ ਵੰਡ ਮੰਤਰਾਲਾ — ਖੇਤੀ ਵਪਾਰ ਨਿਗਰਾਨੀ",
    adminStatGmv: "ਕੁੱਲ ਰਾਸ਼ਟਰੀ ਖੇਤੀ ਵਪਾਰ (GMV)",
    adminStatWaste: "ਬਚਾਈ ਗਈ ਫਸਲ ਬਰਬਾਦੀ",
    adminStatIncome: "ਕਿਸਾਨਾਂ ਦੀ ਸ਼ੁੱਧ ਆਮਦਨ ਵਾਧਾ",
    adminStatMandis: "ਸਰਗਰਮ ਡਿਜੀਟਲ ਹੱਬ",
    recentLedgerTitle: "ਪਾਰਦਰਸ਼ੀ ਰਾਸ਼ਟਰੀ ਖਾਤਾ ਵਹੀ (Audit Trail)",
    colOrderId: "ਇਕਰਾਰਨਾਮਾ ID",
    colBuyer: "ਖਰੀਦਦਾਰ",
    colFarmer: "ਕਿਸਾਨ / ਐਫਪੀਓ",
    colAmount: "ਰਕਮ",
    colDelivery: "ਸਪਲਾਈ ਕਿਸਮ",
    aiEnginesTitle: "ਏਕੀਕ੍ਰਿਤ AI ਇੰਜਣ ਸਥਿਤੀ",

    cartEmpty: "ਤੁਹਾਡੀ ਟੋਕਰੀ ਅਜੇ ਖਾਲੀ ਹੈ",
    cartSubtotal: "ਉਪ-ਕੁੱਲ ਰਕਮ",
    logisticsFee: "ਸਮਾਰਟ ਲੌਜਿਸਟਿਕਸ ਫੀਸ",
    gstTax: "ਜੀਐਸਟੀ (0% ਛੋਟ)",
    totalAmount: "ਕੁੱਲ ਭੁਗਤਾਨਯੋਗ ਰਕਮ",
    proceedOrder: "ਸਮਾਰਟ ਇਕਰਾਰਨਾਮਾ ਲਾਗੂ ਕਰੋ",
    orderSuccessTitle: "ਆਰਡਰ ਇਕਰਾਰਨਾਮਾ ਸਫਲਤਾਪੂਰਵਕ ਲਾਗੂ ਹੋਇਆ!",
    orderSuccessDesc: "ਕਿਸਾਨ ਅਤੇ ਹੱਬ ਅਧਿਕਾਰੀ ਨੂੰ ਸਵੈਚਲਿਤ ਆਰਡਰ ਭੇਜ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
    smartContractIdLabel: "ਸਮਾਰਟ ਇਕਰਾਰਨਾਮਾ ID",
    escrowStatusLabel: "ਐਸਕਰੋ ਸਥਿਤੀ",
    escrowLockedText: "ਲਾਗੂ (ਐਸਕਰੋ ਵਿੱਚ ਸੁਰੱਖਿਅਤ)",
    closeBtn: "ਬੰਦ ਕਰੋ (Close)",

    footerMission: "ਕਿਸਾਨ ਦਿਵਸ ਸਮਰਪਿਤ ਸਿੱਧੀ ਖੇਤੀਬਾੜੀ ਸਪਲਾਈ ਅਤੇ ਲੌਜਿਸਟਿਕਸ ਪ੍ਰਣਾਲੀ। Smart India Hackathon 2026 Problem Statement 26033।",
    aiEnginesCore: "AI ਇੰਜਣ ਕੋਰ (6 AI Engines)",
    userRolesFooter: "ਉਪਭੋਗਤਾ ਭੂਮਿਕਾਵਾਂ (6 Personas)",
    helplineTitle: "ਹੈਲਪਲਾਈਨ ਅਤੇ ਸਹਾਇਤਾ",
    helplineDesc: "ਕਿਸਾਨ ਟੋਲ-ਫ੍ਰੀ IVR ਹੈਲਪਲਾਈਨ: 1800-KISAN-AI",
    allIndiaLangs247: "24x7 ਸਾਰੀਆਂ ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਉਪਲਬਧ",

    translatorHeader: "🇮🇳 ਭਾਰਤ ਬਹੁਭਾਸ਼ੀ ਖੇਤੀ ਅਨੁਵਾਦਕ (All-India Multi-Language Translator)",
    translatorSub: "ਭਾਰਤ ਦੀਆਂ ਪ੍ਰਮੁੱਖ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਖੇਤੀਬਾੜੀ ਸ਼ਬਦ, ਮੰਡੀ ਭਾਅ ਅਤੇ ਸੁਨੇਹਿਆਂ ਦਾ ਤੁਰੰਤ ਅਨੁਵਾਦ।",
    sourceLangLabel: "ਸਰੋਤ ਭਾਸ਼ਾ (ਤੋਂ)",
    targetLangLabel: "ਲਕਸ਼ ਭਾਸ਼ਾ (ਵੱਲ)",
    inputPlaceholder: "ਅਨੁਵਾਦ ਕਰਨ ਲਈ ਖੇਤੀ ਸਵਾਲ, ਫਸਲ ਵੇਰਵਾ ਜਾਂ ਸੁਨੇਹਾ ਦਰਜ ਕਰੋ...",
    translatedOutputPlaceholder: "ਅਨੁਵਾਦ ਕੀਤਾ ਗਿਆ ਪਾਠ ਇੱਥੇ ਦਿਖਾਈ ਦੇਵੇਗਾ...",
    quickAgriPhrasesTitle: "ਤੁਰੰਤ ਖੇਤੀ ਵਾਕ:",
    phrase1: "ਅੱਜ ਮੰਡੀ ਵਿੱਚ ਟਮਾਟਰ ਦਾ ਥੋਕ ਭਾਅ ਕੀ ਹੈ?",
    phrase2: "ਫਸਲ ਕੰਪਿਊਟਰ ਵਿਜ਼ਨ AI ਦੁਆਰਾ ਪ੍ਰਮਾਣਿਤ ਅਤੇ ਗ੍ਰੇਡ A+ ਹੈ।",
    phrase3: "ਸਮਾਰਟ ਇਕਰਾਰਨਾਮੇ ਦਾ ਭੁਗਤਾਨ ਸੁਰੱਖਿਅਤ ਢੰਗ ਨਾਲ ਕਿਸਾਨ ਐਸਕਰੋ ਵਿੱਚ ਜਮ੍ਹਾਂ ਹੈ।",
    phrase4: "ਗੱਡੀ ਪਿਕਅੱਪ ਲਈ ਹੱਬ ਉੱਤੇ 4829 OTP ਪੇਸ਼ ਕਰੋ।",
    phrase5: "ਐਫਪੀਓ ਸਮੂਹ ਵਿੱਚ 500 ਕਿੱਲੋ ਕਣਕ ਦਾ ਵਰਚੁਅਲ ਪੂਲ ਬਣਾਇਆ ਗਿਆ।",
    btnTranslate: "ਅਨੁਵਾਦ ਕਰੋ",
    btnListen: "ਸੁਣੋ (Speak)",
    btnCopy: "ਕਾਪੀ ਕਰੋ",
    copiedNotice: "ਕਾਪੀ ਹੋ ਗਿਆ!",
    btnClear: "ਸਾਫ਼ ਕਰੋ",
    swapLanguages: "ਭਾਸ਼ਾਵਾਂ ਬਦਲੋ",

    currencySymbol: "₹",
    paiseSuffix: "ਪੈਸੇ",
    statusAvailable: "ਉਪਲਬਧ",
    statusInTransit: "ਆਵਾਜਾਈ ਵਿੱਚ",
    statusDelivered: "ਸਫਲਤਾਪੂਰਵਕ ਪਹੁੰਚਾਇਆ",
  },

  mr: {
    // Marathi
    appName: "Nira",
    subTitle: "शेतातून थेट ग्राहकांपर्यंत — मध्यस्थांशिवाय",
    tagline: "भारताचे पहिले AI संचलित थेट कृषी बाजारपेठ व लॉजिस्टिक्स व्यासपीठ",
    activeRoleLabel: "सक्रिय भूमिका",
    navHome: "कृषी बाजार",
    navFarmer: "शेतकरी दालन",
    navFPO: "एफपीओ गट",
    navBuyer: "थेट खरेदीदार",
    navHub: "गुणवत्ता तपासणी केंद्र",
    navTransporter: "वाहतूक व लॉजिस्टिक्स",
    navAdmin: "राष्ट्रीय मंडी प्रशासन",
    cartTitle: "तुमची खरेदी टोपली",
    cartButton: "खरेदी टोपली",
    checkout: "सुरक्षित करार देयक",
    translatorTitle: "भारत बहुभाषिक अनुवादक",
    translatorBtn: "🇮🇳 अनुवादक (Translator)",
    selectLanguage: "भाषा निवडा",
    kisanPlatformBadge: "किसान दिवस ॲग्री-टेक मंच",

    roleFarmer: "शेतकरी दालन",
    roleFPO: "एफपीओ व्यवस्थापक",
    roleBuyer: "थेट खरेदीदार",
    roleHub: "मायक्रो-हब अधिकारी",
    roleTransporter: "वाहतूकदार भागीदार",
    roleAdmin: "मंत्रालय व प्रशासन",
    roleFarmerSub: "रास्त भाव व IVR",
    roleFPOSub: "व्हर्च्युअल लॉट एकत्रीकरण",
    roleBuyerSub: "घाऊक मागणी व करार",
    roleHubSub: "CV प्रतवारी व QR",
    roleTransporterSub: "मार्ग अनुकूलन व OTP",
    roleAdminSub: "राष्ट्रीय कृषी शासन",
    selectDashboard: "वापरकर्ता डॅशबोर्ड निवडा",
    integratedRolesCount: "६ एकात्मिक भूमिका",

    heroBadge: "SIH 2026 PS 26033 • शेतकरी समर्पित थेट कृषी व्यासपीठ",
    heroTitle: "शेतकऱ्यांच्या मालाला थेट रास्त भाव, AI च्या सामर्थ्याने",
    heroDesc: "मध्यस्थांशिवाय थेट विक्री, संगणक दृष्टी (CV) द्वारे स्वयंचलित गुणवत्ता प्रतवारी आणि शून्य नासाडी.",
    heroCTA: "ताजा शेतमाल पहा",
    ivrCTA: "फोनवरून विका (IVR सेवा)",
    tollFreeNotice: "टोल-फ्री IVR व्हॉइस हेल्पलाइन: 1800-KISAN-AI (कीपॅड फोन नोंदणी)",
    statMiddlemen: "0%",
    statMiddlemenSub: "दलाली कमिशन (थेट शेतकरी एस्क्रॉ)",
    statCvGrading: "99.4%",
    statCvGradingSub: "संगणक दृष्टी प्रतवारी (FSSAI प्रमाणित)",
    statAiEngines: "6 AI",
    statAiEnginesSub: "स्मार्ट कृषी इंजिन (रास्त भाव + लॉजिस्टिक्स)",
    statIvrPhone: "IVR/SMS",
    statIvrPhoneSub: "इंटरनेटशिवाय सेवा (कीपॅड फोन साहाय्य)",

    liveMandiTicker: "थेट बाजार भाव (Agmarknet रिअल-टाईम):",
    tickerCrop1: "ताजे टोमॅटो (ग्रेड A+)",
    tickerCrop2: "नाशिक लाल कांदा",
    tickerCrop3: "इंदूर ज्योती बटाटा",
    tickerCrop4: "शरबती प्रीमियम गहू",
    tickerCrop5: "पिवळा सोयाबीन",
    tickerCrop6: "गावरान लसूण",

    marketplaceTitle: "प्रमाणित ताजा शेतमाल बाजार",
    marketplaceSubtitle: "संगणक दृष्टीने प्रमाणित शेतमाल पारदर्शक एस्क्रॉ द्वारे थेट खरेदी करा",
    filterAll: "सर्व पिके",
    filterGradeA: "फक्त उच्च दर्जा A / A+",
    filterOrganic: "फक्त सेंद्रिय पिके",
    pricePerKg: "प्रति किलो",
    availableQty: "उपलब्ध प्रमाण",
    gradeLabel: "गुणवत्ता श्रेणी",
    locationLabel: "स्थान व संकलन हब",
    farmerLabel: "उत्पादक शेतकरी / FPO",
    addToCart: "टोपलीत जोडा",
    buyNow: "आत्ताच खरेदी करा",
    categoryVeg: "भाज्या",
    categoryTubers: "कंदमुळे",
    categoryGrains: "धान्य",
    organicBadge: "100% सेंद्रिय",
    cvTrustScore: "CV विश्वास निर्देशांक",
    fairPriceAiTag: "Fair Price AI दर",

    fairPriceHeader: "रास्त भाव AI इंजिन — हमीभावापेक्षा अधिक चांगला दर",
    ivrHeader: "स्मार्टफोन नाही? 1800-KISAN-AI वर कॉल करा",
    ivrSubtitle: "कीपॅड बटणे दाबून किंवा बोलून शेतमाल नोंदवा — तत्काळ SMS पुष्टी",
    press1: "१: टोमॅटो नोंदणीसाठी",
    press2: "२: कांदा नोंदणीसाठी",
    press3: "३: बटाटा नोंदणीसाठी",
    simulatedCall: "कीपॅड सेवा चाचणी",
    callSuccess: "SMS पाठवला! शेतमाल यशस्वीरीत्या नोंदवला गेला.",

    farmerPortalTitle: "थेट शेतकरी पोर्टल • ०% दलाली कमिशन",
    farmerWelcome: "नमस्कार",
    farmerSubtitle: "तुमचा शेतमाल थेट प्रमाणित खरेदीदारांना रास्त भावात विकला जातो",
    btnListProduce: "नवीन शेतमाल नोंदवा",
    btnIvrService: "IVR व्हॉइस सेवा",
    farmerStatActive: "सक्रिय पीक यादी",
    farmerStatPriceGain: "रास्त भाव नफा",
    farmerStatEscrow: "एस्क्रॉ मधील सुरक्षित रक्कम",
    myListingsTitle: "तुमचा नोंदणीकृत शेतमाल",
    colCrop: "पिकाचे नाव",
    colQty: "प्रमाण",
    colPrice: "भाव",
    colGrade: "गुणवत्ता प्रत",
    colLocation: "हब स्थान",
    colStatus: "स्थिती",
    statusVerified: "प्रमाणित शेतमाल",
    statusPooled: "पूल मध्ये समाविष्ट",
    addModalTitle: "बाजारात नवीन शेतमाल नोंदवा",
    cropNamePlaceholder: "पिकाचे नाव (उदा. लासलगाव कांदा)",
    qtyPlaceholder: "प्रमाण (किलो)",
    pricePlaceholder: "मूळ भाव (₹/किलो)",
    saveProduceBtn: "शेतमाल प्रकाशित करा",
    cancelBtn: "रद्द करा",
    gradeA: "सर्वोत्तम प्रत A+",
    gradeExport: "निर्यात प्रत",

    fpoTitle: "सह्याद्री शेतकरी उत्पादक कंपनी (FPO)",
    fpoGroupName: "एफपीओ व्हर्च्युअल लॉट एकत्रीकरण केंद्र",
    fpoSubtitle: "१४२ शेतकरी सदस्य एकत्रित (सामूहिक सौदेबाजी सामर्थ्य)",
    fpoStatSupply: "एकूण एफपीओ पुरवठा",
    fpoStatSupplySub: "+४२% चांगला भाव मिळवण्याची क्षमता",
    fpoStatLots: "सक्रिय व्हर्च्युअल लॉट्स",
    fpoStatLotsSub: "८६ शेतकरी सहभागी",
    fpoStatRfqs: "संस्थात्मक खरेदी मागण्या",
    fpoStatRfqsSub: "थेट पुरवठ्यासाठी तयार",
    virtualLotsTitle: "सक्रिय व्हर्च्युअल लॉट एकत्रीकरण",
    lockLotBtn: "लॉट लॉक करा",
    lockedBadge: "लॉट लॉक केला",
    poolingActive: "एकत्रीकरण सुरू",
    institutionalDemandTitle: "संस्थात्मक घाऊक खरेदीदारांच्या मागण्या (RFQs)",
    fulfillmentLabel: "मागणी पूर्तता",

    buyerTitle: "थेट खरेदीदार पोर्टल",
    buyerSubtitle: "संगणक दृष्टीने प्रमाणित ताजा शेतमाल — मध्यस्थांशिवाय थेट खरेदी",
    btnPostReq: "घाऊक मागणी नोंदवा",
    buyerStatContracts: "सक्रिय स्मार्ट करार",
    buyerStatEscrow: "एस्क्रॉ जमा रक्कम",
    buyerStatQuality: "CV गुणवत्ता उत्तीर्ण दर",
    buyerOrdersTitle: "अलीकडील करार व खरेदी आदेश",
    reqModalTitle: "नवीन घाऊक शेतमाल मागणी पाठवा",
    submitReqBtn: "मागणी प्रकाशित करा",

    hubTitle: "नाशिक संकलन हब #०४",
    hubName: "मायक्रो-हब संगणक दृष्टी प्रतवारी केंद्र",
    hubSubtitle: "गुणवत्ता तपासणी, QR टॅगिंग आणि शीतगृह व्यवस्थापन",
    hubCropSelect: "शेतमाल निवडा",
    hubLotSize: "लॉट प्रमाण (किलो)",
    btnRunCv: "संगणक दृष्टी AI चाचणी चालवा",
    analyzingCv: "AI गुणवत्ता विश्लेषण सुरू आहे...",
    cvResultsTitle: "गुणवत्ता तपासणी निकाल",
    confidenceScore: "CV विश्वासार्हता",
    ripenessScore: "पक्वता प्रमाण",
    defectScore: "दोष प्रमाण",
    fssaiStatus: "FSSAI प्रमाणीकरण",
    storageTemp: "शिफारस केलेले तापमान",
    shelfLife: "अंदाजे साठवणूक आयुष्य",
    qrGeneratedLabel: "हब QR लेबल तयार",
    printQrBtn: "QR लेबल प्रिंट व टॅग करा",

    transporterTitle: "लॉजिस्टिक्स व स्मार्ट मार्ग अनुकूलन दालन",
    transporterSubtitle: "मल्टी-स्टॉप एकत्रीकरण आणि सुरक्षित OTP डिजिटल हस्तांतरण",
    fleetMetricsTitle: "आजची AI मार्ग कामगिरी",
    distanceLabel: "एकूण अंतर",
    etaLabel: "अंदाजे वेळ",
    fuelSavingsLabel: "इंधन बचत",
    multiStopTitle: "अनुकूलित थांबे आणि वितरण मार्ग",
    pickupOtpLabel: "पिकअप OTP",
    deliveryOtpLabel: "डिलिव्हरी OTP",
    otpVerifyTitle: "सुरक्षित OTP डिजिटल पडताळणी",
    otpVerifyPlaceholder: "४-अंकी OTP टाका (उदा. ४८२९)",
    btnVerifyOtp: "OTP सत्यापित करा",

    adminTitle: "SIH 2026 PS 26033 राष्ट्रीय कृषी शासन",
    adminHeading: "मंत्रालय व राष्ट्रीय कृषी नियंत्रण कक्ष",
    adminSubtitle: "ग्राहक व्यवहार, अन्न आणि सार्वजनिक वितरण मंत्रालय — थेट कृषी व्यापार देखरेख",
    adminStatGmv: "एकूण राष्ट्रीय कृषी उलाढाल (GMV)",
    adminStatWaste: "टाळलेली शेतमाल नासाडी",
    adminStatIncome: "शेतकऱ्यांची निव्वळ नफा वाढ",
    adminStatMandis: "सक्रिय डिजिटल हब्स",
    recentLedgerTitle: "पारदर्शक राष्ट्रीय व्यवहार नोंदवही (Audit Trail)",
    colOrderId: "करार आयडी",
    colBuyer: "खरेदीदार",
    colFarmer: "शेतकरी / FPO",
    colAmount: "रक्कम",
    colDelivery: "वितरण प्रकार",
    aiEnginesTitle: "एकात्मिक AI इंजिन स्थिती",

    cartEmpty: "तुमची टोपली सध्या रिकामी आहे",
    cartSubtotal: "उप-एकूण रक्कम",
    logisticsFee: "स्मार्ट वाहतूक शुल्क",
    gstTax: "जीएसटी (०% कृषी सवलत)",
    totalAmount: "एकूण देय रक्कम",
    proceedOrder: "स्मार्ट करार कार्यान्वित करा",
    orderSuccessTitle: "खरेदी करार यशस्वीरीत्या संपन्न झाला!",
    orderSuccessDesc: "शेतकरी आणि हब अधिकाऱ्यास स्वयंचलित पाठवणी आदेश जारी करण्यात आला आहे.",
    smartContractIdLabel: "स्मार्ट करार आयडी",
    escrowStatusLabel: "एस्क्रॉ स्थिती",
    escrowLockedText: "कार्यान्वित (एस्क्रॉ मध्ये सुरक्षित)",
    closeBtn: "पूर्ण करा (Close)",

    footerMission: "किसान दिवस समर्पित थेट कृषी पुरवठा आणि वाहतूक प्रणाली. Smart India Hackathon 2026 Problem Statement 26033.",
    aiEnginesCore: "AI इंजिन गाभा (6 AI Engines)",
    userRolesFooter: "वापरकर्ता भूमिका (6 Personas)",
    helplineTitle: "हेल्पलाइन आणि साहाय्य",
    helplineDesc: "शेतकरी टोल-फ्री IVR हेल्पलाइन: 1800-KISAN-AI",
    allIndiaLangs247: "२४x७ सर्व भारतीय भाषांमध्ये उपलब्ध",

    translatorHeader: "🇮🇳 भारत बहुभाषिक कृषी अनुवादक (All-India Multi-Language Translator)",
    translatorSub: "भारतातील प्रमुख भाषांमध्ये शेती विषयक शब्द, बाजारभाव व संदेशांचे त्वरित भाषांतर.",
    sourceLangLabel: "मूळ भाषा (From)",
    targetLangLabel: "लक्षित भाषा (To)",
    inputPlaceholder: "भाषांतरासाठी शेती विषयक प्रश्न, शेतमालाचे वर्णन किंवा संदेश टाका...",
    translatedOutputPlaceholder: "भाषांतरित मजकूर येथे दिसेल...",
    quickAgriPhrasesTitle: "त्वरित कृषी वाक्ये:",
    phrase1: "आज नाशिक बाजारात टोमॅटोचा घाऊक भाव काय आहे?",
    phrase2: "शेतमाल संगणक दृष्टी AI द्वारे तपासला असून ग्रेड A+ आहे.",
    phrase3: "स्मार्ट कराराचे पैसे शेतकरी एस्क्रॉ खात्यात सुरक्षित जमा आहेत.",
    phrase4: "वाहन पिकअपसाठी संकलन हबवर ४८२९ OTP सादर करा.",
    phrase5: "एफपीओ समूहात ५०० किलो गव्हाचा व्हर्च्युअल पूल तयार करण्यात आला.",
    btnTranslate: "भाषांतर करा",
    btnListen: "ऐका (Speak)",
    btnCopy: "कॉपी करा",
    copiedNotice: "कॉपी केले!",
    btnClear: "साफ करा",
    swapLanguages: "भाषा बदला",

    currencySymbol: "₹",
    paiseSuffix: "पैसे",
    statusAvailable: "उपलब्ध",
    statusInTransit: "वाहतुकीत",
    statusDelivered: "यशस्वीरीत्या पोहोचवले",
  },

  gu: {
    // Gujarati
    appName: "Nira",
    subTitle: "ખેતરમાંથી સીધા ગ્રાહક સુધી — વચેટિયાઓ વિના",
    tagline: "ભારતનું પ્રથમ AI સંચાલિત ડાયરેક્ટ એગ્રી માર્કેટપ્લેસ અને લોજિસ્ટિક્સ પ્લેટફોર્મ",
    activeRoleLabel: "સક્રિય ભૂમિકા",
    navHome: "કૃષિ બજાર",
    navFarmer: "ખેડૂત પોર્ટલ",
    navFPO: "FPO જૂથ",
    navBuyer: "સીધા ખરીદદાર",
    navHub: "ગુણવત્તા ચકાસણી કેન્દ્ર",
    navTransporter: "પરિવહન અને લોજિસ્ટિક્સ",
    navAdmin: "રાષ્ટ્રીય મંડી શાસન",
    cartTitle: "તમારી ખરીદી કાર્ટ",
    cartButton: "ખરીદી કાર્ટ",
    checkout: "સુરક્ષિત કરાર ચુકવણી",
    translatorTitle: "ભારત બહુભાષી અનુવાદક",
    translatorBtn: "🇮🇳 અનુવાદક (Translator)",
    selectLanguage: "ભાષા પસંદ કરો",
    kisanPlatformBadge: "કિસાન દિવસ એગ્રી-ટેક પ્લેટફોર્મ",

    roleFarmer: "ખેડૂત પોર્ટલ",
    roleFPO: "FPO મેનેજર",
    roleBuyer: "સીધા ખરીદદાર",
    roleHub: "માઇક્રો-હબ અધિકારી",
    roleTransporter: "પરિવહન ભાગીદાર",
    roleAdmin: "સરકારી પ્રશાસન",
    roleFarmerSub: "વાજબી ભાવ અને IVR",
    roleFPOSub: "વર્ચ્યુઅલ લોટ એકત્રીકરણ",
    roleBuyerSub: "જથ્થાબંધ માંગ અને કરાર",
    roleHubSub: "CV ગ્રેડિંગ અને QR",
    roleTransporterSub: "રૂટ ઓપ્ટિમાઇઝેશન અને OTP",
    roleAdminSub: "રાષ્ટ્રીય મંડી શાસન",
    selectDashboard: "વપરાશકર્તા ડેશબોર્ડ પસંદ કરો",
    integratedRolesCount: "૬ એકીકૃત ભૂમિકાઓ",

    heroBadge: "SIH 2026 PS 26033 • કિસાન દિવસ સમર્પિત સીધું કૃષિ પ્લેટફોર્મ",
    heroTitle: "ખેડૂતોના પાકનો સીધો વાજબી ભાવ, AI ની તાકાતથી",
    heroDesc: "વચેટિયાઓ વગર સીધું વેચાણ, કમ્પ્યુટર વિઝન દ્વારા સ્વચાલિત ગુણવત્તા ગ્રેડિંગ અને ૦% બગાડ.",
    heroCTA: "તાજો પાક જુઓ",
    ivrCTA: "ફોન દ્વારા વેચો (IVR સેવા)",
    tollFreeNotice: "ટોલ-ફ્રી IVR વોઇસ હેલ્પલાઇન: 1800-KISAN-AI (કીપેડ ફોન નોંધણી)",
    statMiddlemen: "0%",
    statMiddlemenSub: "વચેટિયા કમિશન (સીધું ખેડૂત એસ્ક્રો)",
    statCvGrading: "99.4%",
    statCvGradingSub: "કમ્પ્યુટર વિઝન ગ્રેડિંગ (FSSAI પ્રમાણિત)",
    statAiEngines: "6 AI",
    statAiEnginesSub: "સ્માર્ટ એગ્રી એન્જિન (વાજબી ભાવ + રૂટ)",
    statIvrPhone: "IVR/SMS",
    statIvrPhoneSub: "ઇન્ટરનેટ વિના સહાય (કીપેડ ફોન સેવા)",

    liveMandiTicker: "જીવંત મંડી ભાવ (Agmarknet રીઅલ-ટાઇમ):",
    tickerCrop1: "તાજા ટામેટાં (ગ્રેડ A+)",
    tickerCrop2: "નાસિક લાલ ડુંગળી",
    tickerCrop3: "ઇન્દોર જ્યોતિ બટાટા",
    tickerCrop4: "શરબતી પ્રીમિયમ ઘઉં",
    tickerCrop5: "પીળી સોયાબીન",
    tickerCrop6: "દેશી લસણ",

    marketplaceTitle: "પ્રમાણિત તાજા પાકનું બજાર",
    marketplaceSubtitle: "કમ્પ્યુટર વિઝન પ્રમાણિત ગુણવત્તા અને પારદર્શક એસ્ક્રો સાથે તાજો પાક ખરીદો",
    filterAll: "બધા પાક",
    filterGradeA: "માત્ર ગ્રેડ A / A+",
    filterOrganic: "માત્ર ઓર્ગેનિક પાક",
    pricePerKg: "પ્રતિ કિલો",
    availableQty: "ઉપલબ્ધ જથ્થો",
    gradeLabel: "ગુણવત્તા ગ્રેડ",
    locationLabel: "સ્થળ અને હબ",
    farmerLabel: "ઉત્પાદક ખેડૂત / FPO",
    addToCart: "કાર્ટમાં ઉમેરો",
    buyNow: "હમણાં ખરીદો",
    categoryVeg: "શાકભાજી",
    categoryTubers: "કંદમૂળ",
    categoryGrains: "અનાજ",
    organicBadge: "100% ઓર્ગેનિક",
    cvTrustScore: "CV વિશ્વાસ સ્કોર",
    fairPriceAiTag: "Fair Price AI ભાવ",

    fairPriceHeader: "વાજબી ભાવ AI એન્જિન — ટેકાના ભાવથી બહેતર મૂલ્ય",
    ivrHeader: "સ્માર્ટફોન નથી? 1800-KISAN-AI ડાયલ કરો",
    ivrSubtitle: "કીપેડ બટન દબાવો અથવા બોલીને પાક નોંધાવો — ત્વરિત SMS પુષ્ટિ",
    press1: "૧: ટામેટાં નોંધવા માટે",
    press2: "૨: ડુંગળી નોંધવા માટે",
    press3: "૩: બટાટા નોંધવા માટે",
    simulatedCall: "કીપેડ સેવા ચલાવો",
    callSuccess: "SMS મોકલાયો! તમારો પાક સફળતાપૂર્વક નોંધાઈ ગયો છે.",

    farmerPortalTitle: "સીધું ખેડૂત પોર્ટલ • ૦% દલાલી કમિશન",
    farmerWelcome: "નમસ્તે",
    farmerSubtitle: "તમારો પાક સીધો પ્રમાણિત ખરીદદારોને વાજબી ભાવે વેચાય છે",
    btnListProduce: "નવો પાક નોંધાવો",
    btnIvrService: "IVR વોઇસ સેવા",
    farmerStatActive: "સક્રિય પાક યાદી",
    farmerStatPriceGain: "વાજબી ભાવ ફાયદો",
    farmerStatEscrow: "એસ્ક્રોમાં સુરક્ષિત રકમ",
    myListingsTitle: "તમારો નોંધાયેલો પાક",
    colCrop: "પાકનું નામ",
    colQty: "જથ્થો",
    colPrice: "ભાવ",
    colGrade: "ગુણવત્તા ગ્રેડ",
    colLocation: "હબ સ્થળ",
    colStatus: "સ્થિતિ",
    statusVerified: "પ્રમાણિત પાક",
    statusPooled: "પૂલમાં સામેલ",
    addModalTitle: "બજારમાં નવો પાક ઉમેરો",
    cropNamePlaceholder: "પાકનું નામ (દા.ત. નાસિક ડુંગળી)",
    qtyPlaceholder: "જથ્થો (કિલો)",
    pricePlaceholder: "મૂળ ભાવ (₹/કિલો)",
    saveProduceBtn: "પાક પ્રકાશિત કરો",
    cancelBtn: "રદ કરો",
    gradeA: "ઉચ્ચતમ ગ્રેડ A+",
    gradeExport: "નિકાસ ગ્રેડ",

    fpoTitle: "સહ્યાદ્રી કિસાન ઉત્પાદક FPO",
    fpoGroupName: "FPO વર્ચ્યુઅલ લોટ એકત્રીકરણ કેન્દ્ર",
    fpoSubtitle: "૧૪૨ સભ્ય ખેડૂતો એકત્રિત (સામૂહિક સોદાબાજી ક્ષમતા)",
    fpoStatSupply: "કુલ FPO એકત્રિત પુરવઠો",
    fpoStatSupplySub: "+૪૨% સારો ભાવ મેળવવાની ક્ષમતા",
    fpoStatLots: "સક્રિય વર્ચ્યુઅલ લોટ્સ",
    fpoStatLotsSub: "૮૬ ખેડૂતો સામેલ છે",
    fpoStatRfqs: "સંસ્થાકીય માંગ દરખાસ્તો",
    fpoStatRfqsSub: "સીધા પુરવઠા માટે તૈયાર",
    virtualLotsTitle: "સક્રિય વર્ચ્યુઅલ લોટ એકત્રીકરણ",
    lockLotBtn: "લોટ લૉક કરો",
    lockedBadge: "લોટ લૉક થયો",
    poolingActive: "પૂલિંગ ચાલુ છે",
    institutionalDemandTitle: "જથ્થાબંધ ખરીદદાર સંસ્થાકીય માંગ (RFQs)",
    fulfillmentLabel: "માંગ પૂર્તિ",

    buyerTitle: "સીધા ખરીદદાર પોર્ટલ",
    buyerSubtitle: "કમ્પ્યુટર વિઝન પ્રમાણિત તાજો પાક — વચેટિયા વગર સીધી ખરીદી",
    btnPostReq: "જથ્થાબંધ માંગ પોસ્ટ કરો",
    buyerStatContracts: "સક્રિય સ્માર્ટ કરારો",
    buyerStatEscrow: "એસ્ક્રો જમા રકમ",
    buyerStatQuality: "CV ગુણવત્તા પાસ દર",
    buyerOrdersTitle: "તાજેતરના કરારો અને ખરીદી ઓર્ડર",
    reqModalTitle: "નવી જથ્થાબંધ ખરીદી માંગ સબમિટ કરો",
    submitReqBtn: "માંગ પ્રકાશિત કરો",

    hubTitle: "નાસિક કલેક્શન હબ #૦૪",
    hubName: "માઇક્રો-હબ કમ્પ્યુટર વિઝન ગ્રેડિંગ ડેસ્ક",
    hubSubtitle: "ગુણવત્તા ચકાસણી, QR ટેગિંગ અને કોલ્ડ-સ્ટોરેજ વ્યવસ્થાપન",
    hubCropSelect: "પાક પસંદ કરો",
    hubLotSize: "લોટ જથ્થો (કિલો)",
    btnRunCv: "કમ્પ્યુટર વિઝન AI ચકાસણી ચલાવો",
    analyzingCv: "AI ગુણવત્તા વિશ્લેષણ ચાલુ છે...",
    cvResultsTitle: "ગુણવત્તા ચકાસણી પરિણામ",
    confidenceScore: "CV વિશ્વસનીયતા",
    ripenessScore: "પાકવાની માત્રા",
    defectScore: "ખામી દર",
    fssaiStatus: "FSSAI પ્રમાણીકરણ",
    storageTemp: "ભલામણ કરેલ તાપમાન",
    shelfLife: "અંદાજિત શેલ્ફ-લાઇફ",
    qrGeneratedLabel: "હબ QR લેબલ તૈયાર",
    printQrBtn: "QR લેબલ પ્રિન્ટ અને ટેગ કરો",

    transporterTitle: "લોજિસ્ટિક્સ અને સ્માર્ટ રૂટ ડેસ્ક",
    transporterSubtitle: "મલ્ટી-સ્ટોપ પિકઅપ અને સુરક્ષિત OTP ડિજિટલ હેન્ડશેક",
    fleetMetricsTitle: "આજની AI રૂટ કામગીરી",
    distanceLabel: "કુલ અંતર",
    etaLabel: "અંદાજિત સમય",
    fuelSavingsLabel: "ઇંધણ બચત",
    multiStopTitle: "ઓપ્ટિમાઇઝ મલ્ટી-સ્ટોપ પિકઅપ અને ડિલિવરી રૂટ",
    pickupOtpLabel: "પિકઅપ OTP",
    deliveryOtpLabel: "ડિલિવરી OTP",
    otpVerifyTitle: "સુરક્ષિત OTP હેન્ડશેક ચકાસણી",
    otpVerifyPlaceholder: "૪-અંકનો OTP દાખલ કરો (દા.ત. 4829)",
    btnVerifyOtp: "OTP ચકાસો",

    adminTitle: "SIH 2026 PS 26033 રાષ્ટ્રીય મંડી શાસન",
    adminHeading: "મંત્રાલય અને રાષ્ટ્રીય મંડી શાસન કંટ્રોલ રૂમ",
    adminSubtitle: "ગ્રાહક બાબતો, ખાદ્ય અને જાહેર વિતરણ મંત્રાલય — કૃષિ વેપાર દેખરેખ",
    adminStatGmv: "કુલ રાષ્ટ્રીય કૃષિ વેપાર (GMV)",
    adminStatWaste: "બચાવેલ પાક બગાડ",
    adminStatIncome: "ખેડૂતોની ચોખ્ખી આવક વૃદ્ધિ",
    adminStatMandis: "સક્રિય ડિજિટલ હબ",
    recentLedgerTitle: "પારદર્શક રાષ્ટ્રીય વહીખાતું (Audit Trail)",
    colOrderId: "કરાર ID",
    colBuyer: "ખરીદદાર",
    colFarmer: "ખેડૂત / FPO",
    colAmount: "રકમ",
    colDelivery: "ડિલિવરી પ્રકાર",
    aiEnginesTitle: "સંકલિત AI એન્જિન સ્થિતિ",

    cartEmpty: "તમારી કાર્ટ હાલ ખાલી છે",
    cartSubtotal: "સબ-ટોટલ રકમ",
    logisticsFee: "સ્માર્ટ ટ્રાન્સપોર્ટ ફી",
    gstTax: "GST (૦% કૃષિ મુક્તિ)",
    totalAmount: "કુલ ચૂકવવાપાત્ર રકમ",
    proceedOrder: "સ્માર્ટ કરાર અમલમાં મૂકો",
    orderSuccessTitle: "ઓર્ડર કરાર સફળતાપૂર્વક અમલમાં મૂકાયો!",
    orderSuccessDesc: "ખેડૂત અને હબ ઓપરેટરને સ્વચાલિત રવાનગી ઓર્ડર મોકલાયો છે.",
    smartContractIdLabel: "સ્માર્ટ કરાર ID",
    escrowStatusLabel: "એસ્ક્રો સ્થિતિ",
    escrowLockedText: "અમલમાં (એસ્ક્રોમાં સુરક્ષિત)",
    closeBtn: "બંધ કરો (Close)",

    footerMission: "કિસાન દિવસ સમર્પિત સીધી કૃષિ પુરવઠો અને લોજિસ્ટિક્સ પ્રણાલી. Smart India Hackathon 2026 Problem Statement 26033.",
    aiEnginesCore: "AI એન્જિન કોર (6 AI Engines)",
    userRolesFooter: "વપરાશકર્તા ભૂમિકાઓ (6 Personas)",
    helplineTitle: "હેલ્પલાઇન અને સહાય",
    helplineDesc: "ખેડૂત ટોલ-ફ્રી IVR હેલ્પલાઇન: 1800-KISAN-AI",
    allIndiaLangs247: "૨૪x૭ બધી ભારતીય ભાષાઓમાં ઉપલબ્ધ",

    translatorHeader: "🇮🇳 ભારત બહુભાષી કૃષિ અનુવાદક (All-India Multi-Language Translator)",
    translatorSub: "ભારતની મુખ્ય ભાષાઓમાં કૃષિ શબ્દો, મંડી ભાવો અને સંદેશાઓનો ત્વરિત અનુવાદ.",
    sourceLangLabel: "મૂળ ભાષા (From)",
    targetLangLabel: "લક્ષ્ય ભાષા (To)",
    inputPlaceholder: "અનુવાદ કરવા માટે કૃષિ પ્રશ્ન, પાકની વિગત અથવા સંદેશ દાખલ કરો...",
    translatedOutputPlaceholder: "અનુવાદિત લખાણ અહીં દેખાશે...",
    quickAgriPhrasesTitle: "ઝડપી કૃષિ વાક્યો:",
    phrase1: "આજે નાસિક મંડીમાં ટામેટાંનો જથ્થાબંધ ભાવ શું છે?",
    phrase2: "પાક કમ્પ્યુટર વિઝન AI દ્વારા પ્રમાણિત અને ગ્રેડ A+ છે.",
    phrase3: "સ્માર્ટ કરારની ચુકવણી સુરક્ષિત રીતે ખેડૂત એસ્ક્રોમાં જમા છે.",
    phrase4: "વાહન પિકઅપ માટે હબ પર 4829 OTP રજૂ કરો.",
    phrase5: "FPO જૂથમાં ૫૦૦ કિલો ઘઉંનો વર્ચ્યુઅલ પૂલ બનાવવામાં આવ્યો.",
    btnTranslate: "અનુવાદ કરો",
    btnListen: "સાંભળો (Speak)",
    btnCopy: "કૉપિ કરો",
    copiedNotice: "કૉપિ થયું!",
    btnClear: "સાફ કરો",
    swapLanguages: "ભાષાઓ બદલો",

    currencySymbol: "₹",
    paiseSuffix: "પૈસા",
    statusAvailable: "ઉપલબ્ધ",
    statusInTransit: "પરિવહનમાં",
    statusDelivered: "સફળતાપૂર્વક પહોંચાડ્યું",
  },

  bn: {
    // Bengali
    appName: "Nira",
    subTitle: "ক্ষেত থেকে সরাসরি ক্রেতার কাছে — কোনো দালাল ছাড়াই",
    tagline: "ভারতের প্রথম AI চালিত সরাসরি কৃষি বাজার ও লজিস্টিকস প্ল্যাটফর্ম",
    activeRoleLabel: "সক্রিয় ভূমিকা",
    navHome: "কৃষি বাজার",
    navFarmer: "কৃষক পোর্টাল",
    navFPO: "এফপিও গ্রুপ",
    navBuyer: "সরাসরি ক্রেতা",
    navHub: "মান যাচাই কেন্দ্র",
    navTransporter: "পরিবহন ও লজিস্টিকস",
    navAdmin: "জাতীয় মান্ডি শাসন",
    cartTitle: "আপনার শপিং কার্ট",
    cartButton: "শপিং কার্ট",
    checkout: "নিরাপদ চুক্তি পেমেন্ট",
    translatorTitle: "ভারত বহুভাষিক অনুবাদক",
    translatorBtn: "🇮🇳 অনুবাদক (Translator)",
    selectLanguage: "ভাষা নির্বাচন করুন",
    kisanPlatformBadge: "কিসান দিবস এগ্রি-টেক প্ল্যাটফর্ম",

    roleFarmer: "কৃষক পোর্টাল",
    roleFPO: "এফপিও ম্যানেজার",
    roleBuyer: "সরাসরি ক্রেতা",
    roleHub: "মাইক্রো-হাব পরিদর্শক",
    roleTransporter: "পরিবহন অংশীদার",
    roleAdmin: "সরকারি প্রশাসন",
    roleFarmerSub: "ন্যায্য মূল্য ও IVR",
    roleFPOSub: "ভার্চুয়াল লট একত্রীকরণ",
    roleBuyerSub: "পাইকারি চাহিদা ও চুক্তি",
    roleHubSub: "CV গ্রেডিং ও QR",
    roleTransporterSub: "রুট অপ্টিমাইজেশন ও OTP",
    roleAdminSub: "জাতীয় মান্ডি প্রশাসন",
    selectDashboard: "ব্যবহারকারী ড্যাশবোর্ড বেছে নিন",
    integratedRolesCount: "৬টি সমন্বিত ভূমিকা",

    heroBadge: "SIH 2026 PS 26033 • কিসান দিবস নিবেদিত সরাসরি কৃষি প্ল্যাটফর্ম",
    heroTitle: "কৃষকদের ফসলের সরাসরি ন্যায্য দাম, AI-এর শক্তিতে",
    heroDesc: "দালাল ছাড়াই সরাসরি বিক্রি, কম্পিউটার ভিশন দ্বারা স্বয়ংক্রিয় মান গ্রেডিং এবং ০% ফসল অপচয়।",
    heroCTA: "তাজা ফসল দেখুন",
    ivrCTA: "ফোনে বিক্রি করুন (IVR সেবা)",
    tollFreeNotice: "টোল-ফ্রি IVR ভয়েস হেল্পলাইন: 1800-KISAN-AI (কী-প্যাড ফোন রেজিস্ট্রেশন)",
    statMiddlemen: "0%",
    statMiddlemenSub: "দালাল কমিশন (সরাসরি কৃষক এসক্রো)",
    statCvGrading: "99.4%",
    statCvGradingSub: "কম্পিউটার ভিশন গ্রেডিং (FSSAI প্রত্যয়িত)",
    statAiEngines: "6 AI",
    statAiEnginesSub: "স্মার্ট এগ্রি ইঞ্জিন (ন্যায্য মূল্য + লজিস্টিকস)",
    statIvrPhone: "IVR/SMS",
    statIvrPhoneSub: "ইন্টারনেট ছাড়াই সেবা (কী-প্যাড ফোন সহায়তা)",

    liveMandiTicker: "লাইভ মান্ডি দর (Agmarknet রিয়েল-টাইম):",
    tickerCrop1: "তাজা টমেটো (গ্রেড A+)",
    tickerCrop2: "নাসিক লাল পেঁয়াজ",
    tickerCrop3: "ইন্দোর জ্যোতি আলু",
    tickerCrop4: "শরবতী প্রিমিয়াম গম",
    tickerCrop5: "হলুদ সয়াবিন",
    tickerCrop6: "দেশি রসুন",

    marketplaceTitle: "যাচাইকৃত তাজা ফসলের বাজার",
    marketplaceSubtitle: "কম্পিউটার ভিশন প্রত্যয়িত মান এবং স্বচ্ছ এসক্রোর মাধ্যমে তাজা ফসল কিনুন",
    filterAll: "সকল ফসল",
    filterGradeA: "কেবল গ্রেড A / A+",
    filterOrganic: "কেবল জৈব ফসল",
    pricePerKg: "প্রতি কেজি",
    availableQty: "উপলব্ধ পরিমাণ",
    gradeLabel: "গুণমানের গ্রেড",
    locationLabel: "স্থান ও হাব",
    farmerLabel: "কৃষক / এফপিও",
    addToCart: "কার্টে যোগ করুন",
    buyNow: "এখনই কিনুন",
    categoryVeg: "শাকসবজি",
    categoryTubers: "কন্দমূল",
    categoryGrains: "শস্যদানা",
    organicBadge: "১০০% জৈব",
    cvTrustScore: "CV আস্থা স্কোর",
    fairPriceAiTag: "Fair Price AI দর",

    fairPriceHeader: "ন্যায্য মূল্য AI ইঞ্জিন — সহায়ক মূল্যের চেয়ে উন্নত দাম",
    ivrHeader: "স্মার্টফোন নেই? ডায়াল করুন 1800-KISAN-AI",
    ivrSubtitle: "কী-প্যাড বোতাম টিপুন বা মুখে বলে ফসল নথিভুক্ত করুন — তাৎক্ষণিক SMS নিশ্চিতকরণ",
    press1: "১: টমেটো তালিকাভুক্ত করতে",
    press2: "২: পেঁয়াজ তালিকাভুক্ত করতে",
    press3: "৩: আলু তালিকাভুক্ত করতে",
    simulatedCall: "কী-প্যাড সেবা চালান",
    callSuccess: "SMS পাঠানো হয়েছে! আপনার ফসল সফলভাবে নথিভুক্ত হয়েছে।",

    farmerPortalTitle: "সরাসরি কৃষক পোর্টাল • ০% মধ্যস্থতাকারী কমিশন",
    farmerWelcome: "নমস্কার",
    farmerSubtitle: "আপনার ফসল সরাসরি যাচাইকৃত ক্রেতাদের কাছে ন্যায্য মূল্যে বিক্রি হয়",
    btnListProduce: "নতুন ফসল নথিভুক্ত করুন",
    btnIvrService: "IVR ভয়েস সেবা",
    farmerStatActive: "সক্রিয় ফসল তালিকা",
    farmerStatPriceGain: "ন্যায্য মূল্য লাভ",
    farmerStatEscrow: "এসক্রোতে সংরক্ষিত অর্থ",
    myListingsTitle: "আপনার নিবন্ধিত ফসলসমূহ",
    colCrop: "ফসলের নাম",
    colQty: "পরিমাণ",
    colPrice: "দাম",
    colGrade: "গুণমান গ্রেড",
    colLocation: "হাব অবস্থান",
    colStatus: "স্থিতি",
    statusVerified: "যাচাইকৃত ফসল",
    statusPooled: "পুলে অন্তর্ভুক্ত",
    addModalTitle: "বাজারে নতুন ফসল যোগ করুন",
    cropNamePlaceholder: "ফসলের নাম (যেমন নাসিক পেঁয়াজ)",
    qtyPlaceholder: "পরিমাণ (কেজি)",
    pricePlaceholder: "ভিত্তি মূল্য (₹/কেজি)",
    saveProduceBtn: "ফসল প্রকাশ করুন",
    cancelBtn: "বাতিল করুন",
    gradeA: "প্রিমিয়াম গ্রেড A+",
    gradeExport: "রপ্তানি গ্রেড",

    fpoTitle: "সহ্যাদ্রি কৃষক উৎপাদক এফপিও",
    fpoGroupName: "এফপিও ভার্চুয়াল লট একত্রীকরণ কেন্দ্র",
    fpoSubtitle: "১৪২ জন সদস্য কৃষক একত্রিত (যৌথ দরকষাকষি ক্ষমতা)",
    fpoStatSupply: "মোট এফপিও সরবরাহ",
    fpoStatSupplySub: "+৪২% উন্নত দরকষাকষি লাভ",
    fpoStatLots: "সক্রিয় ভার্চুয়াল লট",
    fpoStatLotsSub: "৮৬ জন কৃষক অন্তর্ভুক্ত",
    fpoStatRfqs: "প্রাতিষ্ঠানিক চাহিদাপত্র",
    fpoStatRfqsSub: "সরাসরি সরবরাহের জন্য প্রস্তুত",
    virtualLotsTitle: "সক্রিয় ভার্চুয়াল লট একত্রীকরণ",
    lockLotBtn: "লট লক করুন",
    lockedBadge: "লট লক করা হয়েছে",
    poolingActive: "পুলিং চলছে",
    institutionalDemandTitle: "পাইকারি ক্রেতার প্রাতিষ্ঠানিক চাহিদা (RFQs)",
    fulfillmentLabel: "চাহিদা পূরণ",

    buyerTitle: "সরাসরি ক্রেতা পোর্টাল",
    buyerSubtitle: "কম্পিউটার ভিশন প্রত্যয়িত তাজা ফসল — দালাল ছাড়াই সরাসরি ক্রয়",
    btnPostReq: "পাইকারি চাহিদা পোস্ট করুন",
    buyerStatContracts: "সক্রিয় স্মার্ট চুক্তি",
    buyerStatEscrow: "এসক্রো জমা অর্থ",
    buyerStatQuality: "CV গুণমান পাস হার",
    buyerOrdersTitle: "সাম্প্রতিক চুক্তি ও ক্রয়ের আদেশ",
    reqModalTitle: "নতুন পাইকারি ক্রয়ের চাহিদা জমা দিন",
    submitReqBtn: "চাহিদা প্রকাশ করুন",

    hubTitle: "নাসিক কালেকশন হাব #০৪",
    hubName: "মাইক্রো-হাব কম্পিউটার ভিশন গ্রেডিং ডেস্ক",
    hubSubtitle: "গুণমান যাচাই, QR ট্যাগিং এবং কোল্ড-স্টোরেজ ব্যবস্থাপনা",
    hubCropSelect: "ফসল নির্বাচন করুন",
    hubLotSize: "লট পরিমাণ (কেজি)",
    btnRunCv: "কম্পিউটার ভিশন AI পরিদর্শন চালান",
    analyzingCv: "AI গুণমান বিশ্লেষণ চলছে...",
    cvResultsTitle: "গুণমান পরীক্ষার ফলাফল",
    confidenceScore: "CV বিশ্বাসযোগ্যতা",
    ripenessScore: "পাক ধরার অনুপাত",
    defectScore: "ত্রুটি হার",
    fssaiStatus: "FSSAI সার্টিফিকেশন",
    storageTemp: "সুপারিশকৃত তাপমাত্রা",
    shelfLife: "আনুমানিক স্থায়িত্ব",
    qrGeneratedLabel: "হাব QR লেবেল প্রস্তুত",
    printQrBtn: "QR লেবেল প্রিন্ট ও ট্যাগ করুন",

    transporterTitle: "লজিস্টিকস ও স্মার্ট রুট ডেস্ক",
    transporterSubtitle: "মাল্টি-স্টপ সংগ্রহ এবং নিরাপদ OTP ডিজিটাল হ্যান্ডশেক",
    fleetMetricsTitle: "আজকের AI রুট কর্মক্ষমতা",
    distanceLabel: "মোট দূরত্ব",
    etaLabel: "আনুমানিক সময়",
    fuelSavingsLabel: "জ্বালানি সাশ্রয়",
    multiStopTitle: "অনুকূলিত মাল্টি-স্টপ সংগ্রহ ও বিতরণ রুট",
    pickupOtpLabel: "পিকআপ OTP",
    deliveryOtpLabel: "ডেলিভারি OTP",
    otpVerifyTitle: "নিরাপদ OTP হ্যান্ডশেক যাচাই",
    otpVerifyPlaceholder: "৪-সংখ্যার OTP লিখুন (যেমন 4829)",
    btnVerifyOtp: "OTP যাচাই করুন",

    adminTitle: "SIH 2026 PS 26033 জাতীয় মান্ডি শাসন",
    adminHeading: "মন্ত্রণালয় ও জাতীয় মান্ডি প্রশাসন কন্ট্রোল রুম",
    adminSubtitle: "ভোক্তা বিষয়ক, খাদ্য ও গণবণ্টন মন্ত্রণালয় — সরাসরি কৃষি বাণিজ্য তদারকি",
    adminStatGmv: "মোট জাতীয় কৃষি বাণিজ্য (GMV)",
    adminStatWaste: "প্রতিরোধকৃত ফসল অপচয়",
    adminStatIncome: "কৃষকের নিট আয় বৃদ্ধি",
    adminStatMandis: "সক্রিয় ডিজিটাল হাব",
    recentLedgerTitle: "স্বচ্ছ জাতীয় লেনদেন খতিয়ান (Audit Trail)",
    colOrderId: "চুক্তি ID",
    colBuyer: "ক্রেতা",
    colFarmer: "কৃষক / এফপিও",
    colAmount: "পরিমাণ",
    colDelivery: "সরবরাহের ধরন",
    aiEnginesTitle: "সমন্বিত AI ইঞ্জিন স্থিতি",

    cartEmpty: "আপনার কার্ট বর্তমানে খালি আছে",
    cartSubtotal: "উপ-মোট পরিমাণ",
    logisticsFee: "স্মार्ट পরিবহন ফি",
    gstTax: "GST (০% কৃষি ছাড়)",
    totalAmount: "মোট প্রদেয় পরিমাণ",
    proceedOrder: "স্মার্ট চুক্তি সম্পাদন করুন",
    orderSuccessTitle: "অর্ডার চুক্তি সফলভাবে সম্পন্ন হয়েছে!",
    orderSuccessDesc: "কৃষক এবং হাব অপারেটরের কাছে স্বয়ংক্রিয় নির্দেশ পাঠানো হয়েছে।",
    smartContractIdLabel: "স্মার্ট চুক্তি ID",
    escrowStatusLabel: "এসক্রো স্থিতি",
    escrowLockedText: "সম্পন্ন (এসক্রোতে সুরক্ষিত)",
    closeBtn: "বন্ধ করুন (Close)",

    footerMission: "কিসান দিবস নিবেদিত সরাসরি কৃষি সরবরাহ ও লজিস্টিকস ব্যবস্থা। Smart India Hackathon 2026 Problem Statement 26033।",
    aiEnginesCore: "AI ইঞ্জিন কোর (6 AI Engines)",
    userRolesFooter: "ব্যবহারকারী ভূমিকা (6 Personas)",
    helplineTitle: "হেল্পলাইন ও সহায়তা",
    helplineDesc: "কৃষক টোল-ফ্রি IVR হেল্পলাইন: 1800-KISAN-AI",
    allIndiaLangs247: "২৪x৭ সমস্ত ভারতীয় ভাষায় উপলব্ধ",

    translatorHeader: "🇮🇳 ভারত বহুভাষিক কৃষি অনুবাদক (All-India Multi-Language Translator)",
    translatorSub: "ভারতের প্রধান ভাষাগুলিতে কৃষি পরিভাষা, মান্ডি দর এবং বার্তার তাৎক্ষণিক অনুবাদ।",
    sourceLangLabel: "উৎস ভাষা (From)",
    targetLangLabel: "লক্ষ্য ভাষা (To)",
    inputPlaceholder: "অনুবাদ করার জন্য কৃষি প্রশ্ন, ফসলের বিবরণ বা বার্তা লিখুন...",
    translatedOutputPlaceholder: "অনূদিত টেক্সট এখানে প্রদর্শিত হবে...",
    quickAgriPhrasesTitle: "দ্রুত কৃষি বাক্যসমূহ:",
    phrase1: "আজ নাসিক মান্ডিতে টমেটোর পাইকারি দর কত?",
    phrase2: "ফসল কম্পিউটার ভিশন AI দ্বারা যাচাইকৃত এবং গ্রেড A+।",
    phrase3: "স্মার্ট চুক্তির অর্থ কৃষক এসক্রো অ্যাকাউন্টে নিরাপদে জমা আছে।",
    phrase4: "যানবাহন পিকআপের জন্য হাবে 4829 OTP পেশ করুন।",
    phrase5: "এফপিও গ্রুপে ৫০০ কেজি গমের ভার্চুয়াল পুল তৈরি করা হয়েছে।",
    btnTranslate: "অনুবাদ করুন",
    btnListen: "শুনুন (Speak)",
    btnCopy: "কপি করুন",
    copiedNotice: "কপি করা হয়েছে!",
    btnClear: "মুছে ফেলুন",
    swapLanguages: "ভাষা বদলান",

    currencySymbol: "₹",
    paiseSuffix: "পয়সা",
    statusAvailable: "উপলব্ধ",
    statusInTransit: "পরিবহনে",
    statusDelivered: "সফলভাবে বিতরণকৃত",
  },

  te: {
    // Telugu
    appName: "Nira",
    subTitle: "పొలం నుండి నేరుగా కొనుగోలుదారుడికి — దళారులు లేకుండా",
    tagline: "భారతదేశపు మొట్టమొదటి AI ఆధారిత ప్రత్యక్ష వ్యవసాయ మార్కెట్ & లాజిస్టిక్స్ ప్లాట్‌ఫామ్",
    activeRoleLabel: "క్రియాశీల పాత్ర",
    navHome: "వ్యవసాయ మార్కెట్",
    navFarmer: "రైతు పోర్టల్",
    navFPO: "FPO గ్రూప్",
    navBuyer: "ప్రత్యక్ష కొనుగోలుదారు",
    navHub: "నాణ్యత తనిఖీ కేంద్రం",
    navTransporter: "రవాణా & లాజిస్టిక్స్",
    navAdmin: "జాతీయ మార్కెట్ పాలన",
    cartTitle: "మీ షాపింగ్ కార్ట్",
    cartButton: "షాపింగ్ కార్ట్",
    checkout: "సురక్షిత ఒప్పంద చెల్లింపు",
    translatorTitle: "భారత బహుభాషా అనువాదకుడు",
    translatorBtn: "🇮🇳 అనువాదకుడు (Translator)",
    selectLanguage: "భాషను ఎంచుకోండి",
    kisanPlatformBadge: "కిసాన్ దివస్ అగ్రి-టెక్ ప్లాట్‌ఫామ్",

    roleFarmer: "రైతు పోర్టల్",
    roleFPO: "FPO మేనేజర్",
    roleBuyer: "ప్రత్యక్ష కొనుగోలుదారు",
    roleHub: "మైక్రో-హబ్ అధికారి",
    roleTransporter: "రవాణా భాగస్వామి",
    roleAdmin: "ప్రభుత్వ పాలన",
    roleFarmerSub: "న్యాయమైన ధర & IVR",
    roleFPOSub: "వర్చువల్ లాట్ పూలింగ్",
    roleBuyerSub: "టోకు డిమాండ్ & కాంట్రాక్ట్",
    roleHubSub: "CV గ్రేడింగ్ & QR",
    roleTransporterSub: "రూట్ ఆప్టిమైజేషన్ & OTP",
    roleAdminSub: "జాతీయ మార్కెట్ పాలన",
    selectDashboard: "వినియోగదారు డ్యాష్‌బోర్డ్‌ను ఎంచుకోండి",
    integratedRolesCount: "6 సమగ్ర పాత్రలు",

    heroBadge: "SIH 2026 PS 26033 • కిసాన్ దివస్ అంకిత ప్రత్యక్ష వ్యవసాయ వేదిక",
    heroTitle: "రైతు పంటకు నేరుగా సరైన ధర, AI శక్తితో",
    heroDesc: "దళారులు లేకుండా నేరుగా అమ్మకాలు, కంప్యూటర్ విజన్ స్వయంచాలక నాణ్యత గ్రేడింగ్ మరియు 0% పంట వృథా.",
    heroCTA: "తాజా పంటలను చూడండి",
    ivrCTA: "ఫోన్ ద్వారా అమ్మండి (IVR సేవ)",
    tollFreeNotice: "టోల్-ఫ్రీ IVR వాయిస్ హెల్ప్‌లైన్: 1800-KISAN-AI (కీప్యాడ్ ఫోన్ రిజిస్ట్రేషన్)",
    statMiddlemen: "0%",
    statMiddlemenSub: "దళారీ కమీషన్ (నేరుగా రైతు ఎస్క్రో)",
    statCvGrading: "99.4%",
    statCvGradingSub: "కంప్యూటర్ విజన్ గ్రేడింగ్ (FSSAI సర్టిఫైడ్)",
    statAiEngines: "6 AI",
    statAiEnginesSub: "స్మార్ట్ అగ్రి ఇంజన్లు (సరైన ధర + రవాణా)",
    statIvrPhone: "IVR/SMS",
    statIvrPhoneSub: "ఇంటర్నెట్ లేని సేవ (కీప్యాడ్ ఫోన్ మద్దతు)",

    liveMandiTicker: "లైవ్ మార్కెట్ ధరలు (Agmarknet రియల్-టైమ్):",
    tickerCrop1: "తాజా టమోటా (గ్రేడ్ A+)",
    tickerCrop2: "నాసిక్ ఎర్ర ఉల్లిపాయ",
    tickerCrop3: "ఇండోర్ జ్యోతి బంగాళాదుంప",
    tickerCrop4: "శర్బతి ప్రీమియం గోధుమ",
    tickerCrop5: "పసుపు సోయాబీన్",
    tickerCrop6: "దేశీ వెల్లుల్లి",

    marketplaceTitle: "ధృవీకరించబడిన తాజా పంటల మార్కెట్",
    marketplaceSubtitle: "కంప్యూటర్ విజన్ సర్టిఫికేషన్ మరియు పారదర్శక ఎస్క్రోతో తాజా పంటలను కొనుగోలు చేయండి",
    filterAll: "అన్ని పంటలు",
    filterGradeA: "గ్రేడ్ A / A+ మాత్రమే",
    filterOrganic: "సేంద్రీయ పంటలు మాత్రమే",
    pricePerKg: "కిలోకు",
    availableQty: "అందుబాటులో ఉన్న పరిమాణం",
    gradeLabel: "నాణ్యత గ్రేడ్",
    locationLabel: "స్థానం & హబ్",
    farmerLabel: "రైతు / FPO",
    addToCart: "కార్ట్‌కు జోడించండి",
    buyNow: "ఇప్పుడే కొనండి",
    categoryVeg: "కూరగాయలు",
    categoryTubers: "దుంపలు",
    categoryGrains: "ధాన్యాలు",
    organicBadge: "100% సేంద్రీయ",
    cvTrustScore: "CV నమ్మక స్కోరు",
    fairPriceAiTag: "Fair Price AI ధర",

    fairPriceHeader: "న్యాయమైన ధర AI ఇంజిన్ — మద్దతు ధర కంటే మెరుగైన విలువ",
    ivrHeader: "స్మార్ట్‌ఫోన్ లేదా? 1800-KISAN-AI కి కాల్ చేయండి",
    ivrSubtitle: "కీప్యాడ్ బటన్లను నొక్కండి లేదా మాట్లాడి పంటను నమోదు చేయండి — తక్షణ SMS నిర్ధారణ",
    press1: "1: టమోటాలు నమోదు చేయడానికి",
    press2: "2: ఉల్లిపాయలు నమోదు చేయడానికి",
    press3: "3: బంగాళాదుంపలు నమోదు చేయడానికి",
    simulatedCall: "కీప్యాడ్ సేవను ప్రారంభించండి",
    callSuccess: "SMS పంపబడింది! మీ పంట విజయవంతంగా నమోదైంది.",

    farmerPortalTitle: "నేరుగా రైతు పోర్టల్ • 0% దళారీ కమీషన్",
    farmerWelcome: "నమస్కారం",
    farmerSubtitle: "మీ పంట నేరుగా ధృవీకరించబడిన కొనుగోలుదారులకు సరైన ధరకు విక్రయించబడుతుంది",
    btnListProduce: "కొత్త పంటను నమోదు చేయండి",
    btnIvrService: "IVR వాయిస్ సేవ",
    farmerStatActive: "క్రియాశీల పంట జాబితాలు",
    farmerStatPriceGain: "సరైన ధర లాభం",
    farmerStatEscrow: "ఎస్క్రోలో సురక్షిత నిధులు",
    myListingsTitle: "మీ నమోదిత పంటలు",
    colCrop: "పంట పేరు",
    colQty: "పరిమాణం",
    colPrice: "ధర",
    colGrade: "నాణ్యత గ్రేడ్",
    colLocation: "హబ్ స్థానం",
    colStatus: "స్థితి",
    statusVerified: "ధృవీకరించబడిన పంట",
    statusPooled: "పూల్‌లో చేర్చబడింది",
    addModalTitle: "మార్కెట్‌లో కొత్త పంటను చేర్చండి",
    cropNamePlaceholder: "పంట పేరు (ఉదా. నాసిక్ ఉల్లి)",
    qtyPlaceholder: "పరిమాణం (కిలోలు)",
    pricePlaceholder: "బేస్ ధర (₹/కిలో)",
    saveProduceBtn: "పంటను ప్రచురించండి",
    cancelBtn: "రద్దు చేయండి",
    gradeA: "ప్రీమియం గ్రేడ్ A+",
    gradeExport: "ఎగుమతి గ్రేడ్",

    fpoTitle: "సహ్యాద్రి రైతు ఉత్పత్తిదారుల FPO",
    fpoGroupName: "FPO వర్చువల్ లాట్ పూలింగ్ కేంద్రం",
    fpoSubtitle: "142 మంది సభ్య రైతులు ఏకమయ్యారు (సామూహిక బేరసారాల బలం)",
    fpoStatSupply: "మొత్తం FPO సరఫరా",
    fpoStatSupplySub: "+42% మెరుగైన ధర బేరసారాలు",
    fpoStatLots: "క్రియాశీల వర్చువల్ లాట్లు",
    fpoStatLotsSub: "86 మంది రైతులు చేరారు",
    fpoStatRfqs: "సంస్థాగత కొనుగోలు డిమాండ్లు",
    fpoStatRfqsSub: "నేరుగా సరఫరా చేయడానికి సిద్ధం",
    virtualLotsTitle: "క్రియాశీల వర్చువల్ లాట్ పూలింగ్",
    lockLotBtn: "లాట్‌ను లాక్ చేయండి",
    lockedBadge: "లాట్ లాక్ చేయబడింది",
    poolingActive: "పూలింగ్ జరుగుతోంది",
    institutionalDemandTitle: "టోకు కొనుగోలుదారు డిమాండ్లు (RFQs)",
    fulfillmentLabel: "డిమాండ్ నెరవేర్పు",

    buyerTitle: "ప్రత్యక్ష కొనుగోలుదారు పోర్టల్",
    buyerSubtitle: "కంప్యూటర్ విజన్ ధృవీకృత తాజా పంటలు — దళారులు లేకుండా నేరుగా కొనుగోలు",
    btnPostReq: "టోకు డిమాండ్‌ను పోస్ట్ చేయండి",
    buyerStatContracts: "క్రియాశీల స్మార్ట్ ఒప్పందాలు",
    buyerStatEscrow: "ఎస్క్రో డిపాజిట్",
    buyerStatQuality: "CV నాణ్యత ఉత్తీర్ణత రేటు",
    buyerOrdersTitle: "ఇటీవలి ఒప్పందాలు & ఆర్డర్లు",
    reqModalTitle: "కొత్త టోకు కొనుగోలు డిమాండ్‌ను సమర్పించండి",
    submitReqBtn: "డిమాండ్‌ను ప్రచురించండి",

    hubTitle: "నాసిక్ కలెక్షన్ మైక్రో-హబ్ #04",
    hubName: "మైక్రో-హబ్ కంప్యూటర్ విజన్ గ్రేడింగ్ డెస్క్",
    hubSubtitle: "నాణ్యత తనిఖీ, QR ట్యాగింగ్ మరియు కోల్డ్-స్టోరేజ్ నిర్వహణ",
    hubCropSelect: "పంటను ఎంచుకోండి",
    hubLotSize: "లాట్ పరిమాణం (కిలోలు)",
    btnRunCv: "కంప్యూటర్ విజన్ AI తనిఖీని ప్రారంభించండి",
    analyzingCv: "AI నాణ్యత విశ్లేషణ జరుగుతోంది...",
    cvResultsTitle: "నాణ్యత తనిఖీ ఫలితం",
    confidenceScore: "CV విశ్వసనీయత",
    ripenessScore: "పక్వత నిష్పత్తి",
    defectScore: "లోపాల రేటు",
    fssaiStatus: "FSSAI సర్టిఫికేషన్",
    storageTemp: "సూచించిన ఉష్ణోగ్రత",
    shelfLife: "అంచనా నిల్వ కాలం",
    qrGeneratedLabel: "హబ్ QR లేబుల్ సిద్ధమైంది",
    printQrBtn: "QR లేబుల్‌ను ప్రింట్ & ట్యాగ్ చేయండి",

    transporterTitle: "లాజిస్టిక్స్ & స్మార్ట్ రూట్ ఆప్టిమైజర్ డెస్క్",
    transporterSubtitle: "మల్టీ-స్టాప్ పికప్ మరియు సురక్షిత OTP డిజిటల్ హ్యాండ్‌షేక్",
    fleetMetricsTitle: "నేటి AI రూట్ పనితీరు",
    distanceLabel: "మొత్తం దూరం",
    etaLabel: "అంచనా సమయం",
    fuelSavingsLabel: "ఇంధన ఆదా",
    multiStopTitle: "ఆప్టిమైజ్ చేయబడిన పికప్ & డెలివరీ స్టాప్‌లు",
    pickupOtpLabel: "పికప్ OTP",
    deliveryOtpLabel: "డెలివరీ OTP",
    otpVerifyTitle: "సురక్షిత OTP హ్యాండ్‌షేక్ ధృవీకరణ",
    otpVerifyPlaceholder: "4-అంకెల OTP ని నమోదు చేయండి (ఉదా. 4829)",
    btnVerifyOtp: "OTP ని ధృవీకరించండి",

    adminTitle: "SIH 2026 PS 26033 జాతీయ మార్కెట్ పాలన",
    adminHeading: "మంత్రిత్వ శాఖ & జాతీయ మార్కెట్ కంట్రోల్ రూమ్",
    adminSubtitle: "వినియోగదారుల వ్యవహారాలు, ఆహార & ప్రజా పంపిణీ మంత్రిత్వ శాఖ — ప్రత్యక్ష వాణిజ్య పర్యవేక్షణ",
    adminStatGmv: "మొత్తం జాతీయ వ్యవసాయ వాణిజ్యం (GMV)",
    adminStatWaste: "నివారించబడిన పంట వృథా",
    adminStatIncome: "రైతు నికర ఆదాయ వృద్ధి",
    adminStatMandis: "క్రియాశీల డిజిటల్ హబ్‌లు",
    recentLedgerTitle: "పారదర్శక జాతీయ లావాదేవీల లెడ్జర్ (Audit Trail)",
    colOrderId: "ఒప్పంద ID",
    colBuyer: "కొనుగోలుదారు",
    colFarmer: "రైతు / FPO",
    colAmount: "మొత్తం",
    colDelivery: "రవాణా రకం",
    aiEnginesTitle: "సమన్వయ AI ఇంజిన్ల స్థితి",

    cartEmpty: "మీ కార్ట్ ప్రస్తుతం ఖాళీగా ఉంది",
    cartSubtotal: "ఉప-మొత్తం",
    logisticsFee: "స్మార్ట్ రవాణా ఛార్జీ",
    gstTax: "GST (0% వ్యవసాయ మినహాయింపు)",
    totalAmount: "మొత్తం చెల్లించవలసిన మొత్తం",
    proceedOrder: "స్మార్ట్ ఒప్పందాన్ని అమలు చేయండి",
    orderSuccessTitle: "ఆర్డర్ ఒప్పందం విజయవంతంగా అమలు చేయబడింది!",
    orderSuccessDesc: "రైతు మరియు హబ్ ఆపరేటర్‌కు ఆటోమేటిక్ డిస్పాచ్ ఆర్డర్ పంపబడింది.",
    smartContractIdLabel: "స్మార్ట్ కాంట్రాక్ట్ ID",
    escrowStatusLabel: "ఎస్క్రో స్థితి",
    escrowLockedText: "అమలు చేయబడింది (ఎస్క్రోలో భద్రం)",
    closeBtn: "ముగించండి (Close)",

    footerMission: "కిసాన్ దివస్ అంకిత ప్రత్యక్ష వ్యవసాయ సరఫరా మరియు లాజిస్టిక్స్ వ్యవస్థ. Smart India Hackathon 2026 Problem Statement 26033.",
    aiEnginesCore: "AI ఇంజిన్ కోర్ (6 AI Engines)",
    userRolesFooter: "వినియోగదారు పాత్రలు (6 Personas)",
    helplineTitle: "హెల్ప్‌లైన్ & మద్దతు",
    helplineDesc: "రైతు టోల్-ఫ్రీ IVR హెల్ప్‌లైన్: 1800-KISAN-AI",
    allIndiaLangs247: "24x7 అన్ని భారతీయ భాషలలో అందుబాటులో ఉంది",

    translatorHeader: "🇮🇳 భారత బహుభాషా వ్యవసాయ అనువాదకుడు (All-India Multi-Language Translator)",
    translatorSub: "భారతీయ ప్రధాన భాషలలో వ్యవసాయ నిబంధనలు, మార్కెట్ ధరలు మరియు సందేశాల తక్షణ అనువాదం.",
    sourceLangLabel: "మూల భాష (From)",
    targetLangLabel: "లక్ష్య భాష (To)",
    inputPlaceholder: "అనువదించడానికి వ్యవసాయ ప్రశ్న, పంట వివరాలు లేదా సందేశాన్ని నమోదు చేయండి...",
    translatedOutputPlaceholder: "అనువదించబడిన వచనం ఇక్కడ కనిపిస్తుంది...",
    quickAgriPhrasesTitle: "త్వరిత వ్యవసాయ వాక్యాలు:",
    phrase1: "ఈరోజు నాసిక్ మార్కెట్‌లో టమోటాల టోకు ధర ఎంత?",
    phrase2: "పంట కంప్యూటర్ విజన్ AI ద్వారా ధృవీకరించబడింది మరియు గ్రేడ్ A+ పొందింది.",
    phrase3: "స్మార్ట్ ఒప్పంద చెల్లింపు రైతు ఎస్క్రో ఖాతాలో సురక్షితంగా జమ చేయబడింది.",
    phrase4: "వాహనం పికప్ కోసం సేకరణ హబ్‌లో 4829 OTP ని సమర్పించండి.",
    phrase5: "FPO సమూహంలో 500 కిలోల గోధుమల వర్చువల్ పూల్ సృష్టించబడింది.",
    btnTranslate: "అనువదించండి",
    btnListen: "వినండి (Speak)",
    btnCopy: "కాపీ చేయండి",
    copiedNotice: "కాపీ చేయబడింది!",
    btnClear: "క్లియర్ చేయండి",
    swapLanguages: "భాషలను మార్చండి",

    currencySymbol: "₹",
    paiseSuffix: "పైసలు",
    statusAvailable: "అందుబాటులో ఉంది",
    statusInTransit: "రవాణాలో ఉంది",
    statusDelivered: "విజయవంతంగా డెలివరీ చేయబడింది",
  },

  ta: {
    // Tamil
    appName: "Nira",
    subTitle: "பண்ணையிலிருந்து நேரடியாக வாங்குபவருக்கு — இடைத்தரகர்கள் இன்றி",
    tagline: "இந்தியாவின் முதல் AI நேரடி வேளாண் சந்தை மற்றும் தளவாட தளம்",
    activeRoleLabel: "செயலில் உள்ள பங்கு",
    navHome: "வேளாண் சந்தை",
    navFarmer: "விவசாயி தளம்",
    navFPO: "FPO குழு",
    navBuyer: "நேரடி வாங்குபவர்",
    navHub: "தர பரிசோதனை மையம்",
    navTransporter: "போக்குவரத்து & தளவாடம்",
    navAdmin: "தேசிய மண்டி நிர்வாகம்",
    cartTitle: "உங்கள் வணிகக் கூடை",
    cartButton: "வணிகக் கூடை",
    checkout: "பாதுகாப்பான ஒப்பந்த கட்டணம்",
    translatorTitle: "பாரத பன்மொழி மொழிபெயர்ப்பாளர்",
    translatorBtn: "🇮🇳 மொழிபெயர்ப்பாளர் (Translator)",
    selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
    kisanPlatformBadge: "கிசான் திவாஸ் அக்ரி-டெக் தளம்",

    roleFarmer: "விவசாயி தளம்",
    roleFPO: "FPO மேலாளர்",
    roleBuyer: "நேரடி வாங்குபவர்",
    roleHub: "மைக்ரோ-ஹப் அதிகாரி",
    roleTransporter: "போக்குவரத்து பங்குதாரர்",
    roleAdmin: "அரசு நிர்வாகம்",
    roleFarmerSub: "நியாய விலை & IVR",
    roleFPOSub: "விர்ச்சுவல் லாட் ஒருங்கிணைப்பு",
    roleBuyerSub: "மொத்த தேவை & ஒப்பந்தம்",
    roleHubSub: "CV தர மதிப்பீடு & QR",
    roleTransporterSub: "பாதை தேர்வு & OTP",
    roleAdminSub: "தேசிய மண்டி ஆளுகை",
    selectDashboard: "பயனர் டாஷ்போர்டைத் தேர்ந்தெடுக்கவும்",
    integratedRolesCount: "6 ஒருங்கிணைந்த பாத்திரங்கள்",

    heroBadge: "SIH 2026 PS 26033 • கிசான் திவாஸ் நேரடி விவசாய தளம்",
    heroTitle: "விவசாயிகளின் விளைபொருளுக்கு நேரடி நியாயமான விலை, AI ஆற்றலுடன்",
    heroDesc: "இடைத்தரகர்கள் இன்றி நேரடி விற்பனை, கம்ப்யூட்டர் விஷன் தானியங்கி தர நிர்ணயம் மற்றும் 0% உணவு வீணடிப்பு.",
    heroCTA: "புதிய பயிர்களைக் காண்க",
    ivrCTA: "தொலைபேசி வழி விற்க (IVR சேவை)",
    tollFreeNotice: "கட்டணமில்லா IVR குரல் உதவி எண்: 1800-KISAN-AI (கீபேட் தொலைபேசி பதிவு)",
    statMiddlemen: "0%",
    statMiddlemenSub: "இடைத்தரகர் கமிஷன் (நேரடி விவசாயி எஸ்க்ரோ)",
    statCvGrading: "99.4%",
    statCvGradingSub: "கம்ப்யூட்டர் விஷன் தரம் (FSSAI சான்றளிக்கப்பட்டது)",
    statAiEngines: "6 AI",
    statAiEnginesSub: "ஸ்மார்ட் அக்ரி என்ஜின்கள் (நியாய விலை + தளவாடம்)",
    statIvrPhone: "IVR/SMS",
    statIvrPhoneSub: "இணையம் இல்லாத சேவை (கீபேட் போன் ஆதரவு)",

    liveMandiTicker: "நேரடி மண்டி விலைகள் (Agmarknet ரியல்-டைம்):",
    tickerCrop1: "புதிய தக்காளி (தரம் A+)",
    tickerCrop2: "நாசிக் சிவப்பு வெங்காயம்",
    tickerCrop3: "இந்தூர் ஜோதி உருளைக்கிழங்கு",
    tickerCrop4: "சர்பதி பிரீமியம் கோதுமை",
    tickerCrop5: "மஞ்சள் சோயாபீன்",
    tickerCrop6: "நாட்டு பூண்டு",

    marketplaceTitle: "சான்றளிக்கப்பட்ட புதிய விளைபொருள் சந்தை",
    marketplaceSubtitle: "கம்ப்யூட்டர் விஷன் சான்றிதழ் மற்றும் வெளிப்படையான எஸ்க்ரோவுடன் புதிய விளைபொருட்களை வாங்குங்கள்",
    filterAll: "அனைத்து பயிர்கள்",
    filterGradeA: "தரம் A / A+ மட்டும்",
    filterOrganic: "இயற்கை பயிர்கள் மட்டும்",
    pricePerKg: "ஒரு கிலோவிற்கு",
    availableQty: "கிடைக்கும் அளவு",
    gradeLabel: "தர நிலை",
    locationLabel: "இடம் & மையம்",
    farmerLabel: "விவசாயி / FPO",
    addToCart: "கூடையில் சேர்க்கவும்",
    buyNow: "இப்போதே வாங்கவும்",
    categoryVeg: "காய்கறிகள்",
    categoryTubers: "கிழங்கு வகைகள்",
    categoryGrains: "தானியங்கள்",
    organicBadge: "100% இயற்கை",
    cvTrustScore: "CV நம்பிக்கை மதிப்பீடு",
    fairPriceAiTag: "Fair Price AI விலை",

    fairPriceHeader: "நியாய விலை AI என்ஜின் — அரசு குறைந்தபட்ச விலையை விட சிறந்த மதிப்பு",
    ivrHeader: "ஸ்மார்ட்போன் இல்லையா? 1800-KISAN-AI அழைக்கவும்",
    ivrSubtitle: "கீபேட் பொத்தான்களை அழுத்தவும் அல்லது பேசி பயிரைப் பதிவு செய்யவும் — உடனடி SMS உறுதிப்படுத்தல்",
    press1: "1: தக்காளி பதிவு செய்ய",
    press2: "2: வெங்காயம் பதிவு செய்ய",
    press3: "3: உருளைக்கிழங்கு பதிவு செய்ய",
    simulatedCall: "கீபேட் சேவையை இயக்கவும்",
    callSuccess: "SMS அனுப்பப்பட்டது! உங்கள் பயிர் வெற்றிகரமாக பதிவு செய்யப்பட்டது.",

    farmerPortalTitle: "நேரடி விவசாயி தளம் • 0% இடைத்தரகர் கமிஷன்",
    farmerWelcome: "வணக்கம்",
    farmerSubtitle: "உங்கள் பயிர்கள் நேரடியாக சான்றளிக்கப்பட்ட வாங்குபவர்களுக்கு நியாயமான விலையில் விற்கப்படுகின்றன",
    btnListProduce: "புதிய பயிரைப் பதிவு செய்க",
    btnIvrService: "IVR குரல் சேவை",
    farmerStatActive: "செயலில் உள்ள பயிர் பட்டியல்",
    farmerStatPriceGain: "நியாய விலை கூடுதல் லாபம்",
    farmerStatEscrow: "எஸ்க்ரோவில் பாதுகாப்பான தொகை",
    myListingsTitle: "உங்கள் பதிவு செய்யப்பட்ட பயிர்கள்",
    colCrop: "பயிர் பெயர்",
    colQty: "அளவு",
    colPrice: "விலை",
    colGrade: "தர நிலை",
    colLocation: "மைய இடம்",
    colStatus: "நிலை",
    statusVerified: "சான்றளிக்கப்பட்ட பயிர்",
    statusPooled: "குழுவில் இணைக்கப்பட்டது",
    addModalTitle: "சந்தையில் புதிய பயிரைச் சேர்க்கவும்",
    cropNamePlaceholder: "பயிர் பெயர் (எ.கா. நாசிக் வெங்காயம்)",
    qtyPlaceholder: "அளவு (கிலோ)",
    pricePlaceholder: "அடிப்படை விலை (₹/கிலோ)",
    saveProduceBtn: "பயிரை வெளியிடுக",
    cancelBtn: "ரத்து செய்",
    gradeA: "உயர்தரம் A+",
    gradeExport: "ஏற்றுமதி தரம்",

    fpoTitle: "சஹ்யாத்ரி உழவர் உற்பத்தியாளர் FPO",
    fpoGroupName: "FPO விர்ச்சுவல் லாட் ஒருங்கிணைப்பு மையம்",
    fpoSubtitle: "142 உறுப்பினர் விவசாயிகள் இணைந்தனர் (கூட்டு பேரம் பேசும் வலிமை)",
    fpoStatSupply: "மொத்த FPO இருப்பு",
    fpoStatSupplySub: "+42% சிறந்த விலை பேரம் பேசும் திறன்",
    fpoStatLots: "செயலில் உள்ள விர்ச்சுவல் லாட்கள்",
    fpoStatLotsSub: "86 விவசாயிகள் பங்கேற்பு",
    fpoStatRfqs: "நிறுவன தேவைகள்",
    fpoStatRfqsSub: "நேரடி விநியோகத்திற்கு தயார்",
    virtualLotsTitle: "செயலில் உள்ள விர்ச்சுவல் லாட் திரட்டல்",
    lockLotBtn: "லாட்டைப் பூட்டு",
    lockedBadge: "லாட் பூட்டப்பட்டது",
    poolingActive: "ஒருங்கிணைப்பு தொடர்கிறது",
    institutionalDemandTitle: "மொத்த வாங்குபவர் நிறுவன தேவைகள் (RFQs)",
    fulfillmentLabel: "தேவை பூர்த்தி",

    buyerTitle: "நேரடி வாங்குபவர் தளம்",
    buyerSubtitle: "கம்ப்யூட்டர் விஷன் சான்றளிக்கப்பட்ட புதிய பயிர்கள் — இடைத்தரகர்கள் இன்றி நேரடி கொள்முதல்",
    btnPostReq: "மொத்த தேவையைப் பதிவிடவும்",
    buyerStatContracts: "செயலில் உள்ள ஒப்பந்தங்கள்",
    buyerStatEscrow: "எஸ்க்ரோ வைப்புத்தொகை",
    buyerStatQuality: "CV தர தேர்ச்சி விகிதம்",
    buyerOrdersTitle: "சமீபத்திய ஒப்பந்தங்கள் மற்றும் ஆர்டர்கள்",
    reqModalTitle: "புதிய மொத்த கொள்முதல் தேவையைச் சமர்ப்பிக்கவும்",
    submitReqBtn: "தேவையை வெளியிடவும்",

    hubTitle: "நாசிக் சேகரிப்பு மைக்ரோ-ஹப் #04",
    hubName: "மைக்ரோ-ஹப் கம்ப்யூட்டர் விஷன் தர ஆய்வு மையம்",
    hubSubtitle: "தர ஆய்வு, QR குறியீடு மற்றும் குளிர்பதன மேலாண்மை",
    hubCropSelect: "பயிரைத் தேர்ந்தெடுக்கவும்",
    hubLotSize: "லாட் அளவு (கிலோ)",
    btnRunCv: "கம்ப்யூட்டர் விஷன் AI ஆய்வை இயக்கவும்",
    analyzingCv: "AI தர பகுப்பாய்வு நடக்கிறது...",
    cvResultsTitle: "தர பரிசோதனை முடிவு",
    confidenceScore: "CV நம்பகத்தன்மை",
    ripenessScore: "பழுத்த நிலை",
    defectScore: "குறைபாடு விகிதம்",
    fssaiStatus: "FSSAI சான்றிதழ்",
    storageTemp: "பரிந்துரைக்கப்பட்ட வெப்பநிலை",
    shelfLife: "எதிர்பார்க்கப்படும் ஆயுட்காலம்",
    qrGeneratedLabel: "ஹப் QR லேபிள்கள் தயார்",
    printQrBtn: "QR லேபிளை அச்சிட்டு இணைக்கவும்",

    transporterTitle: "தளவாடங்கள் மற்றும் ஸ்மார்ட் வழித்தட மையம்",
    transporterSubtitle: "மல்டி-ஸ்டாப் சேகரிப்பு மற்றும் பாதுகாப்பான OTP டிஜிட்டல் ஒப்படைப்பு",
    fleetMetricsTitle: "இன்றைய AI வழித்தட செயல்திறன்",
    distanceLabel: "மொத்த தூரம்",
    etaLabel: "மதிப்பிடப்பட்ட நேரம்",
    fuelSavingsLabel: "எரிபொருள் சேமிப்பு",
    multiStopTitle: "மேம்படுத்தப்பட்ட நிறுத்துமிடம் மற்றும் விநியோகப் பாதை",
    pickupOtpLabel: "பிக்கப் OTP",
    deliveryOtpLabel: "டெலிவரி OTP",
    otpVerifyTitle: "பாதுகாப்பான OTP ஒப்படைப்பு சரிபார்ப்பு",
    otpVerifyPlaceholder: "4-இலக்க OTP உள்ளிடவும் (எ.கா. 4829)",
    btnVerifyOtp: "OTP சரிபார்க்கவும்",

    adminTitle: "SIH 2026 PS 26033 தேசிய மண்டி ஆளுகை",
    adminHeading: "அமைச்சகம் & தேசிய மண்டி கட்டுப்பாட்டு அறை",
    adminSubtitle: "நுகர்வோர் விவகாரங்கள், உணவு மற்றும் பொது விநியோக அமைச்சகம் — நேரடி வர்த்தக கண்காணிப்பு",
    adminStatGmv: "மொத்த தேசிய வேளாண் வர்த்தகம் (GMV)",
    adminStatWaste: "தடுக்கப்பட்ட உணவு வீணடிப்பு",
    adminStatIncome: "விவசாயிகள் நிகர வருமான உயர்வு",
    adminStatMandis: "செயலில் உள்ள டிஜிட்டல் மையங்கள்",
    recentLedgerTitle: "வெளிப்படையான தேசிய வர்த்தகப் பேரேடு (Audit Trail)",
    colOrderId: "ஒப்பந்த ID",
    colBuyer: "வாங்குபவர்",
    colFarmer: "விவசாயி / FPO",
    colAmount: "தொகை",
    colDelivery: "விநியோக முறை",
    aiEnginesTitle: "ஒருங்கிணைந்த AI என்ஜின்களின் நிலை",

    cartEmpty: "உங்கள் கூடை தற்போது காலியாக உள்ளது",
    cartSubtotal: "கூட்டுத் தொகை",
    logisticsFee: "ஸ்மார்ட் போக்குவரத்து கட்டணம்",
    gstTax: "GST (0% விவசாய விலக்கு)",
    totalAmount: "மொத்த செலுத்த வேண்டிய தொகை",
    proceedOrder: "ஸ்மார்ட் ஒப்பந்தத்தை செயல்படுத்தவும்",
    orderSuccessTitle: "ஆர்டர் ஒப்பந்தம் வெற்றிகரமாக நிறைவேற்றப்பட்டது!",
    orderSuccessDesc: "விவசாயி மற்றும் மைய இயக்குநருக்கு தானியங்கி அனுப்புதல் உத்தரவு அனுப்பப்பட்டுள்ளது.",
    smartContractIdLabel: "ஸ்மார்ட் ஒப்பந்த ID",
    escrowStatusLabel: "எஸ்க்ரோ நிலை",
    escrowLockedText: "நிறைவேறியது (எஸ்க்ரோவில் பாதுகாப்பானது)",
    closeBtn: "முடி (Close)",

    footerMission: "கிசான் திவாஸ் நேரடி வேளாண் சப்ளை மற்றும் தளவாட அமைப்பு. Smart India Hackathon 2026 Problem Statement 26033.",
    aiEnginesCore: "AI என்ஜின் கோர் (6 AI Engines)",
    userRolesFooter: "பயனர் பாத்திரங்கள் (6 Personas)",
    helplineTitle: "உதவி எண் & ஆதரவு",
    helplineDesc: "விவசாயி கட்டணமில்லா IVR உதவி எண்: 1800-KISAN-AI",
    allIndiaLangs247: "24x7 அனைத்து இந்திய மொழிகளிலும் கிடைக்கிறது",

    translatorHeader: "🇮🇳 பாரத பன்மொழி வேளாண் மொழிபெயர்ப்பாளர் (All-India Multi-Language Translator)",
    translatorSub: "இந்திய முதன்மை மொழிகளில் விவசாய சொற்கள், சந்தை விலைகள் மற்றும் செய்திகளின் உடனடி மொழிபெயர்ப்பு.",
    sourceLangLabel: "மூல மொழி (From)",
    targetLangLabel: "இலக்கு மொழி (To)",
    inputPlaceholder: "மொழிபெயர்க்க விவசாய கேள்வி, பயிர் விளக்கம் அல்லது செய்தியை உள்ளிடவும்...",
    translatedOutputPlaceholder: "மொழிபெயர்க்கப்பட்ட உரை இங்கே தோன்றும்...",
    quickAgriPhrasesTitle: "விரைவு விவசாய வாக்கியங்கள்:",
    phrase1: "இன்று நாசிக் சந்தையில் தக்காளியின் மொத்த விலை என்ன?",
    phrase2: "பயிர் கம்ப்யூட்டர் விஷன் AI மூலம் ஆய்வு செய்யப்பட்டு தரம் A+ பெற்றது.",
    phrase3: "ஸ்மார்ட் ஒப்பந்தத் தொகை விவசாயி எஸ்க்ரோ கணக்கில் பாதுகாப்பாக டெபாசிட் செய்யப்பட்டுள்ளது.",
    phrase4: "வாகன பிக்கப்பிற்கு மையத்தில் 4829 OTP ஐக் காட்டவும்.",
    phrase5: "FPO குழுவில் 500 கிலோ கோதுமை விர்ச்சுவல் பூல் உருவாக்கப்பட்டது.",
    btnTranslate: "மொழிபெயர்க்கவும்",
    btnListen: "கேளுங்கள் (Speak)",
    btnCopy: "நகலெடு",
    copiedNotice: "நகலெடுக்கப்பட்டது!",
    btnClear: "அழி",
    swapLanguages: "மொழிகளை மாற்றவும்",

    currencySymbol: "₹",
    paiseSuffix: "பைசா",
    statusAvailable: "கிடைக்கிறது",
    statusInTransit: "போக்குவரத்தில் உள்ளது",
    statusDelivered: "வெற்றிகரமாக விநியோகிக்கப்பட்டது",
  },

  kn: {
    // Kannada
    appName: "Nira",
    subTitle: "ಹೊಲದಿಂದ ನೇರವಾಗಿ ಗ್ರಾಹಕರಿಗೆ — ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದೆ",
    tagline: "ಭಾರತದ ಪ್ರಪ್ರಥಮ AI ಚಾಲಿತ ನೇರ ಕೃಷಿ ಮಾರುಕಟ್ಟೆ ಮತ್ತು ಲಾಜಿಸ್ಟಿಕ್ಸ್ ವೇದಿಕೆ",
    activeRoleLabel: "ಸಕ್ರಿಯ ಪಾತ್ರ",
    navHome: "ಕೃಷಿ ಮಾರುಕಟ್ಟೆ",
    navFarmer: "ರೈತ ಪೋರ್ಟಲ್",
    navFPO: "FPO ಗುಂಪು",
    navBuyer: "ನೇರ ಖರೀದಿದಾರ",
    navHub: "ಗುಣಮಟ್ಟ ತಪಾಸಣಾ ಕೇಂದ್ರ",
    navTransporter: "ಸಾರಿಗೆ ಮತ್ತು ಲಾಜಿಸ್ಟಿಕ್ಸ್",
    navAdmin: "ರಾಷ್ಟ್ರೀಯ ಮಂಡಿ ಆಡಳಿತ",
    cartTitle: "ನಿಮ್ಮ ಶಾಪಿಂಗ್ ಕಾರ್ಟ್",
    cartButton: "ಶಾಪಿಂಗ್ ಕಾರ್ಟ್",
    checkout: "ಸುರಕ್ಷಿತ ಒಪ್ಪಂದ ಪಾವತಿ",
    translatorTitle: "ಭಾರತ ಬಹುಭಾಷಾ ಅನುವಾದಕ",
    translatorBtn: "🇮🇳 ಅನುವಾದಕ (Translator)",
    selectLanguage: "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    kisanPlatformBadge: "ಕಿಸಾನ್ ದಿವಸ್ ಅಗ್ರಿ-ಟೆಕ್ ವೇದಿಕೆ",

    roleFarmer: "ರೈತ ಪೋರ್ಟಲ್",
    roleFPO: "FPO ಮ್ಯಾನೇಜರ್",
    roleBuyer: "ನೇರ ಖರೀದಿದಾರ",
    roleHub: "ಮೈಕ್ರೋ-ಹಬ್ ಅಧಿಕಾರಿ",
    roleTransporter: "ಸಾರಿಗೆ ಪಾಲುದಾರ",
    roleAdmin: "ಸರ್ಕಾರಿ ಆಡಳಿತ",
    roleFarmerSub: "ನ್ಯಾಯಯುತ ಬೆಲೆ ಮತ್ತು IVR",
    roleFPOSub: "ವರ್ಚುವಲ್ ಲಾಟ್ ಸಂಗ್ರಹಣೆ",
    roleBuyerSub: "ಸಗಟು ಬೇಡಿಕೆ ಮತ್ತು ಒಪ್ಪಂದ",
    roleHubSub: "CV ಗ್ರೇಡಿಂಗ್ ಮತ್ತು QR",
    roleTransporterSub: "ಮಾರ್ಗ ಆಪ್ಟಿಮೈಸೇಶನ್ ಮತ್ತು OTP",
    roleAdminSub: "ರಾಷ್ಟ್ರೀಯ ಮಂಡಿ ಆಡಳಿತ",
    selectDashboard: "ಬಳಕೆದಾರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಆಯ್ಕೆಮಾಡಿ",
    integratedRolesCount: "6 ಸಂಯೋಜಿತ ಪಾತ್ರಗಳು",

    heroBadge: "SIH 2026 PS 26033 • ಕಿಸಾನ್ ದಿವಸ್ ಸಮರ್ಪಿತ ನೇರ ಕೃಷಿ ವೇದಿಕೆ",
    heroTitle: "ರೈತರ ಬೆಳೆಗೆ ನೇರ ನ್ಯಾಯಯುತ ಬೆಲೆ, AI ತಂತ್ರಜ್ಞಾನದ ಶಕ್ತಿಯೊಂದಿಗೆ",
    heroDesc: "ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದೆ ನೇರ ಮಾರಾಟ, ಕಂಪ್ಯೂಟರ್ ವಿಷನ್ ಸ್ವಯಂಚಾಲಿತ ಗುಣಮಟ್ಟ ಶ್ರೇಣೀಕರಣ ಮತ್ತು 0% ಬೆಳೆ ವ್ಯರ್ಥ.",
    heroCTA: "ತಾಜಾ ಬೆಳೆಗಳನ್ನು ನೋಡಿ",
    ivrCTA: "ಫೋನ್ ಮೂಲಕ ಮಾರಿ (IVR ಸೇವೆ)",
    tollFreeNotice: "ಟೋಲ್-ಫ್ರೀ IVR ಧ್ವನಿ ಸಹಾಯವಾಣಿ: 1800-KISAN-AI (ಕೀಪ್ಯಾಡ್ ಫೋನ್ ನೋಂದಣಿ)",
    statMiddlemen: "0%",
    statMiddlemenSub: "ಮಧ್ಯವರ್ತಿ ಕಮಿಷನ್ (ನೇರ ರೈತ ಎಸ್ಕ್ರೋ)",
    statCvGrading: "99.4%",
    statCvGradingSub: "ಕಂಪ್ಯೂಟರ್ ವಿಷನ್ ಗ್ರೇಡಿಂಗ್ (FSSAI ಪ್ರಮಾಣಿತ)",
    statAiEngines: "6 AI",
    statAiEnginesSub: "ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಎಂಜಿನ್‌ಗಳು (ನ್ಯಾಯಯುತ ಬೆಲೆ + ಸಾರಿಗೆ)",
    statIvrPhone: "IVR/SMS",
    statIvrPhoneSub: "ಇಂಟರ್ನೆಟ್ ರಹಿತ ಸೇವೆ (ಕೀಪ್ಯಾಡ್ ಫೋನ್ ಬೆಂಬಲ)",

    liveMandiTicker: "ಲೈವ್ ಮಂಡಿ ಬೆಲೆಗಳು (Agmarknet ನೈಜ-ಸಮಯ):",
    tickerCrop1: "ತಾಜಾ ಟೊಮೆಟೊ (ಗ್ರೇಡ್ A+)",
    tickerCrop2: "ನಾಸಿಕ್ ಕೆಂಪು ಈರುಳ್ಳಿ",
    tickerCrop3: "ಇಂದೋರ್ ಜ್ಯೋತಿ ಆಲೂಗಡ್ಡೆ",
    tickerCrop4: "ಶರಬತಿ ಪ್ರೀಮಿಯಂ ಗೋಧಿ",
    tickerCrop5: "ಹಳದಿ ಸೋಯಾಬೀನ್",
    tickerCrop6: "ನಾಟಿ ಬೆಳ್ಳುಳ್ಳಿ",

    marketplaceTitle: "ದೃಢೀಕೃತ ತಾಜಾ ಬೆಳೆಗಳ ಮಾರುಕಟ್ಟೆ",
    marketplaceSubtitle: "ಕಂಪ್ಯೂಟರ್ ವಿಷನ್ ಪ್ರಮಾಣೀಕರಣ ಮತ್ತು ಪಾರದರ್ಶಕ ಎಸ್ಕ್ರೋದೊಂದಿಗೆ ತಾಜಾ ಬೆಳೆಗಳನ್ನು ಖರೀದಿಸಿ",
    filterAll: "ಎಲ್ಲಾ ಬೆಳೆಗಳು",
    filterGradeA: "ಗ್ರೇಡ್ A / A+ ಮಾತ್ರ",
    filterOrganic: "ಸಾವಯವ ಬೆಳೆಗಳು ಮಾತ್ರ",
    pricePerKg: "ಪ್ರತಿ ಕೆಜಿಗೆ",
    availableQty: "ಲಭ್ಯವಿರುವ ಪ್ರಮಾಣ",
    gradeLabel: "ಗುಣಮಟ್ಟದ ಗ್ರೇಡ್",
    locationLabel: "ಸ್ಥಳ ಮತ್ತು ಹಬ್",
    farmerLabel: "ರೈತ / FPO",
    addToCart: "ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ",
    buyNow: "ಈಗಲೇ ಖರೀದಿಸಿ",
    categoryVeg: "ತರಕಾರಿಗಳು",
    categoryTubers: "ಗೆಡ್ಡೆ-ಗೆಣಸು",
    categoryGrains: "ಧಾನ್ಯಗಳು",
    organicBadge: "100% ಸಾವಯವ",
    cvTrustScore: "CV ವಿಶ್ವಾಸಾರ್ಹತೆ ಸ್ಕೋರ್",
    fairPriceAiTag: "Fair Price AI ದರ",

    fairPriceHeader: "ನ್ಯಾಯಯುತ ಬೆಲೆ AI ಎಂಜಿನ್ — ಬೆಂಬಲ ಬೆಲೆಗಿಂತ ಉತ್ತಮ ಮೌಲ್ಯ",
    ivrHeader: "ಸ್ಮಾರ್ಟ್‌ಫೋನ್ ಇಲ್ವಾ? 1800-KISAN-AI ಗೆ ಕರೆ ಮಾಡಿ",
    ivrSubtitle: "ಕೀಪ್ಯಾಡ್ ಬಟನ್ ಒತ್ತಿ ಅಥವಾ ಮಾತನಾಡಿ ಬೆಳೆ ನೋಂದಾಯಿಸಿ — ತಕ್ಷಣದ SMS ದೃಢೀಕರಣ",
    press1: "1: ಟೊಮೆಟೊ ನೋಂದಾಯಿಸಲು",
    press2: "2: ಈರುಳ್ಳಿ ನೋಂದಾಯಿಸಲು",
    press3: "3: ಆಲೂಗಡ್ಡೆ ನೋಂದಾಯಿಸಲು",
    simulatedCall: "ಕೀಪ್ಯಾಡ್ ಸೇವೆ ಚಲಾಯಿಸಿ",
    callSuccess: "SMS ಕಳುಹಿಸಲಾಗಿದೆ! ನಿಮ್ಮ ಬೆಳೆ ಯಶಸ್ವಿಯಾಗಿ ನೋಂದಾಯಿಸಲ್ಪಟ್ಟಿದೆ.",

    farmerPortalTitle: "ನೇರ ರೈತ ಪೋರ್ಟಲ್ • 0% ಮಧ್ಯವರ್ತಿ ಕಮಿಷನ್",
    farmerWelcome: "ನಮಸ್ಕಾರ",
    farmerSubtitle: "ನಿಮ್ಮ ಬೆಳೆಗಳು ನೇರವಾಗಿ ದೃಢೀಕೃತ ಖರೀದಿದಾರರಿಗೆ ನ್ಯಾಯಯುತ ಬೆಲೆಗೆ ಮಾರಾಟವಾಗುತ್ತವೆ",
    btnListProduce: "ಹೊಸ ಬೆಳೆಯನ್ನು ನೋಂದಾಯಿಸಿ",
    btnIvrService: "IVR ಧ್ವನಿ ಸೇವೆ",
    farmerStatActive: "ಸಕ್ರಿಯ ಬೆಳೆ ಪಟ್ಟಿಗಳು",
    farmerStatPriceGain: "ನ್ಯಾಯಯುತ ಬೆಲೆ ಲಾಭ",
    farmerStatEscrow: "ಎಸ್ಕ್ರೋದಲ್ಲಿ ಸುರಕ್ಷಿತ ಠೇವಣಿ",
    myListingsTitle: "ನಿಮ್ಮ ನೋಂದಾಯಿತ ಬೆಳೆಗಳು",
    colCrop: "ಬೆಳೆಯ ಹೆಸರು",
    colQty: "ಪ್ರಮಾಣ",
    colPrice: "ಬೆಲೆ",
    colGrade: "ಗುಣಮಟ್ಟದ ಗ್ರೇಡ್",
    colLocation: "ಹಬ್ ಸ್ಥಳ",
    colStatus: "ಸ್ಥಿತಿ",
    statusVerified: "ದೃಢೀಕೃತ ಬೆಳೆ",
    statusPooled: "ಪೂಲ್‌ನಲ್ಲಿ ಸೇರಿಸಲಾಗಿದೆ",
    addModalTitle: "ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಹೊಸ ಬೆಳೆಯನ್ನು ಸೇರಿಸಿ",
    cropNamePlaceholder: "ಬೆಳೆಯ ಹೆಸರು (ಉದಾ. ನಾಸಿಕ್ ಈರುಳ್ಳಿ)",
    qtyPlaceholder: "ಪ್ರಮಾಣ (ಕೆಜಿ)",
    pricePlaceholder: "ಮೂಲ ಬೆಲೆ (₹/ಕೆಜಿ)",
    saveProduceBtn: "ಬೆಳೆಯನ್ನು ಪ್ರಕಟಿಸಿ",
    cancelBtn: "ರದ್ದುಮಾಡಿ",
    gradeA: "ಪ್ರೀಮಿಯಂ ಗ್ರೇಡ್ A+",
    gradeExport: "ರಫ್ತು ಗುಣಮಟ್ಟ",

    fpoTitle: "ಸಹ್ಯಾದ್ರಿ ರೈತ ಉತ್ಪಾದಕ FPO",
    fpoGroupName: "FPO ವರ್ಚುವಲ್ ಲಾಟ್ ಸಂಗ್ರಹಣಾ ಕೇಂದ್ರ",
    fpoSubtitle: "142 ಸದಸ್ಯ ರೈತರು ಒಗ್ಗೂಡಿದ್ದಾರೆ (ಸಾಮೂಹಿಕ ಚೌಕಾಶಿ ಶಕ್ತಿ)",
    fpoStatSupply: "ಒಟ್ಟು FPO ಪೂರೈಕೆ",
    fpoStatSupplySub: "+42% ಉತ್ತಮ ಬೆಲೆ ಚೌಕಾಶಿ ಶಕ್ತಿ",
    fpoStatLots: "ಸಕ್ರಿಯ ವರ್ಚುವಲ್ ಲಾಟ್‌ಗಳು",
    fpoStatLotsSub: "86 ರೈತರು ಭಾಗಿಯಾಗಿದ್ದಾರೆ",
    fpoStatRfqs: "ಸಂಸ್ಥಾಗತ ಬೇಡಿಕೆಗಳು",
    fpoStatRfqsSub: "ನೇರ ಪೂರೈಕೆಗೆ ಸಿದ್ಧ",
    virtualLotsTitle: "ಸಕ್ರಿಯ ವರ್ಚುವಲ್ ಲಾಟ್ ಸಂಗ್ರಹಣೆ",
    lockLotBtn: "ಲಾಟ್ ಲಾಕ್ ಮಾಡಿ",
    lockedBadge: "ಲಾಟ್ ಲಾಕ್ ಮಾಡಲಾಗಿದೆ",
    poolingActive: "ಸಂಗ್ರಹಣೆ ಪ್ರಗತಿಯಲ್ಲಿದೆ",
    institutionalDemandTitle: "ಸಗಟು ಖರೀದಿದಾರರ ಸಂಸ್ಥಾಗತ ಬೇಡಿಕೆಗಳು (RFQs)",
    fulfillmentLabel: "ಬೇಡಿಕೆ ಪೂರೈಕೆ",

    buyerTitle: "ನೇರ ಖರೀದಿದಾರ ಪೋರ್ಟಲ್",
    buyerSubtitle: "ಕಂಪ್ಯೂಟರ್ ವಿಷನ್ ಪ್ರಮಾಣೀಕೃತ ತಾಜಾ ಬೆಳೆಗಳು — ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದೆ ನೇರ ಖರೀದಿ",
    btnPostReq: "ಸಗಟು ಬೇಡಿಕೆಯನ್ನು ಪೋಸ್ಟ್ ಮಾಡಿ",
    buyerStatContracts: "ಸಕ್ರಿಯ ಸ್ಮಾರ್ಟ್ ಒಪ್ಪಂದಗಳು",
    buyerStatEscrow: "ಎಸ್ಕ್ರೋ ಠೇವಣಿ",
    buyerStatQuality: "CV ಗುಣಮಟ್ಟ ಪಾಸಿಂಗ್ ದರ",
    buyerOrdersTitle: "ಇತ್ತೀಚಿನ ಒಪ್ಪಂದಗಳು ಮತ್ತು ಆದೇಶಗಳು",
    reqModalTitle: "ಹೊಸ ಸಗಟು ಖರೀದಿ ಬೇಡಿಕೆಯನ್ನು ಸಲ್ಲಿಸಿ",
    submitReqBtn: "ಬೇಡಿಕೆಯನ್ನು ಪ್ರಕಟಿಸಿ",

    hubTitle: "ನಾಸಿಕ್ ಸಂಗ್ರಹಣಾ ಮೈಕ್ರೋ-ಹಬ್ #04",
    hubName: "ಮೈಕ್ರೋ-ಹಬ್ ಕಂಪ್ಯೂಟರ್ ವಿಷನ್ ಗ್ರೇಡಿಂಗ್ ಡೆಸ್ಕ್",
    hubSubtitle: "ಗುಣಮಟ್ಟ ತಪಾಸಣೆ, QR ಟ್ಯಾಗಿಂಗ್ ಮತ್ತು ಕೋಲ್ಡ್-ಸ್ಟೋರೇಜ್ ನಿರ್ವಹಣೆ",
    hubCropSelect: "ಬೆಳೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    hubLotSize: "ಲಾಟ್ ಪ್ರಮಾಣ (ಕೆಜಿ)",
    btnRunCv: "ಕಂಪ್ಯೂಟರ್ ವಿಷನ್ AI ತಪಾಸಣೆ ನಡೆಸಿ",
    analyzingCv: "AI ಗುಣಮಟ್ಟ ವಿಶ್ಲೇಷಣೆ ನಡೆಯುತ್ತಿದೆ...",
    cvResultsTitle: "ಗುಣಮಟ್ಟ ತಪಾಸಣಾ ಫಲಿತಾಂಶ",
    confidenceScore: "CV ವಿಶ್ವಾಸಾರ್ಹತೆ",
    ripenessScore: "ಹಣ್ಣಾಗುವಿಕೆ ಅನುಪಾತ",
    defectScore: "ದೋಷದ ದರ",
    fssaiStatus: "FSSAI ಪ್ರಮಾಣೀಕರಣ",
    storageTemp: "ಶಿಫಾರಸು ಮಾಡಿದ ತಾಪಮಾನ",
    shelfLife: "ಅಂದಾಜು ಬಾಳಿಕೆ ಅವಧಿ",
    qrGeneratedLabel: "ಹಬ್ QR ಲೇಬಲ್ ಸಿದ್ಧವಾಗಿದೆ",
    printQrBtn: "QR ಲೇಬಲ್ ಮುದ್ರಿಸಿ ಮತ್ತು ಟ್ಯಾಗ್ ಮಾಡಿ",

    transporterTitle: "ಲಾಜಿಸ್ಟಿಕ್ಸ್ ಮತ್ತು ಸ್ಮಾರ್ಟ್ ಮಾರ್ಗ ಡೆಸ್ಕ್",
    transporterSubtitle: "ಮಲ್ಟಿ-ಸ್ಟಾಪ್ ಪಿಕಪ್ ಮತ್ತು ಸುರಕ್ಷಿತ OTP ಡಿಜಿಟಲ್ ಹಸ್ತಾಂತರ",
    fleetMetricsTitle: "ಇಂದಿನ AI ಮಾರ್ಗ ಕಾರ್ಯಕ್ಷಮತೆ",
    distanceLabel: "ಒಟ್ಟು ದೂರ",
    etaLabel: "ಅಂದಾಜು ಸಮಯ",
    fuelSavingsLabel: "ಇಂಧನ ಉಳಿತಾಯ",
    multiStopTitle: "ಆಪ್ಟಿಮೈಸ್ಡ್ ಪಿಕಪ್ ಮತ್ತು ವಿತರಣಾ ನಿಲ್ದಾಣಗಳು",
    pickupOtpLabel: "ಪಿಕಪ್ OTP",
    deliveryOtpLabel: "ವಿತರಣಾ OTP",
    otpVerifyTitle: "ಸುರಕ್ಷಿತ OTP ಹಸ್ತಾಂತರ ಪರಿಶೀಲನೆ",
    otpVerifyPlaceholder: "4-ಅಂಕಿಯ OTP ನಮೂದಿಸಿ (ಉದಾ. 4829)",
    btnVerifyOtp: "OTP ಪರಿಶೀಲಿಸಿ",

    adminTitle: "SIH 2026 PS 26033 ರಾಷ್ಟ್ರೀಯ ಮಂಡಿ ಆಡಳಿತ",
    adminHeading: "ಸಚಿವಾಲಯ ಮತ್ತು ರಾಷ್ಟ್ರೀಯ ಮಂಡಿ ನಿಯಂತ್ರಣ ಕೊಠಡಿ",
    adminSubtitle: "ಗ್ರಾಹಕ ವ್ಯವಹಾರಗಳು, ಆಹಾರ ಮತ್ತು ಸಾರ್ವಜನಿಕ ವಿತರಣಾ ಸಚಿವಾಲಯ — ನೇರ ವ್ಯಾಪಾರ ಮೇಲ್ವಿಚಾರಣೆ",
    adminStatGmv: "ಒಟ್ಟು ರಾಷ್ಟ್ರೀಯ ಕೃಷಿ ವಹಿವಾಟು (GMV)",
    adminStatWaste: "ತಡೆಗಟ್ಟಲಾದ ಆಹಾರ ವ್ಯರ್ಥ",
    adminStatIncome: "ರೈತರ ನಿವ್ವಳ ಆದಾಯ ಏರಿಕೆ",
    adminStatMandis: "ಸಕ್ರಿಯ ಡಿಜಿಟಲ್ ಹಬ್‌ಗಳು",
    recentLedgerTitle: "ಪಾರದರ್ಶಕ ರಾಷ್ಟ್ರೀಯ ವಹಿವಾಟು ಖಾತೆ (Audit Trail)",
    colOrderId: "ಒಪ್ಪಂದ ID",
    colBuyer: "ಖರೀದಿದಾರ",
    colFarmer: "ರೈತ / FPO",
    colAmount: "ಮೊತ್ತ",
    colDelivery: "ವಿತರಣಾ ಪ್ರಕಾರ",
    aiEnginesTitle: "ಸಂಯೋಜಿತ AI ಎಂಜಿನ್‌ಗಳ ಸ್ಥಿತಿ",

    cartEmpty: "ನಿಮ್ಮ ಕಾರ್ಟ್ ಪ್ರಸ್ತುತ ಖಾಲಿಯಾಗಿದೆ",
    cartSubtotal: "ಉಪ-ಒಟ್ಟು ಮೊತ್ತ",
    logisticsFee: "ಸ್ಮಾರ್ಟ್ ಸಾರಿಗೆ ಶುಲ್ಕ",
    gstTax: "GST (0% ಕೃಷಿ ವಿನಾಯಿತಿ)",
    totalAmount: "ಒಟ್ಟು ಪಾವತಿಸಬೇಕಾದ ಮೊತ್ತ",
    proceedOrder: "ಸ್ಮಾರ್ಟ್ ಒಪ್ಪಂದವನ್ನು ಕಾರ್ಯಗತಗೊಳಿಸಿ",
    orderSuccessTitle: "ಆದೇಶ ಒಪ್ಪಂದ ಯಶಸ್ವಿಯಾಗಿ ನೆರವೇರಿದೆ!",
    orderSuccessDesc: "ರೈತ ಮತ್ತು ಹಬ್ ಆಪರೇಟರ್‌ಗೆ ಸ್ವಯಂಚಾಲಿತ ರವಾನೆ ಆದೇಶ ಕಳುಹಿಸಲಾಗಿದೆ.",
    smartContractIdLabel: "ಸ್ಮಾರ್ಟ್ ಒಪ್ಪಂದ ID",
    escrowStatusLabel: "ಎಸ್ಕ್ರೋ ಸ್ಥಿತಿ",
    escrowLockedText: "ಕಾರ್ಯಗತಗೊಂಡಿದೆ (ಎಸ್ಕ್ರೋದಲ್ಲಿ ಸುರಕ್ಷಿತ)",
    closeBtn: "ಮುಚ್ಚಿ (Close)",

    footerMission: "ಕಿಸಾನ್ ದಿವಸ್ ಸಮರ್ಪಿತ ನೇರ ಕೃಷಿ ಪೂರೈಕೆ ಮತ್ತು ಲಾಜಿಸ್ಟಿಕ್ಸ್ ವ್ಯವಸ್ಥೆ. Smart India Hackathon 2026 Problem Statement 26033.",
    aiEnginesCore: "AI ಎಂಜಿನ್ ಕೋರ್ (6 AI Engines)",
    userRolesFooter: "ಬಳಕೆದಾರ ಪಾತ್ರಗಳು (6 Personas)",
    helplineTitle: "ಸಹಾಯವಾಣಿ ಮತ್ತು ಬೆಂಬಲ",
    helplineDesc: "ರೈತ ಟೋಲ್-ಫ್ರೀ IVR ಸಹಾಯವಾಣಿ: 1800-KISAN-AI",
    allIndiaLangs247: "24x7 ಎಲ್ಲಾ ಭಾರತೀಯ ಭಾಷೆಗಳಲ್ಲಿ ಲಭ್ಯವಿದೆ",

    translatorHeader: "🇮🇳 ಭಾರತ ಬಹುಭಾಷಾ ಕೃಷಿ ಅನುವಾದಕ (All-India Multi-Language Translator)",
    translatorSub: "ಭಾರತದ ಪ್ರಮುಖ ಭಾಷೆಗಳಲ್ಲಿ ಕೃಷಿ ಪದಗಳು, ಮಂಡಿ ಬೆಲೆಗಳು ಮತ್ತು ಸಂದೇಶಗಳ ತ್ವರಿತ ಅನುವಾದ.",
    sourceLangLabel: "ಮೂಲ ಭಾಷೆ (From)",
    targetLangLabel: "ಗುರಿ ಭಾಷೆ (To)",
    inputPlaceholder: "ಅನುವಾದಿಸಲು ಕೃಷಿ ಪ್ರಶ್ನೆ, ಬೆಳೆ ವಿವರಣೆ ಅಥವಾ ಸಂದೇಶವನ್ನು ನಮೂದಿಸಿ...",
    translatedOutputPlaceholder: "ಅನುವಾದಿತ ಪಠ್ಯ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ...",
    quickAgriPhrasesTitle: "ತ್ವರಿತ ಕೃಷಿ ವಾಕ್ಯಗಳು:",
    phrase1: "ಇಂದು ನಾಸಿಕ್ ಮಂಡಿಯಲ್ಲಿ ಟೊಮೆಟೊ ಸಗಟು ಬೆಲೆ ಎಷ್ಟು?",
    phrase2: "ಬೆಳೆಯನ್ನು ಕಂಪ್ಯೂಟರ್ ವಿಷನ್ AI ಮೂಲಕ ತಪಾಸಣೆ ಮಾಡಿ ಗ್ರೇಡ್ A+ ನೀಡಲಾಗಿದೆ.",
    phrase3: "ಸ್ಮಾರ್ಟ್ ಒಪ್ಪಂದ ಪಾವತಿ ಸುರಕ್ಷಿತವಾಗಿ ರೈತ ಎಸ್ಕ್ರೋ ಖಾತೆಯಲ್ಲಿ ಜಮೆಯಾಗಿದೆ.",
    phrase4: "ವಾಹನ ಪಿಕಪ್‌ಗಾಗಿ ಸಂಗ್ರಹಣಾ ಹಬ್‌ನಲ್ಲಿ 4829 OTP ಅನ್ನು ಪ್ರಸ್ತುತಪಡಿಸಿ.",
    phrase5: "FPO ಗುಂಪಿನಲ್ಲಿ 500 ಕೆಜಿ ಗೋಧಿ ವರ್ಚುವಲ್ ಪೂಲ್ ರಚಿಸಲಾಗಿದೆ.",
    btnTranslate: "ಅನುವಾದಿಸಿ",
    btnListen: "ಕೇಳಿ (Speak)",
    btnCopy: "ಕಾಪಿ ಮಾಡಿ",
    copiedNotice: "ಕಾಪಿ ಮಾಡಲಾಗಿದೆ!",
    btnClear: "ಅಳಿಸಿ",
    swapLanguages: "ಭಾಷೆಗಳನ್ನು ಬದಲಾಯಿಸಿ",

    currencySymbol: "₹",
    paiseSuffix: "ಪೈಸೆ",
    statusAvailable: "ಲಭ್ಯವಿದೆ",
    statusInTransit: "ಸಾರಿಗೆಯಲ್ಲಿದೆ",
    statusDelivered: "ಯಶಸ್ವಿಯಾಗಿ ವಿತರಿಸಲಾಗಿದೆ",
  },

  ml: {
    // Malayalam
    appName: "Nira",
    subTitle: "പാടത്തുനിന്ന് നേരിട്ട് ഉപഭോക്താവിലേക്ക് — ഇടനിലക്കാരില്ലാതെ",
    tagline: "ഇന്ത്യയിലെ ആദ്യത്തെ AI അധിഷ്ഠിത നേരിട്ടുള്ള കാർഷിക വിപണിയും ലോജിസ്റ്റിക്സും",
    activeRoleLabel: "സജീവ പങ്ക്",
    navHome: "കാർഷിക വിപണി",
    navFarmer: "കർഷക പോർട്ടൽ",
    navFPO: "FPO ഗ്രൂപ്പ്",
    navBuyer: "നേരിട്ടുള്ള വാങ്ങലുകാരൻ",
    navHub: "ഗുണനിലവാര പരിശോധനാ കേന്ദ്രം",
    navTransporter: "ഗതാഗതവും ലോജിസ്റ്റിക്സും",
    navAdmin: "ദേശീയ മാണ്ഡി ഭരണം",
    cartTitle: "നിങ്ങളുടെ ഷോപ്പിംഗ് കാർട്ട്",
    cartButton: "ഷോപ്പിംഗ് കാർട്ട്",
    checkout: "സുരക്ഷിത കരാർ പേയ്മെന്റ്",
    translatorTitle: "ഭാരത ബഹുഭാഷാ വിവർത്തകൻ",
    translatorBtn: "🇮🇳 വിവർത്തകൻ (Translator)",
    selectLanguage: "ഭാഷ തിരഞ്ഞെടുക്കുക",
    kisanPlatformBadge: "കിസാൻ ദിവസ് അഗ്രി-ടെക് പ്ലാറ്റ്‌ഫോം",

    roleFarmer: "കർഷക പോർട്ടൽ",
    roleFPO: "FPO മാനേജർ",
    roleBuyer: "നേരിട്ടുള്ള വാങ്ങലുകാരൻ",
    roleHub: "മൈക്രോ-ഹബ്ബ് ഉദ്യോഗസ്ഥൻ",
    roleTransporter: "ഗതാഗത പങ്കാളി",
    roleAdmin: "സർക്കാർ ഭരണം",
    roleFarmerSub: "ന്യായവിലയും IVR ഉം",
    roleFPOSub: "വെർച്വൽ ലോട്ട് സമാഹരണം",
    roleBuyerSub: "മൊത്ത ഡിമാൻഡും കരാറും",
    roleHubSub: "CV ഗ്രേഡിംഗും QR ഉം",
    roleTransporterSub: "റൂട്ട് ഒപ്റ്റിമൈസേഷനും OTP യും",
    roleAdminSub: "ദേശീയ മാണ്ഡി ഭരണം",
    selectDashboard: "ഉപയോക്തൃ ഡാഷ്‌ബോർഡ് തിരഞ്ഞെടുക്കുക",
    integratedRolesCount: "6 സംയോജിത റോളുകൾ",

    heroBadge: "SIH 2026 PS 26033 • കിസാൻ ദിവസ് സമർപ്പിത നേരിട്ടുള്ള കാർഷിക പ്ലാറ്റ്‌ഫോം",
    heroTitle: "കർഷകരുടെ വിളകൾക്ക് നേരിട്ട് ന്യായവില, AI കരുത്തോടെ",
    heroDesc: "ഇടനിലക്കാരില്ലാതെ നേരിട്ടുള്ള വിൽപന, കമ്പ്യൂട്ടർ വിഷൻ സ്വയമേവയുള്ള ഗുണനിലവാര ഗ്രേഡിംഗ്, 0% വിള പാഴാകൽ.",
    heroCTA: "പുതിയ വിളകൾ കാണുക",
    ivrCTA: "ഫോൺ വഴി വിൽക്കുക (IVR സേവനം)",
    tollFreeNotice: "ടോൾ-ഫ്രീ IVR വോയ്‌സ് ഹെൽപ്പ്‌ലൈൻ: 1800-KISAN-AI (കീപാഡ് ഫോൺ രജിസ്ട്രേഷൻ)",
    statMiddlemen: "0%",
    statMiddlemenSub: "ഇടനില കമ്മീഷൻ (നേരിട്ട് കർഷക എസ്ക്രോ)",
    statCvGrading: "99.4%",
    statCvGradingSub: "കമ്പ്യൂട്ടർ വിഷൻ ഗ്രേഡിംഗ് (FSSAI സാക്ഷ്യപ്പെടുത്തിയത്)",
    statAiEngines: "6 AI",
    statAiEnginesSub: "സ്മാർട്ട് അഗ്രി എഞ്ചിനുകൾ (ന്യായവില + റൂട്ട്)",
    statIvrPhone: "IVR/SMS",
    statIvrPhoneSub: "ഇന്റർനെറ്റ് ഇല്ലാത്ത സേവനം (കീപാഡ് ഫോൺ പിന്തുണ)",

    liveMandiTicker: "തത്സമയ മാണ്ഡി നിരക്കുകൾ (Agmarknet റിയൽ-ടൈം):",
    tickerCrop1: "തക്കാളി (ഗ്രേഡ് A+)",
    tickerCrop2: "നാസിക് ചുവന്ന ഉള്ളി",
    tickerCrop3: "ഇൻഡോർ ജ്യോതി ഉരുളക്കിഴങ്ങ്",
    tickerCrop4: "ശർബതി പ്രീമിയം ഗോതമ്പ്",
    tickerCrop5: "മഞ്ഞ സോയാബീൻ",
    tickerCrop6: "നാടൻ വെളുത്തുള്ളി",

    marketplaceTitle: "സാക്ഷ്യപ്പെടുത്തിയ പുതിയ വിളകളുടെ വിപണി",
    marketplaceSubtitle: "കമ്പ്യൂട്ടർ വിഷൻ ഗുണനിലവാരവും സുതാര്യമായ എസ്ക്രോയും ഉപയോഗിച്ച് പുതിയ വിളകൾ വാങ്ങുക",
    filterAll: "എല്ലാ വിളകളും",
    filterGradeA: "ഗ്രേഡ് A / A+ മാത്രം",
    filterOrganic: "ജൈവ വിളകൾ മാത്രം",
    pricePerKg: "കിലോഗ്രാമിന്",
    availableQty: "ലഭ്യമായ അളവ്",
    gradeLabel: "ഗുണനിലവാര ഗ്രേഡ്",
    locationLabel: "സ്ഥലവും ഹബ്ബും",
    farmerLabel: "കർഷകൻ / FPO",
    addToCart: "കാർട്ടിലേക്ക് ചേർക്കുക",
    buyNow: "ഇപ്പോൾ വാങ്ങുക",
    categoryVeg: "പച്ചക്കറികൾ",
    categoryTubers: "കിഴങ്ങുവർഗ്ഗങ്ങൾ",
    categoryGrains: "ധാന്യങ്ങൾ",
    organicBadge: "100% ജൈവം",
    cvTrustScore: "CV വിശ്വാസ്യത സ്കോർ",
    fairPriceAiTag: "Fair Price AI നിരക്ക്",

    fairPriceHeader: "ന്യായവില AI എഞ്ചിൻ — താങ്ങുവിലയേക്കാൾ മികച്ച തുക",
    ivrHeader: "സ്മാർട്ട്ഫോൺ ഇല്ലേ? 1800-KISAN-AI വിളിക്കുക",
    ivrSubtitle: "കീപാഡ് ബട്ടണുകൾ അമർത്തുകയോ സംസാരിക്കുകയോ ചെയ്ത് വിള രേഖപ്പെടുത്തുക — തൽക്ഷണ SMS സ്ഥിരീകരണം",
    press1: "1: തക്കാളി രജിസ്റ്റർ ചെയ്യാൻ",
    press2: "2: ഉള്ളി രജിസ്റ്റർ ചെയ്യാൻ",
    press3: "3: ഉരുളക്കിഴങ്ങ് രജിസ്റ്റർ ചെയ്യാൻ",
    simulatedCall: "കീപാഡ് സേവനം പ്രവർത്തിപ്പിക്കുക",
    callSuccess: "SMS അയച്ചു! വിള വിജയകരമായി രേഖപ്പെടുത്തി.",

    farmerPortalTitle: "നേരിട്ടുള്ള കർഷക പോർട്ടൽ • 0% ഇടനില കമ്മീഷൻ",
    farmerWelcome: "നമസ്കാരം",
    farmerSubtitle: "നിങ്ങളുടെ വിളകൾ നേരിട്ട് സാക്ഷ്യപ്പെടുത്തിയ വാങ്ങലുകാർക്ക് ന്യായവിലയിൽ വിൽക്കുന്നു",
    btnListProduce: "പുതിയ വിള രേഖപ്പെടുത്തുക",
    btnIvrService: "IVR വോയ്സ് സേവനം",
    farmerStatActive: "സജീവ വിള പട്ടികകൾ",
    farmerStatPriceGain: "ന്യായവില അധിക നേട്ടം",
    farmerStatEscrow: "എസ്ക്രോയിലെ സുരക്ഷിത തുക",
    myListingsTitle: "നിങ്ങൾ രജിസ്റ്റർ ചെയ്ത വിളകൾ",
    colCrop: "വിളയുടെ പേര്",
    colQty: "അളവ്",
    colPrice: "വില",
    colGrade: "ഗുണനിലവാര ഗ്രേഡ്",
    colLocation: "ഹബ്ബ് സ്ഥലം",
    colStatus: "നില",
    statusVerified: "സാക്ഷ്യപ്പെടുത്തിയ വിള",
    statusPooled: "പൂളിൽ ഉൾപ്പെടുത്തി",
    addModalTitle: "വിപണിയിൽ പുതിയ വിള ചേർക്കുക",
    cropNamePlaceholder: "വിളയുടെ പേര് (ഉദാ. നാസിക് ഉള്ളി)",
    qtyPlaceholder: "അളവ് (കിലോഗ್ರാം)",
    pricePlaceholder: "അടിസ്ഥാന വില (₹/കിലോഗ್ರാം)",
    saveProduceBtn: "വിള പ്രസിദ്ധീകരിക്കുക",
    cancelBtn: "റദ്ദാക്കുക",
    gradeA: "പ്രീമിയം ഗ്രേഡ് A+",
    gradeExport: "കയറ്റുമതി ഗ്രേഡ്",

    fpoTitle: "സഹ്യാദ്രി ഫാർമേഴ്‌സ് പ്രൊഡ്യൂസർ FPO",
    fpoGroupName: "FPO വെർച്വൽ ലോട്ട് സമാഹരണ കേന്ദ്രം",
    fpoSubtitle: "142 കർഷകർ ഒത്തുചേർന്നു (കൂട്ടായ വിലപേശൽ കരുത്ത്)",
    fpoStatSupply: "ആകെ FPO വിതരണ ലഭ്യത",
    fpoStatSupplySub: "+42% മികച്ച വിലപേശൽ നേട്ടം",
    fpoStatLots: "സജീവ വെർച്വൽ ലോട്ടുകൾ",
    fpoStatLotsSub: "86 കർഷകർ പങ്കാളികളാണ്",
    fpoStatRfqs: "സ്ഥാപന ഡിമാൻഡുകൾ",
    fpoStatRfqsSub: "നേരിട്ട് വിതരണം ചെയ്യാൻ തയ്യാറാണ്",
    virtualLotsTitle: "സജീവ വെർച്വൽ ലോട്ട് സമാഹരണം",
    lockLotBtn: "ലോട്ട് ലോക്ക് ചെയ്യുക",
    lockedBadge: "ലോട്ട് ലോക്ക് ചെയ്തു",
    poolingActive: "സമാഹരണം തുടരുന്നു",
    institutionalDemandTitle: "മൊത്ത വാങ്ങലുകാരുടെ ഡിമാൻഡുകൾ (RFQs)",
    fulfillmentLabel: "ഡിമാൻഡ് പൂർത്തീകരണം",

    buyerTitle: "നേരിട്ടുള്ള വാങ്ങലുകാരന്റെ പോർട്ടൽ",
    buyerSubtitle: "കമ്പ്യൂട്ടർ വിഷൻ ഗുണനിലവാരം ഉറപ്പാക്കിയ വിളകൾ — ഇടനിലക്കാരില്ലാത്ത സംഭരണം",
    btnPostReq: "മൊത്ത ഡിമാൻഡ് പോസ്റ്റ് ചെയ്യുക",
    buyerStatContracts: "സജീവ സ്മാർട്ട് കരാറുകൾ",
    buyerStatEscrow: "എസ്ക്രോ നിക്ഷേപം",
    buyerStatQuality: "CV ഗുണനിലവാര വിജയം",
    buyerOrdersTitle: "സമീപകാല കരാറുകളും ഓർഡറുകളും",
    reqModalTitle: "പുതിയ മൊത്ത സംഭരണ ഡിമാൻഡ് സമർപ്പിക്കുക",
    submitReqBtn: "ഡിമാൻഡ് പ്രസിദ്ധീകരിക്കുക",

    hubTitle: "നാസിക് കളക്ഷൻ മൈക്രോ-ഹബ്ബ് #04",
    hubName: "മൈക്രോ-ഹബ്ബ് കമ്പ്യൂട്ടർ വിഷൻ ഗ്രേഡിംഗ് ഡെസ്ക്",
    hubSubtitle: "ഗുണനിലവാര പരിശോധന, QR ടാഗിംഗ്, കോൾഡ് സ്റ്റോറേജ് കൈകാര്യം ചെയ്യൽ",
    hubCropSelect: "വിള തിരഞ്ഞെടുക്കുക",
    hubLotSize: "ലോട്ട് അളവ് (കിലോഗ്രാം)",
    btnRunCv: "കമ്പ്യൂട്ടർ വിഷൻ AI പരിശോധന നടത്തുക",
    analyzingCv: "AI ഗുണനിലവാര വിശകലനം പുരോഗമിക്കുന്നു...",
    cvResultsTitle: "ഗുണനിലവാര പരിശോധനാ ഫലം",
    confidenceScore: "CV വിശ്വാസ്യത",
    ripenessScore: "പാകമായ അനുപാതം",
    defectScore: "കേടുപാടുകളുടെ നിരക്ക്",
    fssaiStatus: "FSSAI സർട്ടിഫിക്കേഷൻ",
    storageTemp: "ശുപാർശ ചെയ്യുന്ന താപനില",
    shelfLife: "പ്രതീക്ഷിക്കുന്ന സംഭരണ കാലാവധി",
    qrGeneratedLabel: "ഹബ്ബ് QR ലേബൽ തയ്യാറായി",
    printQrBtn: "QR ലേബൽ പ്രിന്റ് ചെയ്ത് ഒട്ടിക്കുക",

    transporterTitle: "ലോജിസ്റ്റിക്സ് & സ്മാർട്ട് റൂട്ട് ഡെസ്ക്",
    transporterSubtitle: "മൾട്ടി-സ്റ്റോപ്പ് ശേഖരണവും സുരക്ഷിത OTP ഡിജിറ്റൽ കൈമാറ്റവും",
    fleetMetricsTitle: "ഇന്നത്തെ AI റൂട്ട് പ്രകടനം",
    distanceLabel: "ആകെ ദൂരം",
    etaLabel: "പ്രതീക്ഷിക്കുന്ന സമയം",
    fuelSavingsLabel: "ഇന്ധന ലാഭം",
    multiStopTitle: "ഒപ്റ്റിമൈസ് ചെയ്ത പിക്കപ്പ് & ഡെലിവറി സ്റ്റോപ്പുകൾ",
    pickupOtpLabel: "പിക്കപ്പ് OTP",
    deliveryOtpLabel: "ഡെലിവറി OTP",
    otpVerifyTitle: "സുരക്ഷിത OTP കൈമാറ്റ പരിശോധന",
    otpVerifyPlaceholder: "4-അക്ക OTP നൽകുക (ഉദാ. 4829)",
    btnVerifyOtp: "OTP പരിശോധിക്കുക",

    adminTitle: "SIH 2026 PS 26033 ദേശീയ മാണ്ഡി ഭരണം",
    adminHeading: "മന്ത്രാലയവും ദേശീയ മാണ്ഡി നിയന്ത്രണ മുറിയും",
    adminSubtitle: "ഉപഭോക്തൃകാര്യ, ഭക്ഷ്യ, പൊതുവിതരണ മന്ത്രാലയം — നേരിട്ടുള്ള കാർഷിക വ്യാപാര മേൽനോട്ടം",
    adminStatGmv: "ആകെ ദേശീയ കാർഷിക വ്യാപാരം (GMV)",
    adminStatWaste: "തടഞ്ഞ വിള നഷ്ടം",
    adminStatIncome: "കർഷകരുടെ അറ്റവരുമാന വളർച്ച",
    adminStatMandis: "സജീവ ഡിജിറ്റൽ ഹബ്ബുകൾ",
    recentLedgerTitle: "സുതാര്യമായ ദേശീയ ഇടപാട് ലെഡ്ജർ (Audit Trail)",
    colOrderId: "കരാർ ID",
    colBuyer: "വാങ്ങുന്നയാൾ",
    colFarmer: "കർഷകൻ / FPO",
    colAmount: "തുക",
    colDelivery: "വിതരണ രീതി",
    aiEnginesTitle: "സംയോജിത AI എഞ്ചിനുകളുടെ അവസ്ഥ",

    cartEmpty: "നിങ്ങളുടെ കാർട്ട് നിലവിൽ ശൂന്യമാണ്",
    cartSubtotal: "ഉപ-ആകെ തുക",
    logisticsFee: "സ്മാർട്ട് ഗതാഗത നിരക്ക്",
    gstTax: "GST (0% കാർഷിക ഇളവ്)",
    totalAmount: "ആകെ നൽകേണ്ട തുക",
    proceedOrder: "സ്മാർട്ട് കരാർ നടപ്പിലാക്കുക",
    orderSuccessTitle: "ഓർഡർ കരാർ വിജയകരമായി നടപ്പിലാക്കി!",
    orderSuccessDesc: "കർഷകനും ഹബ്ബ് ഓപ്പറേറ്റർക്കും ഓട്ടോമാറ്റിക് നിർദ്ദേശം കൈമാറിയിട്ടുണ്ട്.",
    smartContractIdLabel: "സ്മാർട്ട് കരാർ ID",
    escrowStatusLabel: "എസ്ക്രോ നില",
    escrowLockedText: "നടപ്പിലാക്കി (എസ്ക്രോയിൽ സുരക്ഷിതം)",
    closeBtn: "പൂർത്തിയാക്കുക (Close)",

    footerMission: "കിസാൻ ദിവസ് സമർപ്പിത നേരിട്ടുള്ള കാർഷിക വിതരണ-ലോജിസ്റ്റിക്സ് സംവിധാനം. Smart India Hackathon 2026 Problem Statement 26033.",
    aiEnginesCore: "AI എഞ്ചിൻ കോർ (6 AI Engines)",
    userRolesFooter: "ഉപയോക്തൃ റോളുകൾ (6 Personas)",
    helplineTitle: "ഹെൽപ്പ്‌ലൈനും പിന്തുണയും",
    helplineDesc: "കർഷക ടോൾ-ഫ്രീ IVR ഹെൽപ്പ്‌ലൈൻ: 1800-KISAN-AI",
    allIndiaLangs247: "24x7 എല്ലാ ഇന്ത്യൻ ഭാഷകളിലും ലഭ്യമാണ്",

    translatorHeader: "🇮🇳 ഭാരത ബഹുഭാഷാ കാർഷിക വിവർത്തകൻ (All-India Multi-Language Translator)",
    translatorSub: "പ്രധാന ഇന്ത്യൻ ഭാഷകളിലേക്ക് കാർഷിക പദങ്ങളും വിപണി നിരക്കുകളും തൽക്ഷണം വിവർത്തനം ചെയ്യുക.",
    sourceLangLabel: "ഉറവിട ഭാഷ (From)",
    targetLangLabel: "ലക്ഷ്യ ഭാഷ (To)",
    inputPlaceholder: "വിവർത്തനം ചെയ്യാൻ കാർഷിക ചോദ്യമോ വിള വിവരങ്ങളോ നൽകുക...",
    translatedOutputPlaceholder: "വിവർത്തനം ചെയ്ത വാചകം ഇവിടെ ദൃശ്യമാകും...",
    quickAgriPhrasesTitle: "ദ്രുത കാർഷിക വാക്യങ്ങൾ:",
    phrase1: "ഇന്ന് നാസിക് മാണ്ഡിയിൽ തക്കാളിയുടെ മൊത്തവില എത്രയാണ്?",
    phrase2: "വിള കമ്പ്യൂട്ടർ വിഷൻ AI പരിശോധിച്ച് ഗ്രേഡ് A+ നൽകി.",
    phrase3: "സ്മാർട്ട് കരാർ തുക കർഷകന്റെ എസ്ക്രോ അക്കൗണ്ടിൽ സുരക്ഷിതമായി നിക്ഷേപിച്ചിട്ടുണ്ട്.",
    phrase4: "വാഹനം പിക്കപ്പിനായി ഹബ്ബിൽ 4829 OTP ഹാജരാക്കുക.",
    phrase5: "FPO ഗ്രൂപ്പിൽ 500 കിലോ ഗോതമ്പ് വെർച്വൽ പൂൾ രൂപീകരിച്ചു.",
    btnTranslate: "വിവർത്തനം ചെയ്യുക",
    btnListen: "കേൾക്കുക (Speak)",
    btnCopy: "പകർത്തുക (Copy)",
    copiedNotice: "പകർത്തി!",
    btnClear: "മായ്ക്കുക",
    swapLanguages: "ഭാഷകൾ പരസ്പരം മാറ്റുക",

    currencySymbol: "₹",
    paiseSuffix: "പൈസ",
    statusAvailable: "ലഭ്യമാണ്",
    statusInTransit: "യാത്രയിലാണ്",
    statusDelivered: "വിജയകരമായി വിതരണം ചെയ്തു",
  },

  or: {
    // Odia
    appName: "Nira",
    subTitle: "କ୍ଷେତରୁ ସିଧା ଗ୍ରାହକଙ୍କ ପାଖକୁ — ମଧ୍ୟସ୍ଥିଙ୍କ ବିନା",
    tagline: "ଭାରତର ପ୍ରଥମ AI ଚାଳିତ ପ୍ରତ୍ୟକ୍ଷ କୃଷି ବଜାର ଓ ଲଜିଷ୍ଟିକ୍ସ ମଞ୍ଚ",
    activeRoleLabel: "ସକ୍ରିୟ ଭୂମିକା",
    navHome: "କୃଷି ବଜାର",
    navFarmer: "କୃଷକ ପୋର୍ଟାଲ",
    navFPO: "FPO ଗ୍ରୁପ୍",
    navBuyer: "ପ୍ରତ୍ୟକ୍ଷ କ୍ରେତା",
    navHub: "ଗୁଣବତ୍ତା ଯାଞ୍ଚ କେନ୍ଦ୍ର",
    navTransporter: "ପରିବହନ ଓ ଲଜିଷ୍ଟିକ୍ସ",
    navAdmin: "ଜାତୀୟ ମଣ୍ଡି ଶାସନ",
    cartTitle: "ଆପଣଙ୍କ ସପିଂ କାର୍ଟ",
    cartButton: "ସପିଂ କାର୍ଟ",
    checkout: "ସୁରକ୍ଷିତ ଚୁକ୍ତିନାମା ପେମେଣ୍ଟ",
    translatorTitle: "ଭାରତ ବହୁଭାଷୀ ଅନୁବାଦକ",
    translatorBtn: "🇮🇳 ଅନୁବାଦକ (Translator)",
    selectLanguage: "ଭାଷା ବାଛନ୍ତୁ",
    kisanPlatformBadge: "କିଷାନ ଦିବସ ଏଗ୍ରି-ଟେକ୍ ପ୍ଲାଟଫର୍ମ",

    roleFarmer: "କୃଷକ ପୋର୍ଟାଲ",
    roleFPO: "FPO ମ୍ୟାନେଜର",
    roleBuyer: "ପ୍ରତ୍ୟକ୍ଷ କ୍ରେତା",
    roleHub: "ମାଇକ୍ରୋ-ହବ୍ ଅଧିକାରୀ",
    roleTransporter: "ପରିବହନ ଅଂଶୀଦାର",
    roleAdmin: "ସରକାରୀ ପ୍ରଶାସନ",
    roleFarmerSub: "ନ୍ୟାୟଯୁକ୍ତ ମୂଲ୍ୟ ଓ IVR",
    roleFPOSub: "ଭର୍ଚୁଆଲ୍ ଲଟ୍ ଏକତ୍ରୀକରଣ",
    roleBuyerSub: "ପାଇକାରୀ ଚାହିଦା ଓ ଚୁକ୍ତି",
    roleHubSub: "CV ଗ୍ରେଡିଂ ଓ QR",
    roleTransporterSub: "ରୁଟ୍ ଅପ୍ଟିମାଇଜେସନ୍ ଓ OTP",
    roleAdminSub: "ଜାତୀୟ ମଣ୍ଡି ଶାସନ",
    selectDashboard: "ୟୁଜର୍ ଡ୍ୟାସବୋର୍ଡ ଚୟନ କରନ୍ତୁ",
    integratedRolesCount: "୬ଟି ସମନ୍ୱିତ ଭୂମିକା",

    heroBadge: "SIH 2026 PS 26033 • କିଷାନ ଦିବସ ସମର୍ପିତ ପ୍ରତ୍ୟକ୍ଷ କୃଷି ମଞ୍ଚ",
    heroTitle: "କୃଷକଙ୍କ ଫସଲର ସିଧାସଳଖ ନ୍ୟାୟଯୁକ୍ତ ମୂଲ୍ୟ, AI ର ଶକ୍ତି ସହିତ",
    heroDesc: "ଦଲାଲ ବିନା ସିଧାସଳଖ ବିକ୍ରି, କମ୍ପ୍ୟୁଟର ଭିଜନ ଦ୍ୱାରା ସ୍ୱୟଂଚାଳିତ ଗୁଣବତ୍ତା ଗ୍ରେଡିଂ ଏବଂ ୦% ଫସଲ ଅପଚୟ।",
    heroCTA: "ତାଜା ଫସଲ ଦେଖନ୍ତୁ",
    ivrCTA: "ଫୋନ୍ ମାଧ୍ୟମରେ ବିକ୍ରି କରନ୍ତୁ (IVR ସେବା)",
    tollFreeNotice: "ଟୋଲ୍-ଫ୍ରି IVR ଭଏସ୍ ହେଲ୍ପଲାଇନ୍: 1800-KISAN-AI (କୀ-ପ୍ୟାଡ୍ ଫୋନ୍ ପଞ୍ଜୀକରଣ)",
    statMiddlemen: "0%",
    statMiddlemenSub: "ମଧ୍ୟସ୍ଥି କମିଶନ (ସିଧାସଳଖ କୃଷକ ଏସ୍କ୍ରୋ)",
    statCvGrading: "99.4%",
    statCvGradingSub: "କମ୍ପ୍ୟୁଟର ଭିଜନ ଗ୍ରେଡିଂ (FSSAI ସାର୍ଟିଫାଏଡ୍)",
    statAiEngines: "6 AI",
    statAiEnginesSub: "ସ୍ମାର୍ଟ କୃଷି ଇଞ୍ଜିନ୍ (ନ୍ୟାୟଯୁକ୍ତ ମୂଲ୍ୟ + ରୁଟ୍)",
    statIvrPhone: "IVR/SMS",
    statIvrPhoneSub: "ଇଣ୍ଟରନେଟ୍ ବିନା ସେବା (କୀ-ପ୍ୟାଡ୍ ଫୋନ୍ ସମର୍ଥନ)",

    liveMandiTicker: "ଲାଇଭ୍ ମଣ୍ଡି ଦର (Agmarknet ରିଅଲ୍-ଟାଇମ୍):",
    tickerCrop1: "ତାଜା ଟମାଟୋ (ଗ୍ରେଡ୍ A+)",
    tickerCrop2: "ନାସିକ ନାଲି ପିଆଜ",
    tickerCrop3: "ଇନ୍ଦୋର ଜ୍ୟୋତି ଆଳୁ",
    tickerCrop4: "ଶରବତୀ ପ୍ରିମିୟମ ଗହମ",
    tickerCrop5: "ହଳଦିଆ ସୋୟାବିନ୍",
    tickerCrop6: "ଦେଶୀ ରସୁଣ",

    marketplaceTitle: "ପ୍ରମାଣିତ ତାଜା ଫସଲ ବଜାର",
    marketplaceSubtitle: "କମ୍ପ୍ୟୁଟର ଭିଜନ ସାର୍ଟିଫିକେସନ୍ ଏବଂ ସ୍ୱଚ୍ଛ ଏସ୍କ୍ରୋ ସହିତ ତାଜା ଫସଲ କିଣନ୍ତୁ",
    filterAll: "ସମସ୍ତ ଫସଲ",
    filterGradeA: "କେବଳ ଗ୍ରେଡ୍ A / A+",
    filterOrganic: "କେବଳ ଜୈବିକ ଫସଲ",
    pricePerKg: "ପ୍ରତି କିଲୋଗ୍ରାମ୍",
    availableQty: "ଉପଲବ୍ଧ ପରିମାଣ",
    gradeLabel: "ଗୁଣବତ୍ତା ଗ୍ରେଡ୍",
    locationLabel: "ସ୍ଥାନ ଓ ହବ୍",
    farmerLabel: "କୃଷକ / FPO",
    addToCart: "କାର୍ଟରେ ଯୋଡନ୍ତୁ",
    buyNow: "ବର୍ତ୍ତମାନ କିଣନ୍ତୁ",
    categoryVeg: "ପନିପରିବା",
    categoryTubers: "କନ୍ଦମୂଳ",
    categoryGrains: "ଶସ୍ୟ",
    organicBadge: "୧୦୦% ଜୈବିକ",
    cvTrustScore: "CV ବିଶ୍ୱାସ ସ୍କୋର",
    fairPriceAiTag: "Fair Price AI ମୂଲ୍ୟ",

    fairPriceHeader: "ନ୍ୟାୟଯୁକ୍ତ ମୂଲ୍ୟ AI ଇଞ୍ଜିନ୍ — ସର୍ବନିମ୍ନ ସହାୟକ ମୂଲ୍ୟଠାରୁ ଉନ୍ନତ ଦର",
    ivrHeader: "ସ୍ମାର୍ଟଫୋନ୍ ନାହିଁ? 1800-KISAN-AI କୁ ଡାଏଲ୍ କରନ୍ତୁ",
    ivrSubtitle: "କୀ-ପ୍ୟାଡ୍ ବଟନ୍ ଦବାନ୍ତୁ କିମ୍ବା କହି ଫସଲ ପଞ୍ଜୀକରଣ କରନ୍ତୁ — ତତକ୍ଷଣାତ୍ SMS ସୁନିଶ୍ଚିତତା",
    press1: "୧: ଟମାଟୋ ପଞ୍ଜୀକରଣ ପାଇଁ",
    press2: "୨: ପିଆଜ ପଞ୍ଜୀକରଣ ପାଇଁ",
    press3: "୩: ଆଳୁ ପଞ୍ଜୀକରଣ ପାଇଁ",
    simulatedCall: "କୀ-ପ୍ୟାଡ୍ ସେବା ଚଳାନ୍ତୁ",
    callSuccess: "SMS ପଠାଗଲା! ଆପଣଙ୍କ ଫସଲ ସଫଳତାର ସହିତ ପଞ୍ଜୀକୃତ ହୋଇଛି।",

    farmerPortalTitle: "ପ୍ରତ୍ୟକ୍ଷ କୃଷକ ପୋର୍ଟାଲ • ୦% ମଧ୍ୟସ୍ଥି କମିଶନ",
    farmerWelcome: "ନମସ୍କାର",
    farmerSubtitle: "ଆପଣଙ୍କ ଫସଲ ସିଧାସଳଖ ଯାଞ୍ଚ ହୋଇଥିବା କ୍ରେତାଙ୍କୁ ନ୍ୟାୟଯୁକ୍ତ ମୂଲ୍ୟରେ ବିକ୍ରି ହୁଏ",
    btnListProduce: "ନୂତନ ଫସଲ ତାଲିକାଭୁକ୍ତ କରନ୍ତୁ",
    btnIvrService: "IVR ଭଏସ୍ ସେବା",
    farmerStatActive: "ସକ୍ରିୟ ଫସଲ ତାଲିକା",
    farmerStatPriceGain: "ନ୍ୟାୟଯୁକ୍ତ ମୂଲ୍ୟ ଲାଭ",
    farmerStatEscrow: "ଏସ୍କ୍ରୋରେ ସୁରକ୍ଷିତ ଧନରାଶି",
    myListingsTitle: "ଆପଣଙ୍କ ପଞ୍ଜୀକୃତ ଫସଲ",
    colCrop: "ଫସଲର ନାମ",
    colQty: "ପରିମାଣ",
    colPrice: "ଦର",
    colGrade: "ଗୁଣବତ୍ତା ଗ୍ରେଡ୍",
    colLocation: "ହବ୍ ସ୍ଥାନ",
    colStatus: "ସ୍ଥିତି",
    statusVerified: "ଯାଞ୍ଚ ହୋଇଥିବା ଫସଲ",
    statusPooled: "ପୁଲ୍‌ରେ ସାମିଲ",
    addModalTitle: "ବଜାରରେ ନୂତନ ଫସଲ ଯୋଡନ୍ତୁ",
    cropNamePlaceholder: "ଫସଲର ନାମ (ଯଥା ନାସିକ ପିଆଜ)",
    qtyPlaceholder: "ପରିମାଣ (କିଲୋଗ୍ରାମ୍)",
    pricePlaceholder: "ମୂଳ ମୂଲ୍ୟ (₹/କିଲୋ)",
    saveProduceBtn: "ଫସଲ ପ୍ରକାଶ କରନ୍ତୁ",
    cancelBtn: "ବାତିଲ୍ କରନ୍ତୁ",
    gradeA: "ଉଚ୍ଚତମ ଗ୍ରେଡ୍ A+",
    gradeExport: "ରପ୍ତାନି ଗ୍ରେଡ୍",

    fpoTitle: "ସହ୍ୟାଦ୍ରି କୃଷକ ଉତ୍ପାଦକ FPO",
    fpoGroupName: "FPO ଭର୍ଚୁଆଲ୍ ଲଟ୍ ଏକତ୍ରୀକରଣ କେନ୍ଦ୍ର",
    fpoSubtitle: "୧୪୨ ଜଣ ସଦସ୍ୟ କୃଷକ ଏକତ୍ରିତ (ସାମୂହିକ ମୂଲଚାଲ ଶକ୍ତି)",
    fpoStatSupply: "ମୋଟ FPO ଯୋଗାଣ",
    fpoStatSupplySub: "+୪୨% ଉନ୍ନତ ଦର ପାଇବାର କ୍ଷମତା",
    fpoStatLots: "ସକ୍ରିୟ ଭର୍ଚୁଆଲ୍ ଲଟ୍",
    fpoStatLotsSub: "୮୬ ଜଣ କୃଷକ ସାମିଲ",
    fpoStatRfqs: "ସଂସ୍ଥାଗତ ଚାହିଦା ପ୍ରସ୍ତାବ",
    fpoStatRfqsSub: "ସିଧାସଳଖ ଯୋଗାଣ ପାଇଁ ପ୍ରସ୍ତୁତ",
    virtualLotsTitle: "ସକ୍ରିୟ ଭର୍ଚୁଆଲ୍ ଲଟ୍ ଏକତ୍ରୀକରଣ",
    lockLotBtn: "ଲଟ୍ ଲକ୍ କରନ୍ତୁ",
    lockedBadge: "ଲଟ୍ ଲକ୍ ହୋଇଛି",
    poolingActive: "ଏକତ୍ରୀକରଣ ଜାରି ରହିଛି",
    institutionalDemandTitle: "ପାଇକାରୀ କ୍ରେତା ସଂସ୍ଥାଗତ ଚାହିଦା (RFQs)",
    fulfillmentLabel: "ଚାହିଦା ପୂରଣ",

    buyerTitle: "ପ୍ରତ୍ୟକ୍ଷ କ୍ରେତା ପୋର୍ଟାଲ",
    buyerSubtitle: "କମ୍ପ୍ୟୁଟର ଭିଜନ ପ୍ରମାଣିତ ତାଜା ଫସଲ — ଦଲାଲ ବିନା ସିଧାସଳଖ କ୍ରୟ",
    btnPostReq: "ପାଇକାରୀ ଚାହିଦା ପୋଷ୍ଟ କରନ୍ତୁ",
    buyerStatContracts: "ସକ୍ରିୟ ସ୍ମାର୍ଟ ଚୁକ୍ତି",
    buyerStatEscrow: "ଏସ୍କ୍ରୋ ଜମା ରାଶି",
    buyerStatQuality: "CV ଗୁଣବତ୍ତା ପାସ୍ ହାର",
    buyerOrdersTitle: "ସାମ୍ପ୍ରତିକ ଚୁକ୍ତିନାମା ଓ ଅର୍ଡର",
    reqModalTitle: "ନୂତନ ପାଇକାରୀ କ୍ରୟ ଚାହିଦା ଦାଖଲ କରନ୍ତୁ",
    submitReqBtn: "ଚାହିଦା ପ୍ରକାଶ କରନ୍ତୁ",

    hubTitle: "ନାସିକ ସଂଗ୍ରହ ମାଇକ୍ରୋ-ହବ୍ #୦୪",
    hubName: "ମାଇକ୍ରୋ-ହବ୍ କମ୍ପ୍ୟୁଟର ଭିଜନ ଗ୍ରେଡିଂ ଡେସ୍କ",
    hubSubtitle: "ଗୁଣବତ୍ତା ଯାଞ୍ଚ, QR ଟ୍ୟାଗିଂ ଏବଂ ଶୀତଳ ଭଣ୍ଡାର ପରିଚାଳନା",
    hubCropSelect: "ଫସଲ ଚୟନ କରନ୍ତୁ",
    hubLotSize: "ଲଟ୍ ପରିମାଣ (କିଲୋଗ୍ରାମ୍)",
    btnRunCv: "କମ୍ପ୍ୟୁଟର ଭିଜନ AI ଯାଞ୍ଚ ଚଳାନ୍ତୁ",
    analyzingCv: "AI ଗୁଣବତ୍ତା ବିଶ୍ଳେଷଣ ଚାଲିଛି...",
    cvResultsTitle: "ଗୁଣବତ୍ତା ପରୀକ୍ଷଣ ଫଳାଫଳ",
    confidenceScore: "CV ବିଶ୍ୱସନୀୟତା",
    ripenessScore: "ପାଚିବା ଅନୁପାତ",
    defectScore: "ତ୍ରୁଟି ହାର",
    fssaiStatus: "FSSAI ପ୍ରମାଣୀକରଣ",
    storageTemp: "ପରାମର୍ଶିତ ତାପମାତ୍ରା",
    shelfLife: "ଆନୁମାନିକ ସଂରକ୍ଷଣ ଅବଧି",
    qrGeneratedLabel: "ହବ୍ QR ଲେବୁଲ୍ ପ୍ରସ୍ତୁତ",
    printQrBtn: "QR ଲେବୁଲ୍ ପ୍ରିଣ୍ଟ୍ ଓ ଟ୍ୟାଗ୍ କରନ୍ତୁ",

    transporterTitle: "ଲଜିଷ୍ଟିକ୍ସ ଓ ସ୍ମାର୍ଟ ରୁଟ୍ ଡେସ୍କ",
    transporterSubtitle: "ମଲ୍ଟି-ଷ୍ଟପ୍ ସଂଗ୍ରହ ଏବଂ ସୁରକ୍ଷିତ OTP ଡିଜିଟାଲ୍ ହସ୍ତାନ୍ତର",
    fleetMetricsTitle: "ଆଜିର AI ରୁଟ୍ କାର୍ଯ୍ୟଦକ୍ଷତା",
    distanceLabel: "ମୋଟ ଦୂରତା",
    etaLabel: "ଆନୁମାନିକ ସମୟ",
    fuelSavingsLabel: "ଇନ୍ଧନ ସଞ୍ଚୟ",
    multiStopTitle: "ଅପ୍ଟିମାଇଜ୍ ହୋଇଥିବା ପିକଅପ୍ ଓ ବିତରଣ ଷ୍ଟପ୍",
    pickupOtpLabel: "ପିକଅପ୍ OTP",
    deliveryOtpLabel: "ଡେଲିଭରୀ OTP",
    otpVerifyTitle: "ସୁରକ୍ଷିତ OTP ହସ୍ତାନ୍ତର ଯାଞ୍ଚ",
    otpVerifyPlaceholder: "୪-ଅଙ୍କ ବିଶିଷ୍ଟ OTP ଲେଖନ୍ତୁ (ଯଥା 4829)",
    btnVerifyOtp: "OTP ଯାଞ୍ଚ କରନ୍ତୁ",

    adminTitle: "SIH 2026 PS 26033 ଜାତୀୟ ମଣ୍ଡି ଶାସନ",
    adminHeading: "ମନ୍ତ୍ରଣାଳୟ ଓ ଜାତୀୟ ମଣ୍ଡି ନିୟନ୍ତ୍ରଣ କକ୍ଷ",
    adminSubtitle: "ଖାଉଟି ବ୍ୟାପାର, ଖାଦ୍ୟ ଓ ସାଧାରଣ ବଣ୍ଟନ ମନ୍ତ୍ରଣାଳୟ — ସିଧାସଳଖ ବାଣିଜ୍ୟ ତଦାରଖ",
    adminStatGmv: "ମୋଟ ଜାତୀୟ କୃଷି କାରବାର (GMV)",
    adminStatWaste: "ରୋକାଯାଇଥିବା ଫସଲ ଅପଚୟ",
    adminStatIncome: "କୃଷକଙ୍କ ନିଟ୍ ଆୟ ବୃଦ୍ଧି",
    adminStatMandis: "ସକ୍ରିୟ ଡିଜିଟାଲ୍ ହବ୍",
    recentLedgerTitle: "ସ୍ୱଚ୍ଛ ଜାତୀୟ କାରବାର ଖାତା (Audit Trail)",
    colOrderId: "ଚୁକ୍ତି ID",
    colBuyer: "କ୍ରେତା",
    colFarmer: "କୃଷକ / FPO",
    colAmount: "ପରିମାଣ",
    colDelivery: "ବିତରଣ ପ୍ରକାର",
    aiEnginesTitle: "ସମନ୍ୱିତ AI ଇଞ୍ଜିନ୍ ସ୍ଥିତି",

    cartEmpty: "ଆପଣଙ୍କ କାର୍ଟ ବର୍ତ୍ତମାନ ଖାଲି ଅଛି",
    cartSubtotal: "ଉପ-ମୋଟ ରାଶି",
    logisticsFee: "ସ୍ମାର୍ଟ ପରିବହନ ଶୁଳ୍କ",
    gstTax: "GST (୦% କୃଷି ଛାଡ଼)",
    totalAmount: "ମୋଟ ଦେୟ ରାଶି",
    proceedOrder: "ସ୍ମାର୍ଟ ଚୁକ୍ତି କାର୍ଯ୍ୟକାରୀ କରନ୍ତୁ",
    orderSuccessTitle: "ଅର୍ଡର ଚୁକ୍ତିନାମା ସଫଳତାର ସହିତ ସମ୍ପନ୍ନ ହେଲା!",
    orderSuccessDesc: "କୃଷକ ଏବଂ ହବ୍ ଅପରେଟରଙ୍କୁ ସ୍ୱୟଂଚାଳିତ ପ୍ରେରଣ ନିର୍ଦ୍ଦେଶ ପଠାଯାଇଛି।",
    smartContractIdLabel: "ସ୍ମାର୍ଟ କଣ୍ଟ୍ରାକ୍ଟ ID",
    escrowStatusLabel: "ଏସ୍କ୍ରୋ ସ୍ଥିତି",
    escrowLockedText: "କାର୍ଯ୍ୟକାରୀ (ଏସ୍କ୍ରୋରେ ସୁରକ୍ଷିତ)",
    closeBtn: "ସମାପ୍ତ କରନ୍ତୁ (Close)",

    footerMission: "କିଷାନ ଦିବସ ସମର୍ପିତ ପ୍ରତ୍ୟକ୍ଷ କୃଷି ଯୋଗାଣ ଓ ଲଜିଷ୍ଟିକ୍ସ ବ୍ୟବସ୍ଥା। Smart India Hackathon 2026 Problem Statement 26033.",
    aiEnginesCore: "AI ଇଞ୍ଜିନ୍ କୋର୍ (6 AI Engines)",
    userRolesFooter: "ୟୁଜର୍ ଭୂମିକା (6 Personas)",
    helplineTitle: "ହେଲ୍ପଲାଇନ୍ ଓ ସହାୟତା",
    helplineDesc: "କୃଷକ ଟୋଲ୍-ଫ୍ରି IVR ହେଲ୍ପଲାଇନ୍: 1800-KISAN-AI",
    allIndiaLangs247: "୨୪x୭ ସମସ୍ତ ଭାରତୀୟ ଭାଷାରେ ଉପଲବ୍ଧ",

    translatorHeader: "🇮🇳 ଭାରତ ବହୁଭାଷୀ କୃଷି ଅନୁବାଦକ (All-India Multi-Language Translator)",
    translatorSub: "ଭାରତର ପ୍ରମୁଖ ଭାଷାଗୁଡ଼ିକରେ କୃଷି ଶବ୍ଦାବଳୀ, ମଣ୍ଡି ଦର ଏବଂ ବାର୍ତ୍ତାର ତତକ୍ଷଣାତ୍ ଅନୁବାଦ।",
    sourceLangLabel: "ମୂଳ ଭାଷା (From)",
    targetLangLabel: "ଲକ୍ଷ୍ୟ ଭାଷା (To)",
    inputPlaceholder: "ଅନୁବାଦ କରିବା ପାଇଁ କୃଷି ପ୍ରଶ୍ନ, ଫସଲ ବିବରଣୀ କିମ୍ବା ବାର୍ତ୍ତା ଲେଖନ୍ତୁ...",
    translatedOutputPlaceholder: "ଅନୁବାଦିତ ପାଠ୍ୟ ଏଠାରେ ଦେଖାଯିବ...",
    quickAgriPhrasesTitle: "ଦ୍ରୁତ କୃଷି ବାକ୍ୟଗୁଡ଼ିକ:",
    phrase1: "ଆଜି ନାସିକ ମଣ୍ଡିରେ ଟମାଟୋର ପାଇକାରୀ ଦର କେତେ?",
    phrase2: "ଫସଲ କମ୍ପ୍ୟୁଟର ଭିଜନ AI ଦ୍ୱାରା ଯାଞ୍ଚ କରାଯାଇ ଗ୍ରେଡ୍ A+ ପାଇଛି।",
    phrase3: "ସ୍ମାର୍ଟ ଚୁକ୍ତିନାମାର ଅର୍ଥ କୃଷକ ଏସ୍କ୍ରୋ ଆକାଉଣ୍ଟରେ ସୁରକ୍ଷିତ ଜମା ଅଛି।",
    phrase4: "ଗାଡି ପିକଅପ୍ ପାଇଁ ହବ୍‌ରେ 4829 OTP ଦାଖଲ କରନ୍ତୁ।",
    phrase5: "FPO ଗ୍ରୁପ୍‌ରେ ୫୦୦ କିଲୋ ଗହମର ଭର୍ଚୁଆଲ୍ ପୁଲ୍ ତିଆରି ହୋଇଛି।",
    btnTranslate: "ଅନୁବାଦ କରନ୍ତୁ",
    btnListen: "ଶୁଣନ୍ତୁ (Speak)",
    btnCopy: "କପି କରନ୍ତୁ",
    copiedNotice: "କପି ହୋଇଗଲା!",
    btnClear: "ସଫା କରନ୍ତୁ",
    swapLanguages: "ଭାଷା ବଦଳାନ୍ତୁ",

    currencySymbol: "₹",
    paiseSuffix: "ପଇସା",
    statusAvailable: "ଉପଲବ୍ଧ",
    statusInTransit: "ପରିବହନରେ",
    statusDelivered: "ସଫଳତାର ସହିତ ବିତରଣ କରାଗଲା",
  },
};

export const AGRI_PHRASE_DICTIONARY: Record<string, Record<Language, string>> = {
  "what is today's wholesale mandi price for tomatoes?": {
    hi: "आज नासिक मंडी में टमाटर का थोक भाव क्या है?",
    en: "What is today's wholesale mandi price for tomatoes?",
    pa: "ਅੱਜ ਮੰਡੀ ਵਿੱਚ ਟਮਾਟਰ ਦਾ ਥੋਕ ਭਾਅ ਕੀ ਹੈ?",
    mr: "आज नाशिक बाजारात टोमॅटोचा घाऊक भाव काय आहे?",
    gu: "આજે નાસિક મંડીમાં ટામેટાંનો જથ્થાબંધ ભાવ શું છે?",
    bn: "আজ নাসিক মান্ডিতে টমেটোর পাইকারি দর কত?",
    te: "ఈరోజు నాసిక్ మార్కెట్‌లో ಟಮೊಟాల టోకు ధర ఎంత?",
    ta: "இன்று நாசிக் சந்தையில் தக்காளியின் மொத்த விலை என்ன?",
    kn: "ಇಂದು ನಾಸಿಕ್ ಮಂಡಿಯಲ್ಲಿ ಟೊಮೆಟೊ ಸಗಟು ಬೆಲೆ ಎಷ್ಟು?",
    ml: "ഇന്ന് നാസിക് മാണ്ഡിയിൽ തക്കാളിയുടെ മൊത്തവില എത്രയാണ്?",
    or: "ଆଜି ନାସିକ ମଣ୍ଡିରେ ଟମାଟୋର ପାଇକାରୀ ଦର କେତେ?",
  },
  "produce inspected with computer vision ai and graded a+.": {
    hi: "फसल कंप्यूटर विज़न AI द्वारा प्रमाणित और ग्रेड A+ है।",
    en: "Produce inspected with Computer Vision AI and graded A+.",
    pa: "ਫਸਲ ਕੰਪਿਊਟਰ ਵਿਜ਼ਨ AI ਦੁਆਰਾ ਪ੍ਰਮਾਣਿਤ ਅਤੇ ਗ੍ਰੇਡ A+ ਹੈ।",
    mr: "शेतमाल संगणक दृष्टी AI द्वारे तपासला असून ग्रेड A+ आहे.",
    gu: "પાક કમ્પ્યુટર વિઝન AI દ્વારા પ્રમાણિત અને ગ્રેડ A+ છે.",
    bn: "ফসল কম্পিউটার ভিশন AI দ্বারা যাচাইকৃত এবং গ্রেড A+।",
    te: "పంట కంప్యూటర్ విజన్ AI ద్వారా ధృవీకరించబడింది మరియు గ్రేడ్ A+ పొందింది.",
    ta: "பயிர் கம்ப்யூட்டர் விஷன் AI மூலம் ஆய்வு செய்யப்பட்டு தரம் A+ பெற்றது.",
    kn: "ಬೆಳೆಯನ್ನು ಕಂಪ್ಯೂಟರ್ ವಿಷನ್ AI ಮೂಲಕ ತಪಾಸಣೆ ಮಾಡಿ ಗ್ರೇಡ್ A+ ನೀಡಲಾಗಿದೆ.",
    ml: "വിള കമ്പ്യൂട്ടർ വിഷൻ AI പരിശോധിച്ച് ഗ്രേഡ് A+ നൽകി.",
    or: "ଫସଲ କମ୍ପ୍ୟୁଟର ଭିଜନ AI ଦ୍ୱାରା ଯାଞ୍ଚ କରାଯାଇ ଗ୍ରେଡ୍ A+ ପାଇଛି।",
  },
  "smart contract payment securely deposited in farmer escrow.": {
    hi: "स्मार्ट अनुबंध भुगतान सुरक्षित रूप से किसान एस्क्रौ में जमा है।",
    en: "Smart contract payment securely deposited in farmer escrow.",
    pa: "ਸਮਾਰਟ ਇਕਰਾਰਨਾਮੇ ਦਾ ਭੁਗਤਾਨ ਸੁਰੱਖਿਅਤ ਢੰਗ ਨਾਲ ਕਿਸਾਨ ਐਸਕਰੋ ਵਿੱਚ ਜਮ੍ਹਾਂ ਹੈ।",
    mr: "स्मार्ट कराराचे पैसे शेतकरी एस्क्रॉ खात्यात सुरक्षित जमा आहेत.",
    gu: "સ્માર્ટ કરારની ચુકવણી સુરક્ષિત રીતે ખેડૂત એસ્ક્રોમાં જમા છે.",
    bn: "স্মার্ট চুক্তির অর্থ কৃষক এসক্রো অ্যাকাউন্টে নিরাপদে জমা আছে।",
    te: "స్మార్ట్ ఒప్పంద చెల్లింపు రైతు ఎస్క్రో ఖాతాలో సురక్షితంగా జమ చేయబడింది.",
    ta: "ஸ்மார்ட் ஒப்பந்தத் தொகை விவசாயி எஸ்க்ரோ கணக்கில் பாதுகாப்பாக டெபாசிட் செய்யப்பட்டுள்ளது.",
    kn: "ಸ್ಮಾರ್ಟ್ ಒಪ್ಪಂದ ಪಾವತಿ ಸುರಕ್ಷಿತವಾಗಿ ರೈತ ಎಸ್ಕ್ರೋ ಖಾತೆಯಲ್ಲಿ ಜಮೆಯಾಗಿದೆ.",
    ml: "സ്മാർട്ട് കരാർ തുക കർഷകന്റെ എസ്ക്രോ അക്കൗണ്ടിൽ സുരക്ഷിതമായി നിക്ഷേപിച്ചിട്ടുണ്ട്.",
    or: "ସ୍ମାର୍ଟ ଚୁକ୍ତିନାମାର ଅର୍ଥ କୃଷକ ଏସ୍କ୍ରୋ ଆକାଉଣ୍ଟରେ ସୁରକ୍ଷିତ ଜମା ଅଛି।",
  },
  "present otp 4829 at the collection hub for vehicle pickup.": {
    hi: "वाहन पिकअप के लिए हब पर 4829 OTP प्रस्तुत करें।",
    en: "Present OTP 4829 at the collection hub for vehicle pickup.",
    pa: "ਗੱਡੀ ਪਿਕਅੱਪ ਲਈ ਹੱਬ ਉੱਤੇ 4829 OTP ਪੇਸ਼ ਕਰੋ।",
    mr: "वाहन पिकअपसाठी संकलन हबवर ४८२९ OTP सादर करा.",
    gu: "વાહન પિકઅપ માટે હબ પર 4829 OTP રજૂ કરો.",
    bn: "যানবাহন পিকআপের জন্য হাবে 4829 OTP পেশ করুন।",
    te: "వాహనం పికప్ కోసం సేకరణ హబ్‌లో 4829 OTP ని సమర్పించండి.",
    ta: "வாகன பிக்கப்பிற்கு மையத்தில் 4829 OTP ஐக் காட்டவும்.",
    kn: "ವಾಹನ ಪಿಕಪ್‌ಗಾಗಿ ಸಂಗ್ರಹಣಾ ಹಬ್‌ನಲ್ಲಿ 4829 OTP ಅನ್ನು ಪ್ರಸ್ತುತಪಡಿಸಿ.",
    ml: "വാഹനം പിക്കപ്പിനായി ഹബ്ബിൽ 4829 OTP ഹാജരാക്കുക.",
    or: "ଗାଡି ପିକଅପ୍ ପାଇଁ ହବ୍‌ରେ 4829 OTP ଦାଖଲ କରନ୍ତୁ।",
  },
  "virtual pool of 500kg wheat formed under fpo cooperative.": {
    hi: "एफपीओ समूह में 500 किग्रा गेहूं का वर्चुअल पूल बनाया गया।",
    en: "Virtual pool of 500kg wheat formed under FPO cooperative.",
    pa: "ਐਫਪੀਓ ਸਮੂਹ ਵਿੱਚ 500 ਕਿੱਲੋ ਕਣਕ ਦਾ ਵਰਚੁਅਲ ਪੂਲ ਬਣਾਇਆ ਗਿਆ।",
    mr: "एफपीओ समूहात ५०० किलो गव्हाचा व्हर्च्युअल पूल तयार करण्यात आला.",
    gu: "FPO જૂથમાં ૫૦૦ કિલો ઘઉંનો વર્ચ્યુઅલ પૂલ બનાવવામાં આવ્યો.",
    bn: "এফপিও গ্রুপে ৫০০ কেজি গমের ভার্চুয়াল পুল তৈরি করা হয়েছে।",
    te: "FPO సమూహంలో 500 కిలోల గోధుಮల వర్చుವಲ್ పూల్ సృష్టించబడింది.",
    ta: "FPO குழுவில் 500 கிலோ கோதுமை விர்ச்சுவல் பூல் உருவாக்கப்பட்டது.",
    kn: "FPO ಗುಂಪಿನಲ್ಲಿ 500 ಕೆಜಿ ಗೋಧಿ ವರ್ಚುವಲ್ ಪೂಲ್ ರಚಿಸಲಾಗಿದೆ.",
    ml: "FPO ഗ്രൂപ്പിൽ 500 കിലോ ഗോതമ്പ് വെർച്വൽ പൂൾ രൂപീകരിച്ചു.",
    or: "FPO ଗ୍ରୁପ୍‌ରେ ୫୦୦ କିଲୋ ଗହମର ଭର୍ଚୁଆଲ୍ ପୁଲ୍ ତିଆରି ହୋଇଛି।",
  },
};

export const cropTranslations: Record<string, { hi: string; en: string }> = {
  // Grains & Cereals
  'मक्का': { hi: 'मक्का (स्वीट कॉर्न)', en: 'Maize (Corn)' },
  'मकई': { hi: 'मक्का', en: 'Corn / Maize' },
  'Corn': { hi: 'मक्का (स्वीट कॉर्न)', en: 'Sweet Corn' },
  'Maize': { hi: 'मक्का (स्वीट कॉर्न)', en: 'Fresh Maize (Corn)' },
  'Sweet Corn': { hi: 'मक्का (स्वीट कॉर्न)', en: 'Sweet Corn' },
  'makka': { hi: 'मक्का', en: 'Maize (Corn)' },
  'makkai': { hi: 'मक्का', en: 'Maize (Corn)' },
  'धान': { hi: 'धान', en: 'Paddy' },
  'चावल': { hi: 'बासमती चावल', en: 'Basmati Rice' },
  'Rice': { hi: 'चावल', en: 'Basmati Rice' },
  'Basmati Rice': { hi: 'बासमती प्रीमियम चावल', en: 'Premium Basmati Rice' },
  'गेहूं': { hi: 'शरबाती गेहूं', en: 'Sharbati Wheat' },
  'गेहूँ': { hi: 'शरबाती गेहूं', en: 'Sharbati Wheat' },
  'Wheat': { hi: 'गेहूं', en: 'Wheat' },
  'Sharbati Wheat': { hi: 'शरबाती गेहूं', en: 'Sharbati Wheat' },
  'Wheat (Sharbati Gold)': { hi: 'शरबाती प्रीमियम गेहूं (C-306)', en: 'Wheat (Sharbati Gold)' },
  'Sharbati Gold C-306': { hi: 'शरबाती गोल्ड C-306', en: 'Sharbati Gold C-306' },
  'ज्वार': { hi: 'ज्वार', en: 'Sorghum (Jowar)' },
  'बाजरा': { hi: 'बाजरा', en: 'Pearl Millet (Bajra)' },
  'जौ': { hi: 'जौ', en: 'Barley' },

  // Vegetables
  'टमाटर': { hi: 'ताज़ा टमाटर', en: 'Fresh Tomatoes' },
  'Tomatoes': { hi: 'टमाटर', en: 'Tomatoes' },
  'Tomato': { hi: 'टमाटर', en: 'Tomato' },
  'Fresh Tomatoes': { hi: 'ताज़ा टमाटर', en: 'Fresh Tomatoes' },
  'Tomato (Vaishali 108)': { hi: 'ताज़ा टमाटर (वैशाली 108)', en: 'Tomato (Vaishali 108)' },
  'Vaishali 108': { hi: 'वैशाली 108', en: 'Vaishali 108' },
  'tamatar': { hi: 'टमाटर', en: 'Fresh Tomatoes' },
  'प्याज़': { hi: 'लाल प्याज', en: 'Red Onions' },
  'प्याज': { hi: 'लाल प्याज', en: 'Red Onions' },
  'Onions': { hi: 'प्याज', en: 'Red Onions' },
  'Onion': { hi: 'प्याज', en: 'Onion' },
  'Onion (Nashik Red)': { hi: 'नाशिक लाल प्याज (गरवा)', en: 'Onion (Nashik Red)' },
  'Garwa Export Quality': { hi: 'गरवा निर्यात गुणवत्ता', en: 'Garwa Export Quality' },
  'pyaaz': { hi: 'प्याज', en: 'Red Onions' },
  'आलू': { hi: 'ज्योति आलू', en: 'Jyoti Potatoes' },
  'Potatoes': { hi: 'आलू', en: 'Potatoes' },
  'Potato': { hi: 'आलू', en: 'Potato' },
  'aalu': { hi: 'आलू', en: 'Potatoes' },
  'alu': { hi: 'आलू', en: 'Potatoes' },
  'भिंडी': { hi: 'ताज़ा भिंडी', en: 'Fresh Okra (Ladyfinger)' },
  'Okra': { hi: 'भिंडी', en: 'Okra (Ladyfinger)' },
  'Ladyfinger': { hi: 'भिंडी', en: 'Ladyfinger' },
  'bhindi': { hi: 'भिंडी', en: 'Fresh Okra' },
  'बैंगन': { hi: 'देसी बैंगन', en: 'Fresh Eggplant (Brinjal)' },
  'Brinjal': { hi: 'बैंगन', en: 'Eggplant (Brinjal)' },
  'Eggplant': { hi: 'बैंगन', en: 'Eggplant (Brinjal)' },
  'baingan': { hi: 'बैंगन', en: 'Eggplant' },
  'फूलगोभी': { hi: 'ताज़ा फूलगोभी', en: 'Fresh Cauliflower' },
  'Cauliflower': { hi: 'फूलगोभी', en: 'Cauliflower' },
  'गोभी': { hi: 'फूलगोभी / पत्तागोभी', en: 'Cauliflower / Cabbage' },
  'gobi': { hi: 'गोभी', en: 'Cauliflower' },
  'पत्तागोभी': { hi: 'हरी पत्तागोभी', en: 'Fresh Cabbage' },
  'Cabbage': { hi: 'पत्तागोभी', en: 'Cabbage' },
  'मटर': { hi: 'हरी मटर', en: 'Green Peas' },
  'Peas': { hi: 'हरी मटर', en: 'Green Peas' },
  'matar': { hi: 'मटर', en: 'Green Peas' },
  'गाजर': { hi: 'देसी जैविक गाजर', en: 'Desi Organic Carrots' },
  'Carrot': { hi: 'गाजर', en: 'Carrots' },
  'Carrots': { hi: 'गाजर', en: 'Carrots' },
  'gajar': { hi: 'गाजर', en: 'Carrots' },
  'मूली': { hi: 'सफ़ेद मूली', en: 'Fresh Radish' },
  'Radish': { hi: 'मूली', en: 'Radish' },
  'mooli': { hi: 'मूली', en: 'Radish' },
  'शलजम': { hi: 'देसी शलजम', en: 'Fresh Turnip' },
  'शलगम': { hi: 'देसी शलजम', en: 'Fresh Turnip' },
  'Turnip': { hi: 'शलजम', en: 'Turnip' },
  'Turnips': { hi: 'शलजम', en: 'Turnips' },
  'turnip': { hi: 'शलजम', en: 'Turnip' },
  'turnips': { hi: 'शलजम', en: 'Turnips' },
  'shalgam': { hi: 'शलजम', en: 'Turnip' },
  'shaljam': { hi: 'शलजम', en: 'Turnip' },
  'चुकंदर': { hi: 'चुकंदर', en: 'Beetroot' },
  'Beetroot': { hi: 'चुकंदर', en: 'Beetroot' },
  'beetroot': { hi: 'चुकंदर', en: 'Beetroot' },
  'chukandar': { hi: 'चुकंदर', en: 'Beetroot' },
  'शकरकंद': { hi: 'मीठी शकरकंद', en: 'Sweet Potato' },
  'Sweet Potato': { hi: 'शकरकंद', en: 'Sweet Potato' },
  'shakarkand': { hi: 'शकरकंद', en: 'Sweet Potato' },
  'जिमीकंद': { hi: 'जिमीकंद (सूरन)', en: 'Elephant Foot Yam' },
  'सूरन': { hi: 'सूरन (जिमीकंद)', en: 'Elephant Foot Yam' },
  'Yam': { hi: 'जिमीकंद', en: 'Yam' },
  'Elephant Foot Yam': { hi: 'जिमीकंद (सूरन)', en: 'Elephant Foot Yam' },
  'jimikand': { hi: 'जिमीकंद', en: 'Yam' },
  'suran': { hi: 'सूरन', en: 'Yam' },
  'कटहल': { hi: 'देसी कटहल', en: 'Fresh Jackfruit' },
  'Jackfruit': { hi: 'कटहल', en: 'Jackfruit' },
  'kathal': { hi: 'कटहल', en: 'Jackfruit' },
  'सहजन': { hi: 'सहजन (मोरिंगा)', en: 'Drumstick (Moringa)' },
  'Drumstick': { hi: 'सहजन फली', en: 'Drumstick' },
  'Moringa': { hi: 'सहजन (मोरिंगा)', en: 'Moringa' },
  'sahjan': { hi: 'सहजन', en: 'Drumstick' },
  'गवार': { hi: 'गवार फली', en: 'Cluster Beans' },
  'Cluster Beans': { hi: 'गवार फली', en: 'Cluster Beans' },
  'gawar': { hi: 'गवार फली', en: 'Cluster Beans' },
  'अरबी': { hi: 'अरबी (कंद)', en: 'Taro Root (Arbi)' },
  'Taro Root': { hi: 'अरबी', en: 'Taro Root' },
  'Arbi': { hi: 'अरबी', en: 'Arbi' },
  'arbi': { hi: 'अरबी', en: 'Arbi' },
  'पेठा': { hi: 'पेठा (सफ़ेद कद्दू)', en: 'Ash Gourd' },
  'Ash Gourd': { hi: 'पेठा (सफ़ेद कद्दू)', en: 'Ash Gourd' },
  'petha': { hi: 'पेठा', en: 'Ash Gourd' },
  'कद्दू': { hi: 'मीठा कद्दू', en: 'Fresh Pumpkin' },
  'Pumpkin': { hi: 'कद्दू', en: 'Pumpkin' },
  'kaddu': { hi: 'कद्दू', en: 'Pumpkin' },
  'कुंदरू': { hi: 'ताज़ा कुंदरू', en: 'Ivy Gourd' },
  'Ivy Gourd': { hi: 'कुंदरू', en: 'Ivy Gourd' },
  'kundru': { hi: 'कुंदरू', en: 'Ivy Gourd' },
  'परवल': { hi: 'हरी परवल', en: 'Pointed Gourd (Parwal)' },
  'Pointed Gourd': { hi: 'परवल', en: 'Pointed Gourd' },
  'parwal': { hi: 'परवल', en: 'Pointed Gourd' },
  'तोरई': { hi: 'ताज़ा तोरई', en: 'Ridge Gourd / Sponge Gourd' },
  'Ridge Gourd': { hi: 'तोरई', en: 'Ridge Gourd' },
  'Sponge Gourd': { hi: 'तोरई', en: 'Sponge Gourd' },
  'torai': { hi: 'तोरई', en: 'Ridge Gourd' },
  'पुदीना': { hi: 'ताज़ा पुदीना', en: 'Fresh Mint' },
  'Mint': { hi: 'पुदीना', en: 'Mint' },
  'pudina': { hi: 'पुदीना', en: 'Mint' },
  'कढ़ी पत्ता': { hi: 'कढ़ी पत्ता', en: 'Curry Leaves' },
  'Curry Leaves': { hi: 'कढ़ी पत्ता', en: 'Curry Leaves' },
  'kadi patta': { hi: 'कढ़ी पत्ता', en: 'Curry Leaves' },
  'हरा प्याज': { hi: 'हरा प्याज', en: 'Spring Onion' },
  'Spring Onion': { hi: 'हरा प्याज', en: 'Spring Onion' },
  'hara pyaaz': { hi: 'हरा प्याज', en: 'Spring Onion' },
  'मेथी': { hi: 'हरी मेथी', en: 'Fenugreek Leaves (Methi)' },
  'Fenugreek': { hi: 'मेथी', en: 'Fenugreek' },
  'methi': { hi: 'मेथी', en: 'Fenugreek' },
  'गुड़': { hi: 'देसी गुड़', en: 'Organic Jaggery' },
  'Jaggery': { hi: 'गुड़', en: 'Jaggery' },
  'gud': { hi: 'गुड़', en: 'Jaggery' },
  'इमली': { hi: 'खट्टी इमली', en: 'Tamarind' },
  'Tamarind': { hi: 'इमली', en: 'Tamarind' },
  'imli': { hi: 'इमली', en: 'Tamarind' },
  'नारियल': { hi: 'ताज़ा नारियल', en: 'Fresh Coconut' },
  'Coconut': { hi: 'नारियल', en: 'Coconut' },
  'nariyal': { hi: 'नारियल', en: 'Coconut' },
  'अमरूद': { hi: 'मीठा अमरूद', en: 'Fresh Guava' },
  'Guava': { hi: 'अमरूद', en: 'Guava' },
  'amrood': { hi: 'अमरूद', en: 'Guava' },
  'संतरा': { hi: 'नागपुरी संतरा', en: 'Nagpur Oranges' },
  'Orange': { hi: 'संतरा', en: 'Orange' },
  'santra': { hi: 'संतरा', en: 'Orange' },
  'नींबू': { hi: 'कागज़ी नींबू', en: 'Fresh Lemon' },
  'Lemon': { hi: 'नींबू', en: 'Lemon' },
  'Lime': { hi: 'नींबू', en: 'Lime' },
  'nimbu': { hi: 'नींबू', en: 'Lemon' },
  'खरबूजा': { hi: 'मीठा खरबूजा', en: 'Muskmelon' },
  'Muskmelon': { hi: 'खरबूजा', en: 'Muskmelon' },
  'kharbuja': { hi: 'खरबूजा', en: 'Muskmelon' },
  'लौकी': { hi: 'ताज़ा लौकी', en: 'Bottle Gourd' },
  'Bottle Gourd': { hi: 'लौकी', en: 'Bottle Gourd' },
  'lauki': { hi: 'लौकी', en: 'Bottle Gourd' },
  'करेला': { hi: 'देसी करेला', en: 'Bitter Gourd' },
  'Bitter Gourd': { hi: 'करेला', en: 'Bitter Gourd' },
  'karela': { hi: 'करेला', en: 'Bitter Gourd' },
  'पालक': { hi: 'जैविक पालक', en: 'Organic Spinach' },
  'Spinach': { hi: 'पालक', en: 'Spinach' },
  'palak': { hi: 'पालक', en: 'Spinach' },
  'धनिया': { hi: 'ताज़ा हरी धनिया', en: 'Fresh Coriander' },
  'Coriander': { hi: 'धनिया', en: 'Coriander' },
  'dhaniya': { hi: 'धनिया', en: 'Coriander' },

  // Spices & Condiments
  'अदरक': { hi: 'देसी अदरक', en: 'Fresh Ginger' },
  'Ginger': { hi: 'अदरक', en: 'Ginger' },
  'adrak': { hi: 'अदरक', en: 'Ginger' },
  'लहसुन': { hi: 'देसी लहसुन', en: 'Garlic' },
  'Garlic': { hi: 'लहसुन', en: 'Garlic' },
  'lahsun': { hi: 'लहसुन', en: 'Garlic' },
  'हल्दी': { hi: 'जैविक कच्ची हल्दी', en: 'Organic Raw Turmeric' },
  'Turmeric': { hi: 'हल्दी', en: 'Turmeric' },
  'haldi': { hi: 'हल्दी', en: 'Turmeric' },
  'मिर्च': { hi: 'तीखी हरी मिर्च', en: 'Green Chilli' },
  'Chilli': { hi: 'मिर्च', en: 'Green Chilli' },
  'Chili': { hi: 'मिर्च', en: 'Green Chilli' },
  'mirch': { hi: 'मिर्च', en: 'Chilli' },
  'शिमला मिर्च': { hi: 'हरी शिमला मिर्च', en: 'Fresh Capsicum' },
  'Capsicum': { hi: 'शिमला मिर्च', en: 'Capsicum' },
  'जीरा': { hi: 'उूंझा जीरा', en: 'Cumin Seeds' },
  'Cumin': { hi: 'जीरा', en: 'Cumin' },

  // Fruits
  'सेब': { hi: 'हिमाचली सेब', en: 'Himachali Apples' },
  'Apple': { hi: 'सेब', en: 'Apples' },
  'Apples': { hi: 'सेब', en: 'Apples' },
  'seb': { hi: 'सेब', en: 'Apples' },
  'आम': { hi: 'अल्फांसो आम', en: 'Alphonso Mangoes' },
  'Mango': { hi: 'आम', en: 'Mangoes' },
  'Mangoes': { hi: 'आम', en: 'Mangoes' },
  'aam': { hi: 'आम', en: 'Mangoes' },
  'केला': { hi: 'भुसावल केला', en: 'Bhusawal Bananas' },
  'Banana': { hi: 'केला', en: 'Bananas' },
  'kela': { hi: 'केला', en: 'Bananas' },
  'अंगूर': { hi: 'नासिक काले अंगूर', en: 'Nashik Black Grapes' },
  'Grapes': { hi: 'अंगूर', en: 'Grapes' },
  'angoor': { hi: 'अंगूर', en: 'Grapes' },
  'अनार': { hi: 'सोलापुर भगवा अनार', en: 'Bhagwa Pomegranates' },
  'Pomegranate': { hi: 'अनार', en: 'Pomegranates' },
  'anar': { hi: 'अनार', en: 'Pomegranates' },
  'पपीता': { hi: 'मीठा रेड लेडी पपीता', en: 'Red Lady Papaya' },
  'Papaya': { hi: 'पपीता', en: 'Papaya' },
  'papita': { hi: 'पपीता', en: 'Papaya' },
  'तरबूज': { hi: 'मीठा तरबूज', en: 'Sweet Watermelon' },
  'Watermelon': { hi: 'तरबूज', en: 'Watermelon' },

  // Oilseeds & Cash Crops
  'मूंगफली': { hi: 'गुजरात मूंगफली', en: 'Peanuts (Groundnuts)' },
  'Peanuts': { hi: 'मूंगफली', en: 'Peanuts' },
  'Groundnut': { hi: 'मूंगफली', en: 'Groundnuts' },
  'mungfali': { hi: 'मूंगफली', en: 'Peanuts' },
  'सोयाबीन': { hi: 'पीला मालवा सोयाबीन', en: 'Yellow Soybean' },
  'Soybean': { hi: 'सोयाबीन', en: 'Soybean' },
  'सरसों': { hi: 'पीली राजस्थान सरसों', en: 'Yellow Mustard' },
  'Mustard': { hi: 'सरसों', en: 'Mustard' },
  'sarson': { hi: 'सरसों', en: 'Mustard' },
  'चना': { hi: 'काबोली चना', en: 'Kabuli Chickpeas' },
  'Chickpeas': { hi: 'चना', en: 'Chickpeas' },
  'chana': { hi: 'चना', en: 'Chickpeas' },
  'मखाना': { hi: 'दरभंगा मखाना', en: 'Darbhanga Fox Nuts (Makhana)' },
  'Makhana': { hi: 'मखाना', en: 'Fox Nuts (Makhana)' },
  'Fox Nuts': { hi: 'मखाना', en: 'Fox Nuts (Makhana)' },

  // Composite Names
  'ताज़ा हाइब्रिड टमाटर (Fresh Tomatoes)': { hi: 'ताज़ा हाइब्रिड टमाटर', en: 'Fresh Hybrid Tomatoes' },
  'नासिक हाइब्रिड टमाटर (ताज़ा टमाटर)': { hi: 'नासिक हाइब्रिड टमाटर', en: 'Nashik Hybrid Tomatoes' },
  'नासिक हाइब्रिड टमाटर (वर्चुअल पूल)': { hi: 'नासिक हाइब्रिड टमाटर (वर्चुअल पूल)', en: 'Nashik Hybrid Tomatoes (Virtual Pool)' },
  'लासलगांव लाल प्याज (थोक एकत्रीकरण)': { hi: 'लासलगांव लाल प्याज (थोक एकत्रीकरण)', en: 'Lasalgaon Red Onion (Bulk Aggregation)' },
  'लाल प्याज (Lasalgaon Red Onion)': { hi: 'लासलगांव लाल प्याज', en: 'Lasalgaon Red Onion' },
  'जैविक ज्योति आलू (Organic Potatoes)': { hi: 'जैविक ज्योति आलू', en: 'Organic Jyoti Potatoes' },
  'हरी शिमला मिर्च (Fresh Capsicum)': { hi: 'हरी शिमला मिर्च', en: 'Fresh Capsicum' },
  'शरबाती प्रीमियम गेहूं (Sharbati Wheat)': { hi: 'शरबाती प्रीमियम गेहूं', en: 'Premium Sharbati Wheat' },
  'देसी जैविक गाजर (Organic Carrots)': { hi: 'देसी जैविक गाजर', en: 'Organic Desi Carrots' },
  'Fresh Nashik Tomatoes': { hi: 'ताज़ा नासिक टमाटर', en: 'Fresh Nashik Tomatoes' },
  'Red Onions (Nashik Quality)': { hi: 'लाल नासिक प्याज़ (उत्कृष्ट)', en: 'Red Onions (Nashik Quality)' },
  'Organic Sharbati Wheat': { hi: 'जैविक शरबती गेहूँ', en: 'Organic Sharbati Wheat' },
  'Farm Fresh Potatoes (Jyoti)': { hi: 'ताज़ा खेत के आलू (ज्योति)', en: 'Farm Fresh Potatoes (Jyoti)' },
};

export const locationTranslations: Record<string, { hi: string; en: string }> = {
  'नासिक मंडी हब (महाराष्ट्र)': { hi: 'नासिक मंडी हब (महाराष्ट्र)', en: 'Nashik Mandi Hub (Maharashtra)' },
  'लासलगांव संकलन केंद्र': { hi: 'लासलगांव संकलन केंद्र', en: 'Lasalgaon Collection Center' },
  'इन्दौर (मध्य प्रदेश)': { hi: 'इन्दौर (मध्य प्रदेश)', en: 'Indore (Madhya Pradesh)' },
  'पुणे ग्रामीण हब': { hi: 'पुणे ग्रामीण हब', en: 'Pune Rural Hub' },
  'उज्जैन (मध्य प्रदेश)': { hi: 'उज्जैन (मध्य प्रदेश)', en: 'Ujjain (Madhya Pradesh)' },
  'जयपुर (राजस्थान)': { hi: 'जयपुर (राजस्थान)', en: 'Jaipur (Rajasthan)' },
  'Pimplgaon Mandi Hub': { hi: 'पिंपलगांव मंडी हब', en: 'Pimplgaon Mandi Hub' },
  'Lasalgaon Cold Storage': { hi: 'लासलगांव कोल्ड स्टोरेज', en: 'Lasalgaon Cold Storage' },
  'Khanna Grain Mandi': { hi: 'खन्ना अनाज मंडी', en: 'Khanna Grain Mandi' },
  'Nashik Central Hub': { hi: 'नासिक सेंट्रल हब', en: 'Nashik Central Hub' },
  'नासिक एग्रो-हब #04': { hi: 'नासिक एग्रो-हब #04', en: 'Nashik Agro-Hub #04' },
  'पुणे स्वॉरगेट वितरण हब': { hi: 'पुणे स्वॉरगेट वितरण हब', en: 'Pune Swargate Distribution Hub' },
  'मुंबई सेन्ट्रल कोल्ड स्टोर': { hi: 'मुंबई सेन्ट्रल कोल्ड स्टोर', en: 'Mumbai Central Cold Storage' },
  'अन्नपूर्णा पुणे संकलन हब': { hi: 'अन्नपूर्णा पुणे संकलन हब', en: 'Annapurna Pune Collection Hub' },
  'नासिक मंडी संकलन हब': { hi: 'नासिक मंडी संकलन हब', en: 'Nashik Mandi Collection Hub' },
  'Farm Collection Center #04, Nashik Hub': { hi: 'खेत संकलन केंद्र #04, नासिक हब', en: 'Farm Collection Center #04, Nashik Hub' },
  'Pimplgaon Mandi Hub, Nashik': { hi: 'पिंपलगांव मंडी हब, नासिक', en: 'Pimplgaon Mandi Hub, Nashik' },
  'Sehore Mandi Hub, MP': { hi: 'सीहोर कृषि मंडी हब, मध्य प्रदेश', en: 'Sehore Mandi Hub, MP' },
};

export const farmerTranslations: Record<string, { hi: string; en: string }> = {
  'रामेश्वर यादव': { hi: 'रामेश्वर यादव', en: 'Rameshwar Yadav' },
  'सहयाद्री किसान FPO समूह': { hi: 'सहयाद्री किसान FPO समूह', en: 'Sahyadri Farmers FPO Group' },
  'सहयाद्री किसान FPO': { hi: 'सहयाद्री किसान FPO', en: 'Sahyadri Farmers FPO' },
  'सुरेश पाटिल': { hi: 'सुरेश पाटिल', en: 'Suresh Patil' },
  'कविता चौधरी': { hi: 'कविता चौधरी', en: 'Kavita Choudhary' },
  'मालवा कृषक FPO': { hi: 'मालवा कृषक FPO', en: 'Malwa Krishak FPO' },
  'हनुमान सहाय': { hi: 'हनुमान सहाय', en: 'Hanuman Sahay' },
  'Ramesh Patil': { hi: 'रमेश पाटिल', en: 'Ramesh Patil' },
  'Harpreet Singh': { hi: 'हरप्रीत सिंह', en: 'Harpreet Singh' },
  'Suresh Gaikwad': { hi: 'सुरेश गायकवाड़', en: 'Suresh Gaikwad' },
  'रमेश पाटिल': { hi: 'रमेश पाटिल', en: 'Ramesh Patil' },
  'हरप्रीत सिंह': { hi: 'हरप्रीत सिंह', en: 'Harpreet Singh' },
  'सुरेश गायकवाड़': { hi: 'सुरेश गायकवाड़', en: 'Suresh Gaikwad' },
  'अन्नपूर्णा होटल एवं कैटरिंग सेवा': { hi: 'अन्नपूर्णा होटल एवं कैटरिंग सेवा', en: 'Annapurna Hotel & Catering Services' },
  'अन्नपूर्णा पुणे (खरीदार)': { hi: 'अन्नपूर्णा पुणे (खरीदार)', en: 'Annapurna Pune (Buyer)' },
  'मदर डेयरी एग्री': { hi: 'मदर डेयरी एग्री', en: 'Mother Dairy Agri' },
  'मदर डेयरी फ्रेश': { hi: 'मदर डेयरी फ्रेश', en: 'Mother Dairy Fresh' },
  'रिलायंस रिटेल एग्री': { hi: 'रिलायंस रिटेल एग्री', en: 'Reliance Retail Agri' },
  'रिलायंस रिटेल फूड्स': { hi: 'रिलायंस रिटेल फूड्स', en: 'Reliance Retail Foods' },
  'बिगबास्केट थोक खरीद': { hi: 'बिगबास्केट थोक खरीद', en: 'BigBasket Wholesale' },
};

export const categoryTranslations: Record<string, { hi: string; en: string }> = {
  'सब्जियाँ': { hi: 'सब्जियाँ', en: 'Vegetables' },
  'कंदमूल': { hi: 'कंदमूल', en: 'Root Crops' },
  'अनाज': { hi: 'अनाज', en: 'Grains' },
  'Vegetables': { hi: 'सब्जियाँ', en: 'Vegetables' },
  'Fruits': { hi: 'फल', en: 'Fruits' },
  'Grains': { hi: 'अनाज', en: 'Grains' },
  'Pulses': { hi: 'दालें', en: 'Pulses' },
  'Spices': { hi: 'मसाले', en: 'Spices' },
  'All': { hi: 'सभी', en: 'All' },
};

export const gradeTranslations: Record<string, { hi: string; en: string }> = {
  'A+': { hi: 'A+', en: 'A+' },
  'A': { hi: 'A', en: 'A' },
  'B': { hi: 'B', en: 'B' },
  'C': { hi: 'C', en: 'C' },
  'Grade A+': { hi: 'Grade A+', en: 'Grade A+' },
  'Grade A': { hi: 'Grade A', en: 'Grade A' },
  'Grade B': { hi: 'Grade B', en: 'Grade B' },
  'Grade C': { hi: 'Grade C', en: 'Grade C' },
  'उच्चतम श्रेणी A+': { hi: 'उच्चतम श्रेणी A+', en: 'Grade A+' },
  'श्रेणी A': { hi: 'श्रेणी A', en: 'Grade A' },
  'ग्रेड A+': { hi: 'ग्रेड A+', en: 'Grade A+' },
  'ग्रेड A': { hi: 'ग्रेड A', en: 'Grade A' },
  'निर्यात श्रेणी': { hi: 'निर्यात श्रेणी', en: 'Export Grade' },
  'Grade A Premium': { hi: 'Grade A', en: 'Grade A' },
  'Grade A+ Export Quality': { hi: 'Grade A+', en: 'Grade A+' },
  'Grade A Ultra': { hi: 'Grade A+', en: 'Grade A+' },
};

// AI Token Map for Word-by-Word Substring & Transliteration Translation
const tokenMap: Record<string, { hi: string; en: string }> = {
  'मक्का': { hi: 'मक्का', en: 'Maize (Corn)' },
  'मकई': { hi: 'मक्का', en: 'Corn / Maize' },
  'corn': { hi: 'मक्का', en: 'Corn' },
  'maize': { hi: 'मक्का', en: 'Maize' },
  'sweetcorn': { hi: 'स्वीट कॉर्न', en: 'Sweet Corn' },
  'makka': { hi: 'मक्का', en: 'Maize (Corn)' },
  'makkai': { hi: 'मक्का', en: 'Maize (Corn)' },
  'धान': { hi: 'धान', en: 'Paddy' },
  'चावल': { hi: 'चावल', en: 'Rice' },
  'paddy': { hi: 'धान', en: 'Paddy' },
  'rice': { hi: 'चावल', en: 'Rice' },
  'गेहूं': { hi: 'गेहूं', en: 'Wheat' },
  'गेहूँ': { hi: 'गेहूं', en: 'Wheat' },
  'wheat': { hi: 'गेहूं', en: 'Wheat' },
  'gehun': { hi: 'गेहूं', en: 'Wheat' },
  'टमाटर': { hi: 'टमाटर', en: 'Tomatoes' },
  'tomato': { hi: 'टमाटर', en: 'Tomato' },
  'tomatoes': { hi: 'टमाटर', en: 'Tomatoes' },
  'tamatar': { hi: 'टमाटर', en: 'Tomatoes' },
  'प्याज': { hi: 'प्याज', en: 'Onions' },
  'प्याज़': { hi: 'प्याज', en: 'Onions' },
  'onion': { hi: 'प्याज', en: 'Onion' },
  'onions': { hi: 'प्याज', en: 'Onions' },
  'pyaaz': { hi: 'प्याज', en: 'Onions' },
  'आलू': { hi: 'आलू', en: 'Potatoes' },
  'potato': { hi: 'आलू', en: 'Potato' },
  'potatoes': { hi: 'आलू', en: 'Potatoes' },
  'aalu': { hi: 'आलू', en: 'Potatoes' },
  'भिंडी': { hi: 'भिंडी', en: 'Okra (Ladyfinger)' },
  'okra': { hi: 'भिंडी', en: 'Okra' },
  'ladyfinger': { hi: 'भिंडी', en: 'Ladyfinger' },
  'bhindi': { hi: 'भिंडी', en: 'Okra' },
  'बैंगन': { hi: 'बैंगन', en: 'Eggplant (Brinjal)' },
  'brinjal': { hi: 'बैंगन', en: 'Brinjal' },
  'eggplant': { hi: 'बैंगन', en: 'Eggplant' },
  'baingan': { hi: 'बैंगन', en: 'Eggplant' },
  'गोभी': { hi: 'गोभी', en: 'Cauliflower' },
  'फूलगोभी': { hi: 'फूलगोभी', en: 'Cauliflower' },
  'cauliflower': { hi: 'फूलगोभी', en: 'Cauliflower' },
  'पत्तागोभी': { hi: 'पत्तागोभी', en: 'Cabbage' },
  'cabbage': { hi: 'पत्तागोभी', en: 'Cabbage' },
  'मटर': { hi: 'मटर', en: 'Peas' },
  'peas': { hi: 'मटर', en: 'Peas' },
  'matar': { hi: 'मटर', en: 'Peas' },
  'गाजर': { hi: 'गाजर', en: 'Carrot' },
  'carrot': { hi: 'गाजर', en: 'Carrot' },
  'carrots': { hi: 'गाजर', en: 'Carrots' },
  'gajar': { hi: 'गाजर', en: 'Carrot' },
  'मूली': { hi: 'मूली', en: 'Radish' },
  'radish': { hi: 'मूली', en: 'Radish' },
  'mooli': { hi: 'मूली', en: 'Radish' },
  'शलजम': { hi: 'शलजम', en: 'Turnip' },
  'शलगम': { hi: 'शलजम', en: 'Turnip' },
  'turnip': { hi: 'शलजम', en: 'Turnip' },
  'turnips': { hi: 'शलजम', en: 'Turnips' },
  'shalgam': { hi: 'शलजम', en: 'Turnip' },
  'shaljam': { hi: 'शलजम', en: 'Turnip' },
  'चुकंदर': { hi: 'चुकंदर', en: 'Beetroot' },
  'beetroot': { hi: 'चुकंदर', en: 'Beetroot' },
  'chukandar': { hi: 'चुकंदर', en: 'Beetroot' },
  'शकरकंद': { hi: 'शकरकंद', en: 'Sweet Potato' },
  'shakarkand': { hi: 'शकरकंद', en: 'Sweet Potato' },
  'जिमीकंद': { hi: 'जिमीकंद', en: 'Yam' },
  'सूरन': { hi: 'सूरन', en: 'Yam' },
  'yam': { hi: 'जिमीकंद', en: 'Yam' },
  'suran': { hi: 'सूरन', en: 'Yam' },
  'jimikand': { hi: 'जिमीकंद', en: 'Yam' },
  'कटहल': { hi: 'कटहल', en: 'Jackfruit' },
  'jackfruit': { hi: 'कटहल', en: 'Jackfruit' },
  'kathal': { hi: 'कटहल', en: 'Jackfruit' },
  'सहजन': { hi: 'सहजन', en: 'Drumstick' },
  'drumstick': { hi: 'सहजन', en: 'Drumstick' },
  'moringa': { hi: 'सहजन', en: 'Moringa' },
  'sahjan': { hi: 'सहजन', en: 'Drumstick' },
  'गवार': { hi: 'गवार', en: 'Cluster Beans' },
  'gawar': { hi: 'गवार', en: 'Cluster Beans' },
  'अरबी': { hi: 'अरबी', en: 'Arbi' },
  'arbi': { hi: 'अरबी', en: 'Arbi' },
  'पेठा': { hi: 'पेठा', en: 'Ash Gourd' },
  'petha': { hi: 'पेठा', en: 'Ash Gourd' },
  'कद्दू': { hi: 'कद्दू', en: 'Pumpkin' },
  'pumpkin': { hi: 'कद्दू', en: 'Pumpkin' },
  'kaddu': { hi: 'कद्दू', en: 'Pumpkin' },
  'कुंदरू': { hi: 'कुंदरू', en: 'Ivy Gourd' },
  'kundru': { hi: 'कुंदरू', en: 'Ivy Gourd' },
  'परवल': { hi: 'परवल', en: 'Pointed Gourd' },
  'parwal': { hi: 'परवल', en: 'Pointed Gourd' },
  'तोरई': { hi: 'तोरई', en: 'Ridge Gourd' },
  'torai': { hi: 'तोरई', en: 'Ridge Gourd' },
  'पुदीना': { hi: 'पुदीना', en: 'Mint' },
  'mint': { hi: 'पुदीना', en: 'Mint' },
  'pudina': { hi: 'पुदीना', en: 'Mint' },
  'कढ़ी': { hi: 'कढ़ी पत्ता', en: 'Curry Leaves' },
  'मेथी': { hi: 'मेथी', en: 'Fenugreek' },
  'methi': { hi: 'मेथी', en: 'Fenugreek' },
  'गुड़': { hi: 'गुड़', en: 'Jaggery' },
  'jaggery': { hi: 'गुड़', en: 'Jaggery' },
  'gud': { hi: 'गुड़', en: 'Jaggery' },
  'इमली': { hi: 'इमली', en: 'Tamarind' },
  'tamarind': { hi: 'इमली', en: 'Tamarind' },
  'imli': { hi: 'इमली', en: 'Tamarind' },
  'नारियल': { hi: 'नारियल', en: 'Coconut' },
  'coconut': { hi: 'नारियल', en: 'Coconut' },
  'nariyal': { hi: 'नारियल', en: 'Coconut' },
  'अमरूद': { hi: 'अमरूद', en: 'Guava' },
  'guava': { hi: 'अमरूद', en: 'Guava' },
  'amrood': { hi: 'अमरूद', en: 'Guava' },
  'संतरा': { hi: 'संतरा', en: 'Orange' },
  'orange': { hi: 'संतरा', en: 'Orange' },
  'santra': { hi: 'संतरा', en: 'Orange' },
  'नींबू': { hi: 'नींबू', en: 'Lemon' },
  'lemon': { hi: 'नींबू', en: 'Lemon' },
  'lime': { hi: 'नींबू', en: 'Lime' },
  'nimbu': { hi: 'नींबू', en: 'Lemon' },
  'खरबूजा': { hi: 'खरबूजा', en: 'Muskmelon' },
  'muskmelon': { hi: 'खरबूजा', en: 'Muskmelon' },
  'kharbuja': { hi: 'खरबूजा', en: 'Muskmelon' },
  'gourd': { hi: 'लौकी', en: 'Gourd' },
  'लौकी': { hi: 'लौकी', en: 'Bottle Gourd' },
  'lauki': { hi: 'लौकी', en: 'Bottle Gourd' },
  'करेला': { hi: 'करेला', en: 'Bitter Gourd' },
  'karela': { hi: 'करेला', en: 'Bitter Gourd' },
  'पालक': { hi: 'पालक', en: 'Spinach' },
  'spinach': { hi: 'पालक', en: 'Spinach' },
  'palak': { hi: 'पालक', en: 'Spinach' },
  'धनिया': { hi: 'धनिया', en: 'Coriander' },
  'coriander': { hi: 'धनिया', en: 'Coriander' },
  'dhaniya': { hi: 'धनिया', en: 'Coriander' },
  'अदरक': { hi: 'अदरक', en: 'Ginger' },
  'ginger': { hi: 'अदरक', en: 'Ginger' },
  'adrak': { hi: 'अदरक', en: 'Ginger' },
  'लहसुन': { hi: 'लहसुन', en: 'Garlic' },
  'garlic': { hi: 'लहसुन', en: 'Garlic' },
  'lahsun': { hi: 'लहसुन', en: 'Garlic' },
  'हल्दी': { hi: 'हल्दी', en: 'Turmeric' },
  'turmeric': { hi: 'हल्दी', en: 'Turmeric' },
  'haldi': { hi: 'हल्दी', en: 'Turmeric' },
  'मिर्च': { hi: 'मिर्च', en: 'Chilli' },
  'chilli': { hi: 'मिर्च', en: 'Chilli' },
  'chili': { hi: 'मिर्च', en: 'Chili' },
  'mirch': { hi: 'मिर्च', en: 'Chilli' },
  'शिमला': { hi: 'शिमला मिर्च', en: 'Capsicum' },
  'capsicum': { hi: 'शिमला मिर्च', en: 'Capsicum' },
  'सेब': { hi: 'सेब', en: 'Apples' },
  'apple': { hi: 'सेब', en: 'Apple' },
  'apples': { hi: 'सेब', en: 'Apples' },
  'seb': { hi: 'सेब', en: 'Apples' },
  'आम': { hi: 'आम', en: 'Mangoes' },
  'mango': { hi: 'आम', en: 'Mango' },
  'mangoes': { hi: 'आम', en: 'Mangoes' },
  'aam': { hi: 'आम', en: 'Mangoes' },
  'केला': { hi: 'केला', en: 'Bananas' },
  'banana': { hi: 'केला', en: 'Banana' },
  'bananas': { hi: 'केला', en: 'Bananas' },
  'kela': { hi: 'केला', en: 'Bananas' },
  'अंगूर': { hi: 'अंगूर', en: 'Grapes' },
  'grapes': { hi: 'अंगूर', en: 'Grapes' },
  'angoor': { hi: 'अंगूर', en: 'Grapes' },
  'अनार': { hi: 'अनार', en: 'Pomegranate' },
  'pomegranate': { hi: 'अनार', en: 'Pomegranate' },
  'anar': { hi: 'अनार', en: 'Pomegranate' },
  'पपीता': { hi: 'पपीता', en: 'Papaya' },
  'papaya': { hi: 'पपीता', en: 'Papaya' },
  'papita': { hi: 'पपीता', en: 'Papaya' },
  'सोयाबीन': { hi: 'सोयाबीन', en: 'Soybean' },
  'soybean': { hi: 'सोयाबीन', en: 'Soybean' },
  'सरसों': { hi: 'सरसों', en: 'Mustard' },
  'mustard': { hi: 'सरसों', en: 'Mustard' },
  'sarson': { hi: 'सरसों', en: 'Mustard' },
  'चना': { hi: 'चना', en: 'Chickpeas' },
  'chickpeas': { hi: 'चना', en: 'Chickpeas' },
  'chana': { hi: 'चना', en: 'Chickpeas' },
  'मूंगफली': { hi: 'मूंगफली', en: 'Peanuts' },
  'peanuts': { hi: 'मूंगफली', en: 'Peanuts' },
  'mungfali': { hi: 'मूंगफली', en: 'Peanuts' },
  'मखाना': { hi: 'मखाना', en: 'Fox Nuts (Makhana)' },
  'makhana': { hi: 'मखाना', en: 'Fox Nuts (Makhana)' },
  'ताज़ा': { hi: 'ताज़ा', en: 'Fresh' },
  'fresh': { hi: 'ताज़ा', en: 'Fresh' },
  'जैविक': { hi: 'जैविक', en: 'Organic' },
  'organic': { hi: 'जैविक', en: 'Organic' },
  'देसी': { hi: 'देसी', en: 'Desi' },
  'desi': { hi: 'देसी', en: 'Desi' },
  'हाइब्रिड': { hi: 'हाइब्रिड', en: 'Hybrid' },
  'hybrid': { hi: 'हाइब्रिड', en: 'Hybrid' },
};

// Dynamic AI Translation Cache (Populated from SQLite DB & Live Google Translate API)
export const dynamicCropCache: Record<string, { hi: string; en: string }> = {};
const pendingTranslateRequests = new Set<string>();

export async function loadDynamicTranslations() {
  if (typeof window === 'undefined') return;
  try {
    const res = await fetch('/api/v1/translate');
    const data = await res.json();
    if (data?.success && data?.translations) {
      Object.assign(dynamicCropCache, data.translations);
    }
  } catch (err) {
    // Ignore fetch error on SSR or initial load
  }
}

export async function fetchCropTranslationAI(cropName: string): Promise<{ hi: string; en: string } | null> {
  if (!cropName) return null;
  const trimmed = cropName.trim();
  const lower = trimmed.toLowerCase();

  if (cropTranslations[trimmed]) return cropTranslations[trimmed];
  if (dynamicCropCache[lower]) return dynamicCropCache[lower];

  try {
    const res = await fetch('/api/v1/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: trimmed }),
    });
    const data = await res.json();
    if (data?.success && data?.hi && data?.en) {
      const result = { hi: data.hi, en: data.en };
      dynamicCropCache[lower] = result;
      dynamicCropCache[trimmed] = result;
      return result;
    }
  } catch (err) {
    console.error('fetchCropTranslationAI error:', err);
  }
  return null;
}

// Auto load cached DB translations when browser initializes
if (typeof window !== 'undefined') {
  loadDynamicTranslations();
}

export function getLocalizedCropName(name: string, lang: Language): string {
  if (!name) return name;
  const trimmed = name.trim();
  const lower = trimmed.toLowerCase();

  // 0. Check AGRI_PHRASE_DICTIONARY first for direct Indian regional languages
  for (const [key, mapping] of Object.entries(AGRI_PHRASE_DICTIONARY)) {
    if (key.toLowerCase() === lower || lower.includes(key.toLowerCase())) {
      if (mapping[lang]) return mapping[lang];
    }
  }

  // 1. Direct exact match in static dictionary
  if (cropTranslations[trimmed]) {
    const res = (cropTranslations[trimmed] as any)[lang] || (lang === 'en' ? cropTranslations[trimmed].en : cropTranslations[trimmed].hi);
    if (res) return res;
  }

  // 2. Direct match in Dynamic AI Cache (populated from DB or live AI)
  if (dynamicCropCache[lower]) {
    const res = (dynamicCropCache[lower] as any)[lang] || (lang === 'en' ? dynamicCropCache[lower].en : dynamicCropCache[lower].hi);
    if (res) return res;
  }
  if (dynamicCropCache[trimmed]) {
    const res = (dynamicCropCache[trimmed] as any)[lang] || (lang === 'en' ? dynamicCropCache[trimmed].en : dynamicCropCache[trimmed].hi);
    if (res) return res;
  }

  // 3. Case-insensitive exact match in static dictionary
  for (const key of Object.keys(cropTranslations)) {
    if (key.toLowerCase() === lower) {
      const res = (cropTranslations[key] as any)[lang] || (lang === 'en' ? cropTranslations[key].en : cropTranslations[key].hi);
      if (res) return res;
    }
  }

  // 4. Substring match for multi-word crop names (e.g., "नासिक मक्का", "ताज़ा मक्का")
  for (const [key, val] of Object.entries(cropTranslations)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      if (lang === 'en' && /[ऀ-ॿ]/.test(trimmed)) {
        return val.en;
      }
      if (lang !== 'en' && !/[ऀ-ॿ]/.test(trimmed)) {
        return val.hi;
      }
    }
  }

  // 5. Token-by-token AI translation / Transliteration
  const words = trimmed.split(/\s+/);
  let hasTranslatedToken = false;
  const translatedTokens = words.map((w) => {
    const cleanWord = w.replace(/[^a-zA-Zऀ-ॿ]/g, '').toLowerCase();
    if (tokenMap[cleanWord]) {
      hasTranslatedToken = true;
      return (tokenMap[cleanWord] as any)[lang] || (lang === 'en' ? tokenMap[cleanWord].en : tokenMap[cleanWord].hi);
    }
    return w;
  });

  if (hasTranslatedToken) {
    return translatedTokens.join(' ');
  }

  // 5b. Smart Probabilistic & Phonetic Fuzzy Matcher (e.g., 'baigan', 'began', 'bagan' -> 'बैंगन' / 'Eggplant')
  const fuzzyMatch = findProbabilisticCropMatch(trimmed, cropTranslations, 0.75);
  if (fuzzyMatch) {
    const res = (fuzzyMatch.translation as any)[lang] || (lang === 'en' ? fuzzyMatch.translation.en : fuzzyMatch.translation.hi);
    if (res) return res;
  }

  // 6. Automatic AI Fallback Cleaner for bracketed names e.g. "ताज़ा हाइब्रिड टमाटर (Fresh Tomatoes)"
  if (lang === 'en') {
    const bracketMatch = name.match(/\(([^)]+)\)/);
    if (bracketMatch && bracketMatch[1]) {
      return bracketMatch[1].trim();
    }
  } else if (lang === 'hi') {
    const cleaned = name.replace(/\([^)]*\)/g, '').trim();
    if (cleaned.length > 0 && cleaned !== trimmed) return cleaned;
  }

  // 7. Background Trigger AI Online Translator for missing crops
  if (typeof window !== 'undefined' && !pendingTranslateRequests.has(lower)) {
    pendingTranslateRequests.add(lower);
    fetchCropTranslationAI(trimmed).then(() => {
      pendingTranslateRequests.delete(lower);
    });
  }

  return name;
}

export function stripIndicParens(text: string): string {
  if (!text) return text;
  // 1. If format is "Indic (English)" e.g. "नासिक संकलन केंद्र (Nashik Mandi Hub)", extract the English inside parentheses
  const indicWithEng = text.match(/[\u0900-\u0D7F]+\s*\(([A-Za-z0-9\s\,\.\-\#]+)\)/);
  if (indicWithEng && indicWithEng[1]) return indicWithEng[1].trim();

  // 2. If format is "English (Indic)" e.g. "Nashik Hub (नासिक हब)", remove the Indic inside parentheses
  const engWithIndic = text.replace(/\s*\([^\)]*[\u0900-\u0D7F][^\)]*\)/g, '').trim();
  if (engWithIndic && !/[\u0900-\u0D7F]/.test(engWithIndic)) return engWithIndic;

  return text.replace(/\s*\([\u0900-\u0D7F\s\.\,\-]+\)/g, '').trim();
}

export function parseBilingualString(text: string, lang: Language): string {
  if (!text) return text;
  if (lang === 'en') {
    // Check if dictionary has direct mapping
    if (locationTranslations[text]?.en) return locationTranslations[text].en;
    if (farmerTranslations[text]?.en) return farmerTranslations[text].en;
    if (cropTranslations[text]?.en) return cropTranslations[text].en;

    // Check if format is "Hindi (English)" or "English (Hindi)"
    const stripped = stripIndicParens(text);
    if (!/[\u0900-\u0D7F]/.test(stripped)) return stripped;

    // Direct token substitutions if still has Devanagari
    let cleaned = text;
    for (const [k, v] of Object.entries(locationTranslations)) {
      if (cleaned.includes(k)) cleaned = cleaned.replace(k, v.en);
    }
    for (const [k, v] of Object.entries(farmerTranslations)) {
      if (cleaned.includes(k)) cleaned = cleaned.replace(k, v.en);
    }
    cleaned = stripIndicParens(cleaned);
    return cleaned;
  }

  // Non-English language: return native text or Indic parenthetical
  const trimmed = text.trim();
  const match = trimmed.match(/^([^(]+)\(([^)]+)\)$/);
  if (match) {
    const part1 = match[1].trim();
    const part2 = match[2].trim();
    if (/[\u0900-\u0D7F]/.test(part1)) return part1;
    if (/[\u0900-\u0D7F]/.test(part2)) return part2;
  }
  return text;
}

export function getLocalizedLocation(loc: string, lang: Language): string {
  if (!loc) return loc;
  if (lang === 'en') {
    if (locationTranslations[loc]?.en) return locationTranslations[loc].en;
    const clean = stripIndicParens(loc);
    if (locationTranslations[clean]?.en) return locationTranslations[clean].en;
    if (!/[\u0900-\u0D7F]/.test(clean)) return clean;
    return parseBilingualString(loc, 'en');
  }
  if (locationTranslations[loc]) {
    return (locationTranslations[loc] as any)[lang] || locationTranslations[loc].hi || loc;
  }
  const cleanKey = stripIndicParens(loc);
  if (locationTranslations[cleanKey]) {
    return (locationTranslations[cleanKey] as any)[lang] || locationTranslations[cleanKey].hi || cleanKey;
  }
  return parseBilingualString(loc, lang);
}

export function getLocalizedFarmer(farmer: string, lang: Language): string {
  if (!farmer) return farmer;
  if (lang === 'en') {
    if (farmerTranslations[farmer]?.en) return farmerTranslations[farmer].en;
    const clean = stripIndicParens(farmer);
    if (farmerTranslations[clean]?.en) return farmerTranslations[clean].en;
    if (!/[\u0900-\u0D7F]/.test(clean)) return clean;
    return parseBilingualString(farmer, 'en');
  }
  if (farmerTranslations[farmer]) {
    return (farmerTranslations[farmer] as any)[lang] || farmerTranslations[farmer].hi || farmer;
  }
  const cleanKey = stripIndicParens(farmer);
  if (farmerTranslations[cleanKey]) {
    return (farmerTranslations[cleanKey] as any)[lang] || farmerTranslations[cleanKey].hi || cleanKey;
  }
  return parseBilingualString(farmer, lang);
}

export function getLocalizedCategory(cat: string, lang: Language): string {
  if (!cat) return cat;
  if (categoryTranslations[cat]) {
    return (categoryTranslations[cat] as any)[lang] || (lang === 'en' ? categoryTranslations[cat].en : categoryTranslations[cat].hi) || cat;
  }
  return cat;
}

export function getLocalizedGrade(grade: string, lang: Language): string {
  if (!grade) return grade;
  if (gradeTranslations[grade]) {
    return (gradeTranslations[grade] as any)[lang] || (lang === 'en' ? gradeTranslations[grade].en : gradeTranslations[grade].hi) || grade;
  }
  return grade;
}
