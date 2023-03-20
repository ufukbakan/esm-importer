import fs from 'fs';
import parentModule from 'parent-module';
import path, { resolve } from 'path';
import { fileURLToPath } from 'url';

// default file extensions:
const fileExtensions = ['.js', '.ts', '.jsx', '.tsx', '.cjs', '.mjs'];

async function importAll(directory = '', options) {
    const parentDir = path.dirname(fileURLToPath(new URL(parentModule())));
    if (!directory.startsWith(".")) {
        throw new Error("Directory must be relative");
    }
    directory = resolve(parentDir, directory);

    options = {
        camelize: true,
        fileExtensions,
        recursive: false,
        ...options
    };

    const files = fs.readdirSync(directory);

    const done = new Set();
    /** @type{Array<Record<string, any>} */const returnValue = [];

    for (const fileExtension of options.fileExtensions) {
        for (const file of files) {

            const filenameStem = path.basename(file).replace(/\.\w+$/, '');
            const fullPath = path.join(directory, file);

            if (options.recursive && fs.statSync(fullPath).isDirectory()) {
                const subModules = importAll(fullPath, options);
                Object.keys(subModules).forEach(key => {
                    returnValue.push({
                        "fileName": `${file}/${key}`,
                        "value": subModules[key]
                    })
                });
                done.add(filenameStem);
            } else {
                const urlFromFullPath = `file://${fullPath}`;
                if (done.has(filenameStem) ||
                    path.extname(file) !== fileExtension ||
                    filenameStem[0] === '_' ||
                    filenameStem[0] === '.') {
                    continue;
                }
                const exportKey = options.camelize ? filenameStem.replace(/[-_](\w)/g, (m, p1) => p1.toUpperCase()) : filenameStem;
                returnValue.push({
                    "fileName": exportKey,
                    "value": await import(urlFromFullPath)
                });
                done.add(filenameStem);
            }
        }
    }

    return returnValue;
};

export default importAll;