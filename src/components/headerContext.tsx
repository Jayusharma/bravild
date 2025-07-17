"use client"
import { createContext, useContext, useState } from "react"

// 1. Define the shape of your context data
const HeaderContext = createContext({
  svgColor: "#000",                  // default color
  setSvgColor: (_: string) => {}     // updater function placeholder
})

// 2. Custom hook to use this context
export const useHeader = () => useContext(HeaderContext)

// 3. Provider component to wrap your app and provide the values
export const HeaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [svgColor, setSvgColor] = useState("#DFDFF2")

  return (
    <HeaderContext.Provider value={{ svgColor, setSvgColor }}>
      {children}
    </HeaderContext.Provider>
  )
}
