import React from "react";
import { FormikHelpers, useFormik } from "formik";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, TextField } from "@mui/material";
import { authActions, authSelectors } from "features/Auth/index";

type FormValuesType = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export const Login = () => {
  const dispatch = useAppDispatch();

  const isLoggedIn = useSelector(authSelectors.selectIsLoggedIn);

  const formik = useFormik({
    validate: (values) => {
      if (!values.email) {
        return {
          email: "Email is required",
        };
      }
      if (!values.password) {
        return {
          password: "Password is required",
        };
      }
    },
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    onSubmit: async (values: FormValuesType, formikHelpers: FormikHelpers<FormValuesType>) => {
      const action = await dispatch(authActions.login(values));

      if (authActions.login.rejected.match(action)) {
        if (action.payload?.fieldsErrors?.length) {
          const error = action.payload?.fieldsErrors[0];
          formikHelpers.setFieldError(error.field, error.error);
        }
      }
    },
  });

  if (isLoggedIn) {
    return <Navigate to={"/"} />;
  }

  return (
    <Grid container justifyContent="center">
      <Grid item xs={4}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <FormLabel>
              <p>
                To log in get registered{" "}
                <a href={"https://social-network.samuraijs.com/"} target={"_blank"}>
                  here
                </a>
              </p>
              <p>or use common test account credentials:</p>
              <p> Email: free@samuraijs.com</p>
              <p>Password: free</p>
            </FormLabel>
            <FormGroup>
              <TextField label="Email" margin="normal" {...formik.getFieldProps("email")} />
              {formik.errors.email ? <div>{formik.errors.email}</div> : null}

              <TextField type="password" label="Password" margin="normal" {...formik.getFieldProps("password")} />
              {formik.errors.password ? <div>{formik.errors.password}</div> : null}

              <FormControlLabel
                label={"Remember me"}
                control={<Checkbox {...formik.getFieldProps("rememberMe")} checked={formik.values.rememberMe} />}
              />
              <Button type={"submit"} variant={"contained"} color={"primary"}>
                Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  );
};
