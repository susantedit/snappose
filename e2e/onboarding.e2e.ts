import { device, element, by, expect } from 'detox';

describe('Onboarding Flow E2E', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('displays 3 onboarding slides with swipe navigation', async () => {
    await expect(element(by.text('Pose it. Snap it. Share it.'))).toBeVisible();
    await element(by.id('onboarding_pager')).swipe('left');
    await element(by.id('onboarding_pager')).swipe('left');
    await expect(element(by.text('Start Exploring'))).toBeVisible();
  });

  it('completes onboarding and navigates to Home screen on CTA tap', async () => {
    await element(by.text('Start Exploring')).tap();
    await expect(element(by.id('home_screen'))).toBeVisible();
  });
});
