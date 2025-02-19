import { Container } from "@mui/material";
import { Metadata } from "next";
import ClientSearch from "./components/search.client";

export const metadata: Metadata = {
  title: "Search your tracks",
  description: "trang kết quả của  search ",
};
const SearchPage = () => {
  return (
    <Container sx={{ mt: 3 }}>
      <ClientSearch />
    </Container>
  );
};
export default SearchPage;
