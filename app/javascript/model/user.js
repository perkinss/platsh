export const ROLES = {
    TEACHER: 'teacher',
    STUDENT: 'student'
}

export default class User {
    // If roles is not otherwise provided it should be empty
    roles = []

    constructor(obj) {
        Object.assign(this, obj)
    }

    hasRole(role) {
        return this.roles && this.roles.includes(role)
    }

    hasAnyRole(roles) {
        const foundRole = roles.find((role) => this.hasRole(role))
        return Boolean(foundRole)
    }

    isTeacher() {
        return this.hasRole(ROLES.TEACHER)
    }

    isStudent() {
        return this.hasRole(ROLES.STUDENT)
    }
}
