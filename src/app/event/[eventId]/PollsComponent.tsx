import React, { ChangeEvent } from "react";
import { Settings, CircleCheck, Trash2, MoveLeft } from "lucide-react";
import { useToast } from "~/components/ui/use-toast";

import { Input } from "~/components/ui/input";
import { Question } from "./types";

type ownProps = {
  questions: Question[] | undefined;
  setShowQuestions: (st: boolean) => void;
  handleSelect: (questionId: number, answerId: number, type: string) => void;
  handleInput: (questionId: number, answerId: number, value: string) => void;
  handleOptionChange: (id: number, value: string) => void;
  selectedQuestionIndex: number;
  setQuestions: (questions: Question[] | undefined) => void;
  setSelectedQuestionIndex: (st: number) => void;
  // handleDelete: () => void;
};

const PollsComponent = (props: ownProps) => {
  const {
    questions,
    // handleDelete,
    handleInput,
    handleSelect,
    setShowQuestions,
    handleOptionChange,
    setQuestions,
    setSelectedQuestionIndex,
    selectedQuestionIndex: questionIndex,
  } = props;
  const { toast } = useToast();

  const question = questions?.[questionIndex];
  console.log({ questionIndex, questions });

  const handleBack = () => {
    console.log(!question?.text && questionIndex !== 0);

    setShowQuestions(false);
    if (questionIndex === 0) {
      setSelectedQuestionIndex(0);
      setQuestions([]);
    }

    if (question?.text.length == 0 && questionIndex !== 0) {
      const updatedQuestions = questions?.filter(
        (_, index) => questionIndex !== index,
      );
      setSelectedQuestionIndex(questionIndex - 1);
      setQuestions(updatedQuestions);
    }
    const answersCorrect = question?.answers.map((ans) => ans.isCorrect);
    if (answersCorrect?.indexOf(true)) {
    }
  };

  const addNewQuestion = () => {
    const answersCorrect = question?.answers.map((ans) => ans.isCorrect);
    console.log(
      "add new question",
      answersCorrect,
      !answersCorrect?.indexOf(true),
    );
    if (answersCorrect?.indexOf(true)) {
      toast({
        variant: "destructive",
        title: "Select a correct answer",
      });
    }
  };

  return (
    <div>
      <div
        className="ml-2 flex cursor-pointer gap-2"
        onClick={() => handleBack()}
      >
        <MoveLeft /> Back to all questions
      </div>
      <div className="mt-4" key={questionIndex}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-600 p-4">
              {questionIndex + 1}
            </p>
            <div className="flex flex-col">
              <p>Quiz question</p>
              <div className="flex gap-2">
                <p>0 votes</p> <p>{"20 sec"}</p>
              </div>
            </div>
          </div>
          <p className="flex gap-2 hover:rounded-md hover:bg-green-200 hover:p-2">
            Poll Settings
            <Settings />
          </p>
        </div>
        <Input
          placeholder="What would  you like to ask?"
          className="my-4"
          value={question?.text}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleOptionChange(questionIndex, e.target.value)
          }
        />
        {question?.answers.map((answer, answerIndex: number) => (
          <div className="mt-6 flex flex-col gap-3 px-2" key={answerIndex}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CircleCheck
                  className={answer.isCorrect ? "text-green-400" : ""}
                  onClick={() =>
                    handleSelect(questionIndex, answerIndex, "select")
                  }
                />
                <input
                  placeholder={`Option ${answerIndex + 1}`}
                  className="border-0"
                  value={answer.text}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInput(questionIndex, answerIndex, e.target.value)
                  }
                />
              </div>
              <Trash2 />
            </div>
            <div className="flex items-center justify-between">
              <div className="ml-10 h-4 w-[92%] rounded-md bg-[#E5E5E5]"></div>
              <div className="ml-2">0 %</div>
            </div>
          </div>
        ))}
        <button
          onClick={addNewQuestion}
          className="my-4 flex w-full justify-start rounded-md border-2 border-white p-2 hover:border-gray-400"
        >
          + Add another quiz question
        </button>
      </div>
    </div>
  );
};

export default PollsComponent;
