import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendRequest } from "@/utils/api";
import { Container, Grid } from "@mui/material";
import ProfileTracks from "@/components/header/profile.tracks";
const ProfilePage = async ({ params }: { params: { slug: string } }) => {
  const session = await getServerSession(authOptions);

  const tracks = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/users?current=1&pageSize=10`,
    method: "POST",
    body: { id: params.slug },
    headers: { Authorization: `Bearer ${session?.access_token}` },
    nextOption: {
      next: {
        tags: ["track-by-profile"],
      },
    },
  });
  const data = tracks?.data?.result ?? []; // bỏ [] ở vế sau thì data có thể bị undefined

  return (
    <>
      <Container sx={{ my: 5 }}>
        <Grid container spacing={5}>
          {data.map((item: ITrackTop, index: number) => {
            return (
              <Grid item xs={12} md={6} key={index}>
                <ProfileTracks data={item} />
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </>
  );
};
export default ProfilePage;
