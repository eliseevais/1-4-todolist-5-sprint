import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Menu } from "@mui/icons-material";
import "./App.css";
import { ErrorSnackbar } from "components/ErrorSnackbar/ErrorSnackbar";
import { TodolistsList } from "features/TodolistsList";
import { authActions, authSelectors, Login } from "features/Auth";
import {
  AppBar,
  Button,
  CircularProgress,
  Container,
  IconButton,
  LinearProgress,
  Toolbar,
  Typography,
} from "@mui/material";
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
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <Menu />
            </IconButton>
            <Typography variant="h6">Menu</Typography>
            {isLoggedIn && (
              <Button color="inherit" onClick={logoutHandler}>
                Log out
              </Button>
            )}
          </Toolbar>
          {status === "loading" && <LinearProgress />}
        </AppBar>
        <Container fixed>
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
