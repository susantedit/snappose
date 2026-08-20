import { FaceSwitchProvider } from '../FaceSwitchProvider';

describe('FaceSwitchProvider Architecture & Safety Contracts', () => {
  const provider = new FaceSwitchProvider();

  it('rejects execution when consent is not granted', async () => {
    const res = await provider.executeFaceSwitch(
      'file://target.jpg',
      'file://source.jpg',
      {
        userConsentGranted: false,
        confirmedPermissionToUseFace: true,
        understoodAiDisclosure: true,
        timestamp: new Date().toISOString(),
      }
    );

    expect(res.success).toBe(false);
    expect(res.error).toContain('Explicit user consent is required');
  });

  it('rejects execution when permission to use source face is unconfirmed', async () => {
    const res = await provider.executeFaceSwitch(
      'file://target.jpg',
      'file://source.jpg',
      {
        userConsentGranted: true,
        confirmedPermissionToUseFace: false,
        understoodAiDisclosure: true,
        timestamp: new Date().toISOString(),
      }
    );

    expect(res.success).toBe(false);
    expect(res.error).toContain('confirm you have permission');
  });

  it('returns honest UNAVAILABLE_ON_CURRENT_BUILD status when native inference weights are unlinked', async () => {
    expect(provider.getCapabilityStatus()).toBe('UNAVAILABLE_ON_CURRENT_BUILD');

    const res = await provider.executeFaceSwitch(
      'file://target.jpg',
      'file://source.jpg',
      {
        userConsentGranted: true,
        confirmedPermissionToUseFace: true,
        understoodAiDisclosure: true,
        timestamp: new Date().toISOString(),
      }
    );

    expect(res.success).toBe(false);
    expect(res.error).toContain('Face Switch unavailable on this device/build');
  });
});
