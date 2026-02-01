
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface User {
  id: number | string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Asset {
  id: string;
  type: 'logo' | 'product';
  name: string;
  data: string; // Base64 or URL
  mime_type: string;
  tags?: string[];
}

export interface PlacedLayer {
  uid: string;
  assetId: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
}

export interface GeneratedMockup {
  id: number | string;
  image_url: string;
  prompt: string;
  scene_prompt?: string;
  lighting_style: 'studio' | 'natural' | 'neon' | 'cinematic';
  created_at: string;
  metadata?: {
      layers: PlacedLayer[];
  };
}

export type AppView = 'dashboard' | 'assets' | 'studio' | 'gallery' | 'try-on' | 'brand-lab';

export interface LoadingState {
  isGenerating: boolean;
  message: string;
}
