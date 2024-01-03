export declare class SmartCreate {
    store: {};
    listeners: Set<() => void>;
    constructor(createSlice: (a: (partial: any) => void, b: () => {}) => {});
    subscribe(listener: () => void): () => boolean;
    getState(): {};
    setState(partial: <T>(_s: T) => {} | {}): void;
    emitChange(): void;
    listen<T extends (...args: any) => any>(callback: T): any;
    check(objA: Record<string, unknown>, objB: Record<string, unknown>): boolean;
    shallow(selector: <T extends (...args: any) => any>(_a: T) => ReturnType<T>): <T extends (...args: any) => any>(state: T) => any;
}
//# sourceMappingURL=index.d.ts.map