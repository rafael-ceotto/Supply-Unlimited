/**
 * Dark Mode Theme Manager
 * Handles theme switching and persistence
 */

class ThemeManager {
  constructor() {
    this.THEME_KEY = 'supply-unlimited-theme';
    this.DARK_THEME = 'dark';
    this.LIGHT_THEME = 'light';
    
    this.initTheme();
    this.setupToggle();
  }

  /**
   * Initialize theme from localStorage or system preference
   */
  initTheme() {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const theme = savedTheme || (prefersDark ? this.DARK_THEME : this.LIGHT_THEME);
    this.setTheme(theme);
  }

  /**
   * Set theme and save to localStorage
   */
  setTheme(theme) {
    if (theme === this.DARK_THEME) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem(this.THEME_KEY, this.DARK_THEME);
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem(this.THEME_KEY, this.LIGHT_THEME);
    }
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme } }));
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === this.DARK_THEME ? this.LIGHT_THEME : this.DARK_THEME;
    this.setTheme(newTheme);
  }

  /**
   * Get current theme
   */
  getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || this.LIGHT_THEME;
  }

  /**
   * Setup theme toggle button
   */
  setupToggle() {
    // Create toggle button if it doesn't exist
    if (!document.getElementById('theme-toggle-btn')) {
      const toggle = document.createElement('button');
      toggle.id = 'theme-toggle-btn';
      toggle.className = 'theme-toggle';
      toggle.setAttribute('title', 'Toggle dark/light mode');
      toggle.innerHTML = '🌙';
      toggle.addEventListener('click', () => {
        this.toggleTheme();
        this.updateToggleIcon();
      });
      document.body.appendChild(toggle);
    }
    
    this.updateToggleIcon();
  }

  /**
   * Update toggle button icon based on current theme
   */
  updateToggleIcon() {
    const toggle = document.getElementById('theme-toggle-btn');
    if (toggle) {
      const currentTheme = this.getCurrentTheme();
      toggle.innerHTML = currentTheme === this.DARK_THEME ? '☀️' : '🌙';
      toggle.setAttribute('aria-label', `Switch to ${currentTheme === this.DARK_THEME ? 'light' : 'dark'} mode`);
    }
  }
}

// Initialize theme manager when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
  });
} else {
  window.themeManager = new ThemeManager();
}

// Listen for system theme preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('supply-unlimited-theme')) {
    window.themeManager.setTheme(e.matches ? 'dark' : 'light');
  }
});
