"use client"

import { useEffect, useMemo, useState } from "react"

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
const getWeatherIconColor = (temperature: number): string => {
  if (temperature >= 80) return "text-amber-500" // Hot - bright orange/yellow
  if (temperature >= 65) return "text-yellow-400" // Warm - yellow
  if (temperature >= 50) return "text-blue-300" // Mild - light blue
  if (temperature >= 40) return "text-gray-400" // Cool - gray
  if (temperature >= 32) return "text-blue-400" // Cold - blue
  return "text-blue-200" // Freezing - light blue
}

const WeatherComponent: React.FC = () => {
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

  useEffect(() => {
    setIsClient(true) // Set to true when component is mounted on the client
  }, [])

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
        const params = {
          ...coords,
          hourly: "temperature_2m",
          temperature_unit: "fahrenheit",
          wind_speed_unit: "mph",
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

  const renderTrendVisualization = () => {
    if (!forecast) return null

    return (
      <div className="mt-2">
        <p className="text-xs">Today&apos;s trend:</p>
        <div className="mt-1 flex h-20 items-end space-x-1">
          {forecast.temperature.slice(0, 8).map((temp, i) => {
            const height = Math.max(15, (temp / 100) * 80)
            const displayTemp =
              unit === TemperatureUnit.FAHRENHEIT
                ? Math.round(temp)
                : (((temp - 32) * 5) / 9).toFixed(1)

            return (
              <div key={i} className="group relative">
                <div
                  className={`w-4 ${temp > 50 ? "bg-orange-300" : "bg-blue-300"}`}
                  style={{ height: `${height}px` }}
                ></div>
                <div className="absolute bottom-full hidden rounded bg-gray-800 p-1 text-xs text-white group-hover:block">
                  {displayTemp}°
                  {unit === TemperatureUnit.FAHRENHEIT ? "F" : "C"} at{" "}
                  {new Date(forecast.time[i]).getHours()}:00
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Render option 3: Daily high/low
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

    return (
      <div className="">
        <span className="text-red-500">H: {highTemp}°</span>
        {" / "}
        <span className="text-blue-500">L: {lowTemp}°</span>
      </div>
    )
  }

  // Weather icon component
  const WeatherIcon = () => {
    if (temperature === null) return null

    // The temperature state variable is always in Fahrenheit (from the API)
    // No conversion needed for icon selection since our thresholds are in Fahrenheit
    const iconName = getWeatherIcon(temperature)
    const iconColor = getWeatherIconColor(temperature)

    // Use dynamic component rendering
    const IconComponent = Icon[iconName]

    return (
      <div className="flex items-center">
        {IconComponent && (
          <IconComponent className={`mr-2 h-6 w-6 ${iconColor}`} />
        )}
      </div>
    )
  }

  return (
    <button onClick={toggleUnit} className="flex cursor-pointer items-center">
      <WeatherIcon />
      <div className="flex flex-col items-start">
        {renderDailyHighLow()}
        <span className="text-sm">Brooklyn, New York</span>
      </div>
    </button>
  )
}

export default WeatherComponent
