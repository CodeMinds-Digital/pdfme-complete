import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // DocuSign-inspired color palette
                docusign: {
                    primary: '#0070E0',
                    success: '#00A651',
                    warning: '#FFB81C',
                    error: '#E31C3D',
                    neutral: {
                        100: '#F8F9FA',
                        200: '#E9ECEF',
                        300: '#DEE2E6',
                        400: '#CED4DA',
                        500: '#ADB5BD',
                        600: '#6C757D',
                        700: '#495057',
                        800: '#343A40',
                        900: '#212529',
                    }
                },
                signer: {
                    1: '#FFD700', // Gold
                    2: '#FF6B6B', // Red
                    3: '#4ECDC4', // Teal
                    4: '#45B7D1', // Blue
                    5: '#96CEB4', // Green
                    6: '#FFEAA7', // Yellow
                    7: '#DDA0DD', // Plum
                    8: '#98D8C8', // Mint
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'docusign': '0 1px 3px rgba(0, 0, 0, 0.1)',
                'docusign-lg': '0 4px 12px rgba(0, 112, 224, 0.15)',
            }
        },
    },
    plugins: [],
}
export default config