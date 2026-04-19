import { Color } from "@prisma/client";

type ColorWheelProps = {
  colors: Partial<Color>[];
  size: number;
};

const ColorWheel: React.FC<ColorWheelProps> = ({ colors, size }) => {
  const numColors = colors.length;
  const radius = size / 2;
  const sliceAngle = 360 / numColors;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="shadow-md rounded-full"
    >
      {colors.map((color, index) => {
        if (numColors === 1) {
          return (
            <circle
              key={index}
              cx={radius}
              cy={radius}
              r={radius}
              fill={color.name || "transparent"}
              stroke="white"
              strokeWidth="1"
            />
          );
        }

        const startAngle = index * sliceAngle;
        const endAngle = startAngle + sliceAngle;

        const startRadians = (startAngle * Math.PI) / 180;
        const endRadians = (endAngle * Math.PI) / 180;

        const round = (n: number) => Math.round(n * 1e6) / 1e6;

        const x1 = round(radius + radius * Math.cos(startRadians));
        const y1 = round(radius + radius * Math.sin(startRadians));
        const x2 = round(radius + radius * Math.cos(endRadians));
        const y2 = round(radius + radius * Math.sin(endRadians));

        const largeArcFlag = sliceAngle > 180 ? 1 : 0;

        const pathData = `
          M ${radius},${radius}
          L ${x1},${y1}
          A ${radius},${radius} 0 ${largeArcFlag} 1 ${x2},${y2}
          Z
        `;

        return (
          <path
            key={index}
            d={pathData}
            fill={color.name || "transparent"}
            stroke="white"
            strokeWidth="1"
          />
        );
      })}
    </svg>
  );
};

export default ColorWheel;
