import { atom, useAtom } from "jotai";

import { AtmData } from "./types";


const editAtmDialog = atom<AtmData | undefined>(undefined);

export const useEditAtmDialog = () => {
  const [editAtm, setEditAtm] = useAtom(editAtmDialog);
  return { editAtm, setEditAtm };
};
