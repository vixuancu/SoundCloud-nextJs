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
  return (
    <AppBar
      position="fixed"
      color="primary"
      sx={{ top: "auto", bottom: 0, background: "#f2f2f2" }}
    >
      <Container sx={{ display: "flex", gap: "10px" }}>
        {" "}
        <AudioPlayer
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3"
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
  );
};
export default AppFooter;
