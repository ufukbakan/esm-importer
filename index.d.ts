type StringStartsWithDot = `.${string}`;

type Options = {
    camelize: boolean,
    fileExtensions: StringStartsWithDot[],
    recursive: boolean
}

type Module = {
    filename: string;
    value: any;
}

declare function importAll(relativePath?: StringStartsWithDot, options?: Options): Module[];

export default importAll;