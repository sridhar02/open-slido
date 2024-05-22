import { BarChart2, Settings, TrendingUp, MoveLeft } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";
import React from "react";

const sidebarItems = [
  { name: "Interactions", icon: <BarChart2 /> },
  { name: "Analytics", icon: <TrendingUp /> },
  { name: "Settings", icon: <Settings /> },
];

type ownProps = {
  children: any;
  title: string;
};

const EventLayout = (props: ownProps) => {
  const { children, title } = props;
  return (
    <div className="flex h-screen w-full flex-col">
      <div className="flex w-full items-center  border-b-2 p-2">
        <Link href="/app">
          <MoveLeft className="h-10 w-10 rounded-full bg-gray-200 p-2" />
        </Link>
        <h1>{title}</h1>
        <div className="mr-4 flex items-center gap-2">
          {/* <div>
            <input type="text" placeholder="search" />
          </div> */}
          <div className="text-sm">What's new</div>
          <div className="rounded-full bg-green-300 p-2 text-sm"> </div>
        </div>
      </div>
      <div className="flex h-full w-full">
        <div id="sidebar" className="w-[100px] border-r-2">
          <ul className="flex flex-col gap-4 p-6">
            {sidebarItems.map((item, index) => (
              <div
                key={index}
                className="mb-3 flex flex-col items-center justify-start gap-3"
              >
                {item.icon}
                <li>{item.name}</li>
              </div>
            ))}
          </ul>
        </div>
        <div className="w-full bg-[#f4f4f4]">{children}</div>
      </div>
    </div>
  );
};

export default EventLayout;
