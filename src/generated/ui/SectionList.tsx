import React from 'react'

interface SectionListProps<T> {
  title?: string
  items: T[]
  columns: Array<{ key: keyof T & string; label: string }>
  onRowClick?: (row: T) => void
}

export function SectionList<T extends Record<string, any>>({ title, items, columns, onRowClick }: SectionListProps<T>) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {title && (
        <div className="px-4 py-3 border-b border-border text-sm font-medium">{title}</div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {columns.map(col => (
                <th key={col.key as string} className="text-left px-4 py-2 font-medium text-muted-foreground">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-muted-foreground">
                  No data
                </td>
              </tr>
            )}
            {items.map((row, idx) => (
              <tr
                key={idx}
                className={`border-t border-border hover:bg-muted/50 ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map(col => (
                  <td key={col.key as string} className="px-4 py-2 whitespace-nowrap">
                    {String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}