// Pisma model
import { Category } from "@prisma/client";

interface CategoryDetailsProps {
  data?: Category;
}

const CategoryDetails: React.FC<CategoryDetailsProps> = ({ data }) => {
  return <div>{data?.name}</div>;
};

export default CategoryDetails;
