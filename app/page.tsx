import { TX } from "./data/translations";
import { getFeaturedProjects } from "./lib/github";
import HomeClient from "./HomeClient";

export default function Home() {
  return (
    <HomeClient
      initialGitHubData={{
        repos: [],
        top3: getFeaturedProjects(TX.es),
        load: true,
        offline: false,
        errorMsg: "",
      }}
    />
  );
}
