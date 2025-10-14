const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Create brands directory if it doesn't exist
const brandsDir = path.join(__dirname, '../public/images/brands');
if (!fs.existsSync(brandsDir)) {
  fs.mkdirSync(brandsDir, { recursive: true });
}

const logos = [
  // Tier 1
  { id: 'figure-ai', url: 'https://images.ctfassets.net/qx5k8y1u9drj/3ygvPaiOiIX62OhZ7oNO2h/d50ccd3bc449eab7ae098d87aa0cd040/figure-logo.svg', ext: 'svg' },
  { id: 'agility-robotics', url: 'https://cdn.prod.website-files.com/672aa4455c7532b497ba15be/677dd3aee2e9a7546b918fac_Agility-Logo-Web.png', ext: 'png' },
  { id: 'apptronik', url: 'https://cdn.prod.website-files.com/646de3abb3e62d339f089e28/6495871ad34ea0dba200a60b_apptronik%20logo.svg', ext: 'svg' },
  { id: 'sanctuary-ai', url: 'https://images.squarespace-cdn.com/content/v1/66e8617ff9cbf43e43b040ef/1726505382295-VVRYERU8RXQSMUHYK52E/Black_Full_Logo.png', ext: 'png' },
  { id: '1x-technologies', url: 'https://1x.tech/icons/1xLogo.svg', ext: 'svg' },
  { id: 'fourier-intelligence', url: 'https://www.fftai.com/uploads/upload/images/20240925/bc7acc9542b5ac29b644dc6814b29622.png', ext: 'png' },

  // Tier 2
  { id: 'pal-robotics', url: 'https://pal-robotics.com/wp-content/uploads/2024/02/siganture_no-margins.png', ext: 'png' },
  { id: 'engineered-arts', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Engineered_Arts_Logo.svg', ext: 'svg' },
  { id: 'hanson-robotics', url: 'https://www.hansonrobotics.com/wp-content/uploads/2018/11/hansonrobotics_reg.png', ext: 'png' },
  { id: 'sony', url: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg', ext: 'svg' },
  { id: 'xiaomi', url: 'https://i01.appmifile.com/webfile/globalimg/logo/pwa-mi/72x72.png', ext: 'png' },
  { id: 'honda', url: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Honda.svg', ext: 'svg' },
  { id: 'hyundai', url: 'https://www.hyundai.com/apps/settings/wcm/designs/hyundai/au/en/images/brand/hyundai-logo-sm.svg', ext: 'svg' },
  { id: 'softbank-robotics', url: 'https://www.softbankrobotics.com/wp-content/uploads/asset/img/common/logo.svg', ext: 'svg' },
  { id: 'petoi', url: 'https://www.petoi.com/cdn/shop/t/171/assets/header-logo.svg?v=20771769726585922281745575553', ext: 'svg' },
  { id: 'limx-dynamics', url: 'https://cdn.limxdynamics.com/uploads/Logo_1_7d74a09428.png', ext: 'png' },

  // Tier 3
  { id: 'neura-robotics', url: 'https://neura-robotics.com/wp-content/uploads/2025/05/neura_logo_white.svg', ext: 'svg' },
  { id: 'enchanted-tools', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Enchanted_Tools_Logo.svg', ext: 'svg' },
  { id: 'gitai', url: 'https://gitai.tech/wp-content/uploads/2024/08/gitai-logo.png', ext: 'png' },
  { id: 'elephant-robotics', url: 'https://static.elephantrobotics.com/wp-content/uploads/2022/06/cropped-大象logo-1.png', ext: 'png' },
  { id: 'mangdang', url: 'https://mangdang.store/cdn/shop/files/308ec23709872bfbfd2a2b975b121008_65cb8da9-882e-4198-b33d-22e4c0978068_140x.jpg', ext: 'jpg' },
  { id: 'clearpath-robotics', url: 'https://s3.amazonaws.com/assets.clearpathrobotics.com/wp-content/uploads/2023/10/02153627/RA-Clearpath-white-e1696281832920.png', ext: 'png' },
  { id: 'agile-robotics', url: 'https://www.agilerobotics.com/templates/agile2022/images/designer/0823d5b9b9631967e2a274438f4ae278_AgileRoboticSystemsLogoReverse.svg', ext: 'svg' },
  { id: 'qkm-technology', url: 'https://www.qkmtech.com/upload/images/site/20221105/16676404633570471.png', ext: 'png' },

  // Tier 4
  { id: 'toyota-research', url: 'https://www.tri.global/themes/custom/tri_global/logo.svg', ext: 'svg' },
  { id: 'stanford-robotics', url: 'https://stanfordstudentrobotics.org/robologonew.png', ext: 'png' },
  { id: 'mit-biomimetic', url: 'https://biomimetics.mit.edu/static/lab_logo-832710d257a040145ff0137f2eb0b031.png', ext: 'png' },
  { id: 'nvidia', url: 'https://www.nvidia.com/content/dam/en-zz/Solutions/about-nvidia/nvidia-brochure/images/nvidia-logo-black.svg', ext: 'svg' },
  { id: 'omron', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/OMRON_Logo.svg', ext: 'svg' },
  { id: 'kawasaki', url: 'https://www.logo.wine/a/logo/Kawasaki_Heavy_Industries/Kawasaki_Heavy_Industries-Logo.wine.svg', ext: 'svg' },
  { id: 'siasun', url: 'https://www.siasun.com/uploads/20230215/2b5ad19204c1fb297d0ce380b858dbd3.png', ext: 'png' },
  { id: 'fjdynamics', url: 'https://www.fjdynamics.com/web/image/134770-1564f3c7/FJDynamics-logo.jpg', ext: 'jpg' },
  { id: 'hebi-robotics', url: 'https://images.squarespace-cdn.com/content/v1/60c1285cfc2bbe32af4c9c81/1624640760917-6X3TVFCWM8JLWXG59HXW/Hebi-Logo.png', ext: 'png' }
];

function downloadLogo(logoInfo) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(logoInfo.url);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;
    const filename = `${logoInfo.id}-logo.${logoInfo.ext}`;
    const filepath = path.join(brandsDir, filename);

    console.log(`Downloading ${logoInfo.id}...`);

    protocol.get(logoInfo.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
        const redirectUrl = response.headers.location;
        console.log(`  Redirecting to ${redirectUrl}`);
        downloadLogo({ ...logoInfo, url: redirectUrl }).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        console.error(`  Failed: ${response.statusCode}`);
        reject(new Error(`Failed to download ${logoInfo.id}: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`  ✓ Saved: ${filename}`);
        resolve({ id: logoInfo.id, filename, success: true });
      });

      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => {});
        console.error(`  Error saving ${logoInfo.id}:`, err.message);
        reject(err);
      });
    }).on('error', (err) => {
      console.error(`  Network error for ${logoInfo.id}:`, err.message);
      reject(err);
    });
  });
}

async function downloadAll() {
  console.log(`Starting download of ${logos.length} logos...\n`);

  const results = [];
  for (const logo of logos) {
    try {
      const result = await downloadLogo(logo);
      results.push(result);
      // Small delay to avoid overwhelming servers
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      results.push({ id: logo.id, success: false, error: error.message });
    }
  }

  console.log('\n=== Download Summary ===');
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`\nSuccessful: ${successful.length}/${logos.length}`);
  if (successful.length > 0) {
    successful.forEach(r => console.log(`  ✓ ${r.id}`));
  }

  if (failed.length > 0) {
    console.log(`\nFailed: ${failed.length}`);
    failed.forEach(r => console.log(`  ✗ ${r.id}: ${r.error}`));
  }

  // Save results to JSON for updating brands.json
  const resultsPath = path.join(__dirname, 'logo-download-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`\nResults saved to: ${resultsPath}`);
}

downloadAll().catch(console.error);
