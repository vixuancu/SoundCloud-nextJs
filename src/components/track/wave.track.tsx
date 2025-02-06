"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
const WaveTrack = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  const fileName = searchParams.get("audio");
  useEffect(() => {
    if (containerRef.current) {
      // chạy chế độ dev thì useEffect chạy 2 lần
      const wavesurfer = WaveSurfer.create({
        container: containerRef.current, // ! nghĩa tham số không null. containerRef.current trả về HTML
        waveColor: "rgb(200, 0, 200)",
        progressColor: "rgb(100, 0, 100)",
        url: `/api?audio=${fileName}`,
      });
    }
  }, []);
  return <div ref={containerRef}>WaveTrack</div>;
};
export default WaveTrack;
