import { Schema, model, Document } from 'mongoose';

export interface IAppConfig extends Document {
  key: string;
  maintenanceMode: boolean;
  minimumVersion: string;
  latestVersion: string;
  adsEnabled: boolean;
  autoCaptureThreshold: number;
  voiceGuidanceEnabled: boolean;
  updatedAt: Date;
}

const AppConfigSchema = new Schema<IAppConfig>(
  {
    key: { type: String, required: true, unique: true, default: 'global' },
    maintenanceMode: { type: Boolean, default: false },
    minimumVersion: { type: String, default: '1.0.0' },
    latestVersion: { type: String, default: '1.0.0' },
    adsEnabled: { type: Boolean, default: true },
    autoCaptureThreshold: { type: Number, default: 94 },
    voiceGuidanceEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const AppConfigModel = model<IAppConfig>('AppConfig', AppConfigSchema);
