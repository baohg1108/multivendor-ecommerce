export interface Detail {
  [key: string]: string | number | boolean | undefined;
}

interface ClickToAddInputProps {
  details: Detail[];
  setDetails: React.Dispatch<React.SetStateAction<Detail[]>>;
  initialDetail: Detail[];
  header: string;
}

const ClickToAddInputs: React.FC<ClickToAddInputProps> = ({
  details,
  setDetails,
  initialDetail = {},
  header,
}) => {
  const PlusButton = ({ onClick }: { onClick: () => void }) => {
    return (
      <button
        type="button"
        title="Add new detail"
        className="group cursor-pointer outline-none hover:rotate-90 duration-300"
        onClick={onClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          viewBox="0 0 16 16"
          className="w-8 h-8 stroke-blue-400 fill-none group-hover:fill-blue-primary group-active:fill-blue-primary"
        >
          <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM6.5 4.5a.5.5 0 011 0v3a.5.5 0 01-.5.5H4a.5.5 0 010-1h2a.5.5 0 01.5.5v-3z"></path>
          <path d="M16 0a8 8 0 100 16A8 8 0 008 0zM6.5 4.5a.5.5 0 011 0v3a.5.5 0 01-.5.5H4a.5.5 0 010-1h2a.5.5 0 01.5.5v-3z"></path>
        </svg>
      </button>
    );
  };

  const MinusButton = ({ onClick }: { onClick: () => void }) => {
    return (
      <button
        type="button"
        title="Remove detail"
        className="group cursor-pointer outline-none hover:rotate-90 duration-300"
        onClick={onClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          viewBox="0 0 16 16"
          className="w-8 h-8 stroke-blue-400 fill-none group-hover:fill-blue-primary group-active:fill-blue-primary"
        >
          <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM6.5 4.5a.5.5 0 011 0v3a.5.5 0 01-.5.5H4a.5.5 0 010-1h2a.5.5 0 01.5.5v-3z"></path>
          <path d="M16 0a8 8 0 100 16A8 8 0 008 0zM6.5 4.5a.5.5 0 011 0v3a.5.5 0 01-.5.5H4a.5.5 0 010-1h2a.5.5 0 01.5.5v-3z"></path>
        </svg>
      </button>
    );
  };
  return <div className="flex flex-col gap-y-4"
  >
    {/* header */}
    <div></div>
  </div>;
};

export default ClickToAddInputs;
