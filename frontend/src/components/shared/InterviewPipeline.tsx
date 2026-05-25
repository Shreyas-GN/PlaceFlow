"use client";

import { cn } from "@/lib/utils";

export const PIPELINE_STAGES = [
  { key: "Applied", label: "Applied", color: "bg-blue-500" },
  { key: "Screening", label: "Screening", color: "bg-indigo-500" },
  { key: "Technical", label: "Technical", color: "bg-violet-500" },
  { key: "HR", label: "HR Round", color: "bg-pink-500" },
  { key: "Offer", label: "Offer", color: "bg-emerald-500" },
] as const;

export function InterviewPipeline({
  currentStage,
  stages,
}: {
  currentStage: string;
  stages?: readonly { key: string; label: string; color: string }[];
}) {
  const pipeline = stages || PIPELINE_STAGES;
  const currentIdx = pipeline.findIndex(
    (s) => s.key.toLowerCase() === currentStage.toLowerCase()
  );

  return (
    <div className="space-y-2">
      <div className="op-label text-zinc-500">Interview Pipeline</div>
      <div className="flex items-center gap-0">
        {pipeline.map((stage, i) => {
          const isReached = i <= currentIdx;
          const isCurrent = i === currentIdx;
          return (
            <div key={stage.key} className="flex items-center flex-1 min-w-0">
              <div
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1.5 text-[11px] font-medium transition-colors",
                  isReached ? "text-zinc-200" : "text-zinc-600"
                )}
              >
                <div
                  className={cn(
                    "w-2 h-2 rounded-full shrink-0",
                    isReached ? stage.color : "bg-zinc-700",
                    isCurrent && "ring-2 ring-offset-1 ring-offset-layer-2 ring-primary/40"
                  )}
                />
                <span className="truncate">{stage.label}</span>
              </div>
              {i < pipeline.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-px mx-1",
                    i < currentIdx ? "bg-zinc-600" : "bg-zinc-800"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CompactPipelineStages({
  currentStage,
  stageCounts,
}: {
  currentStage: string;
  stageCounts: Record<string, number>;
}) {
  const pipeline = PIPELINE_STAGES;
  const currentIdx = pipeline.findIndex(
    (s) => s.key.toLowerCase() === currentStage.toLowerCase()
  );

  return (
    <div className="flex items-center gap-1">
      {pipeline.map((stage, i) => {
        const isReached = i <= currentIdx;
        const count = stageCounts[stage.key] || 0;
        return (
          <div key={stage.key} className="flex items-center gap-0.5">
            <div
              className={cn(
                "px-1.5 py-0.5 rounded text-[10px] font-medium tabular-nums",
                isReached
                  ? `${stage.color}/20 text-white`
                  : "bg-zinc-800/40 text-zinc-600"
              )}
            >
              {count}
            </div>
            {i < pipeline.length - 1 && (
              <div
                className={cn(
                  "w-3 h-px",
                  i < currentIdx ? "bg-zinc-600" : "bg-zinc-800"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
