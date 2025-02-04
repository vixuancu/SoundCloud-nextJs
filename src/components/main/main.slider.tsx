"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Settings } from "react-slick";
import { Box, Button, Divider } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
const MainSlider = () => {
  const NextArrow = (props: any) => {
    return (
      <Button
        variant="outlined"
        onClick={props.onClick}
        sx={{
          position: "absolute",
          right: 0,
          top: "50%",
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
        variant="outlined"
        onClick={props.onClick}
        sx={{
          position: "absolute",
          top: "50%",
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
        ".abc": {
          padding: "0 10px",
        },
        h3: {
          border: "1px solid #ccc",
          padding: "20px",
          height: "200px",
        },
      }}
    >
      <h2> Multiple tracks </h2>
      <Slider {...settings}>
        <div className="abc">
          <h3>Track 1</h3>
        </div>
        <div className="abc">
          <h3>Track 2</h3>
        </div>
        <div className="abc">
          <h3>Track 3</h3>
        </div>
        <div className="abc">
          <h3>Track 4</h3>
        </div>
        <div className="abc">
          <h3>Track 5</h3>
        </div>
        <div className="abc">
          <h3>Track 6</h3>
        </div>
        <div className="abc">
          <h3>Track 7</h3>
        </div>
        <div className="abc">
          <h3>Track 8</h3>
        </div>
        <div className="abc">
          <h3>Track 9</h3>
        </div>
      </Slider>
      <Divider />
      <h2> Multiple tracks </h2>
      <Slider {...settings}>
        <div className="abc">
          <h3>Track 1</h3>
        </div>
        <div className="abc">
          <h3>Track 2</h3>
        </div>
        <div className="abc">
          <h3>Track 3</h3>
        </div>
        <div className="abc">
          <h3>Track 4</h3>
        </div>
        <div className="abc">
          <h3>Track 5</h3>
        </div>
        <div className="abc">
          <h3>Track 6</h3>
        </div>
        <div className="abc">
          <h3>Track 7</h3>
        </div>
        <div className="abc">
          <h3>Track 8</h3>
        </div>
        <div className="abc">
          <h3>Track 9</h3>
        </div>
      </Slider>
      <Divider />
    </Box>
  );
};
export default MainSlider;
