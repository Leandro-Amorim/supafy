
import type { Config } from 'tailwindcss'
import { fontFamily } from "tailwindcss/defaultTheme";
import containerQueries from '@tailwindcss/container-queries';

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			fontSize: {
				'11': '11px',
				'14': '14px',
				'16': '16px'
			},
			textColor: {
				'white': 'white !important',
				'primary': '#b3b3b3 !important',
				'secondary': '#a7a7a7!important',
				'light-green': '#1fdf64!important',
				'green': 'rgb(30, 215, 96)!important',
				'dark-green': '#169c46!important',
				'dark-active': '#7c7b7f!important'
			},
			fontFamily: {
				sans: ["var(--font-sans)", ...fontFamily.sans],
			},
			backgroundColor: {
				'transparent': 'transparent !important',
				'container': '#121212',
				'container-minor': '#1a1a1a',
				'container-hover': '#2a2a2a',
				'container-light': "#282828 !important",
				'container-active': '#232323',
				'container-active-hover': '#393939',
				'container-card': '#181818',
				'searchbox': '#242424',
				'searchbox-hover': '#2a2a2a',
				'light-green': '#1fdf64',
				'green': 'rgb(30, 215, 96)',
				'dark-green': '#169c46',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic':
					'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
			gridTemplateColumns: {
				'mus-3': '[index] 16px [first] 4fr [last] minmax(120px,1fr)',
				'mus-4': '[index] 16px [first] 4fr [var1] 2fr [last] minmax(120px,1fr)',
				'mus-5': '[index] 16px [first] 6fr [var1] 4fr [var2] 3fr [last] minmax(120px,1fr)'
			},
			containers: {
				'8xl': '88rem',
				'9xl': '104rem',
				'10xl': '110rem'
			},
		},
	},
	plugins: [
		containerQueries
	],
	corePlugins: {
		preflight: false,
	},
	important: '#app'
}
export default config