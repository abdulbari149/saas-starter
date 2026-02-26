import { getCurrentUser } from '@/modules/auth/application/user';
import {
  getTeamByStripeCustomerId,
  getTeamForCurrentUser,
  getUserWithTeam,
  updateTeamSubscription
} from '@/modules/teams/application/queries';
import { getActivityLogs } from '@/modules/activity/application/logging';

export const getUser = getCurrentUser;
export const getTeamForUser = getTeamForCurrentUser;
export {
  getTeamByStripeCustomerId,
  updateTeamSubscription,
  getUserWithTeam,
  getActivityLogs
};
