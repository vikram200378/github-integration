import { GithubData } from '../generic';

export interface Entity {
  _id: string;
  type: string;
  label: string;
  createdAt: string;
  updatedAt: string;
}

export interface EntitiesResponse {
  results: Entity[];
}
