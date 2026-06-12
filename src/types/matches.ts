import type { User } from "./users";

export interface Match {
  _id: string;
  fen: string;
  white: User;
  black: User;
  winner: string;
  result: string;
  status: string;
  finishedAt: string;
}

export type Matches = Match[];
