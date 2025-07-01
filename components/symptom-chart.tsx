"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Symptom } from "@/lib/types"

interface SymptomChartProps {
  symptoms: Symptom[]
}

export function SymptomChart({ symptoms }: SymptomChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || symptoms.length === 0) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Group symptoms by name
    const symptomsByName: Record<string, Symptom[]> = {}
    symptoms.forEach((symptom) => {
      if (!symptomsByName[symptom.name]) {
        symptomsByName[symptom.name] = []
      }
      symptomsByName[symptom.name].push(symptom)
    })

    // Sort symptoms by date
    Object.keys(symptomsByName).forEach((name) => {
      symptomsByName[name].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    })

    // Get unique dates for x-axis
    const dates = [
      ...new Set(
        symptoms.map((s) => new Date(s.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })),
      ),
    ].sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

    // Chart dimensions
    const width = canvasRef.current.width
    const height = canvasRef.current.height
    const padding = 40

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw axes
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.strokeStyle = "#d1d5db"
    ctx.stroke()

    // Draw x-axis labels
    ctx.font = "10px sans-serif"
    ctx.fillStyle = "#6b7280"
    ctx.textAlign = "center"

    const xStep = (width - 2 * padding) / (dates.length - 1 || 1)
    dates.forEach((date, i) => {
      const x = padding + i * xStep
      ctx.fillText(date, x, height - padding + 15)
    })

    // Draw y-axis labels
    ctx.textAlign = "right"
    const severityLevels = ["Mild", "Moderate", "Severe"]
    const yStep = (height - 2 * padding) / (severityLevels.length - 1)
    severityLevels.forEach((level, i) => {
      const y = height - padding - i * yStep
      ctx.fillText(level, padding - 5, y + 3)
    })

    // Draw data lines
    const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"]

    Object.entries(symptomsByName).forEach(([name, data], index) => {
      const color = colors[index % colors.length]

      // Draw line
      ctx.beginPath()
      data.forEach((symptom, i) => {
        const dateIndex = dates.indexOf(
          new Date(symptom.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        )
        const x = padding + dateIndex * xStep

        let y
        switch (symptom.severity) {
          case "mild":
            y = height - padding - 0 * yStep
            break
          case "moderate":
            y = height - padding - 1 * yStep
            break
          case "severe":
            y = height - padding - 2 * yStep
            break
          default:
            y = height - padding
        }

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw points
      data.forEach((symptom) => {
        const dateIndex = dates.indexOf(
          new Date(symptom.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        )
        const x = padding + dateIndex * xStep

        let y
        switch (symptom.severity) {
          case "mild":
            y = height - padding - 0 * yStep
            break
          case "moderate":
            y = height - padding - 1 * yStep
            break
          case "severe":
            y = height - padding - 2 * yStep
            break
          default:
            y = height - padding
        }

        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
      })

      // Draw legend
      const legendX = padding + 10
      const legendY = padding + index * 20

      ctx.beginPath()
      ctx.rect(legendX, legendY, 10, 10)
      ctx.fillStyle = color
      ctx.fill()

      ctx.fillStyle = "#374151"
      ctx.textAlign = "left"
      ctx.fillText(name, legendX + 15, legendY + 8)
    })
  }, [symptoms])

  return (
    <Card className="bg-white dark:bg-background">
      <CardHeader>
        <CardTitle>Symptom Trends</CardTitle>
        <CardDescription>Track how your symptoms change over time</CardDescription>
      </CardHeader>
      <CardContent>
        {symptoms.length > 0 ? (
          <div className="w-full h-[300px]">
            <canvas ref={canvasRef} width={800} height={300} className="w-full h-full" />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center h-[300px]">
            <div className="text-sm font-medium">No symptom data available</div>
            <p className="mt-1 text-sm text-muted-foreground">Log symptoms to see trends over time</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
