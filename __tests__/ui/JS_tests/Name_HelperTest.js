import expect from "expect";
import {extractFirstName, getPreferredName} from "../../../app/javascript/helpers/name_helper";

describe('Extraction of first name from a full name gets the first name', () => {

    it ('should return empty string if name is empty', () => {
        let name = ''

        expect(extractFirstName(name)).toBe('')
    })

    it ('should return the first name without extra spaces', () => {
        let fullName = "Albert     Edward Einstein"
        expect(extractFirstName(fullName)).toBe('Albert')
    })


    it ('should return the full name if there is only one name', () => {
       let fullName = 'Einstein'
        expect(extractFirstName(fullName)).toBe('Einstein')
    })

    it ('should return null if the name is null', () => {
        let fullName = null
        expect(extractFirstName(fullName)).toBeNull()
    })
})

describe('Preferred Name gets preferred or first name', () => {
    let student
    beforeEach(() => student = {name: 'Ruth Bader Ginsberg', preferred_name: 'Truthy Ruthy'})

    it ('should return preferred name if there is one', () => {
        expect(getPreferredName(student)).toBe('Truthy Ruthy')
    })

    it ('should return the first name when there is no preferred name set', () => {
        student.preferred_name = ""
        expect(getPreferredName(student)).toBe('Ruth')
    })

    it ('should return the full name if there is only one name', () => {
        student.preferred_name = ""
        student.name = "Ruthful"
        expect(getPreferredName(student)).toBe('Ruthful')
    })

})
