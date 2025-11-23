export function StatsCards({ items }: { items: { title: string; value: string; hint?: string }[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((item) => (
        <div key={item.title} className="card">
          <p className="text-sm text-gray-500">{item.title}</p>
          <p className="text-2xl font-semibold mt-2">{item.value}</p>
          {item.hint && <p className="text-xs text-gray-400 mt-1">{item.hint}</p>}
        </div>
      ))}
    </div>
  );
}
