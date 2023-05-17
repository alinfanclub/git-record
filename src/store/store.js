import { create } from "zustand";

export const useSearchStore = create((set) => ({
  searchText: "",
  addSearch: (val, name) => set((prev) => ({ ...prev, [name]: val })),
}));

export const useModalStore = create((set) => ({
  searchPop: false,
  openSearchToggle: () => set((state) => ({ searchPop: !state.searchPop })),
}));

export const PostListStore = create((set) => ({
  postList: [],
  addPostList: (val) => set((state) => ({ ...state, postList: val })),
}));
