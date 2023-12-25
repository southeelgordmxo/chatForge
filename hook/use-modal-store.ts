import { FriendsWithFriendOneAndFriendTwo } from "@/type";
import { Channel, ChannelType, Friend, Profile, Server } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "createServer"
  | "inviteServer"
  | "editServer"
  | "manageMembers"
  | "createChannels"
  | "leaveServer"
  | "deleteServer"
  | "editChannel"
  | "deleteChannel"
  | "messageFile"
  | "deleteMessage"
  | "addFriend";

interface ModalData {
  server?: Server;
  channelType?: ChannelType;
  channel?: Channel;
  apiUrl?: string;
  users?: Profile[];
  query?: Record<string, any>;
  profileId?: string;
  friends?: FriendsWithFriendOneAndFriendTwo[];
  status?: "error" | "success" | "pending";
}
interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  data: ModalData;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null, data: {} }),
}));
