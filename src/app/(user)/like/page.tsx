import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { convertSlugUrl, sendRequest } from "@/utils/api";
import { Box, Container, Divider } from "@mui/material";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "bài nhạc ưu thích",
  description: "những bài nhạc bạn đã nhấn like",
};

const LikePage = async () => {
  const session = await getServerSession(authOptions);

  const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
    method: "GET",
    queryParams: { current: 1, pageSize: 100 },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: ["liked-by-user"] },
    },
  });
  // console.log("check liked:", res.data?.result);
  const likes = res.data?.result ?? [];

  return (
    <Container>
      <div>
        <h3>Hear the tracks you've liked:</h3>
      </div>
      <Divider />
      <Box sx={{ mt: 3, display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {likes?.map((track) => {
          return (
            <Box key={track._id}>
              <Image
                style={{ borderRadius: "3px" }}
                alt="avatar track"
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track?.imgUrl}`}
                height={200}
                width={200}
              />
              <Link
                style={{ textDecoration: "none", color: "unset" }}
                href={`/track/${convertSlugUrl(track.title)}-${
                  track._id
                }.html?audio=${track.trackUrl}`}
              >
                <span
                  style={{
                    width: "200px",
                    display: "block",
                    color: "black",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {track.title}
                </span>
              </Link>
            </Box>
          );
        })}
      </Box>
    </Container>
  );
};
export default LikePage;
