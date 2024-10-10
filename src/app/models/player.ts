export interface Player {
  id: number;
  name: string;
  country?: string;
  associationId?: string;
  team?: string;
  isSubstitute: boolean;
}
export interface PlayerCSV {
  name: string;
  country?: string;
  associationId?: string;
  team?: string;
  avoidGroups?: string;
  forbidGroups?: string;
}
