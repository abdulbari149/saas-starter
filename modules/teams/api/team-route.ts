import { getTeamForCurrentUser } from '@/modules/teams/application/queries';

export async function GET() {
  const team = await getTeamForCurrentUser();
  return Response.json(team);
}
