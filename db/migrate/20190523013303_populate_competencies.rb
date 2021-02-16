class PopulateCompetencies < ActiveRecord::Migration[5.2]
  def change
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Reasoning and analyzing').id,
                      description: 'Use logic and patterns to solve puzzles and play games',
                      course_id: Course.find_by_title('Math 9').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Reasoning and analyzing').id,
                      description: 'Use reasoning and logic to explore, analyze, and apply mathematical ideas',
                      course_id: Course.find_by_title('Math 9').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Reasoning and analyzing').id,
                      description: 'Estimate reasonably',
                      course_id: Course.find_by_title('Math 9').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Reasoning and analyzing').id,
                      description: 'Demonstrate and apply mental math strategies',
                      course_id: Course.find_by_title('Math 9').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Reasoning and analyzing').id,
                      description: 'Use tools or technology to explore and create patterns and relationships, and test conjectures',
                      course_id: Course.find_by_title('Math 9').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Reasoning and analyzing').id,
                      description: 'Model mathematics in contextualized experiences',
                      course_id: Course.find_by_title('Math 9').id)

    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Understanding and solving').id,
                      description: 'Apply multiple strategies to solve problems in both abstract and contextualized situations',
                      course_id: Course.find_by_title('Math 9').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Understanding and solving').id,
                      description: 'Develop, demonstrate, and apply mathematical understanding through play, inquiry, and problem solving',
                      course_id: Course.find_by_title('Math 9').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Understanding and solving').id,
                      description: 'Visualize to explore mathematical concepts',
                      course_id: Course.find_by_title('Math 9').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Understanding and solving').id,
                      description: 'Engage in problem-solving experiences that are connected to place, story, cultural practices, and perspectives relevant to local First Peoples communities, the local community, and other cultures',
                      course_id: Course.find_by_title('Math 9').id)

    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Communicating and representing').id,
                      description: 'Use mathematical vocabulary and language to contribute to mathematical discussions',
                      course_id: Course.find_by_title('Math 9').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Communicating and representing').id,
                      description: 'Explain and justify mathematical ideas and decisions',
                      course_id: Course.find_by_title('Math 9').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Communicating and representing').id,
                      description: 'Communicate mathematical thinking in many ways',
                      course_id: Course.find_by_title('Math 9').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Communicating and representing').id,
                      description: 'Represent mathematical ideas in concrete, pictorial, and symbolic forms',
                      course_id: Course.find_by_title('Math 9').id)

    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Connecting and reflecting').id,
                      description: 'Reflect on mathematical thinking',
                      course_id: Course.find_by_title('Math 9').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Connecting and reflecting').id,
                      description: 'Connect mathematical concepts to each other and to other areas and personal interests',
                      course_id: Course.find_by_title('Math 9').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Connecting and reflecting').id,
                      description: 'Use mathematical arguments to support personal choices',
                      course_id: Course.find_by_title('Math 9').id)
    Competency.create(competency_group_id: CompetencyGroup.find_by_title('Connecting and reflecting').id,
                      description: 'Incorporate First Peoples worldviews and perspectives to make connections to mathematical concepts',
                      course_id: Course.find_by_title('Math 9').id)


  end
end
