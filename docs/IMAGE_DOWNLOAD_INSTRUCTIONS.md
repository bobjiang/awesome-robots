# Robot Image Download Instructions

## Current Status

I've researched official image sources for all 13 newly added robots. However, most companies don't provide direct download links for press images without media credentials.

## Recommended Approach

### Option 1: Contact Companies for Press Materials (Best Quality)

Contact each company's PR department to request official press kit images:

1. **Tesla Optimus** - media@tesla.com
2. **Figure AI** - Check figure.ai for press contact
3. **Agility Robotics** - press@agilityrobotics.com
4. **Apptronik** - media@apptronik.com
5. **Sanctuary AI** - Check sanctuary.ai for press contact
6. **1X Technologies** - Check 1x.tech for press contact
7. **Fourier Intelligence** - Check fftai.com for contact info
8. **PAL Robotics** - info@pal-robotics.com
9. **Engineered Arts** - info@engineeredarts.co.uk
10. **Hanson Robotics** - Check hansonrobotics.com
11. **Sony Aibo** - Sony press center

### Option 2: Use Wikimedia Commons (Free, Legal)

Search Wikimedia Commons for Creative Commons licensed images:
- https://commons.wikimedia.org/wiki/Category:Robots
- Search for each robot name individually

### Option 3: Screenshot Official Websites (Temporary)

For immediate development:
1. Visit each official website
2. Take high-quality screenshots of robot images
3. Use as placeholders until official press images obtained
4. Credit the source appropriately

### Option 4: Use Stock Photo Services (Paid)

Services like Getty Images, Shutterstock have robot images:
- Sophia robot: 683 images on Getty Images
- Other robots may be available

## Quick Implementation Script

I can create a script that:
1. Downloads any available Wikimedia Commons images
2. Creates placeholder images with robot names
3. Sets up the correct file structure

Would you like me to:
A) Create placeholder images for now?
B) Download available Wikimedia Commons images?
C) Create a script to help you batch download after obtaining images?
D) All of the above?

## Image Naming Convention

Once you have images, use this naming:
- `tesla-optimus-gen3.webp`
- `figure-02.webp`
- `figure-03.webp`
- `agility-digit.webp`
- `apptronik-apollo.webp`
- `sanctuary-phoenix.webp`
- `1x-neo-gamma.webp`
- `fourier-gr1.webp`
- `fourier-gr2.webp`
- `pal-talos.webp`
- `engineered-arts-ameca.webp`
- `hanson-sophia.webp`
- `sony-aibo-ers1000.webp`

Save to: `/public/images/robots/`

## Legal Considerations

- ✅ Official press kit images - Free to use with attribution
- ✅ Wikimedia Commons (CC licenses) - Free with attribution
- ✅ Company website screenshots - Fair use for informational purposes
- ❌ Getty/Shutterstock without license - Requires purchase
- ⚠️ Social media images - Check terms of service

## Alternative: Placeholder Images

For now, the website will work without images (Next.js handles missing images gracefully). You can add proper images later when obtained from official sources.
