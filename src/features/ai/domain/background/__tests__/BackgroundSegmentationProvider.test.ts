import { BackgroundSegmentationProvider } from '../BackgroundSegmentationProvider';

describe('BackgroundSegmentationProvider', () => {
  const provider = new BackgroundSegmentationProvider();

  it('probes capability and returns false in managed environment', () => {
    expect(provider.isNativeModelAvailable()).toBe(false);
  });

  it('returns UNAVAILABLE_ON_CURRENT_BUILD status when model weights are unlinked', async () => {
    const res = await provider.processSegmentation('file://photo.jpg', {
      mode: 'BLUR',
      blurRadius: 15,
    });

    expect(res.success).toBe(false);
    expect(res.status).toBe('UNAVAILABLE_ON_CURRENT_BUILD');
    expect(res.message).toContain('Background Segmentation unavailable on this device/build');
  });

  it('fails gracefully on empty image URI', async () => {
    const res = await provider.processSegmentation('', { mode: 'REMOVE' });
    expect(res.success).toBe(false);
    expect(res.status).toBe('FAILED');
  });
});
