export interface Player {
  id: number;
  name: string;
  country?: string;
  associationID?: string;
  team?: string;
}
export interface PlayerCSV {
  name: string;
  country?: string;
  associationID?: string;
  team?: string;
  avoidGroups?: string;
  forbidGroups?: string;
}
