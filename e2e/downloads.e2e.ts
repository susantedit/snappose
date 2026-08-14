import { device, element, by, expect } from 'detox';

describe('Downloads E2E', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('downloads a pose pack and accesses it in offline downloads view', async () => {
    await element(by.id('pose_card_0')).tap();
    await element(by.id('download_pack_button')).tap();
    await expect(element(by.id('download_progress_bar'))).toBeVisible();

    // Navigate to downloads screen
    await element(by.id('tab_settings')).tap();
    await element(by.text('Downloaded Packs')).tap();
    await expect(element(by.id('downloads_list'))).toBeVisible();
  });
});
