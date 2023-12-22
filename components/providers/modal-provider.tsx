"use client";
import { useEffect, useState } from "react";
import CreateServerModal from "../modals/CreateServerModal";
import InviteServerModal from "../modals/InviteServerModal";
import EditServerModal from "../modals/EditServerModal";
import ManageMembersModal from "../modals/ManageMembersModal";
import CreateChannelsModal from "../modals/CreateChannelsModal";
import LeaveServerModal from "../modals/LeaveServerModal";
import DeleteServerModal from "../modals/DeleteServerModal";
import EditChannelModal from "../modals/EditChannelModal";
import DeleteChannelModal from "../modals/DeleteChannelModal";
import MessageFileModal from "../modals/MessageFileModal";
import DeleteMessageModal from "../modals/DeleteMessageModal";
import AddFriendModal from "../modals/addFriendModal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <CreateServerModal />
      <InviteServerModal />
      <EditServerModal />
      <ManageMembersModal />
      <CreateChannelsModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <EditChannelModal />
      <DeleteChannelModal />
      <MessageFileModal />
      <DeleteMessageModal />
      <AddFriendModal />
    </>
  );
};

export default ModalProvider;
