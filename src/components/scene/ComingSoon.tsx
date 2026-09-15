import './coming-soon.css'

export function ComingSoon({ label }: { readonly label: string }) {
  return (
    <div className="scene-placeholder" role="status">
      <span>{label}</span>
      <strong>To be continue...</strong>
    </div>
  )
}
