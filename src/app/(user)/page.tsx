import AppHeader from "@/components/header/app.header";
import MainSlider from "@/components/main/main.slider";
import { Container } from "@mui/material";
import { url } from "inspector";
import { sendRequest } from "@/utils/api";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
export default async function HomePage() {
  // get session
  const session = await getServerSession(authOptions);
  console.log("check session server:", session);
  const chills = await sendRequest<IBackendRes<ITrackTop[]>>({
    // thông tin là promise nên phải await
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: { category: "CHILL", limit: 10 },
  });
  const workouts = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: { category: "WORKOUT", limit: 10 },
  });
  const party = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: { category: "PARTY", limit: 10 },
  });
  // console.log("check res:", res.data);
  return (
    <div>
      <Container>
        {" "}
        <MainSlider
          title="TOP CHILL"
          data={chills?.data ?? []} // nếu  chills?.data undefind thì trả ra mảng rỗng
        />
        <MainSlider title="TOP WORKOUT" data={workouts?.data ?? []} />
        <MainSlider title="TOP PARTY" data={party?.data ?? []} />
      </Container>
    </div>
  );
}
