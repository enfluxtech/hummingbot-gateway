"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tearDownTempDir = exports.setUpTempDir = exports.unpatch = exports.patch = exports.classHasGetter = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
let patchedObjects = new Set();
const classHasGetter = (obj, prop) => {
    const description = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(obj), prop);
    if (description) {
        return !!description.get;
    }
    return false;
};
exports.classHasGetter = classHasGetter;
const patch = (target, propertyName, mock) => {
    if (patchedObjects.has(target))
        patchedObjects.delete(target);
    if (!('__original__' + propertyName in target)) {
        if (Object.getOwnPropertyDescriptor(target, propertyName)) {
            target['__original__' + propertyName] = target[propertyName];
        }
        else {
            target['__original__' + propertyName] = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(target), propertyName);
        }
    }
    if ((0, exports.classHasGetter)(target, propertyName)) {
        const targetPrototype = Object.getPrototypeOf(target);
        Object.defineProperty(targetPrototype, propertyName, {
            get: mock,
            set: (_value) => {
                return;
            },
        });
        Object.setPrototypeOf(target, targetPrototype);
    }
    else {
        target[propertyName] = mock;
    }
    patchedObjects.add(target);
};
exports.patch = patch;
const unpatch = () => {
    patchedObjects.forEach((target) => {
        const keys = Object.keys(target);
        keys.forEach((key) => {
            if (key.startsWith('__original__')) {
                const propertyName = key.slice(12);
                if (Object.getOwnPropertyDescriptor(target, propertyName)) {
                    target[propertyName] = target[key];
                }
                else {
                    const targetPrototype = Object.getPrototypeOf(target);
                    Object.defineProperty(targetPrototype, propertyName, target[key]);
                    Object.setPrototypeOf(target, targetPrototype);
                }
                delete target[key];
            }
        });
    });
    patchedObjects = new Set();
};
exports.unpatch = unpatch;
let currDir = null;
let tempDir;
function setUpTempDir(dirPrefix = '') {
    if (currDir !== null) {
        throw new Error('Temp dir already set up');
    }
    currDir = process.cwd();
    tempDir = fs_1.default.mkdtempSync(path_1.default.join(os_1.default.tmpdir(), dirPrefix));
    process.chdir(tempDir);
    return tempDir;
}
exports.setUpTempDir = setUpTempDir;
function tearDownTempDir() {
    if (currDir === null) {
        throw new Error('Temp dir not set up');
    }
    process.chdir(currDir);
    fs_1.default.rmSync(tempDir, { recursive: true });
    currDir = null;
}
exports.tearDownTempDir = tearDownTempDir;
//# sourceMappingURL=patch.js.map