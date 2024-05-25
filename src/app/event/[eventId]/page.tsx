"use client";

import { Trophy, MessageSquareMore, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import isArray from "lodash/isArray";
import isEmpty from "lodash/isEmpty";

import { Input } from "~/components/ui/input";
import PollsComponent from "./PollsComponent";
import EventLayout from "~/app/_components/EventLayout";

import { api } from "~/trpc/react";
import { Question } from "./types";
import Interactions from "~/app/_components/Interactions";

const defaultQuestion: Question[] = [
  {
    text: "",
    answers: [
      {
        text: "",
        isCorrect: false,
      },
      {
        text: "",
        isCorrect: false,
      },
    ],
  },
];

export default function Page({ params }: { params: { eventId: string } }) {
  const eventId = params.eventId;
  const event = api.slido.getSlido.useQuery({ id: eventId });
  const polls = api.poll.getAll.useQuery(
    { slidoId: eventId },
    { enabled: !!event },
  );

  const { data: eventData, isLoading } = event;
  const { data: pollsData } = polls;
  const currentPoll = pollsData?.[0];
  const pollId = currentPoll?.id;

  const questionsResponse = api.question.getQuestions.useQuery(
    {
      pollId: pollId,
    },
    {
      //@ts-expect-error currentPoll can be string or undefined
      enabled: currentPoll?.id && !!pollId,
    },
  );

  const questionsData = questionsResponse && questionsResponse?.data;
  const isQuestionsLoading = questionsResponse && questionsResponse?.isLoading;

  const [quizName, setQuizName] = useState("");
  const [showQuestion, setShowQuestion] = useState(false);
  const [showInteractions, setShowInteractions] = useState(false);
  const [questions, setQuestions] = useState<Question[] | undefined>();
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);

  const createPoll = api.poll.createPoll.useMutation({
    onSuccess: (data) => {
      console.log(data);
      if (questions) {
        setQuestions([...questions, ...defaultQuestion]);
      }
    },
  });

  useEffect(() => {
    if (questionsData) {
      setQuestions(questionsData);
    }
  }, [questionsData]);

  const handleOptionChange = (questionId: number, value: string) => {
    const updatedQuestions = questions?.map((ques, index) => {
      if (index === questionId) {
        return {
          ...ques,
          text: value,
        };
      }
      return ques;
    });
    setQuestions(updatedQuestions);
  };

  const handleSelect = (questionId: number, answerId: number, type: string) => {
    const updatedQuestions = questions?.map((ques, index) => {
      if (questionId === index) {
        return {
          ...ques,
          answers: ques.answers.map((ans, ansIndex) =>
            answerId === ansIndex
              ? {
                  ...ans,
                  isCorrect: type === "select" ? !ans.isCorrect : ans.isCorrect,
                }
              : ans,
          ),
        };
      }
      return ques;
    });

    setQuestions(updatedQuestions);
    if (updatedQuestions) {
      createPoll.mutate({
        title: quizName,
        slidoId: eventId,
        questions: updatedQuestions,
        pollId,
      });
    }
  };

  const handleInput = (
    questionId: number,
    answerId: number,
    value: string,
  ): void => {
    const updatedQuestions = questions?.map((ques, index) => {
      if (questionId === index) {
        return {
          ...ques,
          answers: ques.answers.map((ans, ansIndex) =>
            answerId === ansIndex
              ? {
                  ...ans,
                  text: value ? value : ans.text,
                }
              : ans,
          ),
        };
      }
      return ques;
    });

    setQuestions(updatedQuestions);
  };

  const addNewQuestion = () => {
    if (questions && questions.length > 0) {
      setShowQuestion(true);
      setQuestions([...questions, ...defaultQuestion]);
      if (questions.length === 0) {
        setSelectedQuestionIndex(0);
      } else {
        setSelectedQuestionIndex(questions.length);
      }
    } else {
      setQuestions([...defaultQuestion]);
    }
  };

  const handleFirstQuestion = () => {
    setQuestions([...defaultQuestion]);
    setShowQuestion(true);
  };

  console.log({
    currentPoll,
    questionsData,
    pollsData,
    questions,
    setSelectedQuestionIndex,
  });

  const isLoadingState = isLoading || isQuestionsLoading;
  const isQuizEmpty = !isLoadingState && isEmpty(questions);

  return (
    <EventLayout title={eventData?.title}>
      <div className="m-8 flex w-[95%] rounded-md border-2 bg-white p-2">
        <div className="h-full w-full p-4">
          {/* <Interactions setShowInteractions={setShowInteractions} /> */}
          {isLoadingState && <div>Loading ...</div>}
          {isQuizEmpty && (
            <>
              <Input
                className=""
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)}
                placeholder="Quiz Name"
              />
              <div className="flex h-full flex-col items-center justify-center">
                <p>Quiz is empty</p>
                <button
                  className="mt-16 flex h-10 gap-2 rounded-md bg-green-400 p-2 text-white"
                  onClick={() => handleFirstQuestion()}
                >
                  + Add first question
                </button>
              </div>
            </>
          )}
          {questions && currentPoll && !showQuestion && (
            <div className="">
              <h1 className="py-2 text-lg font-semibold">
                {currentPoll?.title}
              </h1>
              {questions.map((ques, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedQuestionIndex(index)}
                  className="hover: rounded-md border-2 border-white p-3 py-2 hover:border-gray-400"
                >
                  <div className="flex items-center gap-4">
                    <p className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-400 p-2">
                      {index + 1}
                    </p>
                    <div className="flex flex-col">
                      <p className="text-sm">Quiz question</p>
                      <p className="text-sm">0 votes 20 sec</p>
                    </div>
                  </div>
                  <p className="py-2">{ques.text}</p>
                </div>
              ))}
              <button
                onClick={addNewQuestion}
                className="my-4 flex w-full justify-start rounded-md border-2 border-white p-2 hover:border-gray-400"
              >
                + Add another quiz question
              </button>
            </div>
          )}
          {!isEmpty(questions) && showQuestion && (
            <>
              <PollsComponent
                questions={questions}
                handleSelect={handleSelect}
                handleInput={handleInput}
                setShowQuestions={setShowQuestion}
                handleOptionChange={handleOptionChange}
                selectedQuestionIndex={selectedQuestionIndex}
                setSelectedQuestionIndex={setSelectedQuestionIndex}
                setQuestions={setQuestions}
              />
            </>
          )}

          <div>
            {/* <button className="my-4 flex w-full justify-start rounded-md p-2 hover:border-2">
              Add leaderboard
            </button> */}
          </div>
        </div>
      </div>
    </EventLayout>
  );
}
