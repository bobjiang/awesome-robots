const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Robot images to download with fallback URLs
const robotImages = [
  {
    id: 'tesla-optimus-gen3',
    urls: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Tesla_Bot.jpg/1200px-Tesla_Bot.jpg',
      'https://cdn.motor1.com/images/mgl/pb3WAo/s1/tesla-optimus-robot.jpg'
    ],
    filename: 'tesla-optimus-gen3.webp'
  },
  {
    id: 'figure-02',
    urls: [
      'https://www.press.bmwgroup.com/global/photo/detail/P90563506',
      'https://cdn.prod.website-files.com/63a38e4d4e7c12daef22f4ec/661d0f7e7ad7e3e14a08f2e9_figure-02-spec-sheet-v2.jpg'
    ],
    filename: 'figure-02.webp'
  },
  {
    id: 'figure-03',
    urls: [
      'https://cdn.prod.website-files.com/63a38e4d4e7c12daef22f4ec/67fe4ac3d8c6d8d24e7dd9b3_F.03_Hero_1.jpg',
      'https://techcrunch.com/wp-content/uploads/2025/02/Figure-03.jpg'
    ],
    filename: 'figure-03.webp'
  },
  {
    id: 'agility-digit',
    urls: [
      'https://cdn.therobotreport.com/wp-content/uploads/2023/10/Agility-Digit-at-Amazon-facility-1024x683.jpg',
      'https://images.axios.com/8tFWcFa3VRvMwXfbGZWM5fzHe-k=/0x0:1920x1080/1920x1080/2024/03/14/1710421804341.jpg'
    ],
    filename: 'agility-digit.webp'
  },
  {
    id: 'apptronik-apollo',
    urls: [
      'https://apptronik.com/wp-content/uploads/2023/08/Apollo-Hero-1-scaled.jpg',
      'https://cdn.therobotreport.com/wp-content/uploads/2024/01/Apptronik-Apollo-humanoid-robot-1024x683.jpg'
    ],
    filename: 'apptronik-apollo.webp'
  },
  {
    id: 'sanctuary-phoenix',
    urls: [
      'https://images.squarespace-cdn.com/content/v1/5e43e2a32cdd6a36ab73f7d1/1684251448863-YWSXP9NKZT9IEP4Y3WUO/Phoenix_ProductImage_001.png',
      'https://newatlas.com/robots/sanctuary-ai-phoenix-humanoid-robot/?itm_source=newatlas&itm_medium=article-body'
    ],
    filename: 'sanctuary-phoenix.webp'
  },
  {
    id: '1x-neo-gamma',
    urls: [
      'https://cdn.sanity.io/images/ca4jck6w/production/b3f7c5d0e0f5c0d7f5b0e5c0d7f5b0e5c0d7f5b0-3840x2160.jpg',
      'https://techcrunch.com/wp-content/uploads/2025/02/1X-NEO-Gamma.jpg'
    ],
    filename: '1x-neo-gamma.webp'
  },
  {
    id: 'fourier-gr1',
    urls: [
      'https://fftai.com/wp-content/uploads/2023/07/GR-1-Hero-Image.jpg',
      'https://developer.nvidia.com/sites/default/files/akamai/isaac_gym/fourier-gr1-humanoid-robot.jpg'
    ],
    filename: 'fourier-gr1.webp'
  },
  {
    id: 'fourier-gr2',
    urls: [
      'https://fftai.com/wp-content/uploads/2024/09/GR-2-Hero-Image.jpg',
      'https://interestingengineering.com/wp-content/uploads/2024/09/fourier-gr-2.jpg'
    ],
    filename: 'fourier-gr2.webp'
  },
  {
    id: 'pal-talos',
    urls: [
      'https://pal-robotics.com/wp-content/uploads/2021/07/TALOS-humanoid-robot-research-1.jpg',
      'https://spectrum.ieee.org/media-library/talos-humanoid-robot-from-pal-robotics.jpg'
    ],
    filename: 'pal-talos.webp'
  },
  {
    id: 'engineered-arts-ameca',
    urls: [
      'https://engineeredarts.com/wp-content/uploads/2021/12/Ameca-Front-View-scaled.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Ameca_robot.jpg/1200px-Ameca_robot.jpg'
    ],
    filename: 'engineered-arts-ameca.webp'
  },
  {
    id: 'hanson-sophia',
    urls: [
      'https://www.hansonrobotics.com/wp-content/uploads/2023/01/sophia-2023-front.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Sophia_at_the_AI_for_Good_Global_Summit_2018_%2827254369347%29_%28cropped%29.jpg/1200px-Sophia_at_the_AI_for_Good_Global_Summit_2018_%2827254369347%29_%28cropped%29.jpg'
    ],
    filename: 'hanson-sophia.webp'
  },
  {
    id: 'sony-aibo-ers1000',
    urls: [
      'https://us.aibo.com/assets/images/feature/spec/img_product.png',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Aibo_ERS-1000.jpg/1200px-Aibo_ERS-1000.jpg'
    ],
    filename: 'sony-aibo-ers1000.webp'
  }
];

// Download function with fallback
async function downloadImage(urls, outputPath) {
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    console.log(`Attempting to download from: ${url}`);

    try {
      await new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        const options = {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        };

        protocol.get(url, options, (response) => {
          if (response.statusCode === 301 || response.statusCode === 302) {
            // Handle redirect
            console.log(`Redirected to: ${response.headers.location}`);
            const redirectUrl = response.headers.location;
            const redirectProtocol = redirectUrl.startsWith('https') ? https : http;

            redirectProtocol.get(redirectUrl, options, (redirectResponse) => {
              if (redirectResponse.statusCode === 200) {
                const fileStream = fs.createWriteStream(outputPath);
                redirectResponse.pipe(fileStream);
                fileStream.on('finish', () => {
                  fileStream.close();
                  resolve();
                });
              } else {
                reject(new Error(`HTTP ${redirectResponse.statusCode}`));
              }
            }).on('error', reject);
          } else if (response.statusCode === 200) {
            const fileStream = fs.createWriteStream(outputPath);
            response.pipe(fileStream);
            fileStream.on('finish', () => {
              fileStream.close();
              resolve();
            });
            fileStream.on('error', reject);
          } else {
            reject(new Error(`HTTP ${response.statusCode}`));
          }
        }).on('error', reject);
      });

      console.log(`✓ Successfully downloaded: ${path.basename(outputPath)}`);
      return true; // Success, no need to try fallback URLs

    } catch (error) {
      console.log(`✗ Failed (${error.message}), trying next URL...`);
      if (i === urls.length - 1) {
        console.error(`✗ All URLs failed for ${path.basename(outputPath)}`);
        return false;
      }
    }
  }
}

// Main download process
async function downloadAllImages() {
  const outputDir = path.join(__dirname, '../public/images/robots');

  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Downloading ${robotImages.length} robot images...\n`);

  let successCount = 0;
  let failCount = 0;

  for (const robot of robotImages) {
    const outputPath = path.join(outputDir, robot.filename);
    console.log(`\nDownloading ${robot.id}...`);

    const success = await downloadImage(robot.urls, outputPath);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }

    // Small delay to avoid overwhelming servers
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Download complete!`);
  console.log(`✓ Successful: ${successCount}/${robotImages.length}`);
  console.log(`✗ Failed: ${failCount}/${robotImages.length}`);
  console.log(`${'='.repeat(50)}`);
}

// Run the download
downloadAllImages().catch(console.error);
