const createLog = (overrides = {}) => ({
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    ...overrides,
});

export const addLog = (logArray, action, oldVal, newVal) => {
    if (oldVal === newVal) return;

    logArray.push(
        createLog({
            action,
            originalVal: oldVal ?? null,
            newVal: newVal ?? null,
        })
    );
};

export const addLogManual = (logArray, action, value) => {
    logArray.push(
        createLog({
            action,
            value,
        })
    );
};
