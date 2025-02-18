import { Box, Container, Divider, Typography } from "@mui/material";
import NewPlaylist from "./components/new.playlist";
import AddPlaylistTrack from "./components/add.playlisttrack";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendRequest } from "@/utils/api";
import CurrentTrack from "./components/current.track";
import { Fragment } from "react";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Playlist bạn đã tạo",
  description: "miêu tả thôi mà",
};
const PlaylistPage = async () => {
  const session = await getServerSession(authOptions);
  const res = await sendRequest<IBackendRes<IModelPaginate<IPlaylist>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/by-user`,
    method: "POST",
    queryParams: { current: 1, pageSize: 100 },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: ["playlist-by-user"] },
    },
  });
  const res1 = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks`,
    method: "GET",
    queryParams: { current: 1, pageSize: 100 },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
  });

  const playlists = res?.data?.result ?? [];
  const tracks = res1?.data?.result ?? [];
  return (
    <>
      <Container
        sx={{ mt: 3, p: 3, background: "#e3e8f2", borderRadius: "3px" }}
      >
        {/* top */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h3>Danh sách phát</h3>
          <div style={{ display: "flex", gap: "20px" }}>
            <NewPlaylist />
            <AddPlaylistTrack playlists={playlists} tracks={tracks} />
          </div>
        </Box>
        <Divider variant="middle" />
        {/* content */}
        <Box sx={{ mt: 3 }}>
          {playlists.map((playlist) => {
            return (
              <>
                <Accordion key={playlist._id}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    // aria-controls="panel1-content"
                  >
                    <Typography sx={{ color: "#ccc", fontSize: "20px" }}>
                      {" "}
                      {playlist.title}{" "}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {playlist?.tracks?.map((track, index: number) => {
                      return (
                        <Fragment key={track._id}>
                          {index === 0 && <Divider />}
                          <CurrentTrack track={track} />
                          <Divider />
                        </Fragment>
                      );
                    })}
                    {playlist?.tracks?.length === 0 && <span>No data.</span>}
                  </AccordionDetails>
                </Accordion>
              </>
            );
          })}
        </Box>
      </Container>
    </>
  );
};
export default PlaylistPage;
