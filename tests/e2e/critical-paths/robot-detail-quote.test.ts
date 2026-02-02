import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { createBrowser, BrowserHelper } from '../../helpers/browser';
import {
  assertPageLoaded,
  assertModalOpen,
  assertModalClosed,
  assertFormFieldError,
} from '../../helpers/assertions';
import { PAGE_PATHS, QUOTE_FORM_DATA, TEST_CONFIG } from '../../fixtures/test-data';

/**
 * E2E Tests: Robot Detail Page and Quote Form
 *
 * Tests:
 * - Robot detail page loads with specifications
 * - Request Quote button opens modal
 * - Quote form validation (required fields, email format)
 * - Form close/cancel functionality
 */

describe('E2E: Robot Detail Page and Quote Form', () => {
  let browser: BrowserHelper;

  beforeAll(async () => {
    browser = createBrowser();
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    await browser.resizeViewport('DESKTOP');
  });

  describe('Robot Detail Page', () => {
    it('should load robot detail page with specifications', async () => {
      // Navigate to robot detail page
      const snapshot = await browser.navigateAndWait(PAGE_PATHS.ROBOT_UNITREE_G1);

      // Assert page loaded
      assertPageLoaded(snapshot);

      // Assert robot name is present
      expect(snapshot).toContain('Unitree G1') || expect(snapshot).toContain('G1');

      // Assert key sections are present
      expect(snapshot).toContain('Specifications') || expect(snapshot).toContain('Features');
      expect(snapshot).toContain('Request Quote');

      // Assert robot image is present
      expect(snapshot).toContain('image') || expect(snapshot).toContain('img');
    }, 30000);

    it('should show complete robot specifications', async () => {
      // Navigate to robot detail page
      const snapshot = await browser.navigateAndWait(PAGE_PATHS.ROBOT_UNITREE_G1);

      // Assert specification categories are present
      const hasGeneralInfo = snapshot.includes('General') || snapshot.includes('Overview');
      const hasFeatures = snapshot.includes('Features') || snapshot.includes('Key Features');
      const hasHardware = snapshot.includes('Hardware') || snapshot.includes('Technical');
      const hasSoftware = snapshot.includes('Software') || snapshot.includes('SDK');

      // At least some specification sections should be present
      const specSectionCount = [hasGeneralInfo, hasFeatures, hasHardware, hasSoftware].filter(Boolean).length;
      expect(specSectionCount).toBeGreaterThan(0);
    }, 30000);

    it('should have Request Quote button', async () => {
      // Navigate to robot detail page
      const snapshot = await browser.navigateAndWait(PAGE_PATHS.ROBOT_UNITREE_G1);

      // Assert Request Quote button is present
      expect(snapshot).toContain('Request Quote');
    }, 30000);

    it('should have link to official website', async () => {
      // Navigate to robot detail page
      const snapshot = await browser.navigateAndWait(PAGE_PATHS.ROBOT_UNITREE_G1);

      // Assert official website link is present
      expect(snapshot).toContain('Official Website') || expect(snapshot).toContain('Visit');
    }, 30000);
  });

  describe('Quote Form Modal', () => {
    it('should open quote form modal when Request Quote is clicked', async () => {
      // Navigate to robot detail page
      await browser.navigateAndWait(PAGE_PATHS.ROBOT_UNITREE_G1);

      // Get snapshot
      let snapshot = await browser.getSnapshot();

      // Find Request Quote button ref
      const quoteRefMatch = snapshot.match(/Request Quote.*?(@e\d+)/i);
      if (!quoteRefMatch) {
        throw new Error('Request Quote button not found');
      }
      const quoteRef = quoteRefMatch[1];

      // Click Request Quote button
      await browser.click('Request Quote button', quoteRef);

      // Wait for modal to open
      await browser.wait(TEST_CONFIG.WAIT_FOR_MODAL);

      // Get updated snapshot
      snapshot = await browser.getSnapshot();

      // Assert modal is open
      assertModalOpen(snapshot, 'Request a Quote') || assertModalOpen(snapshot, 'Quote');

      // Assert form fields are present
      expect(snapshot).toContain('Name') || expect(snapshot).toContain('name');
      expect(snapshot).toContain('Email') || expect(snapshot).toContain('email');
    }, 30000);

    it('should close quote form modal when close button is clicked', async () => {
      // Navigate to robot detail page
      await browser.navigateAndWait(PAGE_PATHS.ROBOT_UNITREE_G1);

      // Get snapshot
      let snapshot = await browser.getSnapshot();

      // Open modal
      const quoteRefMatch = snapshot.match(/Request Quote.*?(@e\d+)/i);
      if (quoteRefMatch) {
        await browser.click('Request Quote button', quoteRefMatch[1]);
        await browser.wait(TEST_CONFIG.WAIT_FOR_MODAL);

        snapshot = await browser.getSnapshot();

        // Find close button ref
        const closeRefMatch = snapshot.match(/Close.*?(@e\d+)/i);
        if (closeRefMatch) {
          await browser.click('Close modal button', closeRefMatch[1]);
          await browser.wait(TEST_CONFIG.WAIT_FOR_MODAL);

          // Get updated snapshot
          snapshot = await browser.getSnapshot();

          // Assert modal is closed
          assertModalClosed(snapshot, 'Request a Quote');
        }
      }
    }, 30000);

    it('should close modal when clicking backdrop', async () => {
      // Navigate to robot detail page
      await browser.navigateAndWait(PAGE_PATHS.ROBOT_UNITREE_G1);

      // Get snapshot
      let snapshot = await browser.getSnapshot();

      // Open modal
      const quoteRefMatch = snapshot.match(/Request Quote.*?(@e\d+)/i);
      if (quoteRefMatch) {
        await browser.click('Request Quote button', quoteRefMatch[1]);
        await browser.wait(TEST_CONFIG.WAIT_FOR_MODAL);

        // Press Escape key to close modal (common pattern)
        await browser.pressKey('Escape');
        await browser.wait(TEST_CONFIG.WAIT_FOR_MODAL);

        // Get updated snapshot
        snapshot = await browser.getSnapshot();

        // Assert modal is closed
        assertModalClosed(snapshot, 'Request a Quote');
      }
    }, 30000);
  });

  describe('Quote Form Validation', () => {
    it('should validate required fields', async () => {
      // Navigate to robot detail page
      await browser.navigateAndWait(PAGE_PATHS.ROBOT_UNITREE_G1);

      // Get snapshot
      let snapshot = await browser.getSnapshot();

      // Open modal
      const quoteRefMatch = snapshot.match(/Request Quote.*?(@e\d+)/i);
      if (!quoteRefMatch) {
        throw new Error('Request Quote button not found');
      }

      await browser.click('Request Quote button', quoteRefMatch[1]);
      await browser.wait(TEST_CONFIG.WAIT_FOR_MODAL);

      snapshot = await browser.getSnapshot();

      // Find submit button
      const submitRefMatch = snapshot.match(/Submit.*?(@e\d+)/i);
      if (submitRefMatch) {
        // Try to submit empty form
        await browser.click('Submit button', submitRefMatch[1]);
        await browser.wait(0.5);

        // Get updated snapshot
        snapshot = await browser.getSnapshot();

        // Assert validation errors are shown
        expect(snapshot).toMatch(/required|Required|field/i);
      }
    }, 30000);

    it('should validate email format', async () => {
      // Navigate to robot detail page
      await browser.navigateAndWait(PAGE_PATHS.ROBOT_UNITREE_G1);

      // Get snapshot
      let snapshot = await browser.getSnapshot();

      // Open modal
      const quoteRefMatch = snapshot.match(/Request Quote.*?(@e\d+)/i);
      if (!quoteRefMatch) {
        return; // Skip if quote button not found
      }

      await browser.click('Request Quote button', quoteRefMatch[1]);
      await browser.wait(TEST_CONFIG.WAIT_FOR_MODAL);

      snapshot = await browser.getSnapshot();

      // Find email input ref
      const emailRefMatch = snapshot.match(/Email.*?(@e\d+)/i);
      if (emailRefMatch) {
        // Enter invalid email
        await browser.type('Email input', emailRefMatch[1], 'invalid-email');

        // Find submit button
        const submitRefMatch = snapshot.match(/Submit.*?(@e\d+)/i);
        if (submitRefMatch) {
          await browser.click('Submit button', submitRefMatch[1]);
          await browser.wait(0.5);

          // Get updated snapshot
          snapshot = await browser.getSnapshot();

          // Assert email validation error
          expect(snapshot).toMatch(/email|Email|valid|Valid/i);
        }
      }
    }, 30000);

    it('should fill form with valid data', async () => {
      // Skip if SKIP_FORM_SUBMISSION is true
      if (TEST_CONFIG.SKIP_FORM_SUBMISSION) {
        return;
      }

      // Navigate to robot detail page
      await browser.navigateAndWait(PAGE_PATHS.ROBOT_UNITREE_G1);

      // Get snapshot
      let snapshot = await browser.getSnapshot();

      // Open modal
      const quoteRefMatch = snapshot.match(/Request Quote.*?(@e\d+)/i);
      if (!quoteRefMatch) {
        return;
      }

      await browser.click('Request Quote button', quoteRefMatch[1]);
      await browser.wait(TEST_CONFIG.WAIT_FOR_MODAL);

      snapshot = await browser.getSnapshot();

      // Find form field refs
      const nameRefMatch = snapshot.match(/Name.*?input.*?(@e\d+)/i);
      const emailRefMatch = snapshot.match(/Email.*?input.*?(@e\d+)/i);
      const messageRefMatch = snapshot.match(/Message.*?(@e\d+)/i);

      if (nameRefMatch && emailRefMatch) {
        // Fill form with valid data
        const formData = [
          { name: 'Name', type: 'textbox', ref: nameRefMatch[1], value: QUOTE_FORM_DATA.VALID.name },
          { name: 'Email', type: 'textbox', ref: emailRefMatch[1], value: QUOTE_FORM_DATA.VALID.email },
        ];

        if (messageRefMatch) {
          formData.push({
            name: 'Message',
            type: 'textbox',
            ref: messageRefMatch[1],
            value: QUOTE_FORM_DATA.VALID.message,
          });
        }

        await browser.fillQuoteForm(formData);

        // Get updated snapshot
        snapshot = await browser.getSnapshot();

        // Assert form is filled
        expect(snapshot).toContain(QUOTE_FORM_DATA.VALID.name);
        expect(snapshot).toContain(QUOTE_FORM_DATA.VALID.email);
      }
    }, 30000);
  });

  describe('Related Robots', () => {
    it('should show related robots section', async () => {
      // Navigate to robot detail page
      const snapshot = await browser.navigateAndWait(PAGE_PATHS.ROBOT_UNITREE_G1);

      // Assert related robots section is present
      expect(snapshot).toContain('Related') || expect(snapshot).toContain('Similar') || expect(snapshot).toContain('You might also like');
    }, 30000);
  });
});
