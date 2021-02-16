class PopulateCalcCompetencies < ActiveRecord::Migration[5.2]
  def change
    CompetencyGroup.create(:title => 'Reasoning and modelling')
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Reasoning and modelling').id,
                      description: 'Develop thinking strategies to solve puzzles and play games',
                      course_id: Course.find_by_title('Pre-calculus 11').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Reasoning and modelling').id,
                      description: 'Explore, analyze, and apply mathematical ideas using reason, technology, and other tools',
                      course_id: Course.find_by_title('Pre-calculus 11').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Reasoning and modelling').id,
                      description: 'Estimate reasonably and demonstrate fluent, flexible, and strategic thinking about numbers',
                      course_id: Course.find_by_title('Pre-calculus 11').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Reasoning and modelling').id,
                      description: 'Model with mathematics in situational contexts',
                      course_id: Course.find_by_title('Pre-calculus 11').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Reasoning and modelling').id,
                      description: 'Think creatively and with curiosity and wonder when  exploring problems',
                      course_id: Course.find_by_title('Pre-calculus 11').id)

    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Understanding and solving').id,
                      description: 'Develop, demonstrate, and apply conceptual understanding of mathematical ideas through play, story, inquiry, and problem solving',
                      course_id: Course.find_by_title('Pre-calculus 11').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Understanding and solving').id,
                      description: 'Visualize to explore and illustrate mathematical concepts  and relationships',
                      course_id: Course.find_by_title('Pre-calculus 11').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Understanding and solving').id,
                      description: 'Apply flexible and strategic approaches to solve problems',
                      course_id: Course.find_by_title('Pre-calculus 11').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Understanding and solving').id,
                      description: 'Solve problems with persistence and a positive disposition',
                      course_id: Course.find_by_title('Pre-calculus 11').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Understanding and solving').id,
                      description: 'Engage in problem-solving experiences connected with place, story, cultural practices, and perspectives relevant to local First Peoples communities, the local community, and other cultures',
                      course_id: Course.find_by_title('Pre-calculus 11').id)

    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Communicating and representing').id,
                      description: 'Explain and justify mathematical ideas and decisions in many ways',
                      course_id: Course.find_by_title('Pre-calculus 11').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Communicating and representing').id,
                      description: 'Represent mathematical ideas in concrete, pictorial, and symbolic forms',
                      course_id: Course.find_by_title('Pre-calculus 11').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Communicating and representing').id,
                      description: 'Use mathematical vocabulary and language to contribute to discussions in the classroom',
                      course_id: Course.find_by_title('Pre-calculus 11').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Communicating and representing').id,
                      description: 'Take risks when offering ideas in classroom discourse',
                      course_id: Course.find_by_title('Pre-calculus 11').id)


    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Connecting and reflecting').id,
                      description: 'Reflect on mathematical thinking',
                      course_id: Course.find_by_title('Pre-calculus 11').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Connecting and reflecting').id,
                      description: 'Connect mathematical concepts with each other, with other areas,  and with personal interests',
                      course_id: Course.find_by_title('Pre-calculus 11').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Connecting and reflecting').id,
                      description: 'Use mistakes as opportunities to advance learning',
                      course_id: Course.find_by_title('Pre-calculus 11').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Connecting and reflecting').id,
                      description: 'Incorporate First Peoples worldviews, perspectives, knowledge,  and practices to make connections with mathematical concepts',
                      course_id: Course.find_by_title('Pre-calculus 11').id)


    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Reasoning and modelling').id,
                      description: 'Develop thinking strategies to solve puzzles and play games',
                      course_id: Course.find_by_title('Pre-calculus 12').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Reasoning and modelling').id,
                      description: 'Explore, analyze, and apply mathematical ideas using reason, technology, and other tools',
                      course_id: Course.find_by_title('Pre-calculus 12').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Reasoning and modelling').id,
                      description: 'Estimate reasonably and demonstrate fluent, flexible, and strategic thinking about numbers',
                      course_id: Course.find_by_title('Pre-calculus 12').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Reasoning and modelling').id,
                      description: 'Model with mathematics in situational contexts',
                      course_id: Course.find_by_title('Pre-calculus 12').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Reasoning and modelling').id,
                      description: 'Think creatively and with curiosity and wonder when  exploring problems',
                      course_id: Course.find_by_title('Pre-calculus 12').id)

    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Understanding and solving').id,
                      description: 'Develop, demonstrate, and apply conceptual understanding of mathematical ideas through play, story, inquiry, and problem solving',
                      course_id: Course.find_by_title('Pre-calculus 12').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Understanding and solving').id,
                      description: 'Visualize to explore and illustrate mathematical concepts  and relationships',
                      course_id: Course.find_by_title('Pre-calculus 12').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Understanding and solving').id,
                      description: 'Solve problems with persistence and a positive disposition',
                      course_id: Course.find_by_title('Pre-calculus 12').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Understanding and solving').id,
                      description: 'Apply flexible and strategic approaches to solve problems',
                      course_id: Course.find_by_title('Pre-calculus 12').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Understanding and solving').id,
                      description: 'Engage in problem-solving experiences connected with place, story, cultural practices, and perspectives relevant to local First Peoples communities, the local community, and other cultures',
                      course_id: Course.find_by_title('Pre-calculus 12').id)

    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Communicating and representing').id,
                      description: 'Explain and justify mathematical ideas and decisions in many ways',
                      course_id: Course.find_by_title('Pre-calculus 12').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Communicating and representing').id,
                      description: 'Represent mathematical ideas in concrete, pictorial, and symbolic forms',
                      course_id: Course.find_by_title('Pre-calculus 12').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Communicating and representing').id,
                      description: 'Use mathematical vocabulary and language to contribute to discussions in the classroom',
                      course_id: Course.find_by_title('Pre-calculus 12').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Communicating and representing').id,
                      description: 'Take risks when offering ideas in classroom discourse',
                      course_id: Course.find_by_title('Pre-calculus 12').id)

    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Connecting and reflecting').id,
                      description: 'Reflect on mathematical thinking',
                      course_id: Course.find_by_title('Pre-calculus 12').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Connecting and reflecting').id,
                      description: 'Connect mathematical concepts with each other, with other areas,  and with personal interests',
                      course_id: Course.find_by_title('Pre-calculus 12').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Connecting and reflecting').id,
                      description: 'Use mistakes as opportunities to advance learning',
                      course_id: Course.find_by_title('Pre-calculus 12').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Connecting and reflecting').id,
                      description: 'Incorporate First Peoples worldviews, perspectives, knowledge,  and practices to make connections with mathematical concept.',
                      course_id: Course.find_by_title('Pre-calculus 12').id)
    
  end
end
