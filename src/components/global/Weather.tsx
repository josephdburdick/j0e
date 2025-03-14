"use client"

import { cn } from "@/lib/utils"
// Create a client-only wrapper component
import dynamic from "next/dynamic"
import { useEffect, useMemo, useState } from "react"

import { Button } from "../ui/button"
import Icon from "./Icon"

// Define temperature unit enum
enum TemperatureUnit {
  FAHRENHEIT = "fahrenheit",
  CELSIUS = "celsius",
}

const coords = {
  latitude: 40.6782,
  longitude: -73.9442,
}

// Weather icon mapping function
const getWeatherIcon = (temperature: number): string => {
  if (temperature >= 80) return "sun" // Hot
  if (temperature >= 65) return "cloudSun" // Warm with some clouds
  if (temperature >= 50) return "sun" // Mild
  if (temperature >= 40) return "cloud" // Cool and cloudy
  if (temperature >= 32) return "cloudDrizzle" // Cold, possible precipitation
  return "snowflake" // Freezing
}

// Weather icon color mapping function
const getWeatherColor = (temperature: number): string => {
  if (temperature >= 80) return "text-amber-500" // Hot - bright orange/yellow
  if (temperature >= 65) return "text-yellow-400" // Warm - yellow
  if (temperature >= 50) return "text-blue-300" // Mild - light blue
  if (temperature >= 40) return "text-gray-400" // Cool - gray
  if (temperature >= 32) return "text-blue-400" // Cold - blue
  return "text-blue-200" // Freezing - light blue
}

