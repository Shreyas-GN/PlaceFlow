"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2, Rocket, Edit3, MapPin, Layers, ListChecks, FileText, ChevronRight } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { useAdminStore } from "@/store/admin.store";
import { useMemoryStore } from "@/store/memory.store";
import DepartmentSelect from "./DepartmentSelect";
import { FormField } from "@/components/shared/FormField";

const COMPANY_TYPES = ["Product", "Service", "Startup", "MNC", "Government", "Consulting"];

const driveSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role is required"),
  package: z.string().min(1, "CTC is required"),
  min_cgpa: z.string().refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 10, {
    message: "CGPA must be between 0 and 10",
  }),
  eligible_departments: z.string().min(1, "Select at least one department"),
  deadline: z.string().min(1, "Deadline is required"),
  ctc: z.string().optional(),
  location: z.string().optional(),
  company_type: z.string().optional(),
  description: z.string().optional(),
  hiring_process: z.string().optional(),
  required_skills: z.string().optional(),
});

type DriveFormValues = z.infer<typeof driveSchema>;

interface CompanyData {
  id?: string;
  company_name?: string;
  role?: string;
  package?: string;
  min_cgpa?: number;
  eligible_departments?: string;
  deadline?: string;
  ctc?: string;
  location?: string;
  company_type?: string;
  description?: string;
  hiring_process?: string;
  required_skills?: string;
}

interface Props {
  mode: "create" | "edit";
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  company?: CompanyData | null;
}

const INPUT_CLS = "w-full bg-white border border-gray-300 rounded-[10px] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-400";

