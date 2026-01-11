/**
 * @file        useApi.ts
 * @description Custom Hook für API-Calls mit Type-Safety und Error-Handling
 * @version     0.6.0
 * @created     2026-01-07 01:18:02 CET
 * @updated     2026-01-11 03:06:28 CET
 * @author      Akki Scholze
 *
 * @usage
 *   const api = useApi();
 *   const result = await api.fetch<Material[]>('/api/material');
 *
 * @changelog
 *   0.6.0 - 2026-01-11 - Fixed: unsafe-any errors by adding proper type assertions (JSON.parse response)
 *   0.5.0 - 2026-01-11 - P1: useApi Hook stable + production-ready (all Pages integrated)
 *   0.4.0 - 2026-01-11 - Fail-fast API base URL resolution (dev proxy allowed empty) + absolute URL guard; tolerant success handling
 *   0.3.0 - 2026-01-10 - Fixed: use VITE_API_URL from .env (not VITE_APP_BASE_URL)
 *   0.2.2 - 2026-01-08 - Strikt nur API-URL aus config.toml (kein Fallback)
 *   0.2.0 - 2026-01-07 - Simplified to generic fetch method
 *   0.1.0 - 2026-01-07 - Initial version mit GET/POST/PUT/DELETE
 */

import { useCallback } from 'react';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export interface UseApiResult {
  fetch: <T = unknown>(endpoint: string, options?: RequestInit) => Promise<ApiResponse<T>>;
}

/**
 * Type Guard: Prüft ob ein Unknown Object ein gültiges ApiResponse ist
 */
function isApiResponse<T>(value: unknown): value is ApiResponse<T> {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return 'success' in obj && typeof obj.success === 'boolean';
}

// API_BASE_URL from .env (VITE_API_URL)
// DEV: Can be empty (Vite proxy handles /api → backend)
// PROD: Must be set to absolute URL (ngrok/production)
const RAW_API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.trim() ?? '';

const API_BASE_URL = (() => {
  if (RAW_API_URL === '') {
    if (import.meta.env.DEV) return '';
    throw new Error('VITE_API_URL is required in production builds');
  }

  if (!/^https?:\/\//i.test(RAW_API_URL)) {
    throw new Error('VITE_API_URL must be absolute (http/https)');
  }

  return RAW_API_URL;
})();

/**
 * Hook für API-Calls (ohne Endpoint-Binding)
 */
export function useApi(): UseApiResult {
  /**
   * Universal fetch method
   */
  const fetch = useCallback(async <T = unknown>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> => {
    try {
      const response = await window.fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        },
        ...options
      });

      const json = (await response.json()) as Record<string, unknown>;

      if (isApiResponse<T>(json)) {
        return json;
      }

      if (!response.ok) {
        const errorMessage = 'error' in json ? String(json.error) : `HTTP ${response.status}`;
        return {
          success: false,
          error: errorMessage
        };
      }

      return {
        success: true,
        data: json as T
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('API fetch error:', err);
      return {
        success: false,
        error: message
      };
    }
  }, []);

  return { fetch };
}
