export interface GithubStatusDetail {
  connected: boolean;
  integration: {
    _id: string;
    userId: string;
    accessToken: string;
    avatarUrl: string;
    connectedAt: string;
    username: string;
  };
}
