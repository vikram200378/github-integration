export enum SyncStatus {
  complete = 'complete',
  pending = 'pending',
}

export interface GithubStatusDetail {
  connected: boolean;
  integration: {
    _id: string;
    userId: string;
    accessToken: string;
    avatarUrl: string;
    connectedAt: string;
    syncStatus: SyncDetail;
    username: string;
  };
}

export interface SyncDetail {
  repos: {
    lastSyncedAt: string | Date;
    status: SyncStatus;
  };
  commits: {
    status: SyncStatus;
  };
  issues: {
    status: SyncStatus;
  };
  pullRequests: {
    status: SyncStatus;
  };
}
