"use client";
import { useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
const WaveTrack = () => {
  useEffect(() => {
    // chạy chế độ dev thì useEffect chạy 2 lần
    const wavesurfer = WaveSurfer.create({
      container: document.getElementById("hoidanit")!, // ! nghĩa tham số không null
      waveColor: "rgb(200, 0, 200)",
      progressColor: "rgb(100, 0, 100)",
      url: "/audio/CHILL.mp3",
    });
  }, []);
  return <div id="hoidanit">WaveTrack</div>;
};
export default WaveTrack;
