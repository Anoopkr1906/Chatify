import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useThemeContext } from '../../context/ThemeProvider';

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useThemeContext();

    return (
        <Tooltip title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <IconButton onClick={toggleTheme} color="inherit">
                {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
        </Tooltip>
    );
};

export default ThemeToggle;