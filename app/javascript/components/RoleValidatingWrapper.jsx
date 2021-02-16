import React, {useContext} from "react";
import {RootAuthContext} from "../context/AuthenticationWrapper";
import {Typography} from "@material-ui/core";

export default function RoleValidatingWrapper(props) {
    const { currentUser } = useContext(RootAuthContext);

    if (!currentUser.hasAnyRole(props.allowedRoles)) {
        return (<Typography variant={'h5'}>You are not authorized to view this page.</Typography>)
    }
    return (<>{props.children}</>)
}
