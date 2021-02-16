import splitSentences from "../../../app/javascript/helpers/string_helper";
import expect from "expect";

describe('String Helper splitSentences returns correct array of clauses', () => {

    const WIDTH = 30
    it('should return a single sentence shorter than 30 characters', () => {
        const yada = ['what the']
        const split = splitSentences(yada, WIDTH)

        expect(split.length).toEqual(yada.length)
        expect(split[0]).toEqual(yada[0])
    })

    it('should return two single sentences shorter than 30 characters', () => {
        const yada = ['what the', 'actual duck']
        const split = splitSentences(yada,WIDTH)

        expect(split.length).toEqual(yada.length)
        expect(split[0]).toEqual(yada[0])
        expect(split[1]).toEqual(yada[1])
    })

    it('should split a single sentence longer than 30 characters', () => {
        const yada = ['this sentence has many more characters than 30 characters']
        const split = splitSentences(yada, WIDTH)

        expect(split.length).toEqual(yada.length)
        expect(typeof split[0]).toEqual('object')
        expect(split[0].length).toBeGreaterThan(1)
        expect(split[0][0]).toEqual('this sentence has many more characters')
        expect(split[0][1]).toEqual('than 30 characters')
    })

    it('should split a multiple sentences longer than 30 characters', () => {
        const yada = [
            'this sentence has many more characters than 30 characters',
            'and this sentence is even so much more longer than the first you can bet that it will make a longer array than the first sentence did'
        ]
        const split = splitSentences(yada, WIDTH)
        expect(split.length).toEqual(yada.length)

        expect(typeof split[0]).toEqual('object')
        expect(split[0].length).toBeGreaterThan(1)
        expect(split[0][0]).toEqual('this sentence has many more characters')
        expect(split[0][1]).toEqual('than 30 characters')

        expect(typeof split[1]).toEqual('object')
        expect(split[1].length).toEqual(4)
        expect(split[1][0]).toEqual('and this sentence is even so much')
        expect(split[1][1]).toEqual('more longer than the first you')
        expect(split[1][2]).toEqual( 'can bet that it will make a longer')
        expect(split[1][3]).toEqual('array than the first sentence did')

    })

})