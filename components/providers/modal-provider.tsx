"use client";
import { useEffect, useState } from "react";
import CreateServerModal from "../modals/CreateServerModal";
import InviteServerModal from "../modals/InviteServerModal";

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
    </>
  );
};

export default ModalProvider;
