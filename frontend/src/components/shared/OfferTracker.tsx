"use client";

import { cn } from "@/lib/utils";

interface OfferData {
  id: string;
  company: string;
  role: string;
  package: string;
  status: "accepted" | "pending" | "declined" | "expiring";
  deadline?: string;
  daysLeft?: number;
}

const OFFER_STATUS_STYLES = {
  accepted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  declined: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  expiring: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

export function OfferTracker({ offers }: { offers: OfferData[] }) {
  if (offers.length === 0) {
    return (
      <div className="space-y-2">
        <div className="op-label text-zinc-500">Offer Acceptance Tracker</div>
        <p className="text-xs text-zinc-600 py-3 text-center">No offers yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="op-label text-zinc-500">Offer Acceptance Tracker</div>
      <div className="space-y-1">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className={cn(
              "flex items-center justify-between px-3 py-2 rounded-lg border",
              OFFER_STATUS_STYLES[offer.status]
            )}
          >
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-zinc-300 truncate">
                {offer.company}
              </p>
              <p className="text-[11px] text-zinc-500 truncate">
                {offer.role} &middot; {offer.package}
              </p>
            </div>
            <div className="text-right shrink-0 ml-3">
              <span className="text-[11px] font-medium capitalize">
                {offer.status}
              </span>
              {offer.daysLeft !== undefined && offer.daysLeft <= 3 && (
                <p className="text-[10px] text-rose-400 tabular-nums">
                  {offer.daysLeft}d remaining
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OfferSummaryBar({
  accepted,
  pending,
  declined,
  expiring,
}: {
  accepted: number;
  pending: number;
  declined: number;
  expiring: number;
}) {
  const total = accepted + pending + declined + expiring;
  if (total === 0) return null;

  const segments = [
    { count: accepted, color: "bg-emerald-500", label: "Accepted" },
    { count: pending, color: "bg-amber-500", label: "Pending" },
    { count: declined, color: "bg-zinc-600", label: "Declined" },
    { count: expiring, color: "bg-rose-500", label: "Expiring" },
  ].filter((s) => s.count > 0);

  return (
    <div className="space-y-1.5">
      <div className="flex h-1.5 rounded-full overflow-hidden bg-zinc-800/60">
        {segments.map((seg) => (
          <div
            key={seg.label}
            className={seg.color}
            style={{ width: `${(seg.count / total) * 100}%` }}
          />
        ))}
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1">
            <div className={cn("w-1.5 h-1.5 rounded-full", seg.color)} />
            <span className="text-[10px] text-zinc-600 tabular-nums">
              {seg.count} {seg.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
