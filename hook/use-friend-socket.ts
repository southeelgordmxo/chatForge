// "use client";
// import { useSocket } from "@/components/providers/socket-provider";
// import { Friend } from "@prisma/client";
// import { useQueryClient } from "@tanstack/react-query";
// import { useEffect } from "react";

// type ChatSocketProps = {
//   friendKey: string;
// };

// export function useChatSocket({ friendKey }: ChatSocketProps) {
//   const { socket } = useSocket();
//   const queryClient = useQueryClient();

//   useEffect(() => {
//     if (!socket) {
//       return;
//     }

//     socket.on(friendKey, (friend: Friend) => {
//       queryClient.setQueryData([queryKey], (oldData: any) => {
//         if (!oldData || !oldData.pages || oldData.pages.length === 0) {
//           return oldData;
//         }
// //
//         const newData = oldData.pages.map((page: any) => {
//           return {
//             ...page,
//             data: page.data.map((item: MessageWithMemberWithProfile) => {
//               if (item.id === message.id) {
//                 return message;
//               }
//               return item;
//             }),
//           };
//         // });

//         const newResult = {
//           ...oldData,
//           pages: newData,
//         };

//         return newResult;
//       });
//     });

//     return () => {
//       socket.off(addKey);
//       socket.off(updateKey);
//     };
//   }, [socket, addKey, queryClient, queryKey, updateKey]);
// }
