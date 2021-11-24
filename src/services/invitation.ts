import * as invitationRepository from '../repository/invitation';
import { IInvitation } from '../interfaces/invitation';
import { IPlayerDTO } from '../interfaces/player';
import { selectPlayerByUsername } from '../repository/player';

export const createInviation = async (invitor: string, inviteeUsername: string): Promise<IInvitation> => {
  const playerToInvite: IPlayerDTO = await selectPlayerByUsername(inviteeUsername);

  if (!playerToInvite) {
    throw new Error(`player with username ${inviteeUsername} not found`);
  }

  const invitation: IInvitation = await invitationRepository.insertNewInvitation(
    invitor,
    playerToInvite.player_id,
  );

  return invitation;
};