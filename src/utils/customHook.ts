import { useEffect, useState } from "react";
// trả ra true nếu component đã render , chưa render chả ra flase
export const useHasMounted = () => {
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  return hasMounted;
};
