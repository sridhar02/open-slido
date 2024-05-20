"use client";
import { Plus, ListFilter } from "lucide-react";
import Button from "../_components/Button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useState } from "react";

export default function Page() {
  const [showModel, setShowModel] = useState(false);

  return (
    <div className="w-full p-4 px-8">
      <div className="flex w-full justify-between">
        <div>Active</div>
        <div className="flex items-center gap-6">
          <div>
            <ListFilter />
          </div>
          <Dialog open={showModel}>
            <DialogTrigger asChild>
              <Button onClick={() => setShowModel(true)}>
                <Plus /> Create Slido
              </Button>
            </DialogTrigger>
            <DialogContent className="">
              <DialogHeader>
                <DialogTitle>When do you want to use this Slido?</DialogTitle>
              </DialogHeader>
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <h3> Give your Slido a name</h3>
                  <Label htmlFor="link" className="sr-only">
                    Link
                  </Label>
                  <Input id="link" defaultValue="" readOnly />
                </div>
              </div>
              <DialogFooter className="sm:justify-start">
                <div className="rounded-sm bg-blue-400 p-2 text-sm">
                  Anyone with the code or link can participate
                </div>
                <Button type="button" variant="secondary">
                  Close
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Create Slido
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="my-4 rounded-sm border-2 p-2"></div>
    </div>
  );
}
