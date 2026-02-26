import { getCurrentUser } from '@/modules/auth/application/user';

export async function GET() {
  const user = await getCurrentUser();
  return Response.json(user);
}