export default function CompanyFormModal({ mode, isOpen, onClose, onSuccess, company }: Props) {
  const isEdit = mode === "edit";
  const { optimisticAddDrive, optimisticUpdateDrive } = useAdminStore();
  const { addRecentDrive } = useMemoryStore();

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<DriveFormValues>({
    resolver: zodResolver(driveSchema),
    defaultValues: {
      company_name: "", role: "", package: "", min_cgpa: "0", eligible_departments: "",
      deadline: "", ctc: "", location: "", company_type: "", description: "", hiring_process: "", required_skills: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      reset({
        company_name: company?.company_name ?? "",
        role: company?.role ?? "",
        package: company?.package ?? "",
        min_cgpa: company?.min_cgpa?.toString() ?? "0",
        eligible_departments: company?.eligible_departments ?? "",
        deadline: company?.deadline ? new Date(company.deadline).toISOString().slice(0, 16) : "",
        ctc: company?.ctc ?? "",
        location: company?.location ?? "",
        company_type: company?.company_type ?? "",
        description: company?.description ?? "",
        hiring_process: company?.hiring_process ?? "",
        required_skills: company?.required_skills ?? "",
      });
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, company, reset]);

  const departments = watch("eligible_departments");
  const selectedType = watch("company_type");

  const onSubmit = async (values: DriveFormValues) => {
    const payload = {
      ...values,
      min_cgpa: parseFloat(values.min_cgpa),
      deadline: new Date(values.deadline).toISOString(),
      ctc: values.ctc || undefined,
      location: values.location || undefined,
      company_type: values.company_type || undefined,
      description: values.description || undefined,
      hiring_process: values.hiring_process || undefined,
      required_skills: values.required_skills || undefined,
    };

    const tempId = crypto.randomUUID();

    if (isEdit && company?.id) {
      optimisticUpdateDrive(company.id, payload);
      try {
        await adminService.updateCompany(company.id, payload);
        toast.success("Placement drive updated successfully!");
        addRecentDrive({ id: company.id, name: payload.company_name, role: payload.role });
        onSuccess();
        onClose();
      } catch (error: any) {
        optimisticUpdateDrive(company.id, {
          company_name: company.company_name, role: company.role, package: company.package,
          min_cgpa: company.min_cgpa, eligible_departments: company.eligible_departments, deadline: company.deadline,
        });
        toast.error(error.response?.data?.detail || "Failed to update drive");
      }
    } else {
      optimisticAddDrive({ ...payload, id: tempId, created_at: new Date().toISOString() });
      try {
        const created = await adminService.createCompany(payload) as any;
        if (created?.id && created.id !== tempId) optimisticUpdateDrive(tempId, { id: created.id });
        toast.success("Placement drive created successfully!");
        addRecentDrive({ id: created?.id ?? tempId, name: payload.company_name, role: payload.role });
        onSuccess();
        onClose();
      } catch (error: any) {
        optimisticUpdateDrive(tempId, { id: tempId, status: "__rollback__" });
        toast.error(error.response?.data?.detail || "Failed to create drive");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white border border-gray-200 rounded-2xl shadow-floating overflow-y-auto">
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${isEdit ? "bg-amber-50 border-amber-200" : "bg-blue-50 border-blue-200"}`}>
                {isEdit ? <Edit3 className="w-5 h-5 text-amber-600" /> : <Rocket className="w-5 h-5 text-blue-600" />}
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">{isEdit ? "Edit Placement Drive" : "New Placement Drive"}</h2>
                <p className="text-xs text-gray-500">{isEdit ? "Update recruitment opportunity details" : "Launch a new recruitment opportunity"}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Company Name" error={errors.company_name} required>
                {(id) => <input id={id} {...register("company_name")} placeholder="e.g. Google" className={INPUT_CLS} />}
              </FormField>

              <FormField label="Job Role" error={errors.role} required>
                {(id) => <input id={id} {...register("role")} placeholder="e.g. Software Engineer" className={INPUT_CLS} />}
              </FormField>

              <FormField label="CTC" error={errors.package} required>
                {(id) => <input id={id} {...register("package")} placeholder="e.g. 12 LPA or 8-12 LPA" className={INPUT_CLS} />}
              </FormField>

              <FormField label="Min. CGPA" error={errors.min_cgpa} required>
                {(id) => <input id={id} type="number" step="0.01" min="0" max="10" {...register("min_cgpa")} className={INPUT_CLS} />}
              </FormField>

              <FormField label="Location" error={errors.location}>
                {(id) => (
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input id={id} {...register("location")} placeholder="e.g. Bangalore / Remote" className={INPUT_CLS.replace("px-4", "pl-9 pr-4")} />
                  </div>
                )}
              </FormField>

              <FormField label="Company Type" error={errors.company_type}>
                {(id) => (
                  <div className="flex flex-wrap gap-1.5">
                    {COMPANY_TYPES.map((type) => (
                      <button key={type} type="button"
                        onClick={() => setValue("company_type", selectedType === type ? "" : type, { shouldValidate: true })}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                          selectedType === type
                            ? "bg-blue-50 border-blue-200 text-blue-700"
                            : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                        }`}>
                        {type}
                      </button>
                    ))}
                    <input id={id} type="hidden" {...register("company_type")} />
                  </div>
                )}
              </FormField>

              <div className="sm:col-span-2">
                <FormField label="Eligible Departments" error={errors.eligible_departments} required>
                  {() => (
                    <DepartmentSelect value={departments} onChange={(v) => setValue("eligible_departments", v, { shouldValidate: true })} />
                  )}
                </FormField>
              </div>

              <div className="sm:col-span-2">
                <FormField label="Application Deadline" error={errors.deadline} required>
                  {(id) => <input id={id} type="datetime-local" {...register("deadline")} className={INPUT_CLS} />}
                </FormField>
              </div>
            </div>

            {/* Extended details */}
            <div className="border-t border-gray-100 pt-5 space-y-4">
              <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                <ChevronRight className="w-3 h-3" />
                Extended Details
                <span className="text-gray-300 normal-case tracking-normal font-normal">— optional</span>
              </p>

              <FormField label="Job Description" error={errors.description}>
                {(id) => (
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-3.5 h-3.5 text-gray-400" />
                    <textarea id={id} {...register("description")} rows={3}
                      placeholder="Role overview, responsibilities, what the team does..."
                      className={`${INPUT_CLS.replace("px-4", "pl-9 pr-4")} resize-none`} />
                  </div>
                )}
              </FormField>

              <FormField label="Hiring Process" error={errors.hiring_process}>
                {(id) => (
                  <div className="relative">
                    <ListChecks className="absolute left-3 top-3 w-3.5 h-3.5 text-gray-400" />
                    <textarea id={id} {...register("hiring_process")} rows={2}
                      placeholder="e.g. OA → Technical Round → HR"
                      className={`${INPUT_CLS.replace("px-4", "pl-9 pr-4")} resize-none`} />
                  </div>
                )}
              </FormField>

              <FormField label="Required Skills" error={errors.required_skills}>
                {(id) => (
                  <div className="relative">
                    <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input id={id} {...register("required_skills")} placeholder="e.g. Java, Spring Boot, SQL, System Design"
                      className={INPUT_CLS.replace("px-4", "pl-9 pr-4")} />
                  </div>
                )}
              </FormField>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose}
                className="flex-1 h-11 rounded-[10px] font-medium border border-gray-300 hover:bg-gray-50 transition-colors text-sm text-gray-700">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting}
                className={`flex-[2] h-11 px-6 rounded-[10px] font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 text-sm text-white ${isEdit ? "bg-amber-500 hover:bg-amber-600" : "bg-blue-600 hover:bg-blue-700"}`}>
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />{isEdit ? "Updating..." : "Creating..."}</>
                ) : (
                  <>{isEdit ? <Edit3 className="w-4 h-4" /> : <Rocket className="w-4 h-4" />}{isEdit ? "Update Drive" : "Launch Drive"}</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
