"use client";
import { useSession } from "next-auth/react";
import {
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Theme,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import { useToast } from "@/utils/toast";
import { useRouter } from "next/navigation";
import { sendRequest } from "@/utils/api";

interface IProps {
  playlists: IPlaylist[];
  tracks: ITrackTop[];
}

const AddPlaylistTrack = (props: IProps) => {
  const { data: session } = useSession();
  const { playlists, tracks } = props;
  const [open, setOpen] = useState<boolean>(false);
  // const [isPublic, setIsPublic] = useState<boolean>(true);
  const [playlistId, setPlaylistId] = useState<string>("");
  const [tracksId, setTracksId] = useState<string[]>([]);
  const toast = useToast();
  const route = useRouter();
  const theme = useTheme();

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  // handle close dialog
  const handleClose = (event: any, reason: any) => {
    if (reason === "backdropClick") {
      return;
    }
    setOpen(false);
    setPlaylistId("");
    setTracksId([]);
  };
  //
  function getStyles(name: string, tracksId: readonly string[], theme: Theme) {
    return {
      fontWeight: tracksId.includes(name)
        ? theme.typography.fontWeightMedium
        : theme.typography.fontWeightRegular,
    };
  }
  //
  // xử lí nút lưu
  const handleSubmit = async () => {
    if (!playlistId) {
      toast.error("!Hãy chọn playlist để thêm tracks ");
      return;
    }
    if (!tracksId.length) {
      toast.error("!Hãy chọn tracks  để thêm vào playlist ");
      return;
    }
    const chosenPlaylist = playlists.find((i) => i._id === playlistId);
    let tracks = tracksId?.map((item) => item?.split("###")?.[1]);

    //remove null/undefined/empty
    tracks = tracks?.filter((item) => item);
    if (chosenPlaylist) {
      {
        const res = await sendRequest<IBackendRes<any>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists`,
          method: "PATCH",
          body: {
            id: chosenPlaylist._id,
            title: chosenPlaylist.title,
            isPublic: chosenPlaylist.isPublic,
            tracks: tracks,
          },
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        });
        // console.log("check res add playlist:", res);
        if (res.data) {
          await sendRequest<IBackendRes<any>>({
            url: `/api/revalidate`,
            method: "POST",
            queryParams: {
              tag: "playlist-by-user",
              secret: "justArandomString",
            },
          });
          route.refresh();
          toast.success(res.message);
          handleClose("", "");
        } else {
          toast.error(res.message);
        }
      }
    }
  };

  return (
    <div>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
      >
        TRACKS
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={"sm"}
        fullWidth
        disableEscapeKeyDown // ngăn chặn nút Esc góc trái
      >
        <DialogTitle>Thêm tracks to playlist:</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              marginTop: "20px",
              width: "100%",
            }}
          >
            <FormControl fullWidth>
              <InputLabel>Chọn playlist</InputLabel>
              <Select
                variant="standard"
                value={playlistId}
                label="Chọn playlist"
                onChange={(event) => setPlaylistId(event.target.value)}
              >
                {playlists.map((item) => {
                  {
                    return (
                      <MenuItem key={item._id} value={item._id}>
                        {item.title}
                      </MenuItem>
                    );
                  }
                })}
              </Select>
            </FormControl>
          </Box>
          {/* chose tracks */}
          <Box sx={{ width: "100%", marginTop: "20px" }}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel id="multiple-tracks">Tracks</InputLabel>
              <Select
                labelId="multiple-tracks"
                // id="demo-multiple-chip"
                multiple
                value={tracksId}
                onChange={(event) => setTracksId(event.target.value as any)}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value?.split("###")?.[0]} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {tracks.map((track) => (
                  <MenuItem
                    key={track._id}
                    value={`${track.title}###${track._id}`}
                    style={getStyles(
                      `${track.title}###${track._id}`,
                      tracksId,
                      theme
                    )}
                  >
                    {track.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose("", "")}>Cancel</Button>
          <Button onClick={() => handleSubmit()}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default AddPlaylistTrack;
