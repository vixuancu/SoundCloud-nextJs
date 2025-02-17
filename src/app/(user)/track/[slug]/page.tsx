import WaveTrack from "@/components/track/wave.track";
import { useSearchParams } from "next/navigation";
import Container from "@mui/material/Container";
import { sendRequest } from "@/utils/api";
import slugify from "slugify";
import { convertSlugUrl } from "@/utils/api";
import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined }; // sau dấu ? trong đường link
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const idSlug = params.slug.split("-")?.pop()?.split(".html")[0] ?? "";
  // read route params
  // const slug = (await params).slug

  // fetch data
  const res = await sendRequest<IBackendRes<ITrackTop>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${idSlug}`,
    method: "GET",
  });

  return {
    title: res.data?.title,
    description: res.data?.description,
    openGraph: {
      title: "Hỏi Dân IT",
      description: "Beyond Your Coding Skills",
      type: "website",
      images: [
        `https://raw.githubusercontent.com/hoidanit/images-hosting/master/eric.png`,
      ],
    },
  };
}

export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}
// params được truyền vào chính là props
const DetailTrackPage = async ({ params }: { params: { slug: string } }) => {
  const idSlug = params.slug.split("-")?.pop()?.split(".html")[0] ?? "";
  console.log("check slug server:", idSlug);

  //fetchData tại server
  const res = await sendRequest<IBackendRes<ITrackTop>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${idSlug}`,
    method: "GET",
    nextOption: {
      // cache: "no-store", // không lưu cache cần xem thêm
      next: { tags: ["track-by-id"] },
    },
  });
  console.log("check track server:", res.data);
  const resComment = await sendRequest<IBackendRes<ITrackComment>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/comments`, // dùng queryParams không cần truyền dấu ? trong đường link
    method: "POST",
    queryParams: {
      current: 1,
      pageSize: 100,
      trackId: idSlug,
      sort: "-createdAt",
    },
  });
  if (!res.data) {
    notFound();
  }

  return (
    <Container>
      <div>
        <WaveTrack
          track={res?.data ?? null}
          //@ts-ignore
          comments={resComment?.data?.result ?? []}
        />
      </div>
    </Container>
  );
};
export default DetailTrackPage;
