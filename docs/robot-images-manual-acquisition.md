# Robot Images - Manual Acquisition Guide

## Overview
This document provides instructions for manually acquiring official high-resolution images for the 13 newly added robots. Most official images are protected by copyright and require manual download from press kits or direct contact with manufacturers.

## Successfully Downloaded (2/13)
✅ **Figure-02** - Downloaded from BMW Press Center
✅ **Sony Aibo ERS-1000** - Downloaded from Sony official site

## Images Requiring Manual Acquisition (11/13)

### 1. Tesla Optimus Gen 3
**Official Source**: https://www.tesla.com/tesla-gallery
**Alternative**: Tesla Press Kit (requires press registration)
**Image Type**: Product photos, factory deployment
**Format Needed**: High-res JPG/PNG (convert to WebP)
**File**: `public/images/robots/tesla-optimus-gen3.webp`

### 2. Figure 03
**Official Source**: https://www.figure.ai/ (News/Press section)
**Alternative**: Figure AI Press Kit
**Image Type**: Product render, home environment
**Format Needed**: High-res JPG/PNG
**File**: `public/images/robots/figure-03.webp`

### 3. Agility Robotics Digit
**Official Source**: https://www.agilityrobotics.com/ (Media/Press)
**Alternative**: Amazon fulfillment center press photos
**Image Type**: Warehouse deployment, product shots
**Format Needed**: High-res JPG/PNG
**File**: `public/images/robots/agility-digit.webp`

### 4. Apptronik Apollo
**Official Source**: https://apptronik.com/apollo
**Alternative**: Mercedes-Benz press release images
**Image Type**: Product photos, factory testing
**Format Needed**: High-res JPG/PNG
**File**: `public/images/robots/apptronik-apollo.webp`

### 5. Sanctuary AI Phoenix
**Official Source**: https://www.sanctuary.ai/ (Resources/News)
**Alternative**: Contact Sanctuary AI press team
**Image Type**: Product photos (NOT renders - they label all as "not a render")
**Format Needed**: High-res JPG/PNG
**File**: `public/images/robots/sanctuary-phoenix.webp`

### 6. 1X Technologies NEO Gamma
**Official Source**: https://www.1x.tech/neo
**Alternative**: 1X Technologies press announcements
**Image Type**: Home environment photos, product shots
**Format Needed**: High-res JPG/PNG
**File**: `public/images/robots/1x-neo-gamma.webp`

### 7. Fourier Intelligence GR-1
**Official Source**: https://fftai.com/products-gr1
**Alternative**: Contact Fourier Intelligence
**Image Type**: Hospital deployment, product photos
**Format Needed**: High-res JPG/PNG
**File**: `public/images/robots/fourier-gr1.webp`

### 8. Fourier Intelligence GR-2
**Official Source**: https://www.fftai.com/ (Products section)
**Alternative**: SAIC-GM press release images
**Image Type**: Automotive factory deployment
**Format Needed**: High-res JPG/PNG
**File**: `public/images/robots/fourier-gr2.webp`

### 9. PAL Robotics TALOS
**Official Source**: https://pal-robotics.com/robot/talos/
**Alternative**: Contact PAL Robotics for press kit
**Image Type**: Research lab photos, technical shots
**Format Needed**: High-res JPG/PNG
**File**: `public/images/robots/pal-talos.webp`

### 10. Engineered Arts Ameca
**Official Source**: https://engineeredarts.com/robot/ameca/
**Alternative**: Engineered Arts press materials
**Image Type**: Facial expression demos, exhibition photos
**Format Needed**: High-res JPG/PNG
**File**: `public/images/robots/engineered-arts-ameca.webp`

### 11. Hanson Robotics Sophia
**Official Source**: https://www.hansonrobotics.com/sophia/
**Press Kit**: https://www.hansonrobotics.com/?jet_download=75090
**Alternative**: Instagram @realsophiarobot
**Image Type**: Official portraits, event photos
**Format Needed**: High-res JPG/PNG
**File**: `public/images/robots/hanson-sophia.webp`

## Acquisition Process

### Step 1: Contact Press Teams
Most companies have press/media contact emails on their websites. Request:
- High-resolution product images
- Usage rights for educational/commercial website
- Preferred attribution format

### Step 2: Press Kit Downloads
Some companies offer downloadable press kits:
- **Hanson Robotics**: Direct download link available
- **BMW** (for Figure-02): Press center registration
- Others may require email request

### Step 3: Alternative Sources
If direct acquisition fails:
- **WikiMedia Commons**: Check for CC-licensed images
- **Official social media**: Instagram, Twitter, LinkedIn (request permission)
- **News articles**: Contact publications for image rights

### Step 4: Image Processing
Once acquired:
```bash
# Convert to WebP format
cwebp input.jpg -q 85 -o output.webp

# Or use ImageMagick
convert input.jpg -quality 85 output.webp
```

### Step 5: Attribution
Add image credits in a new file: `public/images/robots/CREDITS.md`

## Placeholder Images (Temporary)
Currently using:
- Figure-02: ✅ Official BMW press photo
- Sony Aibo: ✅ Official Sony product image
- Others: Missing (will show broken image or fallback)

## Image Specifications
- **Format**: WebP (preferred) or high-quality JPG
- **Minimum Resolution**: 1200x800px
- **Aspect Ratio**: 3:2 or 4:3 preferred
- **File Size**: < 500KB after WebP compression
- **Background**: Clean, preferably white or neutral

## Copyright Considerations
⚠️ **Important**: All images must be:
1. Licensed for commercial use OR
2. Used with explicit permission from copyright holder OR
3. Falls under fair use (news/educational purposes)

Document all image sources and permissions in `CREDITS.md`.

## Contact Information for Press Teams

### Quick Reference
- **Tesla**: press@tesla.com
- **Figure AI**: Check figure.ai for contact
- **Agility Robotics**: Check agilityrobotics.com/contact
- **Apptronik**: info@apptronik.com
- **Sanctuary AI**: Check sanctuary.ai for media contact
- **1X Technologies**: Check 1x.tech for contact
- **Fourier Intelligence**: Check fftai.com for contact
- **PAL Robotics**: info@pal-robotics.com
- **Engineered Arts**: Check engineeredarts.com/contact
- **Hanson Robotics**: Check hansonrobotics.com/contact
- **Sony**: Sony corporate communications

## Next Steps
1. Prioritize robots with existing press kits (Sophia, Tesla)
2. Contact companies with active deployments (Figure, Digit, Apollo)
3. Use social media for companies with strong presence
4. Consider hiring stock photography as last resort
5. Update robots.json with new image paths as acquired
