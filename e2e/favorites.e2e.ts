import { device, element, by, expect } from 'detox';

describe('Favorites E2E', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('toggles favorite on pose detail and verifies in favorites tab', async () => {
    await element(by.id('pose_card_0')).tap();
    await element(by.id('favorite_button')).tap();

    // Navigate to favorites tab
    await element(by.id('tab_favorites')).tap();
    await expect(element(by.id('favorites_list'))).toBeVisible();
  });
});
