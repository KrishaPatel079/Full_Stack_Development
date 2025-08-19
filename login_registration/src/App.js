import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Tab,
  Tabs,
  TextField,
  Typography,
  Paper,
  Stack
} from "@mui/material";
import { Google, GitHub } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function App() {
  const [tab, setTab] = useState(0);

  const loginSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const registerSchema = Yup.object({
    name: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const loginFormik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      alert(`Login Successful!\n${JSON.stringify(values, null, 2)}`);
    },
  });

  const registerFormik = useFormik({
    initialValues: { name: "", email: "", password: "", confirmPassword: "" },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      alert(`Registration Successful!\n${JSON.stringify(values, null, 2)}`);
    },
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0ebb9bff, #3e85ffff)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="sm" sx={{ display: "flex", justifyContent: "center" }}>
        <Paper elevation={6} sx={{ mt: 8, p: 4, borderRadius: 4 }}>
          <Typography
            variant="h4"
            align="center"
            sx={{ color: "#133673ff" }}
            gutterBottom
          >
            {tab === 0 ? "Login" : "Register"}
          </Typography>

          <Tabs
            value={tab}
            onChange={(e, val) => setTab(val)}
            textColor="primary"
            indicatorColor="primary"
            centered
            sx={{ mb: 2 }}
          >
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>

          {tab === 0 && (
            <>
              <form onSubmit={loginFormik.handleSubmit}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={loginFormik.values.email}
                  onChange={loginFormik.handleChange}
                  onBlur={loginFormik.handleBlur}
                  error={
                    loginFormik.touched.email &&
                    Boolean(loginFormik.errors.email)
                  }
                  helperText={
                    loginFormik.touched.email && loginFormik.errors.email
                  }
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  name="password"
                  value={loginFormik.values.password}
                  onChange={loginFormik.handleChange}
                  onBlur={loginFormik.handleBlur}
                  error={
                    loginFormik.touched.password &&
                    Boolean(loginFormik.errors.password)
                  }
                  helperText={
                    loginFormik.touched.password &&
                    loginFormik.errors.password
                  }
                  margin="normal"
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 3,
                    py: 1.5,
                    fontWeight: "bold",
                    background:
                      "linear-gradient(90deg, #0ebb9bff, #3e85ffff)",
                  }}
                >
                  Login
                </Button>
              </form>

              {/* Social Login Buttons */}
              <Stack spacing={2} sx={{ mt: 3 }}>
                <Button
                  variant="outlined"
                  startIcon={<Google />}
                  fullWidth
                  sx={{
                    borderColor: "#4285F4",
                    color: "#4285F4",
                    "&:hover": { backgroundColor: "#e8f0fe" },
                  }}
                  onClick={() => alert("Google Sign-In Clicked")}
                >
                  Sign in with Google
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<GitHub />}
                  fullWidth
                  sx={{
                    borderColor: "#000",
                    color: "#000",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                  onClick={() => alert("GitHub Sign-In Clicked")}
                >
                  Sign in with GitHub
                </Button>
              </Stack>
            </>
          )}

          {tab === 1 && (
            <form onSubmit={registerFormik.handleSubmit}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={registerFormik.values.name}
                onChange={registerFormik.handleChange}
                onBlur={registerFormik.handleBlur}
                error={
                  registerFormik.touched.name &&
                  Boolean(registerFormik.errors.name)
                }
                helperText={
                  registerFormik.touched.name && registerFormik.errors.name
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={registerFormik.values.email}
                onChange={registerFormik.handleChange}
                onBlur={registerFormik.handleBlur}
                error={
                  registerFormik.touched.email &&
                  Boolean(registerFormik.errors.email)
                }
                helperText={
                  registerFormik.touched.email && registerFormik.errors.email
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                name="password"
                value={registerFormik.values.password}
                onChange={registerFormik.handleChange}
                onBlur={registerFormik.handleBlur}
                error={
                  registerFormik.touched.password &&
                  Boolean(registerFormik.errors.password)
                }
                helperText={
                  registerFormik.touched.password &&
                  registerFormik.errors.password
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={registerFormik.values.confirmPassword}
                onChange={registerFormik.handleChange}
                onBlur={registerFormik.handleBlur}
                error={
                  registerFormik.touched.confirmPassword &&
                  Boolean(registerFormik.errors.confirmPassword)
                }
                helperText={
                  registerFormik.touched.confirmPassword &&
                  registerFormik.errors.confirmPassword
                }
                margin="normal"
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 3,
                  py: 1.5,
                  fontWeight: "bold",
                  background:
                    "linear-gradient(90deg, #0ebb9bff, #3e85ffff)",
                }}
              >
                Register
              </Button>
            </form>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
