# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **awesome-robots** project - a catalog website for AI-powered robots including humanoids, quadrupeds, and accessories. The project is designed to be a static site without a custom backend, using client-side functionality for filtering, sorting, and search.

Key characteristics:
- Static site generation approach (no backend required)
- Quotation-based sales model (no direct sales or inventory), quote form (button) for each robot.
- Focus on educational content and comprehensive product information
- Target audience: researchers, educators, hobbyists, tech enthusiasts

## Project Architecture

**Current Status**: This appears to be a new project in early planning stages with only requirements documentation.

**Key Requirements from req.txt**:
- Product catalog organized by categories (Humanoids, Quadrupeds, Accessories, Others) and brands
- Client-side filtering and sorting functionality
- Detailed product pages (PDPs) with specs, images, pricing
- Educational blog section with tutorials and buying guides
- Search functionality implemented client-side
- Competitive reference: https://robostore.com/

**Expected Technical Approach**:
- Static site framework (likely React, Vue, or vanilla HTML/CSS/JS)
- Product data stored in JSON/JavaScript objects for client-side processing
- No server-side processing required
- SEO-optimized content structure for organic traffic

**Data Source**:
- Each robot brand is their official website, like https://www.unitree.com/
- Robot company like https://www.unitree.com/
- Robot Detail info like https://www.unitree.com/go2
- Unitree robots are humanoid and quadrupeds listed from the official websites.
- let's build a static website scatch from Unitree robots data
- and then we can have more robots (and brands) later through adding new official websites.

## Development Commands

**Note**: No build system or package.json detected yet. When implementing:
- Set up appropriate static site generator commands
- Configure linting and formatting tools
- Implement testing for client-side filtering/search functionality

## Content Strategy

The site focuses on:
1. **Product Listings**: Comprehensive robot catalog with rich filtering
2. **Educational Content**: Tutorials, news, buying guides, case studies
3. **Quotation Integration**: Natural product quotation within educational content
4. **User Experience**: Intuitive navigation and product discovery

## Key Implementation Considerations

- All filtering/sorting must work client-side without server calls
- Rich media support (images, videos) for product demonstrations
- Cross-linking between products and accessories
- SEO optimization for organic traffic acquisition
- Mobile-responsive design for diverse user base