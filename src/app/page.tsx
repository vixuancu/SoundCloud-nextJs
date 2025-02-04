import AppHeader from "@/components/header/app.header";
import MainSlider from "@/components/main/main.slider";
import { Container } from "@mui/material";
export default function HomePage() {
  return (
    <div>
      <Container>
        {" "}
        <MainSlider />
      </Container>
    </div>
  );
}
