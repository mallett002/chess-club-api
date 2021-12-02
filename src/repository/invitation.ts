import { IDBInvitation } from "../interfaces/invitation";
import { getPgClient } from "./db-client";

const pgClient = getPgClient();

export const insertNewInvitation = async (invitor: string, invitee: string): Promise<IDBInvitation> => {
  const [dbInvitation]: string[] = await pgClient('chess_club.tbl_invitation')
    .insert({
      invitor_id: invitor,
      invitee_id: invitee,
    }).returning('invitation_id');

  return {
    invitationId: dbInvitation,
  };
};

export const selectExistingInvite = async (invitor: string, invitee: string): Promise<IDBInvitation | null> => {
  const [dbInvitation]: string[] = await pgClient('chess_club.tbl_invitation')
    .where({
      invitor_id: invitor,
      invitee_id: invitee,
    }).orWhere({
      invitor_id: invitee,
      invitee_id: invitor,
    });

  if (dbInvitation) {
    return {
      invitationId: dbInvitation
    };
  }

  return null;
};