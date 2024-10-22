"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Navbar() {
  const link = `https://drive.google.com/uc?export=download&id=1xZub7bbE27EY-3VFCXyOJZEZttnCSo2w`;
  return (
    <nav className="select-none bg-zinc-950 ">
      <div className="flex justify-between">
        <div className="flex items-center">
          <h1 className="text-lg font-bold">abrahammathew.dev</h1>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <a href={link} download="MyExampleDoc" target="_blank">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download Resume</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </nav>
  );
}
