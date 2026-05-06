import { TX } from './lib/translations';
import { getGitHubData } from './lib/github';
import HomeClient from './HomeClient';

export default async function Home() {
  // We default to 'es' for the initial server render
  const t = TX['es'];
  const initialGitHubData = await getGitHubData(t);

  return <HomeClient initialGitHubData={initialGitHubData} />;
}

