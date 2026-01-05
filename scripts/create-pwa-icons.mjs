import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Create a simple SVG icon with "AR" text
const createSVGIcon = (size) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#2563eb"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">AR</text>
</svg>
`;

async function createIcon(size, filename) {
  const svgBuffer = Buffer.from(createSVGIcon(size));

  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(join(projectRoot, 'public', filename));

  console.log(`✓ Created ${filename} (${size}x${size})`);
}

// Create all required PWA icons
await createIcon(192, 'icon-192.png');
await createIcon(512, 'icon-512.png');
await createIcon(180, 'apple-touch-icon.png');
await createIcon(32, 'favicon.ico'); // Also create a favicon

console.log('\n✓ All PWA icons created successfully!');
