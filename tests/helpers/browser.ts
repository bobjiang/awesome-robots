import { BASE_URL, VIEWPORTS, TEST_CONFIG } from '../setup';

/**
 * Browser helper class that wraps MCP Playwright tools
 * Provides high-level methods for common E2E test interactions
 */
export class BrowserHelper {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Navigate to a path and wait for page load
   */
  async navigateAndWait(path: string, waitForText?: string): Promise<string> {
    const url = path.startsWith('http') ? path : `${this.baseUrl}${path}`;

    await (global as any).mcp.playwright.browser_navigate({ url });

    if (waitForText) {
      await (global as any).mcp.playwright.browser_wait_for({ text: waitForText });
    } else {
      // Default wait for page to stabilize
      await this.wait(TEST_CONFIG.WAIT_FOR_NAVIGATION);
    }

    return this.getSnapshot();
  }

  /**
   * Get accessibility snapshot of current page
   */
  async getSnapshot(filename?: string): Promise<string> {
    const result = await (global as any).mcp.playwright.browser_snapshot({
      ...(filename && { filename }),
    });
    return result.content || result;
  }

  /**
   * Search for robots using the search bar
   * @param query - Search query
   * @param searchRef - Element ref for search input (from snapshot)
   * @param slowly - Type slowly to trigger onChange handlers
   */
  async searchRobots(query: string, searchRef: string, slowly: boolean = true): Promise<void> {
    await (global as any).mcp.playwright.browser_type({
      element: 'Search robots textbox',
      ref: searchRef,
      text: query,
      slowly,
    });

    // Wait for client-side filtering
    await this.wait(TEST_CONFIG.WAIT_FOR_SEARCH);
  }

  /**
   * Clear search input
   */
  async clearSearch(searchRef: string): Promise<void> {
    // Select all and delete
    await (global as any).mcp.playwright.browser_click({
      element: 'Search robots textbox',
      ref: searchRef,
    });

    // Select all (Ctrl+A or Cmd+A)
    await (global as any).mcp.playwright.browser_press_key({ key: 'Meta+a' });
    await (global as any).mcp.playwright.browser_press_key({ key: 'Backspace' });

    // Wait for results to update
    await this.wait(TEST_CONFIG.WAIT_FOR_SEARCH);
  }

  /**
   * Apply a filter by clicking a checkbox
   * @param name - Human-readable filter name
   * @param ref - Element ref from snapshot
   */
  async applyFilter(name: string, ref: string): Promise<void> {
    await (global as any).mcp.playwright.browser_click({
      element: `${name} checkbox`,
      ref,
    });

    // Wait for client-side filtering
    await this.wait(TEST_CONFIG.WAIT_FOR_FILTER);
  }

  /**
   * Select a sort option from dropdown
   * @param option - Sort option text
   * @param ref - Element ref for select element
   */
  async selectSort(option: string, ref: string): Promise<void> {
    await (global as any).mcp.playwright.browser_select_option({
      element: 'Sort by dropdown',
      ref,
      values: [option],
    });

    // Wait for client-side sorting
    await this.wait(TEST_CONFIG.WAIT_FOR_SORT);
  }

  /**
   * Fill a quote form with data
   * @param formData - Form field data with refs
   */
  async fillQuoteForm(formData: Array<{ name: string; type: string; ref: string; value: string }>): Promise<void> {
    await (global as any).mcp.playwright.browser_fill_form({
      fields: formData,
    });
  }

  /**
   * Click an element
   * @param element - Human-readable element description
   * @param ref - Element ref from snapshot
   * @param options - Click options (button, doubleClick, etc.)
   */
  async click(
    element: string,
    ref: string,
    options?: { button?: 'left' | 'right' | 'middle'; doubleClick?: boolean }
  ): Promise<void> {
    await (global as any).mcp.playwright.browser_click({
      element,
      ref,
      ...options,
    });
  }

