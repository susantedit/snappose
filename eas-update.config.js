/**
 * EAS Update configuration for Snap Pose OTA (over-the-air) JS-layer updates.
 *
 * This file documents the update channel mapping used by `eas update`.
 * The actual runtime update behaviour is driven by the `updates` field
 * in app.config.ts (which references expo-updates).
 *
 * Channel → Git branch mapping:
 *   development  →  feature/* / develop
 *   preview      →  develop / release/*
 *   production   →  main
 *
 * Usage:
 *   Push JS-only fix to production:
 *     eas update --branch production --message "fix: patch description"
 *
 *   Push to preview for QA:
 *     eas update --branch preview --message "feat: new feature"
 *
 *   Push to development for testing:
 *     eas update --branch development --message "wip: in progress"
 *
 * Limits:
 *   - OTA updates apply only to JS bundle + assets.
 *   - Native code changes (new modules, SDK upgrades) require a full EAS build.
 *   - The `runtimeVersion` in app.config.ts must match the installed native build.
 */

module.exports = {
  cli: {
    version: '>= 10.0.0',
  },
  channels: {
    development: {
      branch: 'development',
    },
    preview: {
      branch: 'preview',
    },
    production: {
      branch: 'production',
    },
  },
};
