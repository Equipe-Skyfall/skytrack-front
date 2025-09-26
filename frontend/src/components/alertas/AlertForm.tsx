import React, { useEffect, useState } from 'react';

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
        // expect { data: stations, pagination } or an array
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
        // backend Parameter model does not include a human-readable name
        // try to map parameter.tipoParametroId -> TipoParametro.nome
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

  // refetch parameters when stationId changes
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
          // map tipoParametroId -> nome from previously loaded tipoParametros
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form onSubmit={onSubmit} className="bg-white p-6 rounded w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{title || 'Formulário de Alerta'}</h2>
        <label className="block mb-2">
          <span className="text-sm text-gray-700">Estação (MAC)</span>
          {loadingStations ? (
            <div className="mt-1 text-sm text-gray-500">Carregando estações...</div>
          ) : (
            <select value={value.stationId || ''} onChange={e => { onChange({ stationId: e.target.value, parameterId: '' }); }} required className="mt-1 block w-full border rounded p-2">
              <option value="">-- Selecionar estação --</option>
              {stations.map(s => (
                <option key={s.mac} value={s.mac}>{s.name ? `${s.name} (${s.mac})` : s.mac}</option>
              ))}
            </select>
          )}
        </label>
        <label className="block mb-2">
          <span className="text-sm text-gray-700">Tipo de Alerta</span>
          <select value={(value as any).tipoAlertaId || ''} onChange={e => onChange({ tipoAlertaId: e.target.value })} className="mt-1 block w-full border rounded p-2">
            <option value="">-- Selecionar tipo de alerta --</option>
            {tipoAlertas.map(t => (
              <option key={t.id} value={t.id}>{t.tipo} {t.id ? `(${t.id.slice(0,8)})` : ''}</option>
            ))}
          </select>
        </label>
        <label className="block mb-2">
          <span className="text-sm text-gray-700">Parâmetro</span>
          {loadingParams ? (
            <div className="mt-1 text-sm text-gray-500">Carregando parâmetros...</div>
          ) : (
            <select value={value.parameterId || ''} onChange={e => onChange({ parameterId: e.target.value })} className="mt-1 block w-full border rounded p-2">
              <option value="">-- Selecionar parâmetro (ou cole o ID) --</option>
              {parameters.map(p => (
                <option key={p.id} value={p.id}>{p.name} {p.id ? `(${p.id.slice(0,8)})` : ''}</option>
              ))}
            </select>
          )}
        </label>
        <label className="block mb-2">
          <span className="text-sm text-gray-700">Data do Alerta</span>
          <input type="datetime-local" value={value.data ? new Date(value.data).toISOString().slice(0,16) : ''} onChange={e => onChange({ data: new Date(e.target.value) })} className="mt-1 block w-full border rounded p-2" />
        </label>
        <label className="block mb-2">
          <span className="text-sm text-gray-700">Medidas ID (opcional)</span>
          <input type="text" value={value.medidasId || ''} onChange={e => onChange({ medidasId: e.target.value || undefined })} className="mt-1 block w-full border rounded p-2" />
        </label>

        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded border">Cancelar</button>
          <button type="submit" disabled={submitting} className="px-4 py-2 rounded bg-indigo-600 text-white">{submitting ? 'Salvando...' : 'Salvar'}</button>
        </div>
      </form>
    </div>
  );
};

export default AlertForm;
