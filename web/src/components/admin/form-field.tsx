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
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-x-3">
        <span className="text-[13px] font-bold text-[#4a4862]">
          {label}
          {required ? <span className="ml-1 text-[#c42b30]">*</span> : null}
        </span>
        {hint ? <span className="text-[12px] font-semibold text-[#66647c]">{hint}</span> : null}
      </div>
      {children}
      {error ? <p className="mt-1.5 text-[13px] font-medium text-[#c42b30]">{error}</p> : null}
    </label>
  );
}

/**
 * v5 field: 14px radius, 1.5px hairline, purple focus ring. 44px tall on phones
 * (16px text so iOS doesn't zoom), 40px from `sm`.
 */
const fieldBase =
  "block w-full rounded-[14px] border-[1.5px] border-[#e2e0ea] bg-white text-[16px] text-[#121226] outline-none transition-[border-color,box-shadow] placeholder:text-[#706e88] hover:border-[#c9c0ff] focus:border-[#5440e8] focus:ring-4 focus:ring-[#5440e8]/15 focus-visible:outline-none! disabled:cursor-not-allowed disabled:bg-[#f7f6fb] disabled:text-[#66647c] disabled:hover:border-[#e2e0ea] sm:text-[14px]";

/** Standard input styled to match the rest of the admin form fields. */
export function AdminInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${fieldBase} min-h-[44px] px-3.5 py-2 sm:min-h-[40px] ` + (props.className ?? "")} />;
}

export function AdminTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${fieldBase} px-3.5 py-2.5 leading-[1.55] ` + (props.className ?? "")} />;
}

export function AdminSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={
        `${fieldBase} min-h-[44px] cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22%2366647c%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20d%3D%22m4.427%206.427%203.396%203.396a.25.25%200%200%200%20.354%200l3.396-3.396A.25.25%200%200%200%2011.396%206H4.604a.25.25%200%200%200-.177.427Z%22%2F%3E%3C%2Fsvg%3E')] bg-[right_10px_center] bg-no-repeat py-2 pl-3.5 pr-9 sm:min-h-[40px] ` +
        (props.className ?? "")
      }
    />
  );
}
