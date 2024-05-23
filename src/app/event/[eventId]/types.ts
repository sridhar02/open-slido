export type Option = {
  id: number;
  text: string;
  isCorrect: boolean;
};

export type Answer = {
  text: string;
  isCorrect: boolean;
};

export type Question = {
  text: string;
  answers: Answer[];
};
