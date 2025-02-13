"use client";
import { useHasMounted } from "@/utils/customHook";
import AppBar from "@mui/material/AppBar";
import { Container } from "@mui/material";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { start } from "repl";
const AppFooter = () => {
  const hasMounted = useHasMounted(); // #98
  if (!hasMounted) return <></>;
  console.log("check Backend", process.env.NEXT_PUBLIC_BACKEND_URL);
  return (
    <div style={{ marginTop: 50 }}>
      <AppBar
        position="fixed"
        color="primary"
        sx={{
          top: "auto",
          bottom: 0,
          background: "#f2f2f2",
        }}
      >
        <Container
          sx={{
            display: "flex",
            gap: "10px",
            ".rhap_main": {
              gap: "30px",
            },
          }}
        >
          {" "}
          <AudioPlayer
            layout="horizontal-reverse"
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/hoidanit.mp3`}
            volume={0.5}
            style={{ boxShadow: "unset", background: "#f2f2f2" }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              justifyContent: "center",
              minWidth: 100,
            }}
          >
            <div style={{ color: "#ccc" }}>DucPhuc</div>
            <div style={{ color: "black" }}>Who am i ?</div>
          </div>
        </Container>
      </AppBar>
    </div>
  );
};
export default AppFooter;
