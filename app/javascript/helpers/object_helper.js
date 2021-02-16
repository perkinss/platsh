export function isNullOrUndefined(obj) {
    return obj === null || obj === undefined
}

export function isObject(obj) {
    return obj instanceof Object
}

export function isArray(obj) {
    return obj instanceof Array
}

export function isEquivalent(a, b) {
    if (a === b) {
        return true
    }
    else if (isNullOrUndefined(a) || isNullOrUndefined(b)) {
        return false
    }

    if (isArray(a)) {
        return isEquivalentArrays(a, b)
    }
    if (isObject(a)) {
        return isEquivalentObjects(a, b)
    }
    return false
}

export function isEquivalentObjects(obj1, obj2) {
    // Check if both values are already equal, or if either is not an instance of Object
    if (obj1 === obj2) {
        return true
    }
    else if (!(isObject(obj1) && isObject(obj2))) {
        return false
    }

    const obj1Entries = Object.entries(obj1)
    if (obj1Entries.length !== Object.entries(obj2).length) {
        return false;
    }

    return  obj1Entries.every(([key, value]) => isEquivalent(value, obj2[key]))
}

export function isEquivalentArrays(array1, array2) {
    // Check if both values are already equal, or if either is not an instance of Array
    if (array1 === array2) {
        return true
    }
    else if (!(isArray(array1) && isArray(array2)) || array1.length !== array2.length) {
        return false
    }

    return  array1.every((value, index) => isEquivalent(value, array2[index]))
}