  /**
   * Type text into an element
   * @param element - Human-readable element description
   * @param ref - Element ref from snapshot
   * @param text - Text to type
   * @param options - Type options
   */
  async type(
    element: string,
    ref: string,
    text: string,
    options?: { slowly?: boolean; submit?: boolean }
  ): Promise<void> {
    await (global as any).mcp.playwright.browser_type({
      element,
      ref,
      text,
      ...options,
    });
  }

  /**
   * Resize viewport to preset or custom dimensions
   * @param preset - Viewport preset name or custom dimensions
   */
  async resizeViewport(preset: keyof typeof VIEWPORTS | { width: number; height: number }): Promise<void> {
    const dimensions = typeof preset === 'string' ? VIEWPORTS[preset] : preset;

    await (global as any).mcp.playwright.browser_resize({
      width: dimensions.width,
      height: dimensions.height,
    });

    // Wait for layout to stabilize
    await this.wait(0.5);
  }

  /**
   * Take a screenshot
   * @param filename - Screenshot filename (relative to project root)
   * @param options - Screenshot options
   */
  async takeScreenshot(
    filename: string,
    options?: { fullPage?: boolean; element?: string; ref?: string }
  ): Promise<void> {
    await (global as any).mcp.playwright.browser_take_screenshot({
      filename,
      type: 'png',
      ...options,
    });
  }

  /**
   * Wait for text to appear
   * @param text - Text to wait for
   */
  async waitForText(text: string): Promise<void> {
    await (global as any).mcp.playwright.browser_wait_for({ text });
  }

  /**
   * Wait for text to disappear
   * @param text - Text to wait to disappear
   */
  async waitForTextGone(text: string): Promise<void> {
    await (global as any).mcp.playwright.browser_wait_for({ textGone: text });
  }

  /**
   * Wait for a specified time
   * @param seconds - Time to wait in seconds
   */
  async wait(seconds: number): Promise<void> {
    await (global as any).mcp.playwright.browser_wait_for({ time: seconds });
  }

  /**
   * Hover over an element
   * @param element - Human-readable element description
   * @param ref - Element ref from snapshot
   */
  async hover(element: string, ref: string): Promise<void> {
    await (global as any).mcp.playwright.browser_hover({
      element,
      ref,
    });
  }

  /**
   * Press a keyboard key
   * @param key - Key name (e.g., 'Enter', 'Escape', 'ArrowDown')
   */
  async pressKey(key: string): Promise<void> {
    await (global as any).mcp.playwright.browser_press_key({ key });
  }

  /**
   * Check if element exists in snapshot
   * @param snapshot - Page snapshot
   * @param text - Text to search for
   */
  hasElement(snapshot: string, text: string): boolean {
    return snapshot.includes(text);
  }

  /**
   * Extract element ref from snapshot
   * Useful for finding refs dynamically
   * @param snapshot - Page snapshot
   * @param pattern - Regex pattern to match
   */
  extractRef(snapshot: string, pattern: RegExp): string | null {
    const match = snapshot.match(pattern);
    return match ? match[1] : null;
  }

  /**
   * Get network requests (for debugging)
   */
  async getNetworkRequests(includeStatic: boolean = false): Promise<any> {
    return (global as any).mcp.playwright.browser_network_requests({ includeStatic });
  }

  /**
   * Get console messages (for debugging)
   */
  async getConsoleMessages(level: 'error' | 'warning' | 'info' | 'debug' = 'info'): Promise<any> {
    return (global as any).mcp.playwright.browser_console_messages({ level });
  }

  /**
   * Go back to previous page
   */
  async goBack(): Promise<void> {
    await (global as any).mcp.playwright.browser_navigate_back({});
  }

  /**
   * Close browser (cleanup)
   */
  async close(): Promise<void> {
    try {
      await (global as any).mcp.playwright.browser_close({});
    } catch (error) {
      // Ignore errors on close
    }
  }
}

/**
 * Create a new browser helper instance
 */
export function createBrowser(baseUrl?: string): BrowserHelper {
  return new BrowserHelper(baseUrl);
}
