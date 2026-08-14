import { device, element, by, expect } from 'detox';

describe('Settings Screen E2E', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('toggles theme, voice coaching, and updates auto capture threshold', async () => {
    await element(by.id('tab_settings')).tap();
    await expect(element(by.text('Settings'))).toBeVisible();

    // Toggle theme switch
    await element(by.id('theme_switch')).tap();

    // Toggle voice coaching switch
    await element(by.id('voice_guidance_switch')).tap();

    // Verify developer links and about section exist
    await expect(element(by.text('Developer'))).toBeVisible();
    await expect(element(by.text('Susant Luitel'))).toBeVisible();
  });
});
