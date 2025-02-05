import AppHeader from "@/components/header/app.header";
import MainSlider from "@/components/main/main.slider";
import { Container } from "@mui/material";
import { url } from "inspector";
import { sendRequest } from "@/utils/api";
export default async function HomePage() {
  // const res = await fetch("http://localhost:8000/api/v1/tracks/top", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json", // Xác định dữ liệu gửi đi là JSON
  //   },
  //   body: JSON.stringify({
  //     category: "CHILL",
  //     limit: 20,
  //   }),
  // });
  // console.log("check res server", await res.json());
  const res = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: "http://localhost:8000/api/v1/tracks/top",
    method: "POST",
    body: { category: "CHILL", limit: 2 },
  });
  console.log("check res:", res.data);
  return (
    <div>
      <Container>
        {" "}
        <MainSlider />
        <MainSlider />
      </Container>
    </div>
  );
}
