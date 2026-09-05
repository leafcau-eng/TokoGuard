'use client';
import Link from 'next/link';
import { useStore } from '@/contexts/StoreContext';
import { STORES, getStoreMeta, getRiskCounts, getReconciliationCounts, ANOMALIES } from '@/lib/mock-data';
import { Severity, StoreFilter } from '@/lib/types';

const SEVERITIES: Severity[] = ['critical', 'high', 'medium', 'low'];

export default function DashboardPage() {
  const { store, setStore } = useStore();
  const meta = getStoreMeta(store);
  const { counts, lowInsufficient } = getRiskCounts(store);
  const recon = getReconciliationCounts(store);
  const criticalFindings = ANOMALIES.filter(a => a.severity === 'critical').slice(0, 2);

  return (
    <div className="bg-[#F0F1F3] rounded-2xl p-4 text-[#14161A] max-w-md mx-auto">
      <div className="mb-3">
        <span className="font-medium text-[15px]">TokoGuard</span>
      </div>
      <div className="flex justify-between items-center mb-4 gap-2">
        <select
          value={store}
          onChange={e => setStore(e.target.value as StoreFilter)}
          className="text-[13px] border border-[#C7C9CC] rounded-lg px-2 py-1.5 bg-white"
        >
          <option value="all">Semua toko</option>
          {STORES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <span className="text-[12px] text-[#5B5F66] font-mono">update {meta.freshnessLabel}</span>
      </div>

      <div className="bg-white border border-[#DADBDD] rounded-xl p-4 mb-3">
        <div className="text-[12px] text-[#5B5F66] mb-0.5">Audit confidence</div>
        <div className="font-mono text-[30px] font-medium text-[#2454E8]">{meta.confidence}%</div>
        <div className="text-[12px] font-mono text-[#5B5F66] mt-1.5">coverage {meta.coverage}% · update {meta.freshnessLabel}</div>
        <div className="text-[12px] font-mono mt-2 pt-2 border-t border-[#E5E6E8]">
          sales {meta.sources.sales ? 'ok' : '—'} · purchase {meta.sources.purchase ? 'ok' : '—'} · waste {meta.sources.waste ? 'ok' : '—'} · opname {meta.sources.opname ? 'ok' : '—'}
        </div>
      </div>

      <div className="bg-white border border-[#DADBDD] rounded-xl p-4 mb-3">
        <div className="text-[12px] text-[#5B5F66] mb-2">Risk overview</div>
        <div className="font-mono text-[13px] leading-relaxed">
          {SEVERITIES.map(sev => (
            <div key={sev}>
              [{sev}] {sev === 'low' && lowInsufficient && counts.low === 0 ? '— (data belum cukup)' : counts[sev]}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#DADBDD] rounded-xl p-4 mb-3">
        <div className="text-[12px] text-[#5B5F66] mb-2">Reconciliation health</div>
        <div className="font-mono text-[13px] leading-relaxed">
          {recon.map(r => (
            <div key={r.category} className="text-[#B23A2E]">{r.category} — variance ({r.count})</div>
          ))}
        </div>
        <div className="text-[11px] text-[#8A8D91] mt-2 pt-2 border-t border-[#E5E6E8]">
          angka = jumlah anomaly berkategori reconciliation (payment/cash/stock).
        </div>
      </div>

      <div className="bg-white border border-[#DADBDD] rounded-xl p-4 mb-3">
        <div className="text-[12px] text-[#5B5F66] mb-1">Inventory health grid</div>
        <div className="text-[13px] font-medium mb-1">Data belum tersedia</div>
        <div className="text-[12px] text-[#5B5F66]">Per-SKU inventory reconciliation belum tersedia pada data saat ini.</div>
      </div>

      <div className="bg-white border border-[#DADBDD] rounded-xl p-4">
        <div className="text-[12px] text-[#5B5F66] mb-2">Recent critical findings</div>
        <a href="/anomaly-center" className="text-[12px] text-[#2454E8] block mb-2">Lihat semua anomaly →</a>
        {criticalFindings.map(a => (
          <Link
            key={a.id}
            href={`/case/${a.id}`}
            className="flex justify-between items-center py-2 border-t border-[#E5E6E8] text-[13px]"
          >
            <span>{a.title}{a.type === 'reconciliation' ? ` — variance ${a.variance}` : ''}</span>
            <span className="text-[#8A8D91]">&rarr;</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
