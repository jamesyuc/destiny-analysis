import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        screens: {
            'xs': '320px',      // Small phones (iPhone SE, older Androids)
            'sm': '640px',      // Large phones, small tablets
            'md': '768px',      // Tablets
            'lg': '1024px',     // Desktop
            'xl': '1280px',     // Large desktop
            '2xl': '1536px',    // Extra large
            // Landscape mode
            'landscape': { 'raw': '(orientation: landscape) and (max-height: 500px)' },
            // Short screens (notched phones in landscape)
            'short': { 'raw': '(max-height: 700px)' },
        },
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
            },
            // Fluid typography using clamp
            fontSize: {
                'fluid-xs': 'clamp(0.625rem, 2vw, 0.75rem)',
                'fluid-sm': 'clamp(0.75rem, 2.5vw, 0.875rem)',
                'fluid-base': 'clamp(0.875rem, 3vw, 1rem)',
                'fluid-lg': 'clamp(1rem, 3.5vw, 1.125rem)',
                'fluid-xl': 'clamp(1.125rem, 4vw, 1.25rem)',
                'fluid-2xl': 'clamp(1.25rem, 5vw, 1.5rem)',
                'fluid-3xl': 'clamp(1.5rem, 6vw, 1.875rem)',
            },
            spacing: {
                'safe-top': 'env(safe-area-inset-top)',
                'safe-bottom': 'env(safe-area-inset-bottom)',
                'safe-left': 'env(safe-area-inset-left)',
                'safe-right': 'env(safe-area-inset-right)',
            },
        },
    },
    plugins: [],
}
export default config
