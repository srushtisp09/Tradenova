import { useMemo, useState } from 'react';

// Reusable table. Click a column heading to sort. Scrolls sideways on small screens.
// columns: [{ key, label, align: 'left' | 'right', render(row), sortValue(row) }]
export default function DataTable({ columns, rows, rowKey, footer }) {
  const [sort, setSort] = useState(null); // { key, dir }

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    const get = col.sortValue || ((r) => r[col.key]);
    return [...rows].sort((a, b) => {
      const x = get(a), y = get(b);
      const r = typeof x === 'string' ? x.localeCompare(y) : x - y;
      return sort.dir === 'asc' ? r : -r;
    });
  }, [rows, sort, columns]);

  // asc -> desc -> no sort
  const toggle = (key) =>
    setSort((s) => (s && s.key === key ? (s.dir === 'asc' ? { key, dir: 'desc' } : null) : { key, dir: 'asc' }));

  return (
    <div className="glass overflow-x-auto">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-line text-mute">
            {columns.map((c) => (
              <th key={c.key} scope="col" className={`px-4 py-3 font-medium ${c.align === 'right' ? 'text-right' : 'text-left'}`}
                aria-sort={sort?.key === c.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                {c.sortable === false ? c.label : (
                  <button onClick={() => toggle(c.key)} className="inline-flex items-center gap-1 hover:text-ink">
                    {c.label}
                    <span aria-hidden className="text-xs">{sort?.key === c.key ? (sort.dir === 'asc' ? '▲' : '▼') : ''}</span>
                  </button>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={row[rowKey]} className="border-b border-line/50 transition hover:bg-line/20">
              {columns.map((c) => (
                <td key={c.key} className={`px-4 py-3 ${c.align === 'right' ? 'text-right' : 'text-left'}`}>
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {footer && <tfoot><tr className="font-semibold">{footer}</tr></tfoot>}
      </table>
    </div>
  );
}
