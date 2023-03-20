type StringStartsWithDot = `.${string}`;

type Options = {
    camelize: boolean,
    fileExtensions: StringStartsWithDot[],
    recursive: boolean
}

type Module<T> = {
    filename: string;
    value: T;
}

declare function importAll<T = any>(relativePath?: StringStartsWithDot, options?: Options): Module<T>[];

export default importAll;