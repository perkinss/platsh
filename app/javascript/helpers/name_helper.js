import {isNullOrUndefined} from "./object_helper";

export const extractFirstName = (fullName) => {
    if (isNullOrUndefined(fullName) || fullName.trim() === '') {
        return fullName
    }
    return fullName.trim().substr(0, fullName.indexOf(" ")) || fullName
}

export const getPreferredName = (student) => {
    return student.preferred_name || extractFirstName(student.name)
}


