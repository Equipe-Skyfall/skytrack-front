import React, { useEffect, useState } from 'react';

import { Loader2, X } from 'lucide-react';


type Alert = {
  id: string;
  data: Date;
  stationId: string;
  parameterId: string;
  tipoAlertaId: string;
  medidasId?: string;
  createdAt: Date;
};

type AlertFormData = Partial<Alert>;

type Props = {
  value: AlertFormData;
  onChange: (v: Partial<AlertFormData>) => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting?: boolean;
  title?: string;
};

const AlertForm: React.FC<Props> = ({ value, onChange, onCancel, onSubmit, submitting, title }) => {
  const [parameters, setParameters] = useState<Array<{ id: string; name: string; tipoParametroId?: string }>>([]);
  const [tipoParametros, setTipoParametros] = useState<Array<{ id: string; nome: string }>>([]);
  const [tipoAlertas, setTipoAlertas] = useState<Array<{ id: string; tipo: string }>>([]);
  const [loadingParams, setLoadingParams] = useState(false);
  const [stations, setStations] = useState<Array<{ mac: string; name?: string; region?: string }>>([]);
  const [loadingStations, setLoadingStations] = useState(false);

  useEffect(() => {
    let mounted = true;
    const base = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000';

    async function loadStations() {
      setLoadingStations(true);
      try {
        const res = await fetch(`${base}/api/stations`);
        if (!res.ok) throw new Error('Failed to load stations');
        const json = await res.json();

        const list = Array.isArray(json) ? json : (json.data || []);
        if (mounted) setStations(list.map((s: any) => ({ mac: s.macAddress ?? s.mac ?? s.id, name: s.name, region: s.address })));
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setLoadingStations(false);
      }
    }

    async function loadParameters(stationId?: string) {
      setLoadingParams(true);
      try {
        const url = stationId ? `${base}/api/parameters?stationId=${encodeURIComponent(stationId)}` : `${base}/api/parameters`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to load parameters');
        const json = await res.json();
        const list = Array.isArray(json) ? json : (json.data || []);

        if (mounted) {
          const mapped = list.map((p: any) => ({ id: p.id, name: p.name || p.tipoParametroId || p.id, tipoParametroId: p.tipoParametroId }));
          setParameters(mapped);
        }
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setLoadingParams(false);
      }
    }

    async function loadTipoParametros() {
      try {
        const res = await fetch(`${base}/api/tipo-parametro`);
        if (!res.ok) return;
        const json = await res.json();
        const list = Array.isArray(json) ? json : (json.data || json);
        if (mounted) setTipoParametros(list.map((t: any) => ({ id: t.id, nome: t.nome })));
      } catch (e) {
        // ignore
      }
    }

    async function loadTipoAlertas() {
      try {
        const res = await fetch(`${base}/api/tipo-alerta`);
        if (!res.ok) return;
        const json = await res.json();
        const list = Array.isArray(json) ? json : (json.data || json);
        if (mounted) setTipoAlertas(list.map((t: any) => ({ id: t.id, tipo: t.tipo })));
      } catch (e) {
        // ignore
      }
    }

    loadStations();
    loadTipoParametros();
    loadTipoAlertas();
    loadParameters(value.stationId || undefined);
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    const base = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000';
    async function loadParametersForStation(stationId?: string) {
      setLoadingParams(true);
      try {
        const url = stationId ? `${base}/api/parameters?stationId=${encodeURIComponent(stationId)}` : `${base}/api/parameters`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to load parameters');
        const json = await res.json();
        const list = Array.isArray(json) ? json : (json.data || []);
        if (mounted) {

          const mapped = list.map((p: any) => {
            const tipo = tipoParametros.find(t => t.id === p.tipoParametroId);
            return { id: p.id, name: tipo ? `${tipo.nome}` : (p.name || p.tipoParametroId || p.id), tipoParametroId: p.tipoParametroId };
          });
          setParameters(mapped);
        }
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setLoadingParams(false);
      }
    }
    loadParametersForStation(value.stationId || undefined);
    return () => { mounted = false; };
  }, [value.stationId, tipoParametros]);


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form onSubmit={onSubmit} className="bg-white rounded-xl p-6 w-full max-w-lg sm:max-w-xl md:max-w-2xl space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-bold text-zinc-800">
            {title || 'Formulário de Alerta'}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-zinc-600 hover:text-zinc-800 cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">Estação (MAC)</label>
          {loadingStations ? (
            <div className="mt-1 text-sm text-zinc-600 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Carregando estações...
            </div>
          ) : (
            <select
              value={value.stationId || ''}
              onChange={e => onChange({ stationId: e.target.value, parameterId: '' })}
              required
              className="mt-1 block w-full rounded-md border border-zinc-300 p-2 text-sm focus:ring-slate-500 focus:border-slate-500"
            >
              <option value="" disabled>Selecione uma estação</option>
              {stations.map(s => (
                <option key={s.mac} value={s.mac}>
                  {s.name ? `${s.name} (${s.mac})` : s.mac}
                </option>
              ))}
            </select>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">Tipo de Alerta</label>
          <select
            value={(value as any).tipoAlertaId || ''}
            onChange={e => onChange({ tipoAlertaId: e.target.value })}
            className="mt-1 block w-full rounded-md border border-zinc-300 p-2 text-sm focus:ring-slate-500 focus:border-slate-500"
          >
            <option value="" disabled>Selecione um tipo de alerta</option>
            {tipoAlertas.map(t => (
              <option key={t.id} value={t.id}>
                {t.tipo} {t.id ? `(${t.id.slice(0, 8)})` : ''}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">Parâmetro</label>
          {loadingParams ? (
            <div className="mt-1 text-sm text-zinc-600 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Carregando parâmetros...
            </div>
          ) : (
            <select
              value={value.parameterId || ''}
              onChange={e => onChange({ parameterId: e.target.value })}
              className="mt-1 block w-full rounded-md border border-zinc-300 p-2 text-sm focus:ring-slate-500 focus:border-slate-500"
            >
              <option value="" disabled>Selecione um parâmetro</option>
              {parameters.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.id ? `(${p.id.slice(0, 8)})` : ''}
                </option>
              ))}
            </select>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">Data do Alerta</label>
          <input
            type="datetime-local"
            value={value.data ? new Date(value.data).toISOString().slice(0, 16) : ''}
            onChange={e => onChange({ data: new Date(e.target.value) })}
            className="mt-1 block w-full rounded-md border border-zinc-300 p-2 text-sm focus:ring-slate-500 focus:border-slate-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">Medidas ID (opcional)</label>
          <input
            type="text"
            value={value.medidasId || ''}
            onChange={e => onChange({ medidasId: e.target.value || undefined })}
            className="mt-1 block w-full rounded-md border border-zinc-300 p-2 text-sm focus:ring-slate-500 focus:border-slate-500"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="bg-zinc-200 text-zinc-800 rounded-lg py-3 px-8 text-base font-semibold hover:bg-zinc-300 transition-colors duration-300 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="bg-slate-900 text-white rounded-lg py-3 px-8 text-base font-semibold hover:bg-slate-800 transition-colors duration-300 disabled:opacity-50 cursor-pointer"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Salvando...
              </span>
            ) : (
              'Salvar'
            )}
          </button>

        </div>
      </form>
    </div>
  );
};

export default AlertForm;

