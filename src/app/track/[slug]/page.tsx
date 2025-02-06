"use client";

import WaveTrack from "@/components/track/wave.track";
import { useSearchParams } from "next/navigation";
import Container from "@mui/material/Container";
// params được truyền vào chính là props
const DetailTrackPage = ({ params }: { params: { slug: string } }) => {
  const searchParams = useSearchParams();

  const fileName = searchParams.get("audio");
  const audioUrl = `/api?audio=${fileName}`;
  return (
    <Container>
      DetailTrackPage
      <div>
        <WaveTrack url={audioUrl} />
      </div>
    </Container>
  );
};
export default DetailTrackPage;
