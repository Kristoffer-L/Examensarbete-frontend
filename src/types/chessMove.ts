export default interface ChessMove {
  from: string;
  to: string;
  promotion?: "q" | "r" | "b" | "n";
}
