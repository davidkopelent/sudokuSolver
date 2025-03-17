import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './public/**/*.{svg,png,jpg,jpeg,gif}',
    ],
    theme: {
        extend: {
            colors: {
                'gray-750': '#2D3748',
                'orange-gradient': 'rgb(253, 111, 77)',
            },
            backgroundColor: {
                'gray-750': '#2D3748',
                'orange-gradient': 'rgb(253, 111, 77)',
            },
        },
    },
    plugins: [],
}

export default config 