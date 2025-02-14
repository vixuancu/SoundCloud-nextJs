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
    nextOption: {
      cache: "no-store", // không caching cần xem thêm
    },
  });
  console.log("check track server:", res.data);
  const resComment = await sendRequest<IBackendRes<ITrackComment>>({
    url: `http://localhost:8000/api/v1/tracks/comments`, // dùng queryParams không cần truyền dấu ? trong đường link
    method: "POST",
    queryParams: {
      current: 1,
      pageSize: 100,
      trackId: params.slug,
      sort: "-createdAt",
    },
  });

  return (
    <Container>
      <div>
        <WaveTrack
          track={res?.data ?? null}
          //@ts-ignore
          comments={resComment?.data.result ?? []}
        />
      </div>
    </Container>
  );
};
export default DetailTrackPage;
