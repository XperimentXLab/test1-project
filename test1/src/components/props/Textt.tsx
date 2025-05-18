interface SpannnProps {
  children: React.ReactNode
  label: string
}

const Spannn: React.FC<SpannnProps> = ({ children, label }) => {
  return (
    <div className="flex gap-2 text-md">
      <span className="font-bold">{label}: </span>
      <span className="font-mono">{children}
      </span>
    </div>
  )
}

export default Spannn