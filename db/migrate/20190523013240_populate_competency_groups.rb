class PopulateCompetencyGroups < ActiveRecord::Migration[5.2]
  def change
    CompetencyGroup.create(:title => 'Reasoning and analyzing')
    CompetencyGroup.create(:title => 'Understanding and solving')
    CompetencyGroup.create(:title => 'Communicating and representing')
    CompetencyGroup.create(:title => 'Connecting and reflecting')
  end
end
