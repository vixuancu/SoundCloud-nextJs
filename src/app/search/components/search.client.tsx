"use client";

import { convertSlugUrl, sendRequest } from "@/utils/api";
import { Box, Divider, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { title } from "process";
import { useEffect, useState } from "react";

const ClientSearch = () => {
  const searchParams = useSearchParams(); // chỉ có client mới sử dụng được useSearchParams();
  const query = searchParams.get("q");
  const [tracks, setTracks] = useState<ITrackTop[]>([]);

  const fetchData = async (query: any) => {
    const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/search`,
      method: "POST",
      queryParams: { current: 1, pageSize: 100 },
      body: {
        title: query,
        current: 1,
        pageSize: 10,
      },
    });
    if (res.data?.result) {
      setTracks(res.data?.result);
    }
  };

  useEffect(() => {
    //update document title by query
    document.title = `"${query}" page Cử làm`;
    if (query) {
      fetchData(query);
    }
  }, [query]);
  return (
    <>
      <Box>
        {!query || !tracks.length ? (
          <div> kết quả không tồn tại!</div>
        ) : (
          <Box>
            <div>
              Kết quả tìm kiếm cho từ khóa: <b>{query}</b>
            </div>
            <Divider sx={{ mt: 2 }} />
            {tracks.length > 0 &&
              tracks.map((track) => {
                return (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                      mt: 3,
                    }}
                  >
                    <Image
                      style={{ borderRadius: "3px" }}
                      alt="ảnh từ kết quả tìm kiếm"
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
                      width={50}
                      height={50}
                    />

                    <Typography>
                      <Link
                        style={{ textDecoration: "none", color: "unset" }}
                        href={`/track/${convertSlugUrl(track.title)}-${
                          track._id
                        }.html?audio=${track.trackUrl}`}
                      >
                        {track.title}
                      </Link>
                    </Typography>
                  </Box>
                );
              })}
          </Box>
        )}
      </Box>
    </>
  );
};

export default ClientSearch;
