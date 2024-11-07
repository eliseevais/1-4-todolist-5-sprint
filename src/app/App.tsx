import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { ErrorSnackbar } from "components/ErrorSnackbar/ErrorSnackbar";
import { TodolistsList } from "features/TodolistsList";
import { authActions, authSelectors, Login } from "features/Auth";
import { AppBar, Box, Button, CircularProgress, Container, LinearProgress, Toolbar, Typography } from "@mui/material";
import { appActions, appSelectors } from "features/Application";
import { useActions } from "utils/redux-utils";

type PropsType = {};

function App(props: PropsType) {
  const status = useSelector(appSelectors.selectStatus);
  const isInitialized = useSelector(appSelectors.selectIsInitialized);
  const isLoggedIn = useSelector(authSelectors.selectIsLoggedIn);

  const dispatch = useDispatch<any>();
  const { logout } = useActions(authActions);
  const { initializeApp } = useActions(appActions);

  useEffect(() => {
    if (!isInitialized) {
      initializeApp();
    }
  }, []);

  const logoutHandler = useCallback(() => {
    logout();
  }, []);

  if (!isInitialized) {
    return (
      <div style={{ position: "fixed", top: "30%", textAlign: "center", width: "100%" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="App">
        <ErrorSnackbar />
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" color={"transparent"}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Tasks tracker
              </Typography>
              {isLoggedIn && (
                <Button color="inherit" onClick={logoutHandler}>
                  Log out
                </Button>
              )}
            </Toolbar>
            {status === "loading" && <LinearProgress />}
          </AppBar>
        </Box>

        <Container fixed style={{ margin: "0px auto", width: "100%" }}>
          <Routes>
            <Route path={"/"} element={<TodolistsList demo={false} />} />
            <Route path={"/login"} element={<Login />} />
          </Routes>
        </Container>
      </div>
    </BrowserRouter>
  );
}

export default App;
