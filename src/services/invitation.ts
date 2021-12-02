import * as invitationRepository from '../repository/invitation';
import { IDBInvitation, IInvitation } from '../interfaces/invitation';
import { IPlayerDTO } from '../interfaces/player';
import { selectPlayerByUsername } from '../repository/player';
import { PlayerJwtPayload } from 'jsonwebtoken';

export const createInviation = async (invitorClaims: PlayerJwtPayload, inviteeUsername: string): Promise<IInvitation> => {
  const {playerId: invitorPlayerId, sub} = invitorClaims;
  const playerToInvite: IPlayerDTO = await selectPlayerByUsername(inviteeUsername);

  if (!playerToInvite) {
    throw new Error(`player with username ${inviteeUsername} not found`);
  }

  if (invitorPlayerId === playerToInvite.player_id) {
    throw new Error('player attempting to invite self');
  }

  const existingInvite: IDBInvitation | null = await invitationRepository.selectExistingInvite(
    invitorPlayerId,
    playerToInvite.player_id,
  );

  if (existingInvite) {
    throw new Error(`Existing invitation with ${playerToInvite.username}`)
  }

  const invitation: IDBInvitation = await invitationRepository.insertNewInvitation(
    invitorPlayerId,
    playerToInvite.player_id,
  );

  return {
    invitationId: invitation.invitationId,
    invitor: {
      playerId: invitorPlayerId,
      username: sub
    },
    invitee: {
      playerId: playerToInvite.player_id,
      username: playerToInvite.username
    }
  };
};