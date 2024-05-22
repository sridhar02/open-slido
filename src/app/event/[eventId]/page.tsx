"use client";

import {
  Trophy,
  MessageSquareMore,
  ChevronDown,
  Settings,
  CircleCheck,
  Trash2,
  MoveLeft,
} from "lucide-react";
import { useState } from "react";
import EventLayout from "~/app/_components/EventLayout";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

export default function Page({ params }: { params: { eventId: string } }) {
  const [quizName, setQuizName] = useState("");
  const [showQuestions, setShowQuestions] = useState(false);
  const [showInteractions, setShowInteractions] = useState(false);

  const event = api.slido.getSlido.useQuery({ id: params.eventId });

  const { data: eventData, isLoading } = event;

  if (isLoading) return null;

  return (
    <EventLayout title={eventData?.title}>
      <div className="flex w-full">
        <div className="flex h-[700px] w-[480px] w-full flex-col gap-4 border-r-2 bg-[#fbfbfb] p-4 px-8">
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
        <div className="m-8  w-full rounded-md border-2 bg-white p-2">
          {!showInteractions ? (
            <>
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
            </>
          ) : (
            <div className="h-full p-4">
              {!showQuestions ? (
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
                      onClick={() => setShowQuestions(true)}
                    >
                      + Add first question
                    </button>
                  </div>
                </>
              ) : (
                <div>
                  <div
                    className="ml-2 flex cursor-pointer gap-2"
                    onClick={() => setShowQuestions(false)}
                  >
                    <MoveLeft /> Back to all questions
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <p className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-600 p-4">
                          1
                        </p>
                        <div className="flex flex-col">
                          <p>Quiz question</p>
                          <div className="flex gap-2">
                            <p>0 votes</p> <p>20 sec</p>
                          </div>
                        </div>
                      </div>{" "}
                      <div className="flex gap-3">
                        <p>random Ques</p>
                        <p>Poll Settings</p>
                        <Settings />
                      </div>
                    </div>
                    <Input
                      placeholder="What would  you like to ask?"
                      className="my-4"
                    />
                    <div className="mt-6 flex flex-col gap-3 px-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <CircleCheck />
                          <input placeholder="Option 1" className="border-0" />
                        </div>
                        <Trash2 />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="ml-10 h-4 w-[92%] rounded-md bg-[#E5E5E5]"></div>
                        <div className="ml-2">0%</div>
                      </div>
                    </div>
                    <div className="mt-8 flex flex-col gap-3 px-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <CircleCheck />
                          <input placeholder="Option 2" className="border-0" />
                        </div>
                        <Trash2 />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="ml-10 h-4 w-[92%] rounded-md bg-[#E5E5E5]"></div>
                        <div className="ml-2">0%</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </EventLayout>
  );
}
