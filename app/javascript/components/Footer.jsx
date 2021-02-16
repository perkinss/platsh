import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, List, ListItem, ListItemText, IconButton} from "@material-ui/core"
import FacebookIcon from '@material-ui/icons/Facebook'
import TwitterIcon from '@material-ui/icons/Twitter'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    footer: {
      flexGrow: 1,
      padding: theme.spacing(3),
      marginLeft: theme.spacing(9),
      backgroundColor: theme.palette.grey[700],
      marginTop: '-6px'
    }
}));

export default function Footer(props) {

    const classes = useStyles()
    return (
           <React.Fragment>
           <hr />
              <div className={classes.footer}>
                <Grid container spacing={5}>
                  <Grid item sm={3} xs={12}>
                    <List>
                      <Typography variant="h5">About Us</Typography>
                      <ListItem alignItems="flex-start">
                        <ListItemText
                          primary="Markury"
                          secondary="is a web-based tool to assist teachers in assessing content knowledge and competency development."
                        >
                        </ListItemText>
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid item sm={3} xs={12}>
                  <List>
                    <Typography variant="h5">Recent Updates</Typography>
                    <ListItem divider={true} alignItems="flex-start">
                      <ListItemText
                        primary="10.19.19"
                        secondary="Student report now includes breakdown of content progress by standard"
                      >
                      </ListItemText>
                    </ListItem>
                    <ListItem divider={true} alignItems="flex-start">
                      <ListItemText
                        primary="09.23.19"
                        secondary="Fixed bug when editing an exisiting assessment"
                      >
                      </ListItemText>
                    </ListItem>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary="08.15.19"
                        secondary="Users can bulk upload students via csv file"
                      >
                      </ListItemText>
                    </ListItem>
                  </List>
                  </Grid>
                  <Grid item sm={3} xs={12}>
                  <List>
                    <Typography variant="h5">Teacher Resources</Typography>
                    <ListItem alignItems="flex-start">
                        <ListItemText
                          primary="Coming Soon"
                        >
                        </ListItemText>
                    </ListItem>
                  </List>
                  </Grid>
                  <Grid item sm={3} xs={12}>
                  <List>
                    <Typography variant="h5">Contact Us</Typography>
                    <ListItem divider={true} alignItems="flex-start">
                      <ListItemText
                        primary="Email:"
                        secondary="admin@markury.xyz"
                      >
                      </ListItemText>
                    </ListItem>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary="Follow Us"
                        secondary={
                          <React.Fragment>
                            <IconButton href="http://www.facebook.com/Markury">
                              <FacebookIcon/>
                            </IconButton>
                          </React.Fragment>
                          }
                      >
                    </ListItemText>
                    </ListItem>
                  </List>
                  </Grid>
                </Grid>
                <Grid container justify="space-between" alignItems="flex-end">
                  <Grid item xs={3}>
                    <Typography variant="body2">{'\u00A9'} 2019 BMJ Education Services</Typography>
                  </Grid>
                </Grid>
              </div>
           </React.Fragment>
    );
}
