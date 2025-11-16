export const addLog = (logArray, action, oldVal, newVal) => {
    if (oldVal === newVal) return;


    logArray.push({
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        action,
        originalVal: oldVal ?? null,
        newVal: newVal ?? null,
    });
};
