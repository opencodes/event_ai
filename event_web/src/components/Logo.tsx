import { Link } from 'react-router-dom'

interface LogoProps {
  to?: string
  className?: string
}

export function Logo({ to = '/', className = 'logo' }: LogoProps) {
  const content = (
    <>
      Utsav <span>Connect</span>
    </>
  )

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    )
  }

  return <div className={className}>{content}</div>
}
