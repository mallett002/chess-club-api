import * as invitationRepository from '../repository/invitation';
import { IInvitation } from '../interfaces/invitation';
import { IPlayerDTO } from '../interfaces/player';
import { selectPlayerByUsername } from '../repository/player';

export const createInviation = async (invitor: string, inviteeUsername: string): Promise<IInvitation> => {
  const playerToInvite: IPlayerDTO = await selectPlayerByUsername(inviteeUsername);

  if (!playerToInvite) {
    throw new Error(`player with username ${inviteeUsername} not found`);
  }

  if (invitor === playerToInvite.player_id) {
    throw new Error('player attempting to invite self');
  }

  const existingInvite: IInvitation | null = await invitationRepository.selectExistingInvite(
    invitor,
    playerToInvite.player_id,
  );

  if (existingInvite) {
    throw new Error(`Existing invitation with ${playerToInvite.username}`)
  }

  const invitation: IInvitation = await invitationRepository.insertNewInvitation(
    invitor,
    playerToInvite.player_id,
  );

  return invitation;
};