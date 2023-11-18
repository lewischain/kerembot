
export interface DiscordAPIUser {
  id: string
  username: string
  avatar: string
  discriminator: string
  public_flags: number
  premium_type: number
  flags: number
  banner: any
  accent_color: any
  global_name: string
  avatar_decoration_data: any
  banner_color: any
  mfa_enabled: boolean
  locale: string
}

export interface DiscordAPIUserToken {
    token_type: string;
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
}