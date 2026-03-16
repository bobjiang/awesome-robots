export interface WeekGroup {
  weekLabel: string
  weekStart: string
  posts: Array<{ title: string; slug: string; date: string; category: string; [key: string]: unknown }>
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * Get the Monday (ISO week start) for a given date.
 * ISO weeks start on Monday.
 */
function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getUTCDay()
  // Sunday is 0, Monday is 1, etc.
  const diff = day === 0 ? -6 : 1 - day
  d.setUTCDate(d.getUTCDate() + diff)
  d.setUTCHours(0, 0, 0, 0)
  return d
}

/**
 * Format a week label like "Mar 9 – Mar 15, 2026"
 */
function formatWeekLabel(monday: Date): string {
  const sunday = new Date(monday)
  sunday.setUTCDate(sunday.getUTCDate() + 6)

  const startMonth = MONTH_NAMES[monday.getUTCMonth()]
  const startDay = monday.getUTCDate()
  const endMonth = MONTH_NAMES[sunday.getUTCMonth()]
  const endDay = sunday.getUTCDate()
  const year = sunday.getUTCFullYear()

  return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${year}`
}

/**
 * Groups posts by ISO week (Monday start).
 * Returns WeekGroup[] sorted by week descending (newest first).
 * Posts within each week sorted by date descending.
 */
export function groupPostsByWeek<T extends { date: string; title: string; slug: string; category: string }>(
  posts: T[]
): WeekGroup[] {
  if (posts.length === 0) return []

  const weekMap = new Map<string, { weekStart: Date; posts: T[] }>()

  for (const post of posts) {
    const postDate = new Date(post.date)
    const monday = getMonday(postDate)
    const key = monday.toISOString().slice(0, 10)

    if (!weekMap.has(key)) {
      weekMap.set(key, { weekStart: monday, posts: [] })
    }
    weekMap.get(key)!.posts.push(post)
  }

  const groups: WeekGroup[] = Array.from(weekMap.values()).map(({ weekStart, posts: weekPosts }) => ({
    weekLabel: formatWeekLabel(weekStart),
    weekStart: weekStart.toISOString().slice(0, 10),
    posts: weekPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  }))

  groups.sort((a, b) => b.weekStart.localeCompare(a.weekStart))

  return groups
}
