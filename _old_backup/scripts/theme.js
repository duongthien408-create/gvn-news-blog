// Theme Manager - Dark Mode Only
class ThemeManager {
  constructor() {
    this.init();
  }

  init() {
    // Always use dark mode
    document.documentElement.classList.add('dark');
    this.updateColors();
  }

  updateColors() {
    const root = document.documentElement;

    // Dark mode colors - Pure black with GearVN red accent
    root.style.setProperty('--color-surface', '0 0 0'); // Pure black #000000
    root.style.setProperty('--color-panel', '15 15 15'); // Almost black #0F0F0F
    root.style.setProperty('--color-card', '25 25 25'); // Dark gray #191919
    root.style.setProperty('--color-border', '50 50 50'); // Border gray #323232
    root.style.setProperty('--color-text-primary', '255 255 255'); // Pure white #FFFFFF
    root.style.setProperty('--color-text-secondary', '200 200 200'); // Light gray #C8C8C8
    root.style.setProperty('--color-text-muted', '150 150 150'); // Muted gray #969696
    root.style.setProperty('--color-accent', '239 68 68'); // Red #EF4444
    root.style.setProperty('--color-accent-hover', '248 113 113'); // Lighter red #F87171
  }
}

// Create global theme manager
const themeManager = new ThemeManager();

// Export for use in other scripts
window.themeManager = themeManager;
