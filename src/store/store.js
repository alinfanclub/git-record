import { create } from "zustand";

export const useSearchStore = create((set) => ({
  searchText: "",
  addSearch: (val, name) => set((prev) => ({ ...prev, [name]: val })),
}));

export const useModalStore = create((set) => ({
  searchPop: false,
  openSearchToggle: () => set((state) => ({ searchPop: !state.searchPop })),
  searchClose: () => set(() => ({ searchPop: false })),
}));

export const PostListStore = create((set) => ({
  postList: [],
  addPostList: (val) => set((state) => ({ ...state, postList: val })),
}));

export const PersonalUserDataStore = create((set) => ({
  personal : [],
  addPersonal: (res) => set(() => ({personal: res})),
  addPersonalUserUrl: (val) => set((state) => ({ personal: { ...state.personal, userPhotoURL: val } })),
  addPersonalUserDisplayName: (val) => set((state) => ({ personal: { ...state.personal, userDisplayName: val } })),
}))

// export const URLUserDataStore = create((set) => ({
//   user : [],
//   addUser: (res) => set(() => ({personal: res}))
// }))