import React, { useState, useEffect, useRef } from 'react'
import {useWindowDimensions, isInViewport} from 'helpers/windowHelper.js'
import Header from './Header';
import Footer from './Footer';
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Container, Grid, Typography, Paper, Box, Fab,
  Card, CardContent, CardMedia, Slide,
  Fade, Grow, Collapse, ButtonBase } from "@material-ui/core"
import DashboardIcon from '@material-ui/icons/Dashboard'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import AssessmentIcon from '@material-ui/icons/Assessment'
import BuildIcon from '@material-ui/icons/Build'
import FullLogo from 'images/logo-transparent.png'
import DashBoard from 'images/dashboard.png'
import VisibilityIcon from '@material-ui/icons/Visibility';
import Bruce from 'images/bruce.png'
import Susan from 'images/susan.png'
import Jordan from 'images/jordan.png'
import Mat from 'images/mat.png'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    main: windowdimensions => ({
        flexGrow: 1,
        padding: theme.spacing(5),
        marginLeft: theme.spacing(10),
        marginTop: theme.spacing(10),
        textAlign: 'center',
        minHeight: windowdimensions.height,
    }),
    bodycontent: bodywindowdimensions => ({
      flexGrow: 1,
      padding: theme.spacing(5),
      marginLeft: theme.spacing(10),
      textAlign: 'center',
      alignItems: 'center',
      minHeight: bodywindowdimensions.height,
    }),
    logo: {
      width: '600px',
      margin: '-150px -150px -150px -150px'
    },
    paper: {
      padding: theme.spacing(3),
      height: '100%',
    },
    card: {
      padding: theme.spacing(3),
      maxWidth: '375px',
      height: '100%'
    },
    media: {
      height: '325px',
      overflow: 'hidden'
    },
}));

export default function Home(props) {
    const { height, width } = useWindowDimensions();
    const windowdimensions = { height: height-190, width: width};
    const bodywindowdimensions = {height: height-80, width:width};
    const theme = useTheme();
    const classes = useStyles(windowdimensions)
    const [slideFeaturesTitle, initiateSlideFeaturesTitle] = useState(false);
    const [slideTeamTitle, initiateSlideTeamTitle] = useState(false);
    const [fadeFeaturesPaper, initiateFadeFeaturesPaper] = useState(false);
    const [fadeTeamPaper, intiateFadeTeamPaper]=useState(false);
    const featuresTitle = useRef();
    const featuresPaper = useRef();
    const teamTitle = useRef();
    const teamPaper = useRef();
    const [toggle, toggleBio] = useState({
      Bruce: false,
      Susan: false,
      Mat: false,
      Jordan: false
    })

    function toggleBioCollapse (name){
      toggleBio({
        ...toggle,
        [name]: !toggle[name]
      });
    }

    useEffect(() => {
      window.addEventListener("scroll",checkVisibility)
      return () => window.removeEventListener("scroll", checkVisibility);
    });

    function checkVisibility() {
      if (isInViewport(featuresTitle.current)){
        initiateSlideFeaturesTitle(true);
      }
      if (isInViewport(featuresPaper.current)){
        initiateFadeFeaturesPaper(true);
      }
      if (isInViewport(teamTitle.current)){
        initiateSlideTeamTitle(true);
      }
      if (isInViewport(teamPaper.current)){
        intiateFadeTeamPaper(true);
      }
    }

    return (
      <React.Fragment>
        <Header currentPage={"Home"} />
          <div className={classes.main}>
            <Grid
            container
            alignContent="space-around"
            alignItems="center"
            justify="space-around"
            style={{minHeight:windowdimensions.height}}
            >
              <Grid item xs={12}>
                <img className={classes.logo} src={FullLogo} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant={'h2'}>Standards-based Assessment Made Easy</Typography>
              </Grid>
                <Grid item xs={12}>
                  <Fab color="primary" variant="extended" href="/signup">
                    Start Your Trial Today
                  </Fab>
              </Grid>
            </Grid>
          </div>
        <hr />
          <div className={classes.bodycontent}>
            <Grid
            container
            alignContent="space-around"
            justify="center"
            alignItems="stretch"
            spacing={5}
            style={{minHeight:bodywindowdimensions.height}}
            >
              <Grid
              container
              justify="center"
              alignItems="center"
              >
                <Grid item md={4} xs={12} ref={featuresTitle}>
                  <Slide in={slideFeaturesTitle} direction="right" timeout={{enter: 500}}>
                    <Typography variant={'h2'}>Features</Typography>
                  </Slide>
                </Grid>
              <Grid item md={8} xs={12}>
                <Slide in={slideFeaturesTitle} direction="left" timeout={{enter: 500}}>
                  <Box borderLeft={{xs:'none', md:3}} paddingLeft={3} borderColor={{xs:'none', md:"secondary.main"}}>
                    <Typography variant={'h6'} style={{color: theme.palette.text.secondary}}>
                      Markury is a web-based tool for teachers to capture and report student progress. Collect evidence that is <em>content-based</em> and <em>competency driven</em>.
                    </Typography>
                  </Box>
                </Slide>
              </Grid>
              </Grid>
              <Fade in={fadeFeaturesPaper} timeout={{enter:500}}>
                <Grid item md={3} xs={12}>
                  <Paper className={classes.paper}>
                    <DashboardIcon fontSize="large" color="secondary"/>
                    <br />
                    <br />
                    <Typography variant="h5">Dashboard</Typography>
                    <Typography variant="body1">
                      <br />
                      Get up-to-date information on the content standards and curricular competencies you've assessed.
                    </Typography>
                  </Paper>
                </Grid>
              </Fade>
              <Fade in={fadeFeaturesPaper} ref={featuresPaper} timeout={{enter:1000}}>
                <Grid item md={3} xs={12}>
                  <Paper className={classes.paper}>
                    <BuildIcon fontSize="large" color="secondary"/>
                    <br />
                    <br />
                    <Typography variant="h5">Configure</Typography>
                    <Typography variant="body1"> <br />Create and modify your sections and assessments. Adjust the course weightings to fit your needs.</Typography>
                  </Paper>
                </Grid>
              </Fade>
              <Fade in={fadeFeaturesPaper} timeout={{enter:1500}}>
                <Grid item md={3} xs={12}>
                  <Paper className={classes.paper}>
                    <VisibilityIcon fontSize="large" color="secondary"/>
                    <br />
                    <br />
                    <Typography variant="h5">Observe</Typography>
                    <Typography variant="body1">
                      <br />
                      Whether it be a test, project, or in-class activity, you can quickly collect and record data for tasks that you've created.
                    </Typography>
                  </Paper>
                </Grid>
              </Fade>
              <Fade in={fadeFeaturesPaper} timeout={{enter:2000}}>
                <Grid item md={3} xs={12}>
                  <Paper className={classes.paper}>
                    <AssessmentIcon fontSize="large" color="secondary"/>
                    <br />
                    <br />
                    <Typography variant="h5">Reports</Typography>
                    <Typography variant="body1">
                      <br />
                      Detailed and accurate reports by section and individual. Easily identify what your students know, can do, and understand.
                    </Typography>
                    <Box display="none">
                      <Typography variant="body1">More information about configured</Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Fade>
            </Grid>
        </div>
      <hr />
      <div className={classes.bodycontent}>
        <Grid
        container
        alignContent="space-around"
        justify="center"
        alignItems="center"
        spacing={5}
        style={{minHeight:bodywindowdimensions.height}}
        >
          <Grid item md={4} xs={12} ref={teamTitle}>
            <Slide in={slideTeamTitle} direction="right" timeout={{enter: 500}} mountOnEnter unmountOnExit>
              <Typography variant={'h2'}>Our Team</Typography>
            </Slide>
          </Grid>
          <Grid item md={8} xs={12}>
            <Box borderLeft={{xs:'none', md:3}} paddingLeft={3} borderColor={{xs:'none', md:"secondary.main"}}>
              <Slide in={slideTeamTitle} direction="left" timeout={{enter: 500}} mountOnEnter unmountOnExit>
                <Typography variant={'h6'} style={{color: theme.palette.text.secondary}}>Built by BC teachers, for BC teachers.</Typography>
              </Slide>
            </Box>
          </Grid>
        <Grid
        container
        justify="space-between"
        alignItems="flex-start"
        spacing={5}
        >
            <Fade in={fadeTeamPaper} timeout={{enter:500}}>
              <Grid item align="center" lg={3} md={6} xs={12} ref={teamPaper}>
                <Card className={classes.card}>
                  <CardMedia image={Susan} className={classes.media}/>
                  <CardContent>
                    <ButtonBase onClick={() => toggleBioCollapse("Susan")}>
                      <Typography gutterBottom variant="h5" component="h2">
                        Susan Perkins
                        {toggle.Susan ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </Typography>
                    </ButtonBase>
                    <Typography variant="body1">
                      Lead Developer
                    </Typography>
                    <Collapse in={toggle.Susan}>
                      <Typography variant="body2" color="textSecondary" component="p">
                        <br />
                        Susan is a software engineer and full stack developer with a  user-centered design approach
                        and a get it done attitude that has helped local tech companies for over a decade.
                        <br /><br />
                        Contact: susan@markury.xyz
                      </Typography>
                    </Collapse>
                  </CardContent>
                </Card>
              </Grid>
            </Fade>
          <Fade in={fadeTeamPaper} timeout={{enter:1000}}>
            <Grid item lg={3} md={6} xs={12} align="center">
              <Card className={classes.card}>
                <CardMedia
                className={classes.media}
                image={Bruce}
                />
                <CardContent>
                  <ButtonBase onClick={() => toggleBioCollapse('Bruce')}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Bruce McAskill
                      {toggle.Bruce ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </Typography>
                  </ButtonBase>
                  <Typography variant="body1">
                    Managing Partner
                  </Typography>
                  <Collapse in={toggle.Bruce}>
                    <Typography variant="body2" color="textSecondary" component="p">
                      <br />
                      For 30 years Bruce has worked as a public and independent school teacher, math department head,
                      BC Mathematics Coordinator & Manager, internation curriculum and learning resource consultant, and texbook
                      consultant/author. Presently he is focused on ways to use different technologies to help his students improve
                      their individualized learning experiences.
                      <br /><br />
                      Contact: bruce@markury.xyz
                    </Typography>
                  </Collapse>
                </CardContent>
              </Card>
            </Grid>
          </Fade>
          <Fade in={fadeTeamPaper} timeout={{enter:1500}}>
            <Grid item lg={3} md={6} xs={12} align="center">
              <Card className={classes.card}>
                  <CardMedia
                  className={classes.media}
                  image={Mat}
                  />
                <CardContent>
                  <ButtonBase onClick={() => toggleBioCollapse('Mat')}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Mat Geddes
                      {toggle.Mat ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </Typography>
                  </ButtonBase>
                  <Typography variant="body1">
                  Marketing Specialist
                  </Typography>
                  <Collapse in={toggle.Mat}>
                    <Typography variant="body2" color="textSecondary" component="p">
                      <br />
                      Mathew Geddes is a career educator, having taught mathmatics, coached, and worked in residence for the past 20 years.
                      Currently he is Head of Mathematics at St. Michaels University School. He is a member of the Graduation Numeracy Marking Leadership Team.
                      He holds an MMT degree from the University of Waterloo, and a BSc and BEd from the University of Victoria.
                      <br /><br />
                      Contact: mat@markury.xyz
                    </Typography>
                  </Collapse>
                </CardContent>
              </Card>
            </Grid>
          </Fade>
          <Fade in={fadeTeamPaper} timeout={{enter:2000}}>
            <Grid item lg={3} md={6} xs={12} align="center">
              <Card className={classes.card}>
                  <CardMedia
                  className={classes.media}
                  image={Jordan}
                  />
                <CardContent>
                  <ButtonBase onClick={() => toggleBioCollapse('Jordan')}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Jordan Tessarolo
                      {toggle.Jordan ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </Typography>
                  </ButtonBase>
                  <Typography variant="body1">
                    Customer Service
                  </Typography>
                  <Collapse in={toggle.Jordan}>
                    <Typography variant="body2" color="textSecondary" component="p">
                      <br />
                      Jordan has been teaching math and sciences in BC for the past 4 years. He is interested in
                      assessment and how teachers can use technology to analyze student data and inform their practice.
                      <br /><br />
                      Contact: jordan@markury.xyz
                    </Typography>
                  </Collapse>
                </CardContent>
              </Card>
            </Grid>
          </Fade>
        </Grid>
      </Grid>
      </div>
    <Footer />
    </React.Fragment>
    );
}
