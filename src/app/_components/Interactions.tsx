import React from "react";
import { Trophy } from "lucide-react";

type ownProps = {
  setShowInteractions: (bool: boolean) => void;
};

const Interactions = (props: ownProps) => {
  const { setShowInteractions } = props;
  return (
    <div className="mb-2 w-full">
      <div className="flex justify-between">
        <h3 className="text-lg">Add new interaction</h3>
        <p className="text-md text-gray-200">Close X</p>
      </div>
      <div className="mt-4">
        <div
          className="flex w-[180px] cursor-pointer flex-col items-center justify-center rounded-md border-2 p-8"
          onClick={() => setShowInteractions(true)}
        >
          <Trophy className="text-red-400" />
          <p className="text-md mt-4 font-semibold">Quiz</p>
        </div>
      </div>
    </div>
  );
};

export default Interactions;
