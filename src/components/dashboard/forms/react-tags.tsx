"use client";

import React, { KeyboardEvent, useState } from "react";

type TagPayload = {
  id: string;
  text: string;
};

type ReactTagsProps = {
  handleAddition?: (tag: TagPayload) => void;
  handleAddution?: (tag: TagPayload) => void;
  handleDeleteKeyword?: (index: number) => void;
  placeholder?: string;
  autocomplete?: boolean;
  classNames?: {
    tagInputField?: string;
  };
  className?: {
    tagInputField?: string;
  };
};

const ReactTags: React.FC<ReactTagsProps> = ({
  handleAddition,
  handleAddution,
  placeholder,
  autocomplete,
  classNames,
  className,
}) => {
  const [inputValue, setInputValue] = useState("");
  const onAdd = handleAddition ?? handleAddution;
  const inputClassName =
    classNames?.tagInputField ??
    className?.tagInputField ??
    "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50";

  const commitTag = () => {
    const value = inputValue.trim();
    if (!value || !onAdd) {
      return;
    }

    onAdd({
      id: `${Date.now()}-${value}`,
      text: value,
    });

    setInputValue("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commitTag();
    }
  };

  return (
    <input
      type="text"
      value={inputValue}
      autoComplete={autocomplete ? "on" : "off"}
      placeholder={placeholder}
      className={inputClassName}
      onChange={(event) => setInputValue(event.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={commitTag}
    />
  );
};

export default ReactTags;
