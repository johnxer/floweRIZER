import { defineStore } from 'pinia';
import { onMounted, onUnmounted, ref, watch } from 'vue';

export const useThemeStore = defineStore('useThemeStore', () => {
    const activeTheme = ref(localStorage.getItem('theme') || 'default');

    const activeThemeIcon = ref(null);
    const activeThemeTooltip = ref(null);

    const applyTheme = (theme) => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = theme === 'dark' || (theme === 'default' && prefersDark);

        document.body.classList.toggle('dark', isDark);
    };

    const handleSetTheme = (theme) => {
        activeTheme.value = theme;
    };

    // const themeIcons = {
    //     light: 'light_mode',
    //     dark: 'dark_mode',
    //     default: 'brightness_medium',
    // };

    // const themeTooltip = {
    //     light: 'Light mode',
    //     dark: 'Dark mode',
    //     default: 'Device default',
    // };

    const themeMap = {
        light: {
            tooltip: 'Light mode',
            icon: 'light_mode',
        },
        dark: {
            tooltip: 'Dark mode',
            icon: 'dark_mode',
        },        
        default: {
            tooltip: 'Device default',
            icon: 'brightness_medium',
        },        
    };

    watch(activeTheme, (newVal) => {
        localStorage.setItem('theme', newVal);
        applyTheme(newVal);
        activeThemeIcon.value = themeMap[newVal].icon || themeMap.default.icon;
        activeThemeTooltip.value = themeMap[newVal].tooltip || themeMap.default.tooltip;
    });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleDeviceChange = () => {
        if (activeTheme.value === 'default') applyTheme('default');
    };

    onMounted(() => {
        applyTheme(activeTheme.value);
        activeThemeIcon.value = themeMap[activeTheme.value].icon;
        activeThemeTooltip.value = themeMap[activeTheme.value].tooltip;
        mediaQuery.addEventListener('change', handleDeviceChange);
    });

    onUnmounted(() => {
        mediaQuery.removeEventListener('change', handleDeviceChange);
    });

    return {
        activeTheme,
        activeThemeIcon,
        activeThemeTooltip,
        handleSetTheme,
    };
});
