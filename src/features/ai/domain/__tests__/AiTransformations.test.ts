import { FaceSwitchEngine } from '../FaceSwitchEngine';
import { BackgroundSegmentationEngine } from '../BackgroundSegmentationEngine';

describe('AI Transformations Architecture (Reality & Ethical Tests)', () => {
  const faceEngine = new FaceSwitchEngine();
  const bgEngine = new BackgroundSegmentationEngine();

  describe('FaceSwitchEngine', () => {
    it('rejects jobs without explicit user consent', async () => {
      const result = await faceEngine.processFaceSwitch('file://target.jpg', 'file://source.jpg', {
        userConsentGranted: false,
        consentTimestamp: new Date().toISOString(),
        sourceImageAuthorizedByUser: true,
        understoodAiDisclosure: true,
      });

      expect(result.status).toBe('FAILED');
      expect(result.errorMessage).toContain('User consent is required');
    });

    it('rejects jobs when source photo is not authorized by user', async () => {
      const result = await faceEngine.processFaceSwitch('file://target.jpg', 'file://source.jpg', {
        userConsentGranted: true,
        consentTimestamp: new Date().toISOString(),
        sourceImageAuthorizedByUser: false,
        understoodAiDisclosure: true,
      });

      expect(result.status).toBe('FAILED');
      expect(result.errorMessage).toContain('authorized and owned by the user');
    });

    it('transparently returns PARTIAL_ENGINE_REQUIRED when consent is valid but native model is unlinked', async () => {
      const result = await faceEngine.processFaceSwitch('file://target.jpg', 'file://source.jpg', {
        userConsentGranted: true,
        consentTimestamp: new Date().toISOString(),
        sourceImageAuthorizedByUser: true,
        understoodAiDisclosure: true,
      });

      expect(result.status).toBe('PARTIAL_ENGINE_REQUIRED');
      expect(result.watermarkApplied).toBe(true);
      expect(result.errorMessage).toContain('Dedicated native neural model weights are required');
    });
  });

  describe('BackgroundSegmentationEngine', () => {
    it('returns PARTIAL_MODEL_REQUIRED with honest reason', async () => {
      const result = await bgEngine.segmentAndReplace('file://photo.jpg', {
        blurRadius: 10,
        replacementColor: '#181818',
      });

      expect(result.status).toBe('PARTIAL_MODEL_REQUIRED');
      expect(result.errorMessage).toContain('Native neural segmentation model');
    });

    it('fails gracefully on empty image URI', async () => {
      const result = await bgEngine.segmentAndReplace('', {});
      expect(result.status).toBe('FAILED');
    });
  });
});
