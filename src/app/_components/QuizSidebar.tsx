import React from "react";
import { Trophy, MessageSquareMore, ChevronDown } from "lucide-react";

type ownProps = {
  showInteractions: boolean;
  quizName: string;
  setShowInteractions: (bool: boolean) => void;
};

const QuizSidebar = (props: ownProps) => {
  const { showInteractions, setShowInteractions, quizName } = props;
  return (
    <div className="flex h-[700px] w-[220px] w-full flex-col gap-4 border-r-2 bg-[#fbfbfb] p-4 px-8">
      <div className="flex items-center justify-between">
        <h3>My interactions</h3>
        <button
          className="flex h-10 gap-2 rounded-md bg-green-400 p-2"
          onClick={() => setShowInteractions(false)}
        >
          {" "}
          + Add new
        </button>
      </div>
      <div>
        <h3 className="text-md font-semibold">Audience Q&A</h3>
        <div className="my-3 flex items-start justify-between rounded-md border-2 border-black px-2 py-4">
          <MessageSquareMore className="mr-4 h-8 w-8" />
          <p className="text-sm">
            Add Q&A to collect questions from your audience
          </p>
          <button className="rounded-md bg-green-400 p-1 px-2">Add</button>
        </div>
      </div>
      <div>
        <h3 className="text-md mb-4 font-semibold">Polls</h3>
        <div className="">
          {!showInteractions ? (
            <p className="text-center text-gray-400">
              Your interactions will appear here
            </p>
          ) : (
            <div>
              <div className="flex flex-col gap-4 rounded-md border-2 border-green-400 p-4 opacity-50">
                <div className="flex items-center justify-between">
                  <p>{quizName ? quizName : "Untitled quiz"}</p>
                  <ChevronDown />
                </div>
                <p>0 questions</p>
                <div className="flex gap-3">
                  <Trophy className="text-red-400" />
                  <p>o votes</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizSidebar;
