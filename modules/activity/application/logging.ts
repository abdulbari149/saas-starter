import { desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import {
  ActivityType,
  activityLogs,
  NewActivityLog,
  users
} from '@/lib/db/schema';
import { getCurrentUser } from '@/modules/auth/application/user';

export async function logActivity(
  teamId: number | null | undefined,
  userId: number,
  type: ActivityType,
  ipAddress?: string
) {
  if (teamId === null || teamId === undefined) {
    return;
  }

  const newActivity: NewActivityLog = {
    teamId,
    userId,
    action: type,
    ipAddress: ipAddress || ''
  };

  await db.insert(activityLogs).values(newActivity);
}

export async function getActivityLogs() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  return db
    .select({
      id: activityLogs.id,
      action: activityLogs.action,
      timestamp: activityLogs.timestamp,
      ipAddress: activityLogs.ipAddress,
      userName: users.name
    })
    .from(activityLogs)
    .leftJoin(users, eq(activityLogs.userId, users.id))
    .where(eq(activityLogs.userId, user.id))
    .orderBy(desc(activityLogs.timestamp))
    .limit(10);
}
