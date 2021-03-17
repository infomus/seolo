import React, {useContext} from 'react';
import { Route, Redirect } from 'react-router-dom'
import { FirebaseContext } from '../context/firebase';
import firebase from '../firebase.prod'



export function IsuserRedirect({ user, loggedInPath, children, ...rest }) {
    return (
        <Route
        {...rest}
        render = {() => {
            if(!user) {
                return children;
            }

            if (user) {
                return (
                    <Redirect
                    to = {{
                        pathname:loggedInPath
                    }}
                    />
                );
            }

        return null;
    }}

    />
    )
}

// We pass in a user and we pass in the loggedInPath.
// We basically say, if the user is logged then redirect them to the loggedInpath


export function ProtectedRoutes({user, children, ...rest}) {
    return(
        <Route 
            {...rest}
            render = {({ location }) => {
                if(user) {
                    return children;
                }

                if(!user) {
                    return(
                        <Redirect
                        to = {{
                            pathname:'login',
                            state: {from: location }
                        }}
                        />
                    );
                }
                return null;
            }}
        />
    )
}

