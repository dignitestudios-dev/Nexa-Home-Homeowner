export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
      <p className="text-xl font-semibold text-[#181818]">{title}</p>
      <p className="text-sm text-[rgba(24,24,24,0.5)]">This section is coming soon.</p>
    </div>
  )
}
