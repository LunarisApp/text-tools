export declare class Hyphen {
    private readonly left;
    private readonly right;
    private hd;
    readonly dictionaries: Record<string, string>;
    private readonly lowercaseLangs;
    constructor(props?: {
        lang?: string;
        left?: number;
        right?: number;
    });
    private loadDicts;
    positions(word: string): number[];
    iterate(word: string): Generator<[string, string]>;
    wrap(word: string, width: number, hyphen?: string): string[] | null;
    inserted(word: string, hyphen?: string): string;
    getLanguageFallback(language: string): string | undefined;
}
