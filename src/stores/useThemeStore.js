import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useGetDetails, useUpdateData } from '../composables';

export const useThemeStore = defineStore('useThemeStore', () => {
    const { data: userData } = useGetDetails();
    const { updateData } = useUpdateData();

    const activeTheme = ref('default');

    watch(
        userData,
        (newVal) => {
            if (newVal?.theme) {
                activeTheme.value = newVal?.theme;
            }
        },
        { immediate: true }
    );

    const activeThemeIcon = ref(null);
    const activeThemeTooltip = ref(null);

    const applyTheme = (theme) => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = theme === 'dark' || (theme === 'default' && prefersDark);

        document.body.classList.toggle('dark', isDark);
    };

    const handleSetTheme = async (theme) => {
        activeTheme.value = theme;
        await updateData({ theme });
    };

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
        applyTheme(newVal);
        activeThemeIcon.value = themeMap[newVal].icon || themeMap.default.icon;
        activeThemeTooltip.value = themeMap[newVal].tooltip || themeMap.default.tooltip;
    });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    mediaQuery.addEventListener('change', () => {
        if (activeTheme.value === 'default') {
            applyTheme('default');
        }
    });

    return {
        activeTheme,
        activeThemeIcon,
        activeThemeTooltip,
        handleSetTheme,
    };
});
