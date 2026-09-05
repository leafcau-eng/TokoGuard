'use client';
import { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@/contexts/StoreContext';
import { STORES, getAnomaliesForTab, getRiskCounts } from '@/lib/mock-data';
import { Severity, StoreFilter, Anomaly } from '@/lib/types';

const SEVERITIES: Severity[] = ['critical', 'high', 'medium', 'low'];
type TabValue = 'all' | Severity;

export default function AnomalyCenterPage() {
  return (
    <Suspense fallback={<div className="text-[13px] text-[#5B5F66] p-4">Memuat...</div>}>
      <AnomalyCenterContent />
    </Suspense>
  );
}

function AnomalyCenterContent() {
  const { store, setStore } = useStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = (searchParams.get('severity') as TabValue) || 'all';

  const { counts } = getRiskCounts(store);
  const list = getAnomaliesForTab(store, tab);

  function setTab(next: TabValue) {
    const params = new URLSearchParams(searchParams.toString());
    if (next === 'all') params.delete('severity'); else params.set('severity', next);
    router.push(`/anomaly-center?${params.toString()}`);
  }

  return (
    <div className="bg-[#F0F1F3] rounded-2xl p-4 text-[#14161A] max-w-md mx-auto">
      <div className="flex justify-between items-center mb-3">
        <span className="font-medium text-[15px]">Anomaly center</span>
      </div>
      <div className="mb-4">
        <select
          value={store}
          onChange={e => setStore(e.target.value as StoreFilter)}
          className="text-[13px] border border-[#C7C9CC] rounded-lg px-2 py-1.5 bg-white"
        >
          <option value="all">Semua toko</option>
          {STORES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      <div className="flex flex-wrap gap-3 mb-1 font-mono text-[13px]">
        <button
          onClick={() => setTab('all')}
          className={`pb-1 border-b-2 ${tab === 'all' ? 'border-[#14161A] font-medium' : 'border-transparent'}`}
        >
          [all]
        </button>
        {SEVERITIES.map(sev => (
          <button
            key={sev}
            onClick={() => setTab(sev)}
            className={`pb-1 border-b-2 ${tab === sev ? 'border-[#14161A] font-medium' : 'border-transparent'}`}
          >
            [{sev}] {counts[sev]}
          </button>
        ))}
      </div>
      <div className="text-[11px] text-[#8A8D91] mb-4">
        Filter lanjutan (kategori, tanggal, sumber rekonsiliasi) — ditunda sampai ada kebutuhan nyata.
      </div>

      {list.length === 0 ? (
        <div className="bg-white border border-[#DADBDD] rounded-xl p-4">
          <div className="text-[13px] font-medium mb-1">No anomalies detected</div>
          <div className="text-[12px] text-[#5B5F66]">Periode diperiksa: 30 Agu – 04 Sep 2026. Semua sumber data untuk kategori ini lengkap.</div>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {list.map(a => <AnomalyCard key={a.id} anomaly={a} />)}
        </div>
      )}
    </div>
  );
}

function AnomalyCard({ anomaly: a }: { anomaly: Anomaly }) {
  return (
    <Link href={`/case/${a.id}`} className="bg-white border border-[#DADBDD] rounded-xl p-3.5 block">
      {a.type === 'insufficient' ? (
        <div className="text-[13px] font-medium mb-1">Insufficient data — {a.title}</div>
      ) : (
        <div className="text-[13px] font-medium mb-1">[{a.severity}] {a.title}</div>
      )}

      {a.type === 'reconciliation' && (
        <div className="font-mono text-[12px] text-[#B23A2E] mb-1">variance {a.variance}</div>
      )}
      {a.type === 'insufficient' && (
        <div className="font-mono text-[12px] text-[#B8860B] mb-1">{a.gapNote}</div>
      )}

      <div className="text-[11px] text-[#8A8D91] mb-2">{a.storeLabel} · {a.date}</div>

      {a.type === 'reconciliation' && (
        <div className="font-mono text-[11px] text-[#5B5F66] mb-2">expected {a.expected} → actual {a.actual}</div>
      )}

      <div className="text-[11px] text-[#5B5F66] mb-2 line-clamp-2">
        {a.type === 'reconciliation' ? a.sourceData : a.type === 'behavioral' ? a.sourceData : a.sourceAvail}
      </div>

      <div className="text-[12px] text-[#2454E8]">View evidence →</div>
    </Link>
  );
}
