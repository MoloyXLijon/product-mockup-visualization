
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { Asset, GeneratedMockup, PlacedLayer, User } from "../types";

const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('sku_token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export const apiService = {
  async register(data: any): Promise<{user: User, token: string}> {
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Registration failed');
    return res.json();
  },

  async login(credentials: any): Promise<{user: User, token: string}> {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Login failed');
    }
    return res.json();
  },

  async logout(): Promise<void> {
    await fetch(`${API_BASE}/logout`, { method: 'POST', headers: getHeaders() });
    localStorage.removeItem('sku_token');
  },

  async getAssets(): Promise<Asset[]> {
    const res = await fetch(`${API_BASE}/assets`, { headers: getHeaders() });
    return res.json();
  },

  async generateAsset(prompt: string, type: string): Promise<Asset> {
    const res = await fetch(`${API_BASE}/assets/generate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ prompt, type })
    });
    if (!res.ok) throw new Error('Generation failed');
    return res.json();
  },

  async deleteAsset(id: string): Promise<void> {
     await fetch(`${API_BASE}/assets/${id}`, { method: 'DELETE', headers: getHeaders() });
  },

  async getMockups(): Promise<GeneratedMockup[]> {
    const res = await fetch(`${API_BASE}/mockups`, { headers: getHeaders() });
    return res.json();
  },

  async renderMockup(data: {
    productId: string,
    layers: PlacedLayer[],
    prompt: string,
    scenePrompt: string,
    lightingStyle: string
  }): Promise<GeneratedMockup> {
    const res = await fetch(`${API_BASE}/mockups/render`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Rendering failed');
    return res.json();
  }
};
