/**
 * Comparison table for the pillar guides (same look as the /resume-format
 * formats table). The wrapper is a focusable, labeled region so keyboard users
 * can scroll it sideways on small screens.
 */
export function GuideTable({
  label,
  caption,
  columns,
  rows,
  minWidth = 560,
}: {
  label: string;
  caption: string;
  columns: string[];
  /** First cell is the row header. */
  rows: string[][];
  minWidth?: number;
}) {
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label={`${label} (scrolls sideways on small screens)`}
      className="relative mt-6 overflow-x-auto rounded-2xl bg-white p-1 [overflow-wrap:normal]"
    >
      <table className="w-full border-collapse text-[15px] leading-6" style={{ minWidth }}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c} scope="col" className="border-b border-[#e2e0ea] px-4 py-3 text-left font-bold text-[#121226]">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([head, ...cells]) => (
            <tr key={head} className="align-top transition-colors hover:bg-[#f7f6fb]">
              <th scope="row" className="border-b border-[#efedf7] px-4 py-3 text-left font-bold text-[#121226]">
                {head}
              </th>
              {cells.map((c, i) => (
                <td key={i} className="border-b border-[#efedf7] px-4 py-3">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
