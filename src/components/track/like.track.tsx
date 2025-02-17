"use client";
import { Box } from "@mui/material";
import Chip from "@mui/material/Chip";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { sendRequest } from "@/utils/api";
interface IProps {
  track: ITrackTop | null;
}
const LikeTrack = (props: IProps) => {
  const { data: session } = useSession(); // thực thực like cần biết session

  const { track } = props;
  const roter = useRouter();
  const [trackLikes, setTrackLikes] = useState<ITrackLike[] | null>(null);

  const fetchData = async () => {
    if (session?.access_token) {
      const res = await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`, // dùng queryParams không cần truyền dấu ? trong đường link
        method: "GET",
        queryParams: {
          current: 1,
          pageSize: 100,
          sort: "-createdAt",
        },
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (res?.data?.result) {
        setTrackLikes(res?.data?.result);
      }
    }
  };
  useEffect(() => {
    fetchData();
  }, [session]);
  const handleLikeTrack = async () => {
    await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`, // dùng queryParams không cần truyền dấu ? trong đường link
      method: "POST",
      body: {
        track: track?._id,
        quantity: trackLikes?.some((t) => t._id === track?._id) ? -1 : 1,
      },
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    fetchData();
    await sendRequest<IBackendRes<any>>({
      url: `/api/revalidate`,
      method: "POST",
      queryParams: {
        tag: "track-by-id",
        secret: "justArandomString",
      },
    });
    roter.refresh();
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Chip
          label="LiKe"
          onClick={() => handleLikeTrack()}
          clickable
          variant="outlined"
          color={
            trackLikes?.some((t) => t._id === track?._id) ? "error" : "default"
          }
          size="medium"
          icon={<FavoriteIcon />}
          sx={{ borderRadius: "5px" }}
        />

        <div style={{ display: "flex", gap: "20px", color: "#999" }}>
          <span style={{ display: "flex", alignItems: "center" }}>
            <PlayArrowIcon sx={{ fontSize: "24px" }} /> {track?.countPlay}
          </span>
          <span style={{ display: "flex", alignItems: "center" }}>
            <FavoriteIcon sx={{ fontSize: "20px" }} /> {track?.countLike}
          </span>
        </div>
      </Box>
    </>
  );
};
export default LikeTrack;
