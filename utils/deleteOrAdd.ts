import type { inputTagType } from "~/types/types";

export const checkDeletedOrAdded = (
  firstData: inputTagType[],
  secondData: inputTagType[]
): inputTagType | undefined => {
  const result = firstData.filter(
    (first: inputTagType) =>
      !secondData.some((second) => second.label == first.label)
  );
  if (result.length) return result[0];
};
