import { DeepLinkService } from '../DeepLinkService';

describe('DeepLinkService', () => {
  it('generates correct custom scheme and universal links for templates', () => {
    const custom = DeepLinkService.getTemplateDeepLink('tpl-golden-01');
    const web = DeepLinkService.getTemplateWebUrl('tpl-golden-01');

    expect(custom).toBe('posehanum://template/tpl-golden-01');
    expect(web).toBe('https://posehanum.com/template/tpl-golden-01');
  });

  it('parses custom scheme template deep links', () => {
    const parsed = DeepLinkService.parseUrl('posehanum://template/tpl-street-01');
    expect(parsed.type).toBe('TEMPLATE');
    expect(parsed.id).toBe('tpl-street-01');
  });

  it('parses web universal links', () => {
    const parsed = DeepLinkService.parseUrl('https://posehanum.com/template/tpl-cafe-01');
    expect(parsed.type).toBe('TEMPLATE');
    expect(parsed.id).toBe('tpl-cafe-01');
  });

  it('parses creator profile links', () => {
    const parsed = DeepLinkService.parseUrl('posehanum://creator/creator_123');
    expect(parsed.type).toBe('CREATOR');
    expect(parsed.id).toBe('creator_123');
  });

  it('handles invalid or unknown URLs gracefully', () => {
    const parsed = DeepLinkService.parseUrl('https://random.com/unknown');
    expect(parsed.type).toBe('UNKNOWN');
  });
});
