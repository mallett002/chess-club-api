import * as invitationRepository from '../repository/invitation';
import { IDBInvitation, IGameInvites, IInboundInvite, IInvitation, IOutboundInvite } from '../interfaces/invitation';
import { IPlayerDTO } from '../interfaces/player';
import { selectPlayerByPlayerId, selectPlayerByUsername } from '../repository/player';
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
    invitationId: invitation.invitation_id,
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

const buildOutboundInvite = async (invitation: IDBInvitation) => {
  const player = await selectPlayerByPlayerId(invitation.invitee_id);

  return {
    invitationId: invitation.invitation_id,
    invitee: player.username
  }
};

const buildInboundRequest = async (request: IDBInvitation) => {
  const player = await selectPlayerByPlayerId(request.invitor_id);

  return {
    invitationId: request.invitation_id,
    invitor: player.username
  }
};

export const getInvitationsAndInboundRequests = async (playerId: string): Promise<IGameInvites> => {
  const [dbInvitations, dbInboundRequests] = await Promise.all([
    invitationRepository.selectInvitationsForPlayer(playerId),
    invitationRepository.selectInboundRequestsForPlayer(playerId)
  ]);

  const invitations = await Promise.all(dbInvitations.map((invite) => buildOutboundInvite(invite)));
  const inboundRequests = await Promise.all(dbInboundRequests.map((request) => buildInboundRequest(request)));

  return {
    invitations,
    inboundRequests
  };
};
