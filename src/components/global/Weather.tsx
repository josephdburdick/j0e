"use client"

import { useEffect, useMemo, useState } from "react"

const coords = {
  latitude: 40.6782,
  longitude: -73.9442,
}

const WeatherComponent: React.FC = () => {
  const [temperature, setTemperature] = useState<number | null>(null)
  const [unit, setUnit] = useState<"fahrenheit" | "celsius">("fahrenheit")
  const [isClient, setIsClient] = useState(false) // New state to track client-side rendering

  useEffect(() => {
    setIsClient(true) // Set to true when component is mounted on the client
  }, [])

  // Fetch the temperature unit preference from local storage
  useEffect(() => {
    if (isClient) {
      // Ensure this runs only on the client
      const savedUnit = localStorage.getItem("temperatureUnit")
      if (savedUnit === "celsius" || savedUnit === "fahrenheit") {
        setUnit(savedUnit)
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
        } catch (error) {
          console.error("Error fetching weather data:", error)
        }
      }

      fetchWeather()
    }
  }, [isClient])

  const toggleUnit = () => {
    const newUnit = unit === "fahrenheit" ? "celsius" : "fahrenheit"
    setUnit(newUnit)
    if (isClient) {
      // Ensure this runs only on the client
      localStorage.setItem("temperatureUnit", newUnit) // Save the preference to local storage
    }
  }

  // const getDisplayText = useMemo(() => {
  //   if (unit === "fahrenheit" && temperature !== null) {
  //     return `${Math.round(temperature)}º F in`
  //   } else if (unit === "celsius" && temperature !== null) {
  //     const celsius = ((temperature - 32) * 5) / 9
  //     return `${celsius.toFixed(1)}º C in`
  //   } else {
  //     return "Loading..."
  //   }
  // }, [unit, temperature])

  return (
    <button onClick={toggleUnit}>
      {/* {getDisplayText}  */}
      Brooklyn, New York
    </button>
  )
}

export default WeatherComponent
