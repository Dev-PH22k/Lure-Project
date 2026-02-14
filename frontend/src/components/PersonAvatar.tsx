import { useMemo } from "react";

interface PersonAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const avatarColors = {
  Anderson: "bg-gradient-to-br from-blue-600 to-blue-800",
  Gabriel: "bg-gradient-to-br from-purple-600 to-purple-800",
  "Joao Vitor": "bg-gradient-to-br from-green-600 to-green-800",
  Felipe: "bg-gradient-to-br from-red-600 to-red-800",
  Amanda: "bg-gradient-to-br from-pink-600 to-pink-800",
  Gustavo: "bg-gradient-to-br from-yellow-600 to-yellow-800",
  Bruno: "bg-gradient-to-br from-indigo-600 to-indigo-800",
  Gladisson: "bg-gradient-to-br from-cyan-600 to-cyan-800",
  Jony: "bg-gradient-to-br from-orange-600 to-orange-800",
  Victor: "bg-gradient-to-br from-teal-600 to-teal-800",
};

export default function PersonAvatar({ name, size = "md", className = "" }: PersonAvatarProps) {
  const initials = useMemo(() => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [name]);

  const bgColor = avatarColors[name as keyof typeof avatarColors] || "bg-gradient-to-br from-gray-600 to-gray-800";

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-lg",
  };

  return (
    <div
      className={`${sizeClasses[size]} ${bgColor} rounded-full flex items-center justify-center font-bold text-white border-2 border-amber-500 ${className}`}
      title={name}
    >
      {initials}
    </div>
  );
}
