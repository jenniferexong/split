export interface PersonTotal {
  name: string;
  total: number;
}

// Indexed by person id
export type PersonTotals = Record<number, PersonTotal>;
