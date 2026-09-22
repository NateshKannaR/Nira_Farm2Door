const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'app', 'farmer', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add states
const targetState = `  const [myListings, setMyListings] = useState<any[]>([]);`;
const replacementState = `  const [myListings, setMyListings] = useState<any[]>([]);
  const [isSeedingAll, setIsSeedingAll] = useState(false);
  const [seedStatusMessage, setSeedStatusMessage] = useState<string | null>(null);`;

if (content.includes(targetState) && !content.includes('isSeedingAll')) {
  content = content.replace(targetState, replacementState);
  console.log('Added isSeedingAll state');
}

// 2. Add logoUrl in loadCrops
const targetLoadCrops = `            imageUrl: photoList[0],
            photos: photoList,
            farmerId: c.farmer_id,`;

const replacementLoadCrops = `            imageUrl: photoList[0],
            photos: photoList,
            logoUrl: c.logo_url || photoList[0],
            sideLogo: c.logo_url || photoList[0],
            farmerId: c.farmer_id,`;

if (content.includes(targetLoadCrops)) {
  content = content.replace(targetLoadCrops, replacementLoadCrops);
  console.log('Added logoUrl and sideLogo to loadCrops');
}

// 3. Add handleSeedAllProductsToKisan function after loadCrops
const targetEffect = `  useEffect(() => {
    loadCrops();
  }, [user]);`;

const replacementEffect = `  const handleSeedAllProductsToKisan = async () => {
    setIsSeedingAll(true);
    setSeedStatusMessage(null);
    try {
      const res = await fetch('/api/v1/products/seed-default-kisan', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSeedStatusMessage(
          language === 'hi'
            ? \`सफल! \${data.count} कैटलॉग उत्पाद डिफ़ॉल्ट किसान (Ramesh Patil / u_farmer_1) में जोड़ दिए गए हैं।\`
            : \`Success! \${data.count} catalog products added to default Kisan account (Ramesh Patil / u_farmer_1).\`
        );
        await loadCrops();
      } else {
        setSeedStatusMessage(data.error || 'Failed to seed products');
      }
    } catch (err: any) {
      setSeedStatusMessage(err.message || 'Network error');
    } finally {
      setIsSeedingAll(false);
    }
  };

  useEffect(() => {
    loadCrops();
  }, [user]);`;

if (content.includes(targetEffect) && !content.includes('handleSeedAllProductsToKisan')) {
  content = content.replace(targetEffect, replacementEffect);
  console.log('Added handleSeedAllProductsToKisan function');
}

// 4. Update BulmaProductCard to pass logo_url and side_logo
const targetBulmaCard = `                    images={crop.photos || [crop.imageUrl]}
                    unit={crop.unit || 'kg'}
                    badge={language === 'hi' ? 'मेरी फसल' : 'My Crop'}`;

const replacementBulmaCard = `                    images={crop.photos || [crop.imageUrl]}
                    logo_url={crop.logoUrl || crop.sideLogo || crop.imageUrl}
                    side_logo={crop.sideLogo || crop.logoUrl}
                    unit={crop.unit || 'kg'}
                    badge={language === 'hi' ? 'मेरी फसल' : 'My Crop'}`;

if (content.includes(targetBulmaCard)) {
  content = content.replace(targetBulmaCard, replacementBulmaCard);
  console.log('Added logo_url and side_logo to BulmaProductCard in farmer page');
}

// 5. Add Seed Button and Status message in My Registered Crops header
const targetCropsHeader = `<div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                {myListings.length} {language === 'hi' ? 'सक्रिय फसलें' : 'Active Crops'}
              </span>`;

const replacementCropsHeader = `<div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleSeedAllProductsToKisan}
                disabled={isSeedingAll}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-black text-xs rounded-xl shadow-md transition disabled:opacity-50"
                title={language === 'hi' ? 'सभी 352 कैटलॉग फसलों को डिफ़ॉल्ट किसान u_farmer_1 के खाते में जोड़ें' : 'Add all 352 catalog produce to default Kisan u_farmer_1'}
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-950" />
                <span>
                  {isSeedingAll
                    ? (language === 'hi' ? '352 उत्पाद जोड़े जा रहे हैं...' : 'Adding 352 Products...')
                    : (language === 'hi' ? '✨ सभी 352 उत्पाद जोड़ें' : '✨ Add All 352 Products to Kisan')}
                </span>
              </button>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                {myListings.length} {language === 'hi' ? 'सक्रिय फसलें' : 'Active Crops'}
              </span>`;

if (content.includes(targetCropsHeader)) {
  content = content.replace(targetCropsHeader, replacementCropsHeader);
  console.log('Added Seed Button in My Registered Crops header');
}

// Also add status banner if seedStatusMessage is set
const targetStatusPlacement = `<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">`;
const replacementStatusPlacement = `{seedStatusMessage && (
            <div className="p-3 bg-amber-100 border-2 border-amber-400 text-emerald-950 rounded-2xl text-xs font-bold flex items-center justify-between shadow-sm animate-fadeIn">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{seedStatusMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setSeedStatusMessage(null)}
                className="text-emerald-900 hover:text-red-700 font-bold ml-4"
              >
                ✕
              </button>
            </div>
          )}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">`;

if (content.includes(targetStatusPlacement) && !content.includes('seedStatusMessage && (')) {
  content = content.replace(targetStatusPlacement, replacementStatusPlacement);
  console.log('Added seedStatusMessage banner to My Registered Crops');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Finished patching farmer page.tsx successfully');
