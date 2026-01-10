/**
 * @file        useApi.ts
 * @description Custom Hook für API-Calls mit Type-Safety und Error-Handling
 * @version     0.3.0
 * @created     2026-01-07 01:18:02 CET
 * @updated     2026-01-10 12:00:00 CET
 * @author      Akki Scholze
 *
 * @usage
 *   const api = useApi();
 *   const result = await api.fetch<Material[]>('/api/material');
 *
 * @changelog
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

// API_BASE_URL from .env (VITE_API_URL)
// DEV: Can be empty (Vite proxy handles /api → backend)
// PROD: Must be set to absolute URL (ngrok/production)
const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';

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

      const json = (await response.json()) as ApiResponse<T>;

      if (!response.ok || !json.success) {
        return {
          success: false,
          error: json.error || `HTTP ${response.status}`
        };
      }

      return json;
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
