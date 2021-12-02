interface IPlayerInvite {
  playerId: string
  username: string
}

export interface IDBInvitation {
  invitationId: string
}

export interface IInvitation {
  invitationId: string
  invitor: IPlayerInvite
  invitee: IPlayerInvite
}
