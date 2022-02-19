interface IPlayerInvite {
  playerId: string
  username: string
}

export interface IDBInvitation {
  invitation_id: string
  invitor_id: string
  invitee_id: string,
  invitee_color: IInvitationColor
}

export interface IInvitation {
  invitationId: string
  invitor: IPlayerInvite
  invitee: IPlayerInvite
}

export interface IOutboundInvite {
  invitationId: string
  invitee: string
}

export interface IInboundInvite {
  invitationId: string
  invitor: string
}

export interface IGameInvites {
  invitations: IOutboundInvite[],
  inboundGameRequests: IInboundInvite[]
}

export enum IInvitationColor {
  w = 'w',
  b = 'b'
}

