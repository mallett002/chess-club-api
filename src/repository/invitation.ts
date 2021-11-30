import { IInvitation } from "../interfaces/invitation";
import { getPgClient } from "./db-client";

const pgClient = getPgClient();

export const insertNewInvitation = async (invitor: string, invitee: string): Promise<IInvitation> => {
  const [dbInvitation]: string[] = await pgClient('chess_club.tbl_invitation')
    .insert({
      invitor_id: invitor,
      invitee_id: invitee,
    }).returning('invitation_id');

  return {
    invitationId: dbInvitation
  };
};

export const selectExistingInvite = async (invitor: string, invitee: string): Promise<IInvitation> => {
  const [dbInvitation]: string[] = await pgClient('chess_club.tbl_invitation')
    .where({
      invitor_id: invitor,
      invitee_id: invitee,
    });

  if (dbInvitation) {
    return {
      invitationId: dbInvitation
    };
  }

  return null;
};