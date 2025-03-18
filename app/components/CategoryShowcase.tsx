"use client";

import { IconType } from "react-icons";
import { categoryItems } from "./MapFilterItems";
import { useSearchParams } from "next/navigation";

interface CategoryShowcaseProps {
  icon: IconType;
  label: string;
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({
  icon: Icon,
  label,
}) => {
  const searchParams = useSearchParams();
  const search = searchParams.get("filter");
  const category = categoryItems.find((item) => item.label === search);

  if (!category) {
    return null; // Return null if no category is selected
  }

  return (
    <div className="flex items-center">
      <Icon size={28} />
      <div className="flex flex-col ml-4">
        <h3 className="font-medium">{category.label}</h3>
        <p className="text-sm text-muted-foreground">{category.description}</p>
      </div>
    </div>
  );
};