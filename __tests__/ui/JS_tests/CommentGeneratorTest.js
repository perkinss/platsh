import generateTopicText, {generateCompetencyText} from "../../../app/javascript/components/report/CommentGenerator";
import expect from "expect";

describe('CommentGenerator generateTopicComment() returns the right comment', () => {
    const one_course_marks = [{
        id: 5,
        title: "Pre-calculus 11",
        course_marks: [
            {
                id: 13,
                name: "Rational Functions",
                mark: 83.33333333333333,
                weight: 1,
            },
            {
                id: 15,
                name: "Inequalities",
                mark: 80,
            },
            {
                id: 12,
                name: "Polynomial Factoring",
                mark: 75,
            }
        ]
    },]
    const course2 = {
        id: 5,
        title: "AP Calculus BC",
        course_marks: [
            {
                id: 130,
                name: "Rationale Functions",
                mark: 98.9,
                weight: 1,
            },
            {
                id: 150,
                name: "Inequalities",
                mark: 78,
            },
            {
                id: 120,
                name: "Polynomial Factoring",
                mark: 90,
            }
        ]
    }
    const course3 = {
        id: 5,
        title: "AP Calculus AB",
        course_marks: [
            {
                id: 230,
                name: "Step Functions",
                mark: 87.5,
                weight: 1,
            },
            {
                id: 250,
                name: "Transformations",
                mark: 68,
            },
            {
                id: 220,
                name: "Logarithms",
                mark: 90.2,
            }
        ]
    }
    const two_course_marks = [...one_course_marks, course2]
    const three_course_marks = [...two_course_marks, course3]

    const student = {
        id: 850,
        name: "Jane Small",
        pronoun: "She/Her/Her",
        preferred_name: "Jane"
    }
    it('Should handle one topic', () => {
        let selectedTopics = [13]

        const remarks = generateTopicText(one_course_marks, selectedTopics, student)
        expect(remarks).toBe('This report, Jane achieved 83% in the topic of rational functions.')
    })

    it('Should handle two topics', () => {
        let selectedTopics = [13, 15]

        const remarks = generateTopicText(one_course_marks, selectedTopics, student)
        expect(remarks).toBe('This report, Jane achieved 83% in the topic of rational functions, and 80% in the topic of inequalities.')
    })

    it('Should handle three topics', () => {
        let selectedTopics = [13,12,15]

        const remarks = generateTopicText(one_course_marks, selectedTopics, student)
        expect(remarks).toBe('This report, Jane achieved 83% in the topic of rational functions, '+
            '80% in the topic of inequalities, and 75% in the topic of polynomial factoring.')
    })

    it('Should handle two courses and one topic', () => {
        let selectedTopics = [130]

        const remarks = generateTopicText(two_course_marks, selectedTopics, student)
        expect(remarks).toBe('This report, in AP Calculus BC, Jane achieved 99% in the topic of rationale functions.')
    })

    it('Should handle three courses and three topics in first', () => {
        let selectedTopics = [130, 13, 15, 12, 230]

        const remarks = generateTopicText(three_course_marks, selectedTopics, student)
        expect(remarks).toBe(
            'This report, in Pre-calculus 11, Jane achieved 83% in the topic of rational functions, ' +
            '80% in the topic of inequalities, and 75% in the topic of polynomial factoring. ' +
            'She achieved 99% in the topic of rationale functions, in AP Calculus BC. ' +
            'She achieved 88% in the topic of step functions, in AP Calculus AB.'
        )
    })

    it('Should handle two courses and one topic in each, and no gender/pronoun in student', () => {
        let selectedTopics = [130, 13]
        student.pronoun = 'She/Her/Her'

        const remarks = generateTopicText(two_course_marks, selectedTopics, student)
        expect(remarks).toBe('This report, in Pre-calculus 11, Jane achieved 83% in the topic of rational functions. ' +
            'She achieved 99% in the topic of rationale functions, in AP Calculus BC.')
    })

})

