import React, { useState } from 'react'
import { fade, makeStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import {isNullOrUndefined} from "../../helpers/object_helper";

const useCompetencyStyles = makeStyles(theme => ({
    thumb: {
        height: theme.spacing(2),
        width: theme.spacing(2),
        backgroundColor: theme.palette.primary,
        border: '2px solid',
        borderColor: theme.palette.secondary.main,
        boxShadow: `0px 0px 0px ${8}px ${fade(theme.palette.secondary.dark, 0.16)}`,
    },
    track: {
        backgroundColor: theme.palette.secondary.dark,
        height: theme.spacing(1),
    },
    rail: {
        height: theme.spacing(1),
        borderRadius: 4,
        backgroundColor: theme.palette.primary.dark,
    },
    valueLabel: {
        left: 'calc(-50% - 4px)',
        color: theme.palette.secondary.dark,
        marginTop: '10px'
    },

}));

const useHolisticStandardStyles = makeStyles(theme => ({
    thumb: {
        height: theme.spacing(2),
        width: theme.spacing(2),
        backgroundColor: theme.palette.secondary,
        border: '2px solid',
        borderColor: theme.palette.primary.dark,
        boxShadow: `0px 0px 0px ${8}px ${fade(theme.palette.primary.dark, 0.16)}`,
    },
    track: {
        backgroundColor: theme.palette.primary.dark,
        height: theme.spacing(1),
    },
    rail: {
        height: theme.spacing(1),
        borderRadius: 4,
        backgroundColor: theme.palette.secondary.dark,
    },
    valueLabel: {
        left: 'calc(-50% - 4px)',
        color: theme.palette.primary.dark,
        marginTop: '10px'
    },

}));

export default function ScoreSlider(props) {

    const { id, type, index, initialValue, handleScoreChange, handleBlur, maxTick = 4 } = props

    const [value, setValue] = useState(isNullOrUndefined(initialValue) ? -1 : initialValue)
    const handleChange = (event, value) => {
        setValue(value)
        handleScoreChange(event, id, value, index)
    }

    const getTickMarks = (maxTick) => {
        const ticks = [{value: -1, label: ''}]
        for (let i = 0; i <= maxTick; i++) {
            ticks.push({value: i, label: i.toString()})
        }
        return ticks;
    }

    const compClasses = type === 'standard' ? useHolisticStandardStyles() : useCompetencyStyles()
    return <Slider
        classes={compClasses}
        id={`slider-${id}-${index}`}
        value={value}
        min={-1}
        max={maxTick}
        step={1}
        aria-labelledby="configuration-slider"
        onChange={handleChange}
        onChangeCommitted={handleBlur}
        marks={getTickMarks(maxTick)}
        valueLabelDisplay={value > -1 ? 'on' : 'off'}
    />
}
