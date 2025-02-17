"use client";
import { Box, Grid } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { fetchDefaultImage, sendRequest } from "@/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/navigation";
import WaveSurfer from "wavesurfer.js";
import { useHasMounted } from "@/utils/customHook";
import Image from "next/image";
dayjs.extend(relativeTime);

interface IProps {
  track: ITrackTop | null;
  comments: ITrackComment[];
  wavesurfer: WaveSurfer | null;
}
const CommentTrack = (props: IProps) => {
  const hasMounted = useHasMounted();
  const router = useRouter();
  const { data: session } = useSession();
  const [yourComment, setYourComment] = useState<string>("");
  const { track, comments, wavesurfer } = props;
  const handleSubmit = async () => {
    const res = await sendRequest<IBackendRes<ITrackComment>>({
      // thông tin là promise nên phải await
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments`,
      method: "POST",
      body: {
        content: yourComment,
        moment: Math.round(wavesurfer?.getCurrentTime() ?? 0),
        track: track?._id,
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    if (res && res.data) {
      //   console.log("check track comment data create:", res.data);
      router.refresh(); // dùng cái này để bảo server refresh lại
      setYourComment("");
    }
  };
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.round(seconds) % 60;
    const paddedSeconds = `0${secondsRemainder}`.slice(-2);
    return `${minutes}:${paddedSeconds}`;
  };
  const handleJumpTrack = (moment: number) => {
    //
    if (wavesurfer) {
      const duration = wavesurfer.getDuration();
      wavesurfer.seekTo(moment / duration);
      wavesurfer.play();
    }
  };
  return (
    <div style={{ marginTop: "30px" }}>
      {session && session.user && (
        <TextField
          fullWidth
          label="Comments"
          variant="standard"
          value={yourComment}
          onChange={(e) => setYourComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
        />
      )}

      <Box
        sx={{
          marginTop: "30px",
        }}
      >
        <Grid container spacing={2}>
          <Grid item md={2}>
            {/* img avatar comment */}
            {session ? (
              <Image
                src={fetchDefaultImage(session.user.type)}
                alt="avatar comment"
                width={150}
                height={150}
                style={{
                  borderRadius: "50%",
                }}
              />
            ) : (
              <div
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  background: "#ccc",
                }}
              ></div>
            )}

            <p>{track?.uploader.email}</p>
          </Grid>
          {/* right */}
          <Grid item xs={12} md={10}>
            <div className="comment-right">
              {comments.map((comment) => {
                return (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "20px",
                    }}
                    key={comment._id}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: "10px",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        src={fetchDefaultImage(comment.user.type)}
                        alt="avatar comment a user"
                        width={35}
                        height={35}
                        style={{
                          borderRadius: "50%",
                        }}
                      />
                      <div>
                        <div style={{ fontSize: "13px" }}>
                          {comment.user.email} &nbsp;at{" "}
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() => handleJumpTrack(comment.moment)}
                          >
                            {" "}
                            &nbsp; {formatTime(comment.moment)}
                          </span>
                        </div>
                        <div style={{ fontSize: "14px" }}>
                          {comment.content}
                        </div>
                      </div>
                    </Box>
                    <div style={{ fontSize: "12px", color: "#999" }}>
                      {hasMounted && dayjs(comment.createdAt).fromNow()}
                      {/* chỗ này có bug khi chạy trên server có 1 kết quả , khi chạy ở client có 1 kết quả khác => nextjs warning */}
                    </div>
                  </Box>
                );
              })}
            </div>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default CommentTrack;
