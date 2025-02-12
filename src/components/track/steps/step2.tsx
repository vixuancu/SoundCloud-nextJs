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
import axios from "axios";
import { useSession } from "next-auth/react";
import { sendRequest } from "@/utils/api";

interface IProps {
  trackUpload: {
    fileName: string;
    percent: number;
    uploadedTrackName: string;
  };
}
interface INewTrack {
  title: string;
  description: string;
  trackUrl: string;
  imgUrl: string;
  category: string;
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

function InputFileUpload(props: any) {
  const { setInfo, info } = props;
  const { data: session } = useSession();
  const handleUpload = async (image: any) => {
    const formData = new FormData();
    formData.append("fileUpload", image); // key ở backend sẽ dùng vì thế cần check api ,key là fileUpload
    // console.log("check file:", image);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/files/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            target_type: "images",
          },
        }
      );
      setInfo({
        ...info,
        imgUrl: res.data.data.fileName,
      });

      console.log("check data:", res.data.data.fileName);
    } catch (error) {
      //@ts-ignore

      alert(error?.response?.data.message);
    }
  };

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
        onChange={(event) => {
          // console.log(event.target.files);
          const file = event.target.files?.[0]; // Lấy file đầu tiên
          if (file) {
            handleUpload(file);
          }
        }}
        // multiple  khong lấy nhiều file 1 lúc
      />
    </Button>
  );
}

const Step2 = (props: IProps) => {
  const { data: session } = useSession();
  const [info, setInfo] = React.useState<INewTrack>({
    title: "",
    description: "",
    trackUrl: "",
    imgUrl: "",
    category: "",
  });
  const { trackUpload } = props;
  React.useEffect(() => {
    if (trackUpload && trackUpload.uploadedTrackName) {
      // console.log("track uploaded Name:", trackUpload);
      setInfo({
        ...info,
        trackUrl: trackUpload.uploadedTrackName,
      });
    }
  }, [trackUpload]);
  // console.log("check trackUpload:", trackUpload);
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
  console.log("check onchange:", info);
  const handleSubmitForm = async () => {
    // console.log("submt info:", info);
    const res = await sendRequest<IBackendRes<ITrackTop[]>>({
      // thông tin là promise nên phải await
      url: "http://localhost:8000/api/v1/tracks",
      method: "POST",
      body: {
        title: info.title,
        description: info.description,
        trackUrl: info.trackUrl,
        imgUrl: info.imgUrl,
        category: info.category,
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    if (res.data) {
      alert("create success a new track");
    } else {
      alert(res.message);
    }
  };
  return (
    <>
      <div> {trackUpload.uploadedTrackName}</div>
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
          {/* img  */}
          <div
            style={{
              border: "1px solid #ccc",
              width: "250px",
              height: "250px",
            }}
          >
            <div>
              {info.imgUrl && (
                <img
                  height={250}
                  width={250}
                  style={{ objectFit: "cover" }}
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${info.imgUrl}`}
                  alt=""
                />
              )}
            </div>
          </div>
          <InputFileUpload setInfo={setInfo} info={info} />
        </Grid>
        <Grid item xs={6} md={8}>
          <TextField
            value={info?.title}
            onChange={(e) =>
              setInfo({
                ...info,
                title: e.target.value,
              })
            }
            fullWidth
            label="Title"
            variant="standard"
            margin="dense"
          />
          <TextField
            value={info?.description}
            onChange={(e) =>
              setInfo({
                ...info,
                description: e.target.value,
              })
            }
            fullWidth
            label="Description"
            variant="standard"
            margin="dense"
          />
          <TextField
            sx={{ mt: 3 }}
            select
            fullWidth
            label="Category"
            variant="standard"
            value={info?.category}
            onChange={(e) =>
              setInfo({
                ...info,
                category: e.target.value,
              })
            }
          >
            {Category.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="outlined"
            sx={{ mt: 5 }}
            onClick={() => handleSubmitForm()}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </>
  );
};
export default Step2;
