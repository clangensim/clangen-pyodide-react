import { useQuery } from "@tanstack/react-query";
import { clangenRunner } from "../python/clangenRunner";

function useClanInfo() {
  return useQuery({
    queryKey: ["claninfo"],
    queryFn: async () => await clangenRunner.getClanInfo(),
  });
}

export default useClanInfo;
