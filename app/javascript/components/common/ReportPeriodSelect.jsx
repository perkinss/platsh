import {
    CircularProgress,
    FormControl,
    Grid,
    Input,
    InputLabel,
    Link,
    MenuItem,
    Select,
    Typography
} from "@material-ui/core";
import React from "react";
import BuildIcon from "@material-ui/icons/BuildRounded";
import {Link as RouterLink} from "react-router-dom";

const LinkBehavior = React.forwardRef((props, ref) => (
    <RouterLink ref={ref} to="/configure" {...props} />
));

export default function ReportPeriodSelect(props) {
    const {selectedReportingPeriod, handleSelectReportingPeriod, reportingPeriods, formControlClass, reportingConfigLoading, sectionName} = props

    //Rendering:
    if (reportingConfigLoading) {
        return (
            <Grid item xs={12} s={12} md={6} lg={4} xl={4}>
                <CircularProgress color={'primary'}/>
            </Grid>
            )

    } else if (!reportingPeriods || reportingPeriods < 1) {
        return (
            <Grid item xs={12} s={12} md={12} lg={6} xl={6}>
                <Typography variant={"caption"}>
                    NOTE: You have no reporting periods configured!
                    You can configure reporting periods for "{sectionName}" in the
                    Reports tab of the &nbsp;
                    <Link component={LinkBehavior} color={"textPrimary"}>
                        <BuildIcon fontSize={"small"} color={'secondary'}/> &nbsp; Configuration
                    </Link> page.
                </Typography>
            </Grid>
        )
    }

    return (
        <Grid item xs={12} s={12} md={6} lg={4} xl={4}>
            <FormControl className={formControlClass} fullWidth={true}>
                <InputLabel htmlFor="select-reporting-period">Reporting Period</InputLabel>
                <Select
                    value={selectedReportingPeriod || ''}
                    onChange={handleSelectReportingPeriod}
                    input={<Input id="select-period"/>}
                >
                    {reportingPeriods.map(period => (
                        <MenuItem key={period.id} value={period.id}>
                            {period.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Grid>
    )
}