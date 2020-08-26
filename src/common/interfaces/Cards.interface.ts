export interface Card {
  title: string;
  subtitle?: string;
  buttons: {
    title: string;
    payload: string;
  }[];
}
