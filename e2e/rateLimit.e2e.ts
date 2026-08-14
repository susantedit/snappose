import { device, element, by, expect } from 'detox';

describe('Photo Capture Rate Limit & Rewarded Ad E2E', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('shows capture limit modal when 10-photo limit is reached and allows ad unlock', async () => {
    // Open camera
    await element(by.id('camera_fab')).tap();
    await expect(element(by.id('camera_screen'))).toBeVisible();

    // Trigger captures up to limit
    for (let i = 0; i < 10; i++) {
      await element(by.id('shutter_button')).tap();
    }

    // 11th capture attempt blocks and displays limit modal
    await element(by.id('shutter_button')).tap();
    await expect(element(by.id('capture_limit_modal'))).toBeVisible();
    await expect(element(by.text('Watch ad for 5 more captures'))).toBeVisible();

    // Tap rewarded ad CTA
    await element(by.text('Watch ad for 5 more captures')).tap();
    // Modal dismisses after rewarded bonus grant
    await expect(element(by.id('capture_limit_modal'))).not.toBeVisible();
  });
});
