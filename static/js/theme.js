/**
 * Theme Manager - Disabled
 * Dark mode has been removed. Application uses light mode only.
 */

// This file is no longer used - dark mode functionality has been completely disabled.

// Listen for system theme preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('supply-unlimited-theme')) {
    window.themeManager.setTheme(e.matches ? 'dark' : 'light');
  }
});
