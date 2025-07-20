export type noteType = {
  id: number;
  title: string;
  content: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export enum noteExistType {
  DEFAULT,
  NOTEXIST,
  EXIST,
}

export enum notesArchivedExistType {
  DEFAULT,
  NOTEXIST,
  EXIST,
}
