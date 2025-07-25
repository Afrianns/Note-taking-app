export type noteType = {
  id: number;
  title: string;
  content: string | null;
  tags: noteTagType[];
  createdAt: Date;
  updatedAt: Date;
};

export type noteTagType = {
  id: string;
  name: string;
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

export type tagType = {
  id: string;
  name: string;
  createdAt: Date;
};
