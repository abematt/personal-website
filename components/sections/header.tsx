"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  return (
    <nav className="select-none bg-zinc-950 ">
      <div className="flex justify-between">
        <div className="flex items-center">
          <h1 className="text-lg font-bold">abrahammathew.dev</h1>
        </div>
      </div>
    </nav>
  );
}
