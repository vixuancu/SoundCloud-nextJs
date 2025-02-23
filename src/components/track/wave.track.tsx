"use client";
import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import "./wave.scss";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { Tooltip } from "@mui/material";
import { fetchDefaultImage, sendRequest } from "@/utils/api";
import { useSearchParams } from "next/navigation";
import { useTrackContext } from "@/lib/track.context.wrapper";
import CommentTrack from "./comment.track";
import LikeTrack from "./like.track";
import Image from "next/image";
interface IProps {
  track: ITrackTop | null;
  comments: ITrackComment[];
}

const WaveTrack = (props: IProps) => {
  const { track, comments } = props;

  const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const hoverRef = useRef<HTMLDivElement | null>(null);
  const timeRef = useRef<HTMLDivElement | null>(null);
  const durationRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hoverWidth, setHoverWidth] = useState<number>(0);
  const [duration, setDuration] = useState<string>("0:00");
  const [currentTime, setCurrentTime] = useState<string>("0:00");
  const wavesurfer = wavesurferRef.current as WaveSurfer;
  //lấy id từ param
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [trackInfo, setTrackInfo] = useState<ITrackTop | null>(null);

  //
  const fileName = searchParams.get("audio");
  const audioUrl = `/api?audio=${fileName}`;
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
      wavesurferRef.current.load(audioUrl);

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
  }, [audioUrl]);

  const handlePlayPause = () => {
    wavesurferRef.current?.playPause();
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.round(seconds) % 60;
    const paddedSeconds = `0${secondsRemainder}`.slice(-2);
    return `${minutes}:${paddedSeconds}`;
  };

  const calLeft = (moment: number) => {
    const hardCodeDuration = wavesurferRef.current?.getDuration() ?? 0;
    const percent = (moment / hardCodeDuration) * 100;
    return `${percent}%`;
  };
  useEffect(() => {
    if (wavesurferRef.current && currentTrack.isPlaying) {
      wavesurferRef.current.pause();
    }
  }, [currentTrack]);

  useEffect(() => {
    if (track?._id && !currentTrack?._id)
      setCurrentTrack({ ...track, isPlaying: false });
  }, [track]);
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
                onClick={() => {
                  handlePlayPause();
                  if (track && wavesurferRef.current) {
                    setCurrentTrack({ ...currentTrack, isPlaying: false });
                  }
                }}
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
                {/* tiêu đề */}
                {track?.title}
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
                {track?.description}
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
            {/* comment */}
            <div className="comments" style={{ position: "relative" }}>
              {comments.map((item: ITrackComment) => {
                return (
                  <Tooltip title={item.content} arrow key={`key-${item._id}`}>
                    <Image
                      onPointerMove={(e) => {
                        const hover = hoverRef.current!;
                        hover.style.width = calLeft(item.moment + 3);
                      }}
                      src={fetchDefaultImage(item.user.type)}
                      alt="user comment"
                      width={20}
                      height={20}
                      style={{
                        position: "absolute",
                        top: 71,
                        zIndex: 20,
                        left: calLeft(item.moment),
                      }}
                    />
                  </Tooltip>
                );
              })}
            </div>
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
          {track?.imgUrl ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track?.imgUrl}`}
              alt="image wave track"
              width={250}
              height={250}
            />
          ) : (
            <div
              style={{
                background: "#ccc",
                width: 250,
                height: 250,
              }}
            ></div>
          )}
        </div>
      </div>
      <div
        style={{
          margin: "10px 10px 0 10px",
        }}
      >
        <LikeTrack track={track} />
      </div>
      <div>
        <CommentTrack
          track={track}
          comments={comments}
          wavesurfer={wavesurfer}
        />
      </div>
    </div>
  );
};

export default WaveTrack;
