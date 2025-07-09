import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const ThemeContext = createContext();

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext must be used within a ThemeContextProvider');
    }
    return context;
};

export const ThemeContextProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    // Define gradient backgrounds
    const lightGradient = 'linear-gradient(135deg, #3b82f6, #dbeafe)'; // blue-500 to blue-100
    const darkGradient = 'linear-gradient(135deg, #581c87, #d8b4fe)'; // purple-800 to purple-300

    const theme = createTheme({
        palette: {
            mode: isDarkMode ? 'dark' : 'light',
            primary: {
                main: isDarkMode ? '#90caf9' : '#1976d2',
            },
            secondary: {
                main: isDarkMode ? '#f48fb1' : '#dc004e',
            },
            background: {
                default: isDarkMode ? '#121212' : '#fafafa',
                paper: isDarkMode ? '#1e1e1e' : '#ffffff',
                gradient: isDarkMode ? darkGradient : lightGradient,
            },
            text: {
                primary: isDarkMode ? '#ffffff' : '#000000',
                secondary: isDarkMode ? '#b0b0b0' : '#666666',
            },
        },
        // components: {
        //     MuiAppBar: {
        //         styleOverrides: {
        //             root: {
        //                 backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
        //                 color: isDarkMode ? '#ffffff' : '#000000',
        //             },
        //         },
        //     },
        // },

        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        background: isDarkMode ? darkGradient : lightGradient,
                        backgroundAttachment: 'fixed',
                        minHeight: '100vh',
                    },
                    html: {
                        background: isDarkMode ? darkGradient : lightGradient,
                        backgroundAttachment: 'fixed',
                    },
                    '#root': {
                        background: isDarkMode ? darkGradient : lightGradient,
                        backgroundAttachment: 'fixed',
                        minHeight: '100vh',
                    },
                },
            },

            MuiAppBar: {
                styleOverrides: {
                    root: {
                        background: isDarkMode 
                            ? 'rgba(30, 30, 30, 0.9)' 
                            : 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        color: isDarkMode ? '#ffffff' : '#000000',
                        borderBottom: isDarkMode 
                            ? '1px solid rgba(255, 255, 255, 0.1)' 
                            : '1px solid rgba(0, 0, 0, 0.1)',
                    },
                },
            },

            MuiPaper: {
                styleOverrides: {
                    root: {
                        background: isDarkMode 
                            ? 'rgba(30, 30, 30, 0.95)' 
                            : 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: isDarkMode 
                            ? '1px solid rgba(255, 255, 255, 0.1)' 
                            : '1px solid rgba(0, 0, 0, 0.1)',
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        background: isDarkMode 
                            ? 'rgba(30, 30, 30, 0.9)' 
                            : 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(5px)',
                    },
                },
            },

            MuiDialog: {
                styleOverrides: {
                    paper: {
                        background: isDarkMode 
                            ? 'rgba(30, 30, 30, 0.95)' 
                            : 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                    },
                },
            },
            MuiDrawer: {
                styleOverrides: {
                    paper: {
                        background: isDarkMode 
                            ? 'rgba(30, 30, 30, 0.95)' 
                            : 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                    },
                },
            },
        },

    });

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};