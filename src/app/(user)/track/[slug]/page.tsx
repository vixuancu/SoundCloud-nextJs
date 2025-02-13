import WaveTrack from "@/components/track/wave.track";
import { useSearchParams } from "next/navigation";
import Container from "@mui/material/Container";
import { sendRequest } from "@/utils/api";
// params được truyền vào chính là props
const DetailTrackPage = async ({ params }: { params: { slug: string } }) => {
  //fetchData tại server
  const res = await sendRequest<IBackendRes<ITrackTop>>({
    url: `http://localhost:8000/api/v1/tracks/${params.slug}`,
    method: "GET",
  });

  return (
    <Container>
      <div>
        <WaveTrack track={res?.data ?? null} />
      </div>
    </Container>
  );
};
export default DetailTrackPage;
