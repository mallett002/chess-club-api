interface IPlayerInvite {
  playerId: string
  username: string
}

export interface IDBInvitation {
  invitation_id: string
  invitor_id: string
  invitee_id: string
}

export interface IInvitation {
  invitationId: string
  invitor: IPlayerInvite
  invitee: IPlayerInvite
}
