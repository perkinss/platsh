import expect from "expect";
import * as ObjectHelper from "../../../app/javascript/helpers/object_helper"

describe('Object Helper isEquivalent() returns correct boolean', () => {
    it ('should compare 2 equal primitives', () => {
        const equal = ObjectHelper.isEquivalent(7, 7)
        expect(equal).toBe(true)
    })

    it ('should compare 2 equal primitives', () => {
        const equal = ObjectHelper.isEquivalent(7, 8)
        expect(equal).toBe(false)
    })

    it ('should handled invalid values safely', () => {
        const equal = ObjectHelper.isEquivalent(null, undefined)
        expect(equal).toBe(false)
    })

    it ('should handle correct comparison of undefined fields', () => {
        const equal = ObjectHelper.isEquivalent(undefined, undefined)
        expect(equal).toBe(true)
    })

    it ('should be true when deep object comparison is the same', () => {
        const a = {
            nestedObject: { a: 1, b: 2, c: { name: 'Wilma' } },
            booleanValue: false
        }
        const b = {
            nestedObject: { a: 1, b: 2, c: { name: 'Wilma' } },
            booleanValue: false
        }

        const equal = ObjectHelper.isEquivalent(a, b)

        expect(equal).toBe(true)
    })

    it ('should be false when deep object comparison is has low level change', () => {
        const a = {
            nestedObject: { a: 1, b: 2, c: { name: 'Wilma' } },
            booleanValue: false
        }
        const b = {
            nestedObject: { a: 1, b: 22, c: { name: 'Wilma' } },
            booleanValue: false
        }

        const equal = ObjectHelper.isEquivalent(a, b)

        expect(equal).toBe(false)
    })

    it ('should be true when deep array comparison is the same', () => {
        const a = [[1, 2, 3, 4, 5], 75, 'Wilma']
        const b = [[1, 2, 3, 4, 5], 75, 'Wilma']

        const equal = ObjectHelper.isEquivalent(a, b)

        expect(equal).toBe(true)
    })

    it ('should be false when deep array comparison has a change', () => {
        const a = [[1, 2, 3, 4, 5], 75, 'Wilma']
        const b = [[1, 2, 3, 5], 75, 'Wilma']

        const equal = ObjectHelper.isEquivalent(a, b)

        expect(equal).toBe(false)
    })

    it ('should handle deep comparison of objects nested in arrays and vice versa', () => {
        const a = { a: [{ b: 2 }] }
        const b = { a: [{ b: 2 }] }

        const equal = ObjectHelper.isEquivalent(a, b)

        expect(equal).toBe(true)
    })

    it ('should be false when objects are same size with different keys', () => {
        const a = { a: 1, b: 2 }
        const b = { a: 1, c: 2 }

        const equal = ObjectHelper.isEquivalent(a, b)

        expect(equal).toBe(false)
    })

    it ('should be true when objects have numerical keys', () => {
        const a = { 1: 'a', 2: 'b' }
        const b = { 1: 'a', 2: 'b' }

        const equal = ObjectHelper.isEquivalent(a, b)

        expect(equal).toBe(true)
    })
})