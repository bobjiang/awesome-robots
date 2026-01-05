import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

async function optimizeLogo(inputPath, outputPath, maxWidth = 200) {
  try {
    const metadata = await sharp(inputPath).metadata();
    console.log(`\nOriginal: ${inputPath}`);
    console.log(`Size: ${(metadata.size / 1024).toFixed(2)}KB`);
    console.log(`Dimensions: ${metadata.width}x${metadata.height}`);

    await sharp(inputPath)
      .resize(maxWidth, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .png({ compressionLevel: 9, quality: 90 })
      .toFile(outputPath);

    const newMetadata = await sharp(outputPath).metadata();
    console.log(`\nOptimized: ${outputPath}`);
    console.log(`Size: ${(newMetadata.size / 1024).toFixed(2)}KB`);
    console.log(`Dimensions: ${newMetadata.width}x${newMetadata.height}`);
    console.log(`Savings: ${((metadata.size - newMetadata.size) / 1024).toFixed(2)}KB`);
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error);
  }
}

// Optimize the two large logos
await optimizeLogo(
  join(projectRoot, 'public/images/brands/limx-dynamics-logo.png'),
  join(projectRoot, 'public/images/brands/limx-dynamics-logo-opt.png')
);

await optimizeLogo(
  join(projectRoot, 'public/images/brands/sanctuary-ai-logo.png'),
  join(projectRoot, 'public/images/brands/sanctuary-ai-logo-opt.png')
);

console.log('\n✓ Logo optimization complete!');
