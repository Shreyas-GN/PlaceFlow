"use client";

import { useEffect, useState } from "react";
import { X, AlertTriangle, Loader2, Archive, Ban, CalendarX, Users } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-floating overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-semibold text-red-600">Close Placement Drive</h2>
              <p className="text-sm text-gray-500 mt-1">
                This action has institutional consequences. Review the impact below before proceeding.
              </p>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors shrink-0">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="px-6 pb-6 flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          </div>
        ) : consequences ? (
          <>
            <div className="px-6 space-y-2">
              <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                <div className="flex items-center gap-2 mb-1.5">
                  <Users className="w-3.5 h-3.5 text-red-500" />
                  <span className="text-xs font-semibold text-red-700">Reject {consequences.pending_applicants} pending applicants</span>
                </div>
                <p className="text-[11px] text-gray-500 ml-5">All applicants in Applied or Eligibility Conflict status will be moved to Rejected.</p>
              </div>

              {consequences.locked_scheduling && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                  <div className="flex items-center gap-2 mb-1.5">
                    <CalendarX className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-xs font-semibold text-amber-700">Lock interview scheduling</span>
                  </div>
                  <p className="text-[11px] text-gray-500 ml-5">In-progress interviews will be archived. Scheduled interviews will be cancelled.</p>
                </div>
              )}

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-2 mb-1.5">
                  <Archive className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-xs font-semibold text-gray-700">Archive recruiter access</span>
                </div>
                <p className="text-[11px] text-gray-500 ml-5">Recruiters will lose access to this drive and its applicant data.</p>
              </div>
            </div>

            <div className="mx-6 mt-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Total impacted records</span>
                <span className="text-lg font-bold text-red-600 tabular-nums">{consequences.total_impacted}</span>
              </div>
            </div>

            <div className="px-6 pt-4 pb-6">
              <label className="text-xs font-medium text-gray-700 block mb-1.5">
                Type <span className="text-gray-900 font-mono">{companyName}</span> to confirm
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={`Type "${companyName}" to confirm`}
                className="w-full bg-white border border-gray-300 rounded-[10px] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all text-gray-900 placeholder:text-gray-400"
              />
              <div className="flex gap-3 mt-4">
                <button onClick={onClose}
                  className="flex-1 h-10 rounded-[10px] text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors text-gray-700">
                  Cancel
                </button>
                <button disabled={!isConfirmed || isClosing} onClick={handleClose}
                  className="flex-[2] h-10 rounded-[10px] text-sm font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
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
      </div>
    </div>
  );
}
