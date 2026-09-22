const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, '..', 'public', 'data', 'catalog.json');
const outputMediaJsonPath = path.join(__dirname, '..', 'public', 'data', 'product_images.json');
const srcDataMediaJsonPath = path.join(__dirname, '..', 'src', 'data', 'product_images.json');

// Ensure directories exist
fs.mkdirSync(path.dirname(outputMediaJsonPath), { recursive: true });
fs.mkdirSync(path.dirname(srcDataMediaJsonPath), { recursive: true });

const catalogData = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

function makeSquareLogoUrl(url) {
  if (!url || typeof url !== 'string') return url;
  if (url.includes('images.unsplash.com')) {
    const base = url.split('?')[0];
    return `${base}?auto=format&fit=crop&w=300&h=300&q=85`;
  }
  return url;
}

function makeThumbUrl(url) {
  if (!url || typeof url !== 'string') return url;
  if (url.includes('images.unsplash.com')) {
    const base = url.split('?')[0];
    return `${base}?auto=format&fit=crop&w=400&h=300&q=80`;
  }
  return url;
}

const mediaEntries = [];
const updatedCatalogItems = [];
const items = Array.isArray(catalogData) ? catalogData : (catalogData.items || []);

for (const item of items) {
  const productId = item.id;
  const logoId = `lnk_logo_${productId}`;
  const primaryId = `lnk_img_${productId}_primary`;
  const thumbId = `lnk_img_${productId}_thumb`;

  const primaryPhoto = item.photos && item.photos[0] ? item.photos[0] : item.thumbnail;
  const rawLogo = item.sideLogo || primaryPhoto;
  const logoUrl = makeSquareLogoUrl(rawLogo);
  const thumbUrl = makeThumbUrl(item.thumbnail || primaryPhoto);

  const galleryItems = (item.photos || []).map((photoUrl, idx) => ({
    link_id: `lnk_img_${productId}_gal_${idx + 1}`,
    url: photoUrl,
    alt: `${item.name} (${item.nameHi}) - Photo ${idx + 1}`,
    type: `gallery_photo_${idx + 1}`,
  }));

  const logoStructure = {
    link_id: logoId,
    url: logoUrl,
    alt: `${item.name} Official Product Logo`,
    type: 'square_logo',
    aspect_ratio: '1:1',
    format: 'jpg/webp',
  };

  const imagesStructure = {
    primary: {
      link_id: primaryId,
      url: primaryPhoto,
      alt: `${item.name} Produce Primary View`,
      type: 'primary_photo',
    },
    thumbnail: {
      link_id: thumbId,
      url: thumbUrl,
      alt: `${item.name} Thumbnail`,
      type: 'thumbnail',
    },
    gallery: galleryItems,
  };

  const mediaEntry = {
    id: `media_${productId}`,
    product_id: productId,
    crop_name: item.name,
    crop_name_hi: item.nameHi,
    category: item.category,
    variety: item.variety,
    logo_id: logoId,
    logo_url: logoUrl,
    logo_alt: `${item.name} Official Product Logo`,
    primary_image_id: primaryId,
    primary_image_url: primaryPhoto,
    thumbnail_id: thumbId,
    thumbnail_url: thumbUrl,
    gallery_urls: (item.photos || []).slice(1),
    logo_structure: logoStructure,
    images_structure: imagesStructure,
  };

  mediaEntries.push(mediaEntry);

  updatedCatalogItems.push({
    ...item,
    sideLogo: logoUrl,
    logo_url: logoUrl,
    logo: logoStructure,
    imagesStructure: imagesStructure,
  });
}

// 1. Write product_images.json
fs.writeFileSync(outputMediaJsonPath, JSON.stringify(mediaEntries, null, 2), 'utf8');
fs.writeFileSync(srcDataMediaJsonPath, JSON.stringify(mediaEntries, null, 2), 'utf8');

// 2. Update catalog.json
const outputCatalog = Array.isArray(catalogData)
  ? updatedCatalogItems
  : { ...catalogData, items: updatedCatalogItems };
fs.writeFileSync(catalogPath, JSON.stringify(outputCatalog, null, 2), 'utf8');

console.log(`Successfully generated ${mediaEntries.length} media records in:`);
console.log(` - ${outputMediaJsonPath}`);
console.log(` - ${srcDataMediaJsonPath}`);
console.log(` - Updated ${catalogPath}`);
