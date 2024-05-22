import { Session } from "next-auth";
import Link from "next/link";
import React from "react";

const sidebarItems = [
  { name: "My Sliods", icon: "" },
  { name: "Team", icon: "" },
  { name: "Analytics", icon: "" },
  { name: "Tutorials", icon: "" },
  { name: "Integrations", icon: "" },
];

type ownProps = {
  children: React.ReactNode;
  session: Session | null;
};

const BasicLayout = (props: ownProps) => {
  const { children, session } = props;
  return (
    <div className="flex h-screen w-full flex-col">
      <nav className="flex w-full items-center justify-between border-b-2 p-2">
        <Link href="/app">
          <h1 className="pl-4 text-2xl">Open Slido</h1>
        </Link>
        <div className="mr-4 flex items-center gap-2">
          {/* <div>
            <input type="text" placeholder="search" />
          </div> */}
          <div className="text-sm">{"What's new"}</div>
          <div className="rounded-full bg-green-300 p-2 text-sm">
            {" "}
            {session && <span>{session.user?.name}</span>}
          </div>
          <Link
            href={session ? "/api/auth/signout" : "/api/auth/signin"}
            className="px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
          >
            {session ? "Sign out" : "Sign in"}
          </Link>
        </div>
      </nav>
      <div className="flex h-full w-full">
        <div id="sidebar" className="w-[240px] border-r-2">
          <ul className="flex flex-col gap-4 p-8">
            {sidebarItems.map((item, index) => (
              <li key={index}>{item.name}</li>
            ))}
          </ul>
        </div>
        <div className="w-full p-2 px-8">{children}</div>
      </div>
    </div>
  );
};

export default BasicLayout;
