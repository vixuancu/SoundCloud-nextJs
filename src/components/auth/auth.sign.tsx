"use client";

import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import { getProviders, signIn } from "next-auth/react";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";

const AuthSignIn = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [username, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isErrorUserName, setIsErrorUserName] = useState<boolean>(false);
  const [isErrorPassword, setIsErrorPassword] = useState<boolean>(false);

  const [errorUserName, setErrorUserName] = useState<string>("");
  const [errorPassword, setErrorPassword] = useState<string>("");

  const router = useRouter();
  const handleSubmit = async () => {
    setIsErrorUserName(false);
    setIsErrorPassword(false);
    setErrorUserName("");
    setErrorPassword("");
    if (!username) {
      setIsErrorUserName(true);
      setErrorUserName("Username đang trống");
      return;
    }
    if (!password) {
      setIsErrorPassword(true);
      setErrorPassword("Password đang trống");
      return;
    }
    console.log(">>> check username: ", username, " pass: ", password);
    const res = await signIn("credentials", {
      username: username,
      password: password,
      redirect: false,
    });
    console.log("check res:", res);
    if (!res?.error) {
      // redirect("/");// sử dụng ở client bị lỗi search next Link dùng useRouter Hook
      router.push("/");
    } else {
      alert(res?.error);
    }
  };
  return (
    <>
      <Box
        sx={{
          backgroundImage:
            "linear-gradient(to bottom, #ff9aef, #fedac1, #d5e1cf, #b7e6d9)",
          backgroundColor: "#b7e6d9",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Grid
          container
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          {" "}
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            lg={4}
            sx={{
              boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
            }}
          >
            <div style={{ margin: "20px" }}>
              <Link href={"/"}>
                <ArrowBackIcon />
              </Link>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <Avatar>
                  <LockIcon />
                </Avatar>
                <Typography component="h1">Sign in</Typography>
              </Box>
              <TextField
                onChange={(event) => setUserName(event.target.value)}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Username"
                name="username"
                autoFocus
                error={isErrorUserName}
                helperText={errorUserName}
              />
              <TextField
                onChange={(event) => setPassword(event.target.value)}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                error={isErrorPassword}
                helperText={errorPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword === false ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                sx={{
                  my: 3,
                }}
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Sign In
              </Button>
              <Divider>Or using</Divider>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "25px",
                  mt: 3,
                }}
              >
                <Avatar
                  sx={{
                    cursor: "pointer",
                    bgcolor: "orange",
                  }}
                  onClick={() => {
                    signIn("github");
                  }}
                >
                  <GitHubIcon titleAccess="Login with Github" />
                </Avatar>
                <Avatar
                  sx={{
                    cursor: "pointer",
                    bgcolor: "orange",
                  }}
                >
                  <GoogleIcon titleAccess="Login with Google" />
                </Avatar>
              </Box>
            </div>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
export default AuthSignIn;
