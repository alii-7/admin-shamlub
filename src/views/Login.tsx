import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { auth } from "firebase";

export const Login: React.FC = () => {
  let history = useHistory();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<"" | null>(null);

  const login = (e: any) => {
    e.preventDefault();
    auth()
      .signInWithEmailAndPassword(email, password)
      .then((user: any) => {
        setError(null);
        localStorage.setItem(
          "tab",
          JSON.stringify({ key: "0", value: "ShamLub" })
        );
        history.push("/dashboard");
      })
      .catch(function(error) {
        setError(error.message);
      });
  };
  return (
    <Container>
      <Box
        height="80vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <form onSubmit={login}>
          <Grid
            container
            direction="column"
            spacing={5}
            justify="center"
            alignItems="center"
          >
            <Grid item>
              <TextField
                id="email"
                label="email"
                variant="outlined"
                onChange={(e: any) => {
                  setEmail(e.target.value);
                }}
              />
            </Grid>
            <Grid item>
              <TextField
                id="password"
                label="password"
                variant="outlined"
                type="password"
                onChange={(e: any) => {
                  setPassword(e.target.value);
                }}
              />
            </Grid>
            <FormHelperText error={error === null ? false : true}>
              {error}
            </FormHelperText>
            <Grid item>
              <Button type="submit">Login</Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};
