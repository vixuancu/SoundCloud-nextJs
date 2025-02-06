// "use client";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useRef } from "react";
// import WaveSurferPlayer from "@/utils/WaveSurferPlayer";
// import WaveSurfer from "wavesurfer.js";
// const WaveTrack = () => {
//   const searchParams = useSearchParams();

//   const fileName = searchParams.get("audio");
//   const audioUrl = `/api?audio=${fileName}`;

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">SoundCloud Waveform Style</h1>
//       <WaveSurferPlayer url={audioUrl} />
//     </div>
//   );
// };
// export default WaveTrack;
"use client";
import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import "./wave.scss";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
interface WaveSurferPlayerProps {
  url: string;
}

const WaveTrack: React.FC<WaveSurferPlayerProps> = ({ url }) => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const hoverRef = useRef<HTMLDivElement | null>(null);
  const timeRef = useRef<HTMLDivElement | null>(null);
  const durationRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hoverWidth, setHoverWidth] = useState<number>(0);
  const [duration, setDuration] = useState<string>("0:00");
  const [currentTime, setCurrentTime] = useState<string>("0:00");

  useEffect(() => {
    if (typeof window !== "undefined" && waveformRef.current) {
      /// chạy trên browrer
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      // Gradient waveform
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#dad8d2");
      gradient.addColorStop(0.7, "#dad8d2");
      gradient.addColorStop(1, "#c3babade");

      // Gradient progress
      const progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      progressGradient.addColorStop(0, "#EB4926");
      progressGradient.addColorStop(0.7, "#ffffff");
      progressGradient.addColorStop(1, "#EB4926");

      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: gradient,
        progressColor: progressGradient,
        cursorColor: "transparent",
        barWidth: 2.5,
        barRadius: 3,
        height: 100,
      });
      //// Load audio file
      wavesurferRef.current.load(url);

      wavesurferRef.current.on("ready", () => {
        setDuration(formatTime(wavesurferRef.current!.getDuration()));
      });
      //// Xử lý sự kiện play/pause
      wavesurferRef.current.on("play", () => setIsPlaying(true));
      wavesurferRef.current.on("pause", () => setIsPlaying(false));
      wavesurferRef.current.on("interaction", () => {
        wavesurferRef.current?.play();
      });
      //audioprocess
      wavesurferRef.current.on("audioprocess", () => {
        setCurrentTime(formatTime(wavesurferRef.current!.getCurrentTime()));
      });
      // xử lí hover
      const handleHover = (e: MouseEvent) => {
        if (waveformRef.current) {
          const rect = waveformRef.current.getBoundingClientRect();
          const offsetX = e.clientX - rect.left;
          setHoverWidth(offsetX);
        }
      };

      const container = waveformRef.current;
      container.addEventListener("mousemove", handleHover);

      return () => {
        wavesurferRef.current?.destroy();
        container.removeEventListener("mousemove", handleHover);
      };
    }
  }, [url]);

  const handlePlayPause = () => {
    wavesurferRef.current?.playPause();
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.round(seconds) % 60;
    const paddedSeconds = `0${secondsRemainder}`.slice(-2);
    return `${minutes}:${paddedSeconds}`;
  };

  return (
    <div style={{ marginTop: 20 }}>
      <div
        style={{
          display: "flex",
          gap: 15,
          padding: 20,
          height: 400,
          background:
            "linear-gradient(135deg, rgb(106, 112, 67) 0%, rgb(11, 15, 20) 100%)",
        }}
      >
        <div
          className="left"
          style={{
            width: "75%",
            height: "calc(100% - 10px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div className="info" style={{ display: "flex" }}>
            <div>
              <div
                onClick={() => handlePlayPause()}
                style={{
                  borderRadius: "50%",
                  background: "#f50",
                  height: "50px",
                  width: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                {isPlaying === true ? (
                  <PauseIcon sx={{ fontSize: 30, color: "white" }} />
                ) : (
                  <PlayArrowIcon sx={{ fontSize: 30, color: "white" }} />
                )}
              </div>
            </div>
            <div style={{ marginLeft: 20 }}>
              <div
                style={{
                  padding: "0 5px",
                  background: "#333",
                  fontSize: 30,
                  width: "fit-content",
                  color: "white",
                }}
              >
                Hỏi Dân IT's song
              </div>
              <div
                style={{
                  padding: "0 5px",
                  marginTop: 10,
                  background: "#333",
                  fontSize: 20,
                  width: "fit-content",
                  color: "white",
                }}
              >
                Eric
              </div>
            </div>
          </div>
          <div
            className="waveform"
            ref={waveformRef}
            style={{
              marginBottom: "20px",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div className="time" ref={timeRef}>
              {currentTime}
            </div>
            <div className="duration" ref={durationRef}>
              {duration}
            </div>
            <div
              className="hover"
              style={{ width: `${hoverWidth}px` }}
              ref={hoverRef}
            ></div>
            {/* Lớp overlay */}
            <div
              className="overlay"
              style={{
                position: "absolute",
                height: "30px",
                width: "100%",
                bottom: "0",
                // background: "#ccc"
                backdropFilter: "brightness(0.5)",
              }}
            ></div>
          </div>
        </div>
        {/*  */}
        <div
          className="right"
          style={{
            width: "25%",
            padding: 15,
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#ccc",
              width: 250,
              height: 250,
            }}
          ></div>
        </div>
      </div>

      {/* <button
        onClick={handlePlayPause}
        className="mt-2 p-2 bg-orange-500 text-white rounded"
      >
        {isPlaying ? " Pause" : " Play"}
      </button> */}
    </div>
  );
};

export default WaveTrack;
