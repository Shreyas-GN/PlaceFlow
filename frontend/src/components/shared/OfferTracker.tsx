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
  accepted: "bg-green-50 text-green-700 border-green-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  declined: "bg-gray-100 text-gray-500 border-gray-200",
  expiring: "bg-red-50 text-red-700 border-red-200",
};

export function OfferTracker({ offers }: { offers: OfferData[] }) {
  if (offers.length === 0) {
    return (
      <div className="space-y-2">
        <div className="text-xs font-medium text-gray-500">Offer Acceptance Tracker</div>
        <p className="text-xs text-gray-400 py-3 text-center">No offers yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-gray-500">Offer Acceptance Tracker</div>
      <div className="space-y-1">
        {offers.map((offer) => (
          <div key={offer.id} className={cn("flex items-center justify-between px-3 py-2 rounded-lg border", OFFER_STATUS_STYLES[offer.status])}>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-900 truncate">{offer.company}</p>
              <p className="text-[11px] text-gray-500 truncate">{offer.role} &middot; {offer.package}</p>
            </div>
            <div className="text-right shrink-0 ml-3">
              <span className="text-[11px] font-medium capitalize">{offer.status}</span>
              {offer.daysLeft !== undefined && offer.daysLeft <= 3 && (
                <p className="text-[10px] text-red-600 tabular-nums">{offer.daysLeft}d remaining</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OfferSummaryBar({ accepted, pending, declined, expiring }: { accepted: number; pending: number; declined: number; expiring: number; }) {
  const total = accepted + pending + declined + expiring;
  if (total === 0) return null;

  const segments = [
    { count: accepted, color: "bg-green-500", label: "Accepted" },
    { count: pending, color: "bg-amber-500", label: "Pending" },
    { count: declined, color: "bg-gray-300", label: "Declined" },
    { count: expiring, color: "bg-red-500", label: "Expiring" },
  ].filter((s) => s.count > 0);

  return (
    <div className="space-y-1.5">
      <div className="flex h-1.5 rounded-full overflow-hidden bg-gray-100">
        {segments.map((seg) => (
          <div key={seg.label} className={seg.color} style={{ width: `${(seg.count / total) * 100}%` }} />
        ))}
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1">
            <div className={cn("w-1.5 h-1.5 rounded-full", seg.color)} />
            <span className="text-[10px] text-gray-400 tabular-nums">{seg.count} {seg.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
