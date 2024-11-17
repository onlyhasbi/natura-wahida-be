export type RefreshToken = {
  refresh_token: string;
};

export type Token = {
  access_token: string;
} & RefreshToken;
