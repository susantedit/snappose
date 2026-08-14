import { device, element, by, expect } from 'detox';

describe('Capture Flow E2E', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('navigates from home to pose detail, then opens camera and captures photo', async () => {
    await element(by.id('pose_card_0')).tap();
    await expect(element(by.text('Use This Pose'))).toBeVisible();

    await element(by.text('Use This Pose')).tap();
    await expect(element(by.id('camera_screen'))).toBeVisible();

    // Verify shutter button is present and tap to capture
    await element(by.id('shutter_button')).tap();
    await expect(element(by.id('capture_success_toast'))).toBeVisible();
  });
});
