"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { InterviewPipeline, CompactPipelineStages } from "@/components/shared/InterviewPipeline";
import { ConversionFunnel, FunnelMetrics } from "@/components/shared/ConversionFunnel";
import { OfferTracker } from "@/components/shared/OfferTracker";
import { Tabs } from "radix-ui";
import { cn } from "@/lib/utils";

interface StageCounts {
  Applied: number;
  Screening: number;
  Technical: number;
  HR: number;
  Offer: number;
  [key: string]: number;
}

interface FunnelStage {
  key: string;
  label: string;
  count: number;
  color: string;
}

interface AnalyticsPanelProps {
  stageCounts: StageCounts;
  funnelStages: FunnelStage[];
  totalApplicants: number;
}

const TABS = ["pipeline", "funnel", "offers"] as const;
type TabKey = typeof TABS[number];

const TAB_LABELS: Record<TabKey, string> = {
  pipeline: "Pipeline",
  funnel: "Funnel",
  offers: "Offers",
};

export function AnalyticsPanel({ stageCounts, funnelStages, totalApplicants }: AnalyticsPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("pipeline");

  const currentStage =
    stageCounts.Offer > 0 ? "Offer"
      : stageCounts.HR > 0 ? "HR"
        : stageCounts.Technical > 0 ? "Technical"
          : stageCounts.Screening > 0 ? "Screening"
            : "Applied";

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
        <Tabs.Root value={activeTab} onValueChange={(v) => setActiveTab(v as TabKey)}>
          <Tabs.List className="flex items-center gap-1">
            {TABS.map((tab) => (
              <Tabs.Trigger
                key={tab}
                value={tab}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  activeTab === tab
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                {TAB_LABELS[tab]}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>

        <button
          onClick={() => setCollapsed((c) => !c)}
          className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label={collapsed ? "Expand analytics" : "Collapse analytics"}
        >
          {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {!collapsed && (
        <div className="p-5">
          {activeTab === "pipeline" && (
            <>
              <InterviewPipeline currentStage={currentStage} />
              <div className="mt-4 pt-4 border-t border-gray-100">
                <CompactPipelineStages currentStage="Applied" stageCounts={stageCounts} />
              </div>
            </>
          )}
          {activeTab === "funnel" && (
            <>
              <ConversionFunnel stages={funnelStages} total={totalApplicants} />
              <FunnelMetrics stages={funnelStages} total={totalApplicants} />
            </>
          )}
          {activeTab === "offers" && <OfferTracker offers={[]} />}
        </div>
      )}
    </div>
  );
}
