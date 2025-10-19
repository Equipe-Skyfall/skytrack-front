// Gerenciador de refresh para garantir atualização da UI após mudanças

export class RefreshManager {
  private static refreshCallbacks: Map<string, (() => void)[]> = new Map();

  /**
   * Registra um callback para ser chamado quando uma entidade for atualizada
   */
  static subscribe(entity: string, callback: () => void): () => void {
    const callbacks = this.refreshCallbacks.get(entity) || [];
    callbacks.push(callback);
    this.refreshCallbacks.set(entity, callbacks);
    
    // Retorna função para unsubscribe
    return () => {
      const currentCallbacks = this.refreshCallbacks.get(entity) || [];
      const index = currentCallbacks.indexOf(callback);
      if (index > -1) {
        currentCallbacks.splice(index, 1);
        this.refreshCallbacks.set(entity, currentCallbacks);
      }
    };
  }

  /**
   * Notifica todos os listeners de uma entidade que ela foi atualizada
   */
  static notify(entity: string) {
    const callbacks = this.refreshCallbacks.get(entity) || [];
    callbacks.forEach(callback => callback());
  }

  /**
   * Força um reload da página se necessário
   */
  static forceReload() {
    window.location.reload();
  }

  /**
   * Atualiza uma entidade específica e notifica os listeners
   */
  static async refreshEntity(entity: string, forceReload = false) {
    if (forceReload) {
      this.forceReload();
      return;
    }
    
    this.notify(entity);
  }
}

// Constantes para os tipos de entidades
export const ENTITY_TYPES = {
  TIPO_ALERTA: 'tipo_alerta',
  TIPO_PARAMETRO: 'tipo_parametro',
  ALERTS: 'alerts',
  STATIONS: 'stations',
  PARAMETERS: 'parameters',
} as const;