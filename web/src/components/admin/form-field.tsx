import type { ReactNode } from "react";

export type FormFieldProps = {
  label: string;
  hint?: string;
  error?: string | null;
  required?: boolean;
  htmlFor?: string;
  children: ReactNode;
};

export function FormField({ label, hint, error, required, htmlFor, children }: FormFieldProps) {
  return (
    <label htmlFor={htmlFor} className="block">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[12px] font-semibold uppercase tracking-wider text-[#475569]">
          {label}
          {required ? <span className="ml-1 text-red-600">*</span> : null}
        </span>
        {hint ? <span className="text-[11px] text-[#94A3B8]">{hint}</span> : null}
      </div>
      {children}
      {error ? (
        <p className="mt-1.5 text-[12px] text-red-700">{error}</p>
      ) : null}
    </label>
  );
}

/** Standard input styled to match the rest of the admin form fields. */
export function AdminInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        "block w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-[13px] text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] hover:border-[#CBD5E1] focus:border-[#1A56DB] focus:ring-2 focus:ring-[#1A56DB]/15 disabled:bg-[#F8FAFC] disabled:text-[#94A3B8] " +
        (props.className ?? "")
      }
    />
  );
}

export function AdminTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={
        "block w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-[13px] leading-[1.55] text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] hover:border-[#CBD5E1] focus:border-[#1A56DB] focus:ring-2 focus:ring-[#1A56DB]/15 " +
        (props.className ?? "")
      }
    />
  );
}

export function AdminSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={
        "block w-full appearance-none rounded-lg border border-[#E2E8F0] bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22%2394a3b8%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20d%3D%22m4.427%206.427%203.396%203.396a.25.25%200%200%200%20.354%200l3.396-3.396A.25.25%200%200%200%2011.396%206H4.604a.25.25%200%200%200-.177.427Z%22%2F%3E%3C%2Fsvg%3E')] bg-[right_8px_center] bg-no-repeat px-3 py-2 pr-9 text-[13px] text-[#0F172A] outline-none transition hover:border-[#CBD5E1] focus:border-[#1A56DB] focus:ring-2 focus:ring-[#1A56DB]/15 " +
        (props.className ?? "")
      }
    />
  );
}
