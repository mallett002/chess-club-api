import { IDBInvitation } from "../interfaces/invitation";
import { getPgClient } from "./db-client";

const pgClient = getPgClient();

export const insertNewInvitation = async (invitor: string, invitee: string): Promise<IDBInvitation> => {
  const [dbInvitation]: IDBInvitation[] = await pgClient('chess_club.tbl_invitation')
    .insert({
      invitor_id: invitor,
      invitee_id: invitee,
    }).returning('*');

  return dbInvitation;
};

export const selectExistingInvite = async (invitor: string, invitee: string): Promise<IDBInvitation | null> => {
  const [dbInvitation]: IDBInvitation[] = await pgClient('chess_club.tbl_invitation')
    .where({
      invitor_id: invitor,
      invitee_id: invitee,
    }).orWhere({
      invitor_id: invitee,
      invitee_id: invitor,
    });

    return dbInvitation || null;
};

export const selectInvitationById = async (invitationId: string): Promise<IDBInvitation | null> => {
  const [dbInvitation]: IDBInvitation[] = await pgClient('chess_club.tbl_invitation')
    .where({
      invitation_id: invitationId,
    }).returning('*');

  return dbInvitation || null;
};

export const selectInvitationsForPlayer = async (playerId: string): Promise<IDBInvitation[]> => {
  const dbInvitations: IDBInvitation[] = await pgClient('chess_club.tbl_invitation')
    .where({
      invitor_id: playerId,
    });

    return dbInvitations;
};

export const selectInboundRequestsForPlayer = async (playerId: string): Promise<IDBInvitation[]> => {
  const inboundRequests: IDBInvitation[] = await pgClient('chess_club.tbl_invitation')
    .where({
      invitee_id: playerId,
    });

    return inboundRequests;
};

export const deleteInvitationById = async (invitationId: string): Promise<string | null> => {
  const [dbInvitation]: string[] = await pgClient('chess_club.tbl_invitation')
    .where({ invitation_id: invitationId })
    .del()
    .returning('invitation_id');

  return dbInvitation || null;
};