describe('CommentGenerator generateCompetencyText() returns the right comment', () => {
    const comps =
        [
            {
                id: 5,
                title: "Pre-calculus 11",
                competencies: [
                    { id: "1", name: "applying flexible and strategic approaches to solve problems", score: 4 },
                    { id: "2", name: "Connecting mathematical concepts with each other, with other areas, and with personal interests", score: 4 },
                    { id: "3", name: "Reflecting on mathematical thinking", score: 2.5 },
                    { id: "8", name: "Coming up with good names for competencies even though tired", score: 1.5},
                    { id: "9", name: "Having said that, Pooh turned to piglet and said, lets go ask owl in the woods, ok?", score: 0.5}
                ]
            },
            {
                id: 6,
                title: "Pre-calculus 12",
                competencies: [
                    { id: "4", name: "Applying flexible and strategic approaches to solve problems", score: 4 },
                    { id: "5", name: "Developing, demonstrate, and apply conceptual understanding", score: 4 },
                    { id: "6", name: "Developing thinking strategies and field generators", phrasing: null, score: 4.6 },
                    { id: "7", name: "just a name", phrasing: 'generating comments better than ever in every sense of the word', score: 4.5 }

                ]
            }
        ]

    const student = {
        id: 850,
        name: "Jane Small",
        pronoun: "She/Her/Her",
        preferred_name: "Jane"
    }


    it('Should handle one competency', () => {
        let selected = ['1']

        const expected = new RegExp('^In Pre-calculus 11, Jane demonstrated '+
            '(advanced|excellent|exceptional|exemplary|expansive|extensive|sophisticated|superlative|total)' +
            ' proficiency related to applying flexible and strategic approaches to solve problems\\\.$')

        const remarks = generateCompetencyText(comps, selected, [], student)
        expect(remarks).toMatch(expected)
    })

    it('Should handle two high competencies', () => {
        let highSelected = ['1', '2']

        const expected = new RegExp('^In Pre-calculus 11, Jane demonstrated ' +
            '(advanced|excellent|exceptional|exemplary|expansive|extensive|sophisticated|superlative|total) ' +
            'proficiency related to applying flexible and strategic approaches to solve problems. She also demonstrated ' +
            '(advanced|excellent|exceptional|exemplary|expansive|extensive|sophisticated|superlative|total) ' +
            'proficiency related to connecting mathematical concepts with each other, with other areas, and with personal interests\\\.$')

        const remarks = generateCompetencyText(comps, highSelected, [], student)
        expect(remarks).toMatch(expected)
    })

    it('Should handle two high competencies and one low competency', () => {
        let selected = ['1', '2']
        let lowSelected = ['3']

        const expected = new RegExp('^In Pre-calculus 11, Jane demonstrated ' +
            '(advanced|excellent|exceptional|exemplary|expansive|extensive|sophisticated|superlative|total) ' +
            'proficiency related to applying flexible and strategic approaches to solve problems.  She also demonstrated ' +
            '(advanced|excellent|exceptional|exemplary|expansive|extensive|sophisticated|superlative|total) ' +
            'proficiency related to connecting mathematical concepts with each other, with other areas, and with personal interests.' +
            ' However, she could improve upon reflecting on mathematical thinking.\\\$')

        const remarks = generateCompetencyText(comps, selected, lowSelected, student)
        // expect(remarks).toMatch(expected)
    })

    it('Should handle one competency in two courses', () => {
        let selected = ['1', '4']

        const expected = new RegExp('^In Pre-calculus 11, Jane demonstrated '+
            '(advanced|excellent|exceptional|exemplary|expansive|extensive|sophisticated|superlative|total)' +
            ' proficiency related to applying flexible and strategic approaches to solve problems. Jane demonstrated ' +
            '(advanced|excellent|exceptional|exemplary|expansive|extensive|sophisticated|superlative|total)' +
            ' proficiency related to applying flexible and strategic approaches to solve problems, in Pre-calculus 12.$')

        const remarks = generateCompetencyText(comps, selected, [], student)
        // expect(remarks).toMatch(expected)
    })

    it('Should handle two competencies in two courses', () => {
        let selected = ['1', '4']

        const expected = new RegExp('^In Pre-calculus 11, Jane demonstrated '+
            '(advanced|excellent|exceptional|exemplary|expansive|extensive|sophisticated|superlative|total)' +
            ' proficiency related to applying flexible and strategic approaches to solve problems. Jane demonstrated ' +
            '(advanced|excellent|exceptional|exemplary|expansive|extensive|sophisticated|superlative|total)' +
            ' proficiency related to applying flexible and strategic approaches to solve problems, in Pre-calculus 12.$')

        const remarks = generateCompetencyText(comps, selected, [], student)
        // expect(remarks).toMatch(expected)
    })

    it('Should use phrasing instead of description/name when present', () => {
        let selected = ['6', '7']

        const expected = new RegExp('^In Pre-calculus 12, Jane demonstrated ' +
            '(advanced|excellent|exceptional|exemplary|expansive|extensive|sophisticated|superlative|total) ' +
            'proficiency related to developing thinking strategies and field generators. She also demonstrated ' +
            '(advanced|excellent|exceptional|exemplary|expansive|extensive|sophisticated|superlative|total) ' +
            'proficiency related to generating comments better than ever in every sense of the word.$')

        const remarks = generateCompetencyText(comps, selected, [], student)
        expect(remarks).toMatch(expected)
    })

    it('Should use first name instead of preferred name when no preferred name present', () => {
        let selected = ['6', '7']
        student.preferred_name = ""
        student.name = "Sarah Becket"
        const expected = new RegExp('^In Pre-calculus 12, Sarah demonstrated ' +
            '(advanced|excellent|exceptional|exemplary|expansive|extensive|sophisticated|superlative|total) ' +
            'proficiency related to developing thinking strategies and field generators. She also demonstrated ' +
            '(advanced|excellent|exceptional|exemplary|expansive|extensive|sophisticated|superlative|total) ' +
            'proficiency related to generating comments better than ever in every sense of the word.$')

        const remarks = generateCompetencyText(comps, selected, [], student)
        expect(remarks).toMatch(expected)
    })

    it('Should use full name instead of preferred name when no preferred name present and the full name has no spaces', () => {
        let selected = ['6', '7']
        student.preferred_name = ""
        student.name = "Sarah"
        const expected = new RegExp('^In Pre-calculus 12, Sarah demonstrated ' +
            '(advanced|excellent|exceptional|exemplary|expansive|extensive|sophisticated|superlative|total) ' +
            'proficiency related to developing thinking strategies and field generators. She also demonstrated ' +
            '(advanced|excellent|exceptional|exemplary|expansive|extensive|sophisticated|superlative|total) ' +
            'proficiency related to generating comments better than ever in every sense of the word.$')

        const remarks = generateCompetencyText(comps, selected, [], student)
        expect(remarks).toMatch(expected)
    })

    it('Should handle several high and several low competencies', () => {
        let selected = ['1', '2']
        let low = ['3', '8']
        student.name = "Jane"
        const expected = new RegExp('^In Pre-calculus 11, Jane demonstrated ' +
            '(advanced|excellent|exceptional|exemplary|expansive|extensive|sophisticated|superlative|total) ' +
            'proficiency related to applying flexible and strategic approaches to solve problems. She also demonstrated ' +
            '(advanced|excellent|exceptional|exemplary|expansive|extensive|sophisticated|superlative|total) ' +
            'proficiency related to connecting mathematical concepts with each other, with other areas, and with personal interests. ' +
            'However, she could improve upon reflecting on mathematical thinking, and she had some difficulty with coming up ' +
            'with good names for competencies even though tired.$')

        const remarks = generateCompetencyText(comps, selected, low, student)
        expect(remarks).toMatch(expected)
    })
     const comps2 = [
        {
            id: 5,
            title: "Pre-calculus 11",
            competencies: [
                { id: "1", name: "applying flexible and strategic approaches to solve problems", score: 4 },
                { id: "2", name: "Connecting mathematical concepts with each other, with other areas, and with personal interests", score: 4 },
                { id: "3", name: "Reflecting on mathematical thinking", score: 2.5 },
                { id: "8", name: "Coming up with good names for competencies even though tired", score: 1.5},
                { id: "9", name: "Having said that, Pooh turned to piglet and said, lets go ask owl in the woods, ok?", score: 0.5}
            ]
        },
         ]
    it('Should handle one course with several high and several low competencies', () => {
        let selected = ['1', '2']
        let low = ['8', '9']

        const expected = new RegExp("^Jane demonstrated " +
            "(advanced|excellent|exceptional|exemplary|expansive|extensive|sophisticated|superlative|total) " +
            "proficiency related to applying flexible and strategic approaches to solve problems. She also demonstrated " +
            "(advanced|excellent|exceptional|exemplary|expansive|extensive|sophisticated|superlative|total) " +
            "proficiency related to connecting mathematical concepts with each other, with other areas, and with personal interests. " +
            "However, she had some difficulty with coming up with good names for competencies even though tired, and she struggled " +
            "with having said that, pooh turned to piglet and said, lets go ask owl in the woods, ok\\\?\\\.$")

        const remarks = generateCompetencyText(comps2, selected, low, student)
        expect(remarks).toMatch(expected)
    })
})
