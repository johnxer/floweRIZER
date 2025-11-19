export function observeVisibility(el, options = {}) {
    const {
        threshold = 0.6,
        rootMargin = '0px'
    } = options

    if (!el) return Promise.resolve(null)

    return new Promise(resolve => {
        const observer = new IntersectionObserver((entries, obs) => {
            const entry = entries[0]
            if (entry.isIntersecting) {
                obs.disconnect()
                resolve(entry)
            }
        }, { threshold, rootMargin })

        observer.observe(el)
    })
}