'use client'

import { memo } from 'react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

interface SparklineProps {
  data: number[]
  color?: string
  height?: number
  showDot?: boolean
}

export const Sparkline = memo(function Sparkline({
  data,
  color = 'hsl(var(--primary))',
  height = 40,
  showDot = false,
}: SparklineProps) {
  if (data.length === 0) {
    return <div style={{ height }} className="bg-muted rounded" />
  }

  const chartData = data.map((value, index) => ({ value, index }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={showDot}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
})
