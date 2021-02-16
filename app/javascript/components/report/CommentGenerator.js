const CONTENT_TEMPLATE = 'achieved {mark}% in the topic of {topic}';

const HIGH_COMPETENCY_TEMPLATE = '{pronoun} demonstrated {high_adjective} proficiency {competency1} and {competency1}.'
const LOW_COMPETENCY_TEMPLATE =  'However, {pronoun} was {low_adjective} with {low_competency_1} and {low_competency_2}.'

const EXTENDING = ['advanced', 'excellent', 'exceptional','exemplary', 'expansive', 'extensive', 'sophisticated', 'superlative', 'total']
const PROFICIENT = ['adequate', 'broad', 'commendable','competent', 'complete', 'comprehensive', 'good', 'in-depth', 'satisfactory', 'sufficient', 'thorough']
const DEVELOPING = ['deficient', 'developing', 'fragmented','growing', 'imperfect', 'improving', 'inadequate', 'partial', 'underdeveloped', 'unfinished']
const EMERGING = ['basic', 'budding', 'emerging','initial', 'introductory', 'nascent', 'preliminary', 'rudimentary', 'rudimental', 'undeveloped']

const getHighAdjective = (score, used) => {
    const s = Number(score)
    let level = EMERGING
    if (s > 3.25) {
       level = EXTENDING
    } else if ( s > 2.25) {
       level = PROFICIENT
    } else if (s > 1.25) {
       level = DEVELOPING
    }
    const copy = level.filter(word => !used.includes(word))
    return copy[Math.floor(Math.random() * copy.length)]
}

const getLowAdjective = (score) => {
    const s = Number(score)
    if (s > 2.25) {
        return "could improve upon"
    } else if ( s > 1.25) {
        return "had some difficulty with"
    } else {
        return "struggled with"
    }
}

// Move to Report generator
const initial = 'This report'

const getStudentName = (student) => {
    if (student.preferred_name) {
        return student.preferred_name
    } else {
        let firstName = student.name
        if (student.name.indexOf(' ') !== -1) {
            firstName = student.name.substr(0, student.name.indexOf(' '))
        }
        return firstName
    }
}

const generateTopicText = (marks, selectedTopics, student) => {
    let pronouns = student.pronoun.split('/')
    let preferred_name = getStudentName(student)

    let remarks = marks.reduce((remark, course, courseIndex, courseArray) => {
        let topicRemarks = course.course_marks
            .filter(topic => selectedTopics.includes(topic.id))
            .reduce((clause, topic, index, sourceArray) => {
                let mark = topic.mark ? topic.mark.toFixed(0) + "% " : "incomplete "
                let conj = index === sourceArray.length - 1 ? ", and " : ", "
                let mark_description = mark + "in the topic of " + topic.name.toLowerCase()

                let name = courseIndex > 0 && remark ? pronouns[0] : preferred_name

                return clause ? clause + conj + mark_description : name + " achieved " + mark_description
            }, "")

        if (topicRemarks && topicRemarks.length > 0) {
            let courseClause = marks.length > 1 ? ", in " + course.title : ""
            return remark ? remark + topicRemarks + courseClause + ". " : initial + courseClause + ", " + topicRemarks + ". "
        } else return remark;
    }, "")
    return remarks.trim()
};

function getCompetencyPhrasing(competency) {
    let competency_phrasing = competency.phrasing ? competency.phrasing.trim() : competency.name.toLowerCase().trim()
    let endsWithPeriod = competency_phrasing.lastIndexOf('.') === competency_phrasing.length - 1
    competency_phrasing = endsWithPeriod ? competency_phrasing.slice(0, -1) : competency_phrasing
    return competency_phrasing;
}

export const generateCompetencyText = (scores, selectedHighCompetencies, selectedLowCompetencies, student) => {
    let pronouns = student.pronoun.split('/')
    let studentName = getStudentName(student)

    let remarks = scores.reduce((courseComments, course, courseIndex, courseArray) => {
        studentName = courseIndex > 0 && courseComments ? pronouns[0] : studentName
        let usedAdjectives = []
        // TODO: Break into two using the selected high and selected low:
        let competencyNotes = course.competencies
            .filter(c => selectedHighCompetencies.includes(`${c.id}`))
            .reduce((competencyComments, competency, index, sourceArray) => {
                let adjective = getHighAdjective(competency.score, usedAdjectives)
                usedAdjectives.push(adjective)

                let competency_phrasing = getCompetencyPhrasing(competency);

                let firstSentence = index === 0
                let secondSentence = index === 1
                let thirdSentence = index === 2
                let description = adjective + " proficiency related to " + competency_phrasing

                if (firstSentence || secondSentence) {
                    let conjunctive = secondSentence ? (pronouns[0] || studentName) + " also" : ""

                    return firstSentence ? studentName + " demonstrated " + description.trim() + ". " : competencyComments + conjunctive + " demonstrated " + description + ". "
                } else {
                    let conjunctive = thirdSentence ? "As well, " + pronouns[0].toLowerCase() : ', and ' + pronouns[0].toLowerCase()
                    return competencyComments + conjunctive + " demonstrated " + description + ". "
                }

            }, "")
        usedAdjectives = []
        const conjunctives = ["However,", ", and", ", and", "also", ", as well as", ", and"]
        let stoppingPoint = 3
        competencyNotes += course.competencies
            .filter(c => selectedLowCompetencies.includes(`${c.id}`))
            .map((currentCompetency, index) => {
                // after 3 clauses, stop and take a breath before going on.
                const startNewSentence = index ===  stoppingPoint

                let adjective = getLowAdjective(currentCompetency.score)
                let competency_phrasing = getCompetencyPhrasing(currentCompetency);

                // when using the same adjective, eg "did poorly with" don't repeat "did poorly" in the next sentence
                if (usedAdjectives.includes(adjective)) {
                    if (!startNewSentence) {
                        adjective = adjective.substring(adjective.lastIndexOf(" ") + 1, adjective.length)
                        return `${conjunctives[index]} ${adjective} ${competency_phrasing}`
                    } else {
                        return `${studentName} ${conjunctives[index]} ${adjective} ${competency_phrasing}`
                    }
                } else {
                    usedAdjectives.push(adjective)
                    return `${conjunctives[index]} ${pronouns[0].toLowerCase()} ${adjective} ${competency_phrasing}`
                }
            })
            .reduce((competencyComments, clause, index, sourceArray) => {
                // After three competency descriptions, break it up with a period and start again with the pronoun
                const startNewSentence = index ===  stoppingPoint

                let  description = startNewSentence ? '. ' + clause :  clause
                return competencyComments + description
            }, "")

        if (competencyNotes) {
            if (!competencyNotes.trim().endsWith('.')) {
                competencyNotes += "."
            }
            // TODO: Fix this so it doesn't tag on the course name when there are no more competencies for the course
            let courseClause = scores.length > 1 ? "In " + course.title + ", " : ""
            return courseComments ? courseComments + courseClause + competencyNotes : courseClause + competencyNotes
        } else return courseComments;
    }, "")
    return remarks.trim()
};
export default generateTopicText;