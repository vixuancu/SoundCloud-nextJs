"use client";
import { useSession } from "next-auth/react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Switch,
  TextField,
} from "@mui/material";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import { useToast } from "@/utils/toast";
import { useRouter } from "next/navigation";
import { sendRequest } from "@/utils/api";
const NewPlaylist = (props: any) => {
  const { data: session } = useSession();
  const [open, setOpen] = useState<boolean>(false);
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [title, setTitle] = useState<string>("");
  const toast = useToast();
  const route = useRouter();
  // handle close dialog
  const handleClose = (reason: any) => {
    if (reason === "backdropClick") {
      return;
    }
    setOpen(false);
  };

  // xử lí nút lưu
  const handleSubmit = async () => {
    if (!title) {
      toast.error("Tiêu đề không được để trống!");
      return;
    }
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/empty`,
      method: "POST",
      body: { title, isPublic },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    if (res.data) {
      toast.success("Tạo mới playlist thành công!");
      setIsPublic(true);
      setTitle("");
      setOpen(false);
      await sendRequest<IBackendRes<any>>({
        url: `/api/revalidate`,
        method: "POST",
        queryParams: {
          tag: "playlist-by-user",
          secret: "justArandomString",
        },
      });
      route.refresh();
    } else {
      toast.error(res.message);
    }
    // setOpen(false);
  };

  return (
    <div>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
      >
        PLAYLIST
      </Button>
      <Dialog
        open={open}
        onClose={(event, reason) => handleClose(reason)}
        maxWidth={"sm"}
        fullWidth
        disableEscapeKeyDown // ngăn chặn nút Esc góc trái
      >
        <DialogTitle>Thêm mới playlist:</DialogTitle>
        <DialogContent>
          <Box>
            <TextField
              label="Tiêu đề"
              variant="standard"
              fullWidth
              onChange={(event) => setTitle(event.target.value)}
            />
            <FormGroup sx={{ mt: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isPublic}
                    onChange={(event) => setIsPublic(event.target.checked)}
                  />
                }
                label={isPublic ? "Public" : "Private"}
              />
            </FormGroup>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => handleSubmit()}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default NewPlaylist;