// Rename the component to WeatherContent
const WeatherContent: React.FC = () => {
  const [temperature, setTemperature] = useState<number | null>(null)
  const [unit, setUnit] = useState<TemperatureUnit>(TemperatureUnit.FAHRENHEIT)
  const [isClient, setIsClient] = useState(false) // New state to track client-side rendering
  const [forecast, setForecast] = useState<{
    time: string[]
    temperature: number[]
  } | null>(null)
  const [dailyHighLow, setDailyHighLow] = useState<{
    high: number
    low: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false) // Add loading state

  useEffect(
    () => setIsClient(true), // Set to true when component is mounted on the client
    [],
  )

  // Fetch the temperature unit preference from local storage
  useEffect(() => {
    if (isClient) {
      // Ensure this runs only on the client
      const savedUnit = localStorage.getItem("temperatureUnit")
      if (
        savedUnit === TemperatureUnit.CELSIUS ||
        savedUnit === TemperatureUnit.FAHRENHEIT
      ) {
        setUnit(savedUnit as TemperatureUnit)
      }
    }
  }, [isClient])

  useEffect(() => {
    if (isClient) {
      // Ensure this runs only on the client
      const fetchWeather = async () => {
        setIsLoading(true) // Set loading to true before fetch starts

        const params = {
          ...coords,
          hourly: "temperature_2m,precipitation,relative_humidity_2m",
          temperature_unit: "fahrenheit",
          wind_speed_unit: "mph",
          current: "is_day",
          forecast_days: "1",
        }

        const queryString = new URLSearchParams(params as any).toString()
        const url = `https://api.open-meteo.com/v1/forecast?${queryString}`

        try {
          const response = await fetch(url)
          if (!response.ok) {
            throw new Error("Network response was not ok")
          }
          const data = await response.json()
          const weatherData = data.hourly

          setTemperature(weatherData.temperature_2m[0])

          // Store forecast data
          setForecast({
            time: weatherData.time.slice(0, 24), // Get next 24 hours
            temperature: weatherData.temperature_2m.slice(0, 24),
          })

          // Calculate today's high and low
          const todayTemps = weatherData.temperature_2m.slice(0, 24)
          setDailyHighLow({
            high: Math.max(...todayTemps),
            low: Math.min(...todayTemps),
          })
        } catch (error) {
          console.error("Error fetching weather data:", error)
        } finally {
          setIsLoading(false) // Set loading to false when fetch completes (success or error)
        }
      }

      fetchWeather()
    }
  }, [isClient])

  const toggleUnit = () => {
    const newUnit =
      unit === TemperatureUnit.FAHRENHEIT
        ? TemperatureUnit.CELSIUS
        : TemperatureUnit.FAHRENHEIT
    setUnit(newUnit)
    if (isClient) {
      // Ensure this runs only on the client
      localStorage.setItem("temperatureUnit", newUnit) // Save the preference to local storage
    }
  }

  const renderTemperature = useMemo(() => {
    if (unit === TemperatureUnit.FAHRENHEIT && temperature !== null) {
      return `${Math.round(temperature)}º F in `
    } else if (unit === TemperatureUnit.CELSIUS && temperature !== null) {
      const celsius = ((temperature - 32) * 5) / 9
      return `${celsius.toFixed(1)}º C in`
    } else {
      return ""
    }
  }, [unit, temperature])

  const renderForecast = () => {
    if (!forecast) return null

    return (
      <div className="mt-2">
        <p className="text-xs">Next few hours:</p>
        <div className="mt-1 flex space-x-4 overflow-x-auto pb-2">
          {forecast.time.slice(0, 6).map((time, i) => {
            const temp = forecast.temperature[i]
            const displayTemp =
              unit === TemperatureUnit.FAHRENHEIT
                ? Math.round(temp)
                : (((temp - 32) * 5) / 9).toFixed(1)
            const hour = new Date(time).getHours()
            const ampm = hour >= 12 ? "PM" : "AM"
            const hour12 = hour % 12 || 12

            return (
              <div key={i} className="text-center">
                <div className="text-xs">
                  {hour12}
                  {ampm}
                </div>
                <div className="text-sm font-medium">{displayTemp}°</div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  //  Daily high/low
  const renderDailyHighLow = () => {
    if (!dailyHighLow) return null

    const highTemp =
      unit === TemperatureUnit.FAHRENHEIT
        ? Math.round(dailyHighLow.high)
        : (((dailyHighLow.high - 32) * 5) / 9).toFixed(1)

    const lowTemp =
      unit === TemperatureUnit.FAHRENHEIT
        ? Math.round(dailyHighLow.low)
        : (((dailyHighLow.low - 32) * 5) / 9).toFixed(1)

    // Get colors based on the temperature values
    const highTempColor = getWeatherColor(dailyHighLow.high)
    const lowTempColor = getWeatherColor(dailyHighLow.low)

    const tempLabel = (label: string) => (
      <span className="hidden lg:inline">{label}</span>
    )

    return (
      <div className="flex items-center gap-x-1 text-sm">
        <span className={lowTempColor}>
          {tempLabel("L:")} {lowTemp}º
        </span>
        <span className="text-muted-foreground">&ndash;</span>
        <span className={highTempColor}>
          {tempLabel("H:")} {highTemp}º
        </span>
      </div>
    )
  }

  // Weather icon component
  const WeatherIcon = () => {
    if (temperature === null) return null

    // The temperature state variable is always in Fahrenheit (from the API)
    // No conversion needed for icon selection since our thresholds are in Fahrenheit
    const iconName = getWeatherIcon(temperature)
    const iconColor = getWeatherColor(temperature)

    // Use dynamic component rendering
    const IconComponent = Icon[iconName]

    return (
      <div className="flex items-center justify-center">
        {IconComponent && <IconComponent className={`h-7 w-7 ${iconColor}`} />}
      </div>
    )
  }

  const LoadingIndicator = () => (
    <div className="flex items-center justify-center">
      <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-gray-500" />
    </div>
  )

  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <>
      {isLoading ? <LoadingIndicator /> : <WeatherIcon />}
      <div className="flex items-center gap-x-1 text-left font-medium">
        {isLoading ? <LoadingIndicator /> : renderDailyHighLow()}
        <Button
          onClick={toggleUnit}
          size="sm"
          variant="ghost"
          className={cn("cursor-pointer rounded-full px-1.5 py-0.5")}
          disabled={isLoading}
        >
          <Icon.toggleLeft
            size={14}
            className={cn(
              "origin-center",
              unit === TemperatureUnit.FAHRENHEIT ? "rotate-90" : "-rotate-90",
            )}
          />
          {unit === TemperatureUnit.FAHRENHEIT ? "F" : "C"}
        </Button>
      </div>
    </>
  )
}

// Create a client-only version as the default export
const Weather = dynamic(() => Promise.resolve(WeatherContent), {
  ssr: false,
  loading: () => (
    <>
      <div className="flex items-center justify-center">
        <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-gray-500" />
      </div>
      <div className="flex items-center gap-x-1 text-left font-medium">
        <div className="h-3 w-36 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </>
  ),
})

export default Weather
