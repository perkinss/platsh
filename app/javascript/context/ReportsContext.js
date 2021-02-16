import React from 'react'

export const reports = {
    students: [],
    sections: [],
    selected_section: null,
    selected_student: null,
    section_overview_marks: {},
    section_competency_scores: {},
    student_section_marks: {},
    heat_map_colors: []
}


const ReportsContext =  React.createContext(reports);

export { ReportsContext }
