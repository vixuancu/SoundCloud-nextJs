"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Settings } from "react-slick";
import { Box, Button, Divider } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
interface IProps {
  data: ITrackTop[];
  title: string;
}
const MainSlider = (props: IProps) => {
  const { data, title } = props;
  const NextArrow = (props: any) => {
    return (
      <Button
        color="inherit"
        variant="contained"
        onClick={props.onClick}
        sx={{
          position: "absolute",
          right: 25,
          top: "20%",
          zIndex: 2,
          minWidth: 30,
          width: 35,
        }}
      >
        <ChevronRightIcon />
      </Button>
    );
  };
  const PrevArrow = (props: any) => {
    return (
      <Button
        color="inherit"
        variant="contained"
        onClick={props.onClick}
        sx={{
          position: "absolute",
          top: "20%",
          zIndex: 2,
          minWidth: 30,
          width: 35,
        }}
      >
        <ChevronLeftIcon />
      </Button>
    );
  };
  const settings: Settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5, // hiển thị số lượng
    slidesToScroll: 3, // số lượng cuộn theo
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };
  return (
    // Box === div nhưng mà hỗ trợ code thằng sx vì sử dụng thư viện MUI
    <Box
      sx={{
        margin: "0 50px",
        ".track": {
          padding: "0 10px",
          img: {
            height: "150px",
            width: "150px",
          },
        },
        h3: {
          border: "1px solid #ccc",
          padding: "20px",
          height: "200px",
        },
      }}
    >
      <h2> {title} </h2>
      <Slider {...settings}>
        {data.map((track) => {
          return (
            <div className="track" key={track._id}>
              <img
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
              />
              <h4>{track.title}</h4>
              <h5>{track.description}</h5>
            </div>
          );
        })}
      </Slider>
      <Divider />
    </Box>
  );
};
export default MainSlider;
