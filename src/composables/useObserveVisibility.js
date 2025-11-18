export const useObserveVisibility = () => {
    const observeVisibility = (el, threshold = 0.6) => {
        if (!el) return Promise.resolve(null)
            
        return new Promise((resolve) => {
            const observer = new IntersectionObserver(
                (entries, obs) => {
                    const entry = entries[0];
                    if (entry.isIntersecting) {
                        obs.disconnect();
                        resolve(entry);
                    }
                },
                { threshold }
            );

            observer.observe(el);
        });
    };

    return { observeVisibility };
};
