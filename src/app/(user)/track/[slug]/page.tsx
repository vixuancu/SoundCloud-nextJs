import WaveTrack from "@/components/track/wave.track";
import { useSearchParams } from "next/navigation";
import Container from "@mui/material/Container";
import { sendRequest } from "@/utils/api";

import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined }; // sau dấu ? trong đường link
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  // const slug = (await params).slug

  // fetch data
  const res = await sendRequest<IBackendRes<ITrackTop>>({
    url: `http://localhost:8000/api/v1/tracks/${params.slug}`,
    method: "GET",
  });

  return {
    title: res.data?.title,
    description: res.data?.description,
  };
}

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
