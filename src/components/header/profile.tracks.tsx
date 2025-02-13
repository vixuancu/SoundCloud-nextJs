"use client";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { useTrackContext } from "@/lib/track.context.wrapper";
import PauseIcon from "@mui/icons-material/Pause";
interface IProps {
  data: ITrackTop;
}
const ProfileTracks = (props: IProps) => {
  const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;
  const { data } = props;
  const theme = useTheme();
  return (
    <>
      <Card sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography component="div" variant="h5">
              {data.title}
            </Typography>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ color: "text.secondary" }}
            >
              {data.description}
            </Typography>
          </CardContent>
          <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
            <IconButton aria-label="previous">
              {theme.direction === "rtl" ? (
                <SkipNextIcon />
              ) : (
                <SkipPreviousIcon />
              )}
            </IconButton>
            {/* play */}
            {(data._id !== currentTrack._id ||
              (data._id === currentTrack._id &&
                currentTrack.isPlaying === false)) && (
              <IconButton
                aria-label="play/pause"
                onClick={() => setCurrentTrack({ ...data, isPlaying: true })}
              >
                <PlayArrowIcon sx={{ height: 38, width: 38 }} />
              </IconButton>
            )}
            {data._id === currentTrack._id &&
              currentTrack.isPlaying === true && (
                <IconButton
                  aria-label="play/pause"
                  onClick={() => setCurrentTrack({ ...data, isPlaying: false })}
                >
                  <PauseIcon sx={{ height: 38, width: 38 }} />
                </IconButton>
              )}

            {/*  */}
            <IconButton aria-label="next">
              {theme.direction === "rtl" ? (
                <SkipPreviousIcon />
              ) : (
                <SkipNextIcon />
              )}
            </IconButton>
          </Box>
        </Box>

        <CardMedia
          component="img"
          sx={{
            width: 151,
            height: 154,
            objectFit: "cover",
            display: "block",
          }}
          image={`http://localhost:8000/images/${data.imgUrl}`}
          //   alt="Live from space album cover"
        />
      </Card>
    </>
  );
};
export default ProfileTracks;
