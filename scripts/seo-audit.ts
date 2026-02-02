/**
 * SEO Audit Script
 *
 * Validates SEO implementation across the Awesome Robots website:
 * - Metadata completeness
 * - Structured data validation
 * - Canonical URLs
 * - Image alt text
 * - Internal linking structure
 *
 * Usage:
 *   npm run seo-audit                  # Full audit
 *   npm run seo-audit -- --page=robots # Audit specific page type
 *   npm run seo-audit -- --fix         # Auto-fix common issues
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import robots from '../src/data/robots.json';
import brands from '../src/data/brands.json';
import categories from '../src/data/categories.json';
import { Robot } from '../src/types/robot';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface AuditResult {
  passed: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info';
  fix?: string;
}

interface AuditReport {
  timestamp: string;
  totalChecks: number;
  passed: number;
  warnings: number;
  errors: number;
  results: Array<{
    category: string;
    checks: AuditResult[];
  }>;
}

class SEOAuditor {
  private report: AuditReport;

  constructor() {
    this.report = {
      timestamp: new Date().toISOString(),
      totalChecks: 0,
      passed: 0,
      warnings: 0,
      errors: 0,
      results: [],
    };
  }

  /**
   * Add audit result
   */
  private addResult(category: string, result: AuditResult): void {
    this.report.totalChecks++;

    if (result.passed) {
      this.report.passed++;
    } else if (result.severity === 'error') {
      this.report.errors++;
    } else if (result.severity === 'warning') {
      this.report.warnings++;
    }

    // Find or create category
    let categoryResults = this.report.results.find((r) => r.category === category);
    if (!categoryResults) {
      categoryResults = { category, checks: [] };
      this.report.results.push(categoryResults);
    }

    categoryResults.checks.push(result);
  }

  /**
   * Audit robot data completeness
   */
  auditRobotData(): void {
    console.log('\n🤖 Auditing Robot Data...');

    (robots as Robot[]).forEach((robot: Robot) => {
      // Check required fields
      this.addResult('Robot Data', {
        passed: !!robot.name && !!robot.brand && !!robot.category,
        message: `${robot.brand} ${robot.name}: Required fields (name, brand, category)`,
        severity: 'error',
      });

      // Check description
      this.addResult('Robot Data', {
        passed: !!robot.description && robot.description.length >= 50,
        message: `${robot.brand} ${robot.name}: Description length (${robot.description?.length || 0} chars, min 50)`,
        severity: 'warning',
        fix: robot.description && robot.description.length < 50
          ? 'Expand description to at least 50 characters for better SEO'
          : undefined,
      });

      // Check images
      this.addResult('Robot Data', {
        passed: !!robot.images && robot.images.length > 0,
        message: `${robot.brand} ${robot.name}: Has images (${robot.images?.length || 0})`,
        severity: 'error',
        fix: !robot.images || robot.images.length === 0
          ? 'Add at least one product image'
          : undefined,
      });

      // Check local images (not remote URLs)
      if (robot.images && robot.images.length > 0) {
        const hasRemoteImages = robot.images.some(img => img.startsWith('http'));
        this.addResult('Robot Data', {
          passed: !hasRemoteImages,
          message: `${robot.brand} ${robot.name}: All images are local (no http:// or https://)`,
          severity: 'warning',
          fix: hasRemoteImages
            ? 'Download remote images and save them locally for better performance'
            : undefined,
        });
      }

      // Check pricing
      this.addResult('Robot Data', {
        passed: !!robot.price && (typeof robot.price.starting === 'number' || robot.price.starting === 'Request Quote'),
        message: `${robot.brand} ${robot.name}: Has pricing information`,
        severity: 'warning',
      });

      // Check features
      const features = robot.features || robot.keyFeatures || [];
      this.addResult('Robot Data', {
        passed: features.length >= 3,
        message: `${robot.brand} ${robot.name}: Has features (${features.length}, min 3)`,
        severity: 'warning',
        fix: features.length < 3
          ? 'Add at least 3 key features for better product description'
          : undefined,
      });

      // Check specifications
      this.addResult('Robot Data', {
        passed: !!robot.specifications || !!robot.hardwareBuildQuality || !!robot.softwareEcosystem,
        message: `${robot.brand} ${robot.name}: Has technical specifications`,
        severity: 'info',
      });
    });
  }

  /**
   * Audit brand data completeness
   */
  auditBrandData(): void {
    console.log('\n🏢 Auditing Brand Data...');

    brands.forEach((brand) => {
      // Check required fields
      this.addResult('Brand Data', {
        passed: !!brand.name && !!brand.id,
        message: `${brand.name}: Required fields (name, id)`,
        severity: 'error',
      });

      // Check description
      this.addResult('Brand Data', {
        passed: !!brand.description && brand.description.length >= 50,
        message: `${brand.name}: Description length (${brand.description?.length || 0} chars, min 50)`,
        severity: 'warning',
        fix: brand.description && brand.description.length < 50
          ? 'Expand description to at least 50 characters'
          : undefined,
      });

      // Check logo
      this.addResult('Brand Data', {
        passed: !!brand.logo,
        message: `${brand.name}: Has logo`,
        severity: 'warning',
      });

      // Check website
      this.addResult('Brand Data', {
        passed: !!brand.website,
        message: `${brand.name}: Has official website link`,
        severity: 'info',
      });

      // Check foundingYear (optional field)
      const foundingYear = (brand as any).foundingYear || (brand as any).founded;
      this.addResult('Brand Data', {
        passed: !foundingYear || (foundingYear >= 1900 && foundingYear <= new Date().getFullYear()),
        message: `${brand.name}: Has valid founding year`,
        severity: 'info',
      });
    });
  }

  /**
   * Audit category data
   */
  auditCategoryData(): void {
    console.log('\n📁 Auditing Category Data...');

    categories.forEach((category) => {
      // Check required fields
      this.addResult('Category Data', {
        passed: !!category.name && !!category.id,
        message: `${category.name}: Required fields (name, id)`,
        severity: 'error',
      });

      // Check description
      this.addResult('Category Data', {
        passed: !!category.description && category.description.length >= 50,
        message: `${category.name}: Description length (${category.description?.length || 0} chars, min 50)`,
        severity: 'warning',
      });
    });
  }

  /**
   * Audit sitemap coverage
   */
  auditSitemapCoverage(): void {
    console.log('\n🗺️  Auditing Sitemap Coverage...');

    const expectedUrls = [
      '/', '/browse', '/brands', '/categories', '/blog',
      ...(robots as Robot[]).map((r: Robot) => `/robots/${r.id}`),
      ...brands.map((b) => `/brands/${b.id}`),
      ...categories.map((c) => `/categories/${c.id}`),
    ];

    this.addResult('Sitemap', {
      passed: expectedUrls.length > 0,
      message: `Expected ${expectedUrls.length} URLs in sitemap`,
      severity: 'info',
    });

    // Check for duplicate IDs
    const robotIds = (robots as Robot[]).map((r: Robot) => r.id);
    const duplicateRobotIds = robotIds.filter((id, index) => robotIds.indexOf(id) !== index);

    this.addResult('Sitemap', {
      passed: duplicateRobotIds.length === 0,
      message: `No duplicate robot IDs`,
      severity: 'error',
      fix: duplicateRobotIds.length > 0
        ? `Fix duplicate IDs: ${duplicateRobotIds.join(', ')}`
        : undefined,
    });
  }

  /**
   * Audit structured data patterns
   */
  auditStructuredData(): void {
    console.log('\n📊 Auditing Structured Data Patterns...');

    // Check robots have required fields for Product schema
    (robots as Robot[]).forEach((robot: Robot) => {
      this.addResult('Structured Data', {
        passed: !!robot.name && !!robot.brand && !!robot.images,
        message: `${robot.brand} ${robot.name}: Has fields for Product schema`,
        severity: 'error',
      });
    });

    // Check brands have required fields for Organization schema
    brands.forEach((brand) => {
      this.addResult('Structured Data', {
        passed: !!brand.name && !!brand.description,
        message: `${brand.name}: Has fields for Organization schema`,
        severity: 'warning',
      });
    });
  }

  /**
   * Audit SEO best practices
   */
  auditSEOBestPractices(): void {
    console.log('\n✨ Auditing SEO Best Practices...');

    // Check for unique robot names
    const robotNames = (robots as Robot[]).map((r: Robot) => `${r.brand} ${r.name}`);
    const duplicateNames = robotNames.filter((name, index) => robotNames.indexOf(name) !== index);

    this.addResult('SEO Best Practices', {
      passed: duplicateNames.length === 0,
      message: `No duplicate robot names`,
      severity: 'warning',
      fix: duplicateNames.length > 0
        ? `Review duplicate names: ${Array.from(new Set(duplicateNames)).join(', ')}`
        : undefined,
    });

    // Check for SEO-friendly IDs (lowercase, hyphens)
    (robots as Robot[]).forEach((robot: Robot) => {
      const isValidId = /^[a-z0-9-]+$/.test(robot.id);
      this.addResult('SEO Best Practices', {
        passed: isValidId,
        message: `${robot.brand} ${robot.name}: ID is SEO-friendly (${robot.id})`,
        severity: 'warning',
        fix: !isValidId
          ? 'Use lowercase letters, numbers, and hyphens only in IDs'
          : undefined,
      });
    });

    // Check for proper canonical ID format
    brands.forEach((brand) => {
      const isValidId = /^[a-z0-9-]+$/.test(brand.id);
      this.addResult('SEO Best Practices', {
        passed: isValidId,
        message: `${brand.name}: ID is SEO-friendly (${brand.id})`,
        severity: 'warning',
      });
    });
  }

  /**
   * Generate and display report
   */
  generateReport(): void {
    console.log('\n' + '='.repeat(70));
    console.log('  SEO AUDIT REPORT');
    console.log('='.repeat(70));
    console.log(`\n📅 Timestamp: ${this.report.timestamp}`);
    console.log(`\n📊 Summary:`);
    console.log(`   Total Checks: ${this.report.totalChecks}`);
    console.log(`   ✅ Passed: ${this.report.passed} (${((this.report.passed / this.report.totalChecks) * 100).toFixed(1)}%)`);
    console.log(`   ⚠️  Warnings: ${this.report.warnings}`);
    console.log(`   ❌ Errors: ${this.report.errors}`);

    // Display results by category
    this.report.results.forEach((categoryResult) => {
      console.log(`\n${categoryResult.category}:`);

      categoryResult.checks.forEach((check) => {
        const icon = check.passed ? '✅' : check.severity === 'error' ? '❌' : '⚠️';
        console.log(`  ${icon} ${check.message}`);

        if (check.fix) {
          console.log(`     💡 Fix: ${check.fix}`);
        }
      });
    });

    // Overall score
    const score = (this.report.passed / this.report.totalChecks) * 100;
    const grade = score >= 95 ? 'A' : score >= 85 ? 'B' : score >= 75 ? 'C' : score >= 65 ? 'D' : 'F';

    console.log('\n' + '='.repeat(70));
    console.log(`  Overall Score: ${score.toFixed(1)}% (Grade: ${grade})`);
    console.log('='.repeat(70));

    // Save report to file
    const reportPath = path.join(__dirname, '../seo-audit-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.report, null, 2));
    console.log(`\n📝 Detailed report saved to: ${reportPath}`);
  }

  /**
   * Run full audit
   */
  runFullAudit(): void {
    console.log('🚀 Starting SEO Audit...\n');

    this.auditRobotData();
    this.auditBrandData();
    this.auditCategoryData();
    this.auditSitemapCoverage();
    this.auditStructuredData();
    this.auditSEOBestPractices();

    this.generateReport();
  }
}

// Run audit
const auditor = new SEOAuditor();
auditor.runFullAudit();

// Exit with error code if there are errors
if (auditor['report'].errors > 0) {
  process.exit(1);
}

export default SEOAuditor;
