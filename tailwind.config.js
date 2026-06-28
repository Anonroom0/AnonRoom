/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep night-indigo canvas backgrounds
        cyberDark: {
          DEFAULT: '#090A10',
          elevated: '#0D0E17',
        },
        // Transparent slate surfaces for premium glassmorphism
        cyberSlate: '#1F2833',
        // Luxury multi-stop gradient accent tones
        cyberPurple: '#6A1B9A',
        cyberIndigo: '#3F51B5',
        cyberViolet: '#7B1FA2',
      },
      backdropBlur: {
        md: '12px',
      }
    },
  },
  plugins: [],
}
