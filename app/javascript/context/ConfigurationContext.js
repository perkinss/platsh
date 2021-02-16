import React from 'react'

export const configuration = {
    sections: [
        {
            id: null,
            courses: [],
            name: '',
            assessment: [
                {
                    type: 'test',
                    name: '',
                    tasks: [
                    {
                        name: '',
                        available_standards: [
                            {
                                id: -1,
                                level: ''
                            }
                        ],
                        competencies: [

                        ]
                    },
                    ]
                }
            ],
            enrollees: [
                1, 2, 3, 22
            ]
        },
    ],

}


const ConfigurationContext =  React.createContext(configuration);

export { ConfigurationContext }
