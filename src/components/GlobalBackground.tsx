"use client";

import { useTheme } from "@/provider/ThemeContext";

export default function GlobalBackground() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div
            className="fixed inset-0 -z-50 transition-colors duration-700 ease-in-out pointer-events-none"
            style={{ backgroundColor: isDark ? '#050505' : '#dfdff2' }}
        />
    );
}
