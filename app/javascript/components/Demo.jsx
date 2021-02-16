import React  from 'react';
import { Typography, Paper, Container, Grid } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import BuildIcon from '@material-ui/icons/BuildRounded'
import Header from './Header'
import StackedTopicBarChart from './report/StackedTopicBarChart'
import { useTheme } from '@material-ui/styles'
import HeatMap from './report/HeatMap'
import RadialChart from './report/RadialChart'
import RoleValidatingWrapper from "./RoleValidatingWrapper";
import {ROLES} from "../model/user";


const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(10),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        marginLeft: theme.spacing(10)
    },
});

const fakeStudentObservations = {
    standardObservations: [
        {studentId: 1, standardId: 1, mark: true, date: Date.now()}
    ],
    competencyObservations: [],
    comments: []
}

const fakeSectionData = [
    {
        sectionid: 1,
        standardMarks: [
            {standardId: 1, average: 12},
            {standardId: 2, average: 98}
        ],
        competencyAverages: []
    }
]

function Demo (props) {
    const { classes } = props
    const theme = useTheme()
    const heatClasses = classes
    classes.tooltip = {
        theme: 'dark'
    }
    const demoStandardCategories =
        ["Ada Lovelace", "Alan Turing", "Daisy Chain", "Leo da Vinci", "Vincent Van Gogh",
            "Albrecht Durer", "Tiffany Chain", "Cecilia Gallerani", "Karen Kain", "Roberto Mondigliani", "Arthur Erikson",
            "Mies Van der Roeh", "Frank Lloyd Wright", "Grace Hopper", "Marie Curie", "Liza Einstein",
            "Eina Kleina Dansmusick", "Elise Erikson","Ada Lovelace", "Alan Turing", "Daisy Chain", "Leo da Vinci", "Vincent Van Gogh",
            "Albrecht Durer", "Tiffany Chain", "Cecilia Gallerani", "Karen Kain", "Roberto Mondigliani", "Arthur Erikson",
            "Mies Van der Roeh", "Frank Lloyd Wright", "Grace Hopper", "Marie Curie", "Liza Einstein",
            "Eina Kleina Dansmusick", "Elise Erikson"
        ]
    const timeCategories = [
        "Sept 2019", "Oct 2019","Nov 2019","Dec 2019","Jan 2020","Feb 2020","March 2020","April 2020","May 2020","June 2020"
    ]
    const generateData = (count, yrange)  => {
        var i = 0;
        var series = [];
        while (i < count) {
            var x = 'w' + (i + 1).toString();
            var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

            series.push({
                x: x,
                y: y
            });
            i++;
        }
        return series;
    }

    const series1 = [
        {
            name: 'Operations',
            data: generateData(36, {
                min: 0,
                max: 100
            }),
        },
        {
            name: 'Exponents',
            data: generateData(36, {
                min: 0,
                max: 100
            })
        },
        {
            name: 'Polynomials',
            data: generateData(36, {
                min: 0,
                max: 100
            })
        },
        {
            name: 'Two-variable linear relations',
            data: generateData(36, {
                min: 0,
                max: 100
            })
        },
        {
            name: 'Linear equations',
            data: generateData(36, {
                min: 0,
                max: 100
            })
        },
        {
            name: 'Proportional Reasoning',
            data: generateData(36, {
                min: 0,
                max: 100
            })
        },
        {
            name: 'Statistics',
            data: generateData(36, {
                min: 0,
                max: 100
            })
        },
        {
            name: 'Financial Reasoning',
            data: generateData(36, {
                min: 0,
                max: 100
            })
        },
    ]

    const series2 = [
        {
            name: 'Connect and Reflect',
            data: generateData(10, {
                min: 0,
                max: 60
            })
        },
        {
            name: 'Understand and Solving',
            data: generateData(10, {
                min: 50,
                max: 90
            })
        },
        {
            name: 'Reasoning and Modeling',
            data: generateData(10, {
                min: 70,
                max: 100
            })
        },
        {
            name: 'Communicating and Representing',
            data: generateData(10, {
                min: 90,
                max: 100
            })
        },

    ]



    return (
        <React.Fragment>
            <Header currentPage={"Report"}>
                <Container maxWidth={'xl'}>
                    <div className={classes.content}>
                        <div className={classes.toolbar} />
                        <RoleValidatingWrapper allowedRoles={[ROLES.TEACHER]}>
                            <Typography variant={'h2'}>
                                View Student Status
                            </Typography>
                            <Paper className={classes.paper}>
                                <Typography paragraph>
                                    This is where you will be able to generate reports for the students in your courses.
                                    You will also see some cool graphs.  Maybe even some helpful ones.
                                </Typography>
                                <Grid container>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant={'h6'}>DEMO: Radial Overview of Math 10</Typography>

                                        <RadialChart
                                            classes={classes}

                                            labels={[
                                                'Math 10 Section 1',
                                                'Math 10 Section 2',

                                            ]}
                                            series={[90,80]}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Typography variant={'h6'}>DEMO: Radial Overview of Pre Calculus</Typography>
                                        <RadialChart
                                            classes={classes}
                                            labels={[
                                                'Pre-calculus 11 Section 1',
                                                'Pre-calculus 11 Section 2',
                                                'Pre-calculus 11 Section 3',

                                            ]}
                                            series={[90,80,50]}
                                            title={"Damn good demo"}
                                        />

                                    </Grid>
                                </Grid>
                                <HeatMap
                                    classes={heatClasses}
                                    title={"DEMO: Topics for Section 9 Math 9"}
                                    categories={demoStandardCategories}
                                    series={series1}
                                />

                                <HeatMap
                                    classes={heatClasses}
                                    title={"DEMO: Overview time series for Section 9 Math 9"}
                                    categories={timeCategories}
                                    series={series2}
                                />

                                <StackedTopicBarChart classes={classes}/>
                            </Paper>
                        </RoleValidatingWrapper>
                    </div>
                </Container>
            </Header>
        </React.Fragment>
    );

}
export default withStyles(styles)(Demo);


