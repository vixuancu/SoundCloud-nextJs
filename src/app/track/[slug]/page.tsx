"use client";

import WaveTrack from "@/components/track/wave.track";
import { useSearchParams } from "next/navigation";
// params được truyền vào chính là props
const DetailTrackPage = ({ params }: { params: { slug: string } }) => {
  const searchParams = useSearchParams();

  const search = searchParams.get("audio");
  console.log("check Search:", search);
  return (
    <div>
      DetailTrackPage
      <div>
        <WaveTrack />
      </div>
    </div>
  );
};
export default DetailTrackPage;
