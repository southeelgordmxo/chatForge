import { Hash } from "lucide-react";

interface ChatWelcomeMessageProps {
  name: string;
  type: "channel" | "member";
}

const ChatWelcomeMessage = ({ name, type }: ChatWelcomeMessageProps) => {
  return (
    <div className="mb-4 space-y-4">
      {type === "channel" && (
        <div className="w-16 h-16 rounded-full flex items-center justify-center p-3 bg-zinc-800">
          <Hash className="h-9 w-9 md:w-12 md:h-12" />
        </div>
      )}
      <p className="text-xl md:text-2xl">
        {type === "channel" ? "Welcome to #" : ""}
        {name}
      </p>
      <p className="text-muted-foreground">
        {name && type === "channel"
          ? `This is the conversation start of the #${name} channel`
          : `This is the conversation start of with ${name}`}
      </p>
    </div>
  );
};

export default ChatWelcomeMessage;
