tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        primary: '#3b82f6', 
                        primaryDark: '#2563eb',
                        darkBg: '#171717', 
                        darkCard: '#262626', 
                        darkSidebar: '#0a0a0a',
                    },
                    animation: {
                        'fade-in': 'fadeIn 0.3s ease-out',
                        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    },
                    keyframes: {
                        fadeIn: {
                            '0%': { opacity: '0', transform: 'translateY(10px)' },
                            '100%': { opacity: '1', transform: 'translateY(0)' },
                        }
                    }
                }
            }
        }