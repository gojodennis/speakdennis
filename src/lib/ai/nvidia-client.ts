import OpenAI from 'openai';

/**
 * Shared NVIDIA NIM client using the OpenAI-compatible API.
 * Base URL: https://integrate.api.nvidia.com/v1
 * Auth: nvapi-* key from https://build.nvidia.com
 */
export const nim = new OpenAI({
  apiKey: process.env.NVIDIA_NIM_API_KEY ?? '',
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

export const NIM_MODELS = {
  /** Llama-3.1-8B-Instruct — Selected for blazing fast MVP responses */
  ANALYZE: 'meta/llama-3.1-8b-instruct',
} as const;
