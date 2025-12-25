"use client"
import { createContext, useContext, useState } from "react"

// Define the shape of your context data
interface HeaderContextType {
  svgColor: string;
  setSvgColor: (color: string) => void;
}

const HeaderContext = createContext<HeaderContextType>({
  svgColor: "bg-gradient-to-r from-[#F5F3EC] via-[#D2CDB9] to-[#92A378]",
  setSvgColor: () => { }
})

// Custom hook to use this context
export const useHeader = () => useContext(HeaderContext)

// Provider component
export const HeaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [svgColor, setSvgColor] = useState("")

  return (
    <HeaderContext.Provider value={{ svgColor, setSvgColor }}>
      {children}
    </HeaderContext.Provider>
  )
}
