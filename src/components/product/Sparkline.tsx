import { useId } from 'react'
import { cn } from '@/lib/cn'

type SparklineProps = {
  /** Normalised 0–1 samples. */
  points: number[]
  className?: string
  width?: number
  height?: number
}

/**
 * Hand-rolled sparkline. A charting library for nine points would be a
 * dependency for nothing, and this way the curve inherits `currentColor`.
 */
export function Sparkline({ points, className, width = 96, height = 28 }: SparklineProps) {
  const gradientId = useId()
  const step = width / Math.max(1, points.length - 1)
  const pad = 2

  const coords = points.map((value, index) => {
    const x = index * step
    const y = height - pad - value * (height - pad * 2)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })

  const line = `M ${coords.join(' L ')}`
  const area = `${line} L ${width},${height} L 0,${height} Z`

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn('h-7 w-24 overflow-visible', className)}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} />
      <path
        d={line}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
