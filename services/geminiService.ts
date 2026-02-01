
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, Modality } from "@google/genai";
import { Asset, PlacedLayer } from "../types";

const getBase64Data = (dataUrl: string): string => {
  return dataUrl.split(',')[1];
};

/**
 * Generates a pro mockup with staging and lighting.
 */
export const generateProMockup = async (
  product: Asset,
  layers: { asset: Asset; placement: PlacedLayer }[],
  instruction: string,
  scenePrompt?: string,
  lightingStyle: string = 'studio'
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    // Switched to Flash model for Free Tier support
    const model = 'gemini-2.5-flash-image';

    const parts: any[] = [
      {
        inlineData: {
          mimeType: product.mime_type,
          data: getBase64Data(product.data),
        },
      },
    ];

    let layoutHints = "";
    layers.forEach((layer, index) => {
      parts.push({
        inlineData: {
          mimeType: layer.asset.mime_type,
          data: getBase64Data(layer.asset.data),
        },
      });
      layoutHints += `\n- Logo ${index + 1}: At (${Math.round(layer.placement.x)}%, ${Math.round(layer.placement.y)}%). Scale: ${layer.placement.scale}. Opacity: ${layer.placement.opacity}.`;
    });

    const finalPrompt = `
    TASK: Professional Product Mockup & Staging.
    
    1. COMPOSITION: Place logos (images 2-${layers.length + 1}) onto the base product (image 1).
    2. PLACEMENT GUIDE: ${layoutHints}
    3. STAGING: ${scenePrompt ? `Place the product in this environment: ${scenePrompt}.` : 'Keep a clean studio background.'}
    4. LIGHTING: Use ${lightingStyle} lighting. Ensure realistic shadows, reflections, and surface wrapping.
    5. ADDITIONAL: ${instruction}

    Output ONLY the resulting high-fidelity staged image.
    `;

    parts.push({ text: finalPrompt });

    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: { responseModalities: [Modality.IMAGE] },
    });

    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (part?.inlineData?.data) return `data:image/png;base64,${part.inlineData.data}`;
    
    throw new Error("Generation failed");
  } catch (error) {
    console.error("Pro Mockup failed:", error);
    throw error;
  }
};

export const generateAsset = async (prompt: string, type: 'logo' | 'product'): Promise<string> => {
   try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    // Switched to Flash model for Free Tier support
    const model = 'gemini-2.5-flash-image';
    
    const enhancedPrompt = type === 'logo' 
        ? `A high-quality logo design of ${prompt}. Vector style, flat design, white background.`
        : `Professional studio shot of ${prompt}. Clean background, 4k, realistic product photography.`;

    const response = await ai.models.generateContent({
        model,
        contents: { parts: [{ text: enhancedPrompt }] },
        config: { responseModalities: [Modality.IMAGE] }
    });

    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (part?.inlineData?.data) return `data:image/png;base64,${part.inlineData.data}`;
    throw new Error("No image generated");
   } catch (error) {
       console.error("Asset generation failed:", error);
       throw error;
   }
}

export const generateRealtimeComposite = async (
    compositeImageBase64: string,
    prompt: string = "Make this look like a real photo"
  ): Promise<string> => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Switched to Flash model for Free Tier support
      const model = 'gemini-2.5-flash-image';
  
      const parts = [
        { inlineData: { mimeType: 'image/png', data: getBase64Data(compositeImageBase64) } },
        { text: `${prompt}. Seamlessly blend elements, match lighting/perspective. Output IMAGE only.` }
      ];
  
      const response = await ai.models.generateContent({
        model,
        contents: { parts },
        config: { responseModalities: [Modality.IMAGE] },
      });
  
      const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (part?.inlineData?.data) return `data:image/png;base64,${part.inlineData.data}`;
      throw new Error("Composite failed");
    } catch (error) {
      console.error("AR Composite failed:", error);
      throw error;
    }
  };
