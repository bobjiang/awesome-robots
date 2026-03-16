interface FreshnessBadgeProps {
  date: string
  updated?: string
}

export default function FreshnessBadge({ date, updated }: FreshnessBadgeProps) {
  const badgeBase = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium'

  if (updated && updated !== date) {
    const formatted = new Date(updated).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    })
    return (
      <span className={`${badgeBase} bg-green-100 text-green-800`}>
        Updated {formatted}
      </span>
    )
  }

  const postDate = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - postDate.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)

  if (diffDays <= 7 && diffDays >= 0) {
    return (
      <span className={`${badgeBase} bg-blue-100 text-blue-800`}>
        New
      </span>
    )
  }

  return null
}
