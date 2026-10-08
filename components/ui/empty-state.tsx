import Image from "next/image";
import React from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  imageSrc?: string;
}

const EmptyState = ({ title, description, imageSrc }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16">
    <Image
      src={imageSrc ?? "/empty-state.svg"}
      alt="No projects"
      className="w-48 h-48 mb-4"
      height={90}
      width={90}
    />
    <h2 className="text-xl font-semibold text-gray-500">No projects found</h2>
    <p className="text-gray-400">Create a new project to get started!</p>
  </div>
);

export default EmptyState;
