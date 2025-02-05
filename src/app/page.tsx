import AppHeader from "@/components/header/app.header";
import MainSlider from "@/components/main/main.slider";
import { Container } from "@mui/material";
import { url } from "inspector";
import { sendRequest } from "@/utils/api";
export default async function HomePage() {
  const chills = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: "http://localhost:8000/api/v1/tracks/top",
    method: "POST",
    body: { category: "CHILL", limit: 10 },
  });
  const workouts = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: "http://localhost:8000/api/v1/tracks/top",
    method: "POST",
    body: { category: "WORKOUT", limit: 10 },
  });
  const party = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: "http://localhost:8000/api/v1/tracks/top",
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
