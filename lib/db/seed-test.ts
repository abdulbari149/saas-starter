import { and, eq } from 'drizzle-orm';
import { db } from './drizzle';
import { teamMembers, teams, users } from './schema';
import { hashPassword } from '@/modules/auth/application/session';

const TEST_EMAIL = 'test@test.com';
const TEST_PASSWORD = 'admin123';
const TEST_TEAM_NAME = 'Test Team';

async function seedTestData() {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, TEST_EMAIL))
    .limit(1);

  const user =
    existingUser[0] ??
    (
      await db
        .insert(users)
        .values({
          email: TEST_EMAIL,
          passwordHash: await hashPassword(TEST_PASSWORD),
          role: 'owner'
        })
        .returning()
    )[0];

  if (!user) {
    throw new Error('Unable to create or load test user');
  }

  const existingMembership = await db
    .select({ id: teamMembers.id })
    .from(teamMembers)
    .where(eq(teamMembers.userId, user.id))
    .limit(1);

  if (existingMembership.length > 0) {
    console.log('Test user/team membership already exists.');
    return;
  }

  const [team] = await db
    .insert(teams)
    .values({ name: TEST_TEAM_NAME })
    .returning();

  if (!team) {
    throw new Error('Unable to create test team');
  }

  const duplicateMembership = await db
    .select({ id: teamMembers.id })
    .from(teamMembers)
    .where(and(eq(teamMembers.userId, user.id), eq(teamMembers.teamId, team.id)))
    .limit(1);

  if (duplicateMembership.length === 0) {
    await db.insert(teamMembers).values({
      userId: user.id,
      teamId: team.id,
      role: 'owner'
    });
  }

  console.log('Test seed completed.');
}

seedTestData()
  .catch((error) => {
    console.error('Test seed failed:', error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
