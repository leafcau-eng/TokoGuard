'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ANOMALIES } from '@/lib/mock-data';

export default function CaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const anomaly = ANOMALIES.find(a => a.id === id);
  const [status, setStatus] = useState(anomaly?.status ?? '');

  if (!anomaly) {
    return (
      <div className="bg-[#F0F1F3] rounded-2xl p-4 text-[#14161A] max-w-md mx-auto">
        <div className="text-[13px]">Case {id} tidak ditemukan.</div>
        <button onClick={() => router.push('/anomaly-center')} className="text-[12px] text-[#2454E8] mt-2">
          ← Kembali ke Anomaly Center
        </button>
      </div>
    );
  }

  const a = anomaly;

  return (
    <div className="bg-[#F0F1F3] rounded-2xl p-4 text-[#14161A] max-w-md mx-auto">
      <button onClick={() => router.back()} className="text-[12px] text-[#2454E8] mb-3 block">
        ← Kembali
      </button>

      <div className="bg-white border border-[#DADBDD] rounded-xl p-4 mb-3">
        <div className="font-mono text-[11px] text-[#8A8D91] mb-1">{a.id}</div>
        <div className="text-[12px] text-[#5B5F66] mb-2">{a.storeLabel} · {a.date}</div>
        <div className="flex justify-between items-center">
          <span className="text-[14px] font-medium">
            {a.severity ? `[${a.severity}]` : '— (severity belum dapat ditentukan)'}
          </span>
          <span className="text-[11px] text-[#5B5F66]">{status}</span>
        </div>
      </div>

      <div className="bg-white border border-[#DADBDD] rounded-xl p-4 mb-3">
        <div className="text-[12px] text-[#5B5F66] mb-1">Finding summary</div>
        <div className="text-[15px] font-medium mb-1">{a.title}</div>
        <div className="text-[12px] text-[#5B5F66] mb-2">
          {a.category === 'pattern' ? 'Anomaly detection — Behavioral pattern' : `Reconciliation — ${a.category}`}
        </div>
        {a.type === 'reconciliation' && (
          <div className="font-mono text-[13px] text-[#B23A2E]">variance {a.variance}</div>
        )}
        {a.type === 'insufficient' && (
          <div className="font-mono text-[13px] text-[#B8860B]">{a.gapNote}</div>
        )}
      </div>

      <div className="bg-white border border-[#DADBDD] rounded-xl p-4 mb-3">
        <div className="text-[12px] text-[#5B5F66] mb-2.5">Evidence chain</div>

        {a.type === 'reconciliation' && (
          <>
            <ChainStep n={1} label="Source data" content={a.sourceData} />
            <ChainStep n={2} label="Calculation" content={a.calculation} />
            <ChainStep n={3} label="Detected variance" content={`expected ${a.expected} → actual ${a.actual} = variance ${a.variance}`} mono color="#B23A2E" />
            <ChainStep n={4} label="Anomaly" content={`[${a.severity}] ${a.title}`} bold />
          </>
        )}
        {a.type === 'behavioral' && (
          <>
            <ChainStep n={1} label="Source data" content={a.sourceData} />
            <ChainStep n={2} label="Rule" content={a.detectionRule} />
            <ChainStep n={3} label="Observed pattern" content={a.observedPattern} />
            <ChainStep n={4} label="Anomaly" content={`[${a.severity}] ${a.title}`} bold />
          </>
        )}
        {a.type === 'insufficient' && (
          <>
            <ChainStep n={1} label="Source data available" content={a.sourceAvail} />
            <ChainStep n={2} label="Calculation attempted" content={a.calcAttempt} />
            <ChainStep n={3} label="Missing source" content={a.missingSource} color="#B8860B" />
            <ChainStep n={4} label="Conclusion" content="Status: Insufficient data" bold />
          </>
        )}
      </div>

      <div className="bg-white border border-[#DADBDD] rounded-xl p-4 mb-3">
        <div className="text-[12px] text-[#5B5F66] mb-2">Evidence detail</div>
        <div className="text-[12px] leading-relaxed">
          {a.evidenceDetail.map((f, i) => <div key={i}>{f}</div>)}
        </div>
      </div>

      <div className="bg-white border border-[#DADBDD] rounded-xl p-4 mb-3">
        <div className="text-[12px] text-[#5B5F66] mb-2">Audit explanation</div>
        <div className="text-[12px] leading-relaxed">
          {a.type === 'reconciliation' && (
            <>
              <div><b>Why this was flagged:</b> hasil rekonsiliasi menunjukkan variance {a.variance} antara expected dan actual.</div>
              <div className="mt-1.5"><b>Rule triggered:</b> {a.ruleTriggered}</div>
            </>
          )}
          {a.type === 'behavioral' && (
            <>
              <div><b>Why this was flagged:</b> {a.reasonFlagged}</div>
              <div className="mt-1.5"><b>Rule triggered:</b> {a.detectionRule}</div>
            </>
          )}
          {a.type === 'insufficient' && (
            <>
              <div><b>Why this was flagged:</b> {a.explainWhy}</div>
              <div className="mt-1.5"><b>Rule triggered:</b> {a.ruleTriggered}</div>
              <div className="mt-1.5 text-[#B8860B]"><b>Limitation:</b> {a.missingSource} TokoGuard tidak memberikan kesimpulan variance yang confirmed sampai source ini tersedia.</div>
            </>
          )}
        </div>
      </div>

      <div className="bg-white border border-[#DADBDD] rounded-xl p-4 mb-3">
        <div className="text-[12px] text-[#5B5F66] mb-2.5">Resolusi manual</div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setStatus('Sudah diperiksa')}
            className="border border-[#C7C9CC] rounded-lg py-2.5 text-[13px]"
          >
            Tandai sudah diperiksa
          </button>
          {'recountLabel' in a && a.recountLabel ? (
            <button
              onClick={() => setStatus(a.recountLabel!.replace('Perlu ', 'Menunggu '))}
              className="border border-[#C7C9CC] rounded-lg py-2.5 text-[13px]"
            >
              {a.recountLabel}
            </button>
          ) : (
            <div className="text-[11px] text-[#8A8D91] text-center">
              Tidak ada aksi hitung ulang — kategori ini tidak melibatkan physical recount
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-[#DADBDD] rounded-xl p-4">
        <div className="text-[12px] text-[#5B5F66] mb-1">Evidence export</div>
        <div className="text-[12px] text-[#8A8D91]">Belum tersedia — backend export belum diimplementasi</div>
      </div>
    </div>
  );
}

function ChainStep({ n, label, content, mono, bold, color }: { n: number; label: string; content: string; mono?: boolean; bold?: boolean; color?: string }) {
  return (
    <div className="py-2 border-t border-[#E5E6E8] first:border-t-0">
      <div className="text-[11px] text-[#8A8D91]">{n}. {label}</div>
      <div
        className={`text-[12px] mt-0.5 ${mono ? 'font-mono' : ''} ${bold ? 'font-medium' : ''}`}
        style={color ? { color } : undefined}
      >
        {content}
      </div>
    </div>
  );
}
