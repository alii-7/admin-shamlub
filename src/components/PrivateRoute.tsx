import React, { useEffect, useState } from "react";
import { Route, Link } from "react-router-dom";
import firebase from "firebase";

export const PrivateRoute = ({
  component: Component,
  path,
  ...rest
}: {
  path: string;
  component: any;
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribeFromAuth = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        setIsAuthenticated(true);
      } else {
        // No user is signed in.
        console.log("unauthenticated");
        setIsAuthenticated(false);
      }
    });
    return () => {
      unsubscribeFromAuth();
    };
  }, []);

  const render = (props: any) =>
    isAuthenticated === true ? (
      <Component {...props} />
    ) : (
      <div>
        You need to <Link to="/">Login</Link>
      </div>
    );

  return <Route path={path} render={render} {...rest} />;
};
