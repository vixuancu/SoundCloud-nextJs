import * as React from "react";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Grid, MenuItem } from "@mui/material";
import TextField from "@mui/material/TextField";
interface IProps {
  trackUpload: {
    fileName: string;
    percent: number;
  };
}
// Progress
function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary" }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

function LinearWithValueLabel(props: IProps) {
  const { trackUpload } = props;

  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgressWithLabel value={trackUpload.percent} />
    </Box>
  );
}
///button upload
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function InputFileUpload() {
  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      Upload files
      <VisuallyHiddenInput
        type="file"
        onChange={(event) => console.log(event.target.files)}
        // multiple  khong lấy nhiều file 1 lúc
      />
    </Button>
  );
}

const Step2 = (props: IProps) => {
  const { trackUpload } = props;
  console.log("check trackUpload:", trackUpload);
  const Category = [
    {
      value: "CHILL",
      label: "CHILL",
    },
    {
      value: "WORKOUT",
      label: "WORKOUT",
    },
    {
      value: "PARTY",
      label: "PARTY",
    },
  ];
  return (
    <>
      <div>Uploading {trackUpload.fileName}</div>
      <LinearWithValueLabel trackUpload={trackUpload} />
      <Grid container spacing={2} mt={5}>
        <Grid
          item
          xs={6}
          md={4}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div
            style={{
              border: "1px solid #ccc",
              width: "250px",
              height: "250px",
            }}
          >
            left
          </div>
          <InputFileUpload />
        </Grid>
        <Grid item xs={6} md={8}>
          <TextField
            fullWidth
            label="Title"
            id="fullWidth"
            variant="standard"
            margin="dense"
          />
          <TextField
            fullWidth
            label="Description"
            id="fullWidth"
            variant="standard"
            margin="dense"
          />
          <TextField
            sx={{ mt: 3 }}
            id="standard-select-currency"
            select
            fullWidth
            label="Category"
            variant="standard"
          >
            {Category.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="outlined" sx={{ mt: 5 }}>
            Save
          </Button>
        </Grid>
      </Grid>
    </>
  );
};
export default Step2;
