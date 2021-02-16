export function dashboardReducer(state, action) {
    switch (action.type) {
        case 'SET_COURSES' :
        state = {...state, courses: action.courses}
        return state;
        default:
            return state
    }
}
