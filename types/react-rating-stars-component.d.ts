declare module "react-rating-stars-component" {
  import { ComponentType, ReactNode } from "react";

  interface ReactStarsProps {
    count?: number;
    value?: number;
    onChange?: (newRating: number) => void;
    size?: number;
    isHalf?: boolean;
    edit?: boolean;
    activeColor?: string;
    color?: string;
    emptyIcon?: ReactNode;
    halfIcon?: ReactNode;
    filledIcon?: ReactNode;
    // className?: string;
  }

  const ReactStars: ComponentType<ReactStarsProps>;

  export default ReactStars;
}
