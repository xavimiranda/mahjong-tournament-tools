export interface Player {
  id: number;
  name: string;
  country?: string;
  associationId?: string;
  team?: string;
}
export interface PlayerCSV {
  name: string;
  country?: string;
  associationId?: string;
  team?: string;
  avoidGroups?: string;
  forbidGroups?: string;
}
