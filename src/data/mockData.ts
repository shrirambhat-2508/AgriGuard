export type ResultType = "healthy" | "attention" | "warning"

export interface CropRecord {
  id: string
  date: string
  displayDate: string
  displayTime: string
  month: string
  result: ResultType
  condition: string
  confidence: number
  moisture: number
  temp: number
  humidity: number
  recommendation: string
  whatItMeans: string
}

export const MOCK_HISTORY: CropRecord[] = [
  {
    id: "1",
    date: "2026-09-24",
    displayDate: "24 Sep",
    displayTime: "7:20 PM",
    month: "September 2026",
    result: "attention",
    condition: "Possible Early Blight",
    confidence: 86,
    moisture: 41,
    temp: 28.7,
    humidity: 64,
    recommendation:
      "Inspect affected leaves carefully and continue monitoring the crop over the next few days.",
    whatItMeans:
      "The image shows patterns that are commonly associated with possible early blight. This is an AI indication based on the crop image — it is not a confirmed diagnosis.",
  },
  {
    id: "2",
    date: "2026-09-21",
    displayDate: "21 Sep",
    displayTime: "6:45 PM",
    month: "September 2026",
    result: "healthy",
    condition: "Healthy",
    confidence: 94,
    moisture: 47,
    temp: 27.9,
    humidity: 61,
    recommendation:
      "Crop appears healthy. Continue your regular monitoring schedule.",
    whatItMeans:
      "The crop image shows no visible signs of disease or stress. Field conditions are within a comfortable range.",
  },
  {
    id: "3",
    date: "2026-09-18",
    displayDate: "18 Sep",
    displayTime: "7:05 PM",
    month: "September 2026",
    result: "healthy",
    condition: "Healthy",
    confidence: 91,
    moisture: 53,
    temp: 27.2,
    humidity: 57,
    recommendation:
      "Crop appears healthy. Continue your regular monitoring schedule.",
    whatItMeans:
      "The crop image shows no visible signs of disease or stress. Field conditions are within a comfortable range.",
  },
  {
    id: "4",
    date: "2026-09-14",
    displayDate: "14 Sep",
    displayTime: "5:55 PM",
    month: "September 2026",
    result: "healthy",
    condition: "Healthy",
    confidence: 89,
    moisture: 58,
    temp: 26.8,
    humidity: 55,
    recommendation:
      "Crop appears healthy. Continue your regular monitoring schedule.",
    whatItMeans:
      "The crop image shows no visible signs of disease or stress. Field conditions are within a comfortable range.",
  },
]

export const MOCK_SENSOR = {
  moisture: 41,
  temp: 28.7,
  humidity: 64,
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

export function groupByMonth(
  records: CropRecord[],
): Record<string, CropRecord[]> {
  return records.reduce<Record<string, CropRecord[]>>((acc, r) => {
    if (!acc[r.month]) acc[r.month] = []
    acc[r.month].push(r)
    return acc
  }, {})
}
