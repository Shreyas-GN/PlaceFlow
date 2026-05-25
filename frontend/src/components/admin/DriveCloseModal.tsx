"use client";

import { useEffect, useState } from "react";
import { X, AlertTriangle, Loader2, Archive, Ban, CalendarX, Users, FileX } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface ConsequenceData {
  drive_name: string;
  pending_applicants: number;
  locked_scheduling: boolean;
  archived_recruiter_access: boolean;
  total_impacted: number;
}

interface Props {
  companyId: string;
  companyName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DriveCloseModal({ companyId, companyName, isOpen, onClose, onSuccess }: Props) {
  const [consequences, setConsequences] = useState<ConsequenceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      loadConsequences();
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const loadConsequences = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getDriveCloseConsequences(companyId);
      setConsequences(data);
    } catch {
      toast.error("Failed to load drive consequences");
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = async () => {
    setIsClosing(true);
    try {
      await adminService.closeDrive(companyId);
      toast.success("Drive closed successfully");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to close drive");
    } finally {
      setIsClosing(false);
    }
  };

  const isConfirmed = confirmText.toLowerCase() === companyName.toLowerCase();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-lg bg-layer-2 border border-zinc-800/60 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Warning header */}
            <div className="p-6 pb-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center shrink-0 border border-rose-500/20">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-rose-400">Close Placement Drive</h2>
                  <p className="text-sm text-zinc-400 mt-1">
                    This action has institutional consequences. Review the impact below before proceeding.
                  </p>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-zinc-800 rounded transition-colors shrink-0">
                  <X className="w-4 h-4 text-zinc-500" />
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="px-6 pb-6 flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              </div>
            ) : consequences ? (
              <>
                {/* Consequence list */}
                <div className="px-6 space-y-2">
                  <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-3.5 h-3.5 text-rose-400" />
                      <span className="text-xs font-semibold text-rose-300">Reject {consequences.pending_applicants} pending applicants</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 ml-5.5">
                      All applicants in Applied or Eligibility Conflict status will be moved to Rejected.
                    </p>
                  </div>

                  {consequences.locked_scheduling && (
                    <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarX className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-xs font-semibold text-amber-300">Lock interview scheduling</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 ml-5.5">
                        In-progress interviews will be archived. Scheduled interviews will be cancelled.
                      </p>
                    </div>
                  )}

                  <div className="p-3 rounded-lg bg-zinc-500/5 border border-zinc-800/40">
                    <div className="flex items-center gap-2 mb-2">
                      <Archive className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="text-xs font-semibold text-zinc-300">Archive recruiter access</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 ml-5.5">
                      Recruiters will lose access to this drive and its applicant data.
                    </p>
                  </div>
                </div>

                {/* Impact summary */}
                <div className="mx-6 mt-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Total impacted records</span>
                    <span className="text-lg font-bold text-rose-400 tabular-nums">{consequences.total_impacted}</span>
                  </div>
                </div>

                {/* Confirmation */}
                <div className="px-6 pt-4 pb-6">
                  <label className="text-[11px] text-zinc-500 block mb-1.5">
                    Type <span className="text-zinc-300 font-mono">{companyName}</span> to confirm
                  </label>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder={`Type "${companyName}" to confirm`}
                    className="w-full bg-zinc-900 border border-zinc-800/60 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500/40 transition-all"
                  />
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={onClose}
                      className="flex-1 h-10 rounded text-xs font-medium border border-zinc-800/60 hover:bg-zinc-900 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={!isConfirmed || isClosing}
                      onClick={handleClose}
                      className="flex-[2] h-10 rounded text-xs font-medium bg-rose-500 text-white hover:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                      {isClosing ? (
                        <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Closing...</>
                      ) : (
                        <><Ban className="w-3.5 h-3.5" /> Close Drive Permanently</>
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : null}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
