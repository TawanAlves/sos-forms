/**
 * Sistema de cache para dados do formulário
 * Armazena dados no localStorage com expiração configurável
 */

import { CacheConfig, CachedData, CacheInfo } from "@/types/hooks";

export class FormCache {
  private static readonly CACHE_PREFIX = "sos_forms_cache_";
  private static readonly DEFAULT_EXPIRATION_HOURS = 24; // 24 horas por padrão

  /**
   * Salva dados no cache com timestamp e expiração
   */
  static set<T>(key: string, data: T, expirationHours?: number): void {
    try {
      // Verifica se está no lado do cliente
      if (typeof window === "undefined") {
        return;
      }

      const config: CacheConfig = {
        key: this.CACHE_PREFIX + key,
        expirationHours: expirationHours || this.DEFAULT_EXPIRATION_HOURS,
      };

      const now = Date.now();
      const expiresAt = now + config.expirationHours * 60 * 60 * 1000;

      const cachedData: CachedData<T> = {
        data,
        timestamp: now,
        expiresAt,
      };

      localStorage.setItem(config.key, JSON.stringify(cachedData));

      // console.log(`[FormCache] Dados salvos em cache: ${key}, expira em ${new Date(expiresAt).toLocaleString()}`);
    } catch (error) {
      console.error("[FormCache] Erro ao salvar dados em cache:", error);
    }
  }

  /**
   * Recupera dados do cache se ainda não expiraram
   */
  static get<T>(key: string): T | null {
    try {
      // Verifica se está no lado do cliente
      if (typeof window === "undefined") {
        return null;
      }

      const cacheKey = this.CACHE_PREFIX + key;
      const cached = localStorage.getItem(cacheKey);

      if (!cached) {
        return null;
      }

      const cachedData: CachedData<T> = JSON.parse(cached);
      const now = Date.now();

      // Verifica se o cache expirou
      if (now > cachedData.expiresAt) {
        this.remove(key);
        // console.log(`[FormCache] Cache expirado removido: ${key}`);
        return null;
      }

      // console.log(`[FormCache] Dados recuperados do cache: ${key}, expira em ${new Date(cachedData.expiresAt).toLocaleString()}`);
      return cachedData.data;
    } catch (error) {
      console.error("[FormCache] Erro ao recuperar dados do cache:", error);
      return null;
    }
  }

  /**
   * Remove dados específicos do cache
   */
  static remove(key: string): void {
    try {
      // Verifica se está no lado do cliente
      if (typeof window === "undefined") {
        return;
      }

      const cacheKey = this.CACHE_PREFIX + key;
      localStorage.removeItem(cacheKey);
      // console.log(`[FormCache] Cache removido: ${key}`);
    } catch (error) {
      console.error("[FormCache] Erro ao remover cache:", error);
    }
  }

  /**
   * Remove todos os caches do formulário
   */
  static clearAll(): void {
    try {
      // Verifica se está no lado do cliente
      if (typeof window === "undefined") {
        return;
      }

      const keys = Object.keys(localStorage);
      const formCacheKeys = keys.filter((key) =>
        key.startsWith(this.CACHE_PREFIX)
      );

      formCacheKeys.forEach((key) => {
        localStorage.removeItem(key);
      });

      // console.log(`[FormCache] ${formCacheKeys.length} caches removidos`);
    } catch (error) {
      console.error("[FormCache] Erro ao limpar todos os caches:", error);
    }
  }

  /**
   * Verifica se um cache existe e não expirou
   */
  static has(key: string): boolean {
    try {
      // Verifica se está no lado do cliente
      if (typeof window === "undefined") {
        return false;
      }

      const cacheKey = this.CACHE_PREFIX + key;
      const cached = localStorage.getItem(cacheKey);

      if (!cached) {
        return false;
      }

      const cachedData: CachedData<unknown> = JSON.parse(cached);
      const now = Date.now();

      return now <= cachedData.expiresAt;
    } catch {
      return false;
    }
  }

  /**
   * Retorna informações sobre o cache (útil para debug)
   */
  static getInfo(key: string): CacheInfo | null {
    try {
      // Verifica se está no lado do cliente
      if (typeof window === "undefined") {
        return null;
      }

      const cacheKey = this.CACHE_PREFIX + key;
      const cached = localStorage.getItem(cacheKey);

      if (!cached) {
        return { exists: false };
      }

      const cachedData: CachedData<unknown> = JSON.parse(cached);
      const now = Date.now();
      const age = now - cachedData.timestamp;

      return {
        exists: true,
        expiresAt: new Date(cachedData.expiresAt),
        age: Math.floor(age / (1000 * 60)), // idade em minutos
      };
    } catch {
      return null;
    }
  }

  /**
   * Limpa caches expirados automaticamente
   */
  static cleanupExpired(): void {
    try {
      // Verifica se está no lado do cliente
      if (typeof window === "undefined") {
        return;
      }

      const keys = Object.keys(localStorage);
      const formCacheKeys = keys.filter((key) =>
        key.startsWith(this.CACHE_PREFIX)
      );
      const now = Date.now();
      let cleanedCount = 0;

      formCacheKeys.forEach((key) => {
        try {
          const cached = localStorage.getItem(key);
          if (cached) {
            const cachedData: CachedData<unknown> = JSON.parse(cached);
            if (now > cachedData.expiresAt) {
              localStorage.removeItem(key);
              cleanedCount++;
            }
          }
        } catch {
          // Remove cache corrompido
          localStorage.removeItem(key);
          cleanedCount++;
        }
      });

      if (cleanedCount > 0) {
        // console.log(`[FormCache] ${cleanedCount} caches expirados removidos automaticamente`);
      }
    } catch (error) {
      console.error("[FormCache] Erro na limpeza automática:", error);
    }
  }
}

// Executa limpeza automática quando o módulo é carregado
if (typeof window !== "undefined") {
  FormCache.cleanupExpired();

  // Limpeza automática a cada hora
  setInterval(() => {
    FormCache.cleanupExpired();
  }, 60 * 60 * 1000);
}
