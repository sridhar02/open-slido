"use client";

import { Plus, ListFilter, Calendar, EllipsisVertical } from "lucide-react";
import Button from "../_components/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Page() {
  const router = useRouter();

  const [showModel, setShowModel] = useState(false);
  const [slidoName, setSlidoName] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const events = api.slido.getAllSlidos.useQuery();
  const { data: eventsData } = events;

  const createSlido = api.slido.createSlido.useMutation({
    onSuccess: async (data) => {
      setSlidoName("");
      setStartDate(new Date());
      setEndDate(new Date());
      router.push(`/event/${data.id}`);
    },
  });

  const handleSubmit = () => {
    if (startDate && endDate) {
      createSlido.mutate({
        title: slidoName,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
    }
  };

  const formatDateRange = (start: Date, end: Date) => {
    const startDateFormatted = format(new Date(start), "d");
    const endDateFormatted = format(new Date(end), "d MMM yyyy");
    return `${startDateFormatted} – ${endDateFormatted}`;
  };

  return (
    <div className="w-full p-4 px-8">
      <div className="flex w-full justify-between">
        <div>Active</div>
        <div className="flex items-center gap-6">
          <div>
            <ListFilter />
          </div>
          <Dialog open={showModel} onOpenChange={setShowModel}>
            <DialogTrigger asChild>
              <Button onClick={() => setShowModel(true)}>
                <Plus /> Create Slido
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[1000px]">
              <DialogHeader>
                <DialogTitle>When do you want to use this Slido?</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col  space-x-2">
                <div className="grid flex-1 gap-2">
                  <h3> Give your Slido a name</h3>
                  <Label htmlFor="link" className="sr-only">
                    Link
                  </Label>
                  <Input
                    id="link"
                    defaultValue=""
                    value={slidoName}
                    onChange={(e) => setSlidoName(e.target.value)}
                    className="w-4/5"
                  />
                </div>
                <div className="mt-2 flex justify-between">
                  <div className="flex flex-col gap-2">
                    <p>Start Data</p>
                    <DatePicker
                      selected={startDate}
                      onChange={(date: Date | null) => setStartDate(date)}
                      className="w-3/5 rounded-md border border-gray-300 p-2"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p>End Data</p>
                    <DatePicker
                      selected={endDate}
                      onChange={(date: Date | null) => setEndDate(date)}
                      className="w-3/5 rounded-md border border-gray-300 p-2"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter className="sm:justify-start">
                <div className="rounded-sm bg-blue-400 p-2 text-sm">
                  Anyone with the code or link can participate
                </div>
                <Button onClick={() => setShowModel(false)}>Close</Button>
                <DialogClose asChild>
                  <Button onClick={handleSubmit}>Create Slido</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="my-4 rounded-sm p-2">
        {eventsData?.map((event) => (
          <Link key={event.id} href={`/event/${event.id}`}>
            <div className="my-2 flex justify-between rounded-md border-2 p-2 py-4">
              <div className="flex items-center gap-3">
                <Calendar className="mr-2" />
                <div>
                  <div className="flex items-center">
                    <h3 className="mr-4 font-bold">{event.title}</h3>{" "}
                    <span className="text-gray-400">#{event.joinCode}</span>
                  </div>
                  <p>{formatDateRange(event.startDate, event.endDate)}</p>
                </div>
              </div>
              <div>
                <EllipsisVertical />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
