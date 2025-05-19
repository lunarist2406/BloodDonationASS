import React from "react";
import GuestHeader from "../header/Header";
import GuestFooter from "../footer/GuestFooter";
import { IconMessage } from "@tabler/icons-react";
import { experiences } from "./experienceData";

export default function BloodExperience() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex flex-col">
      <GuestHeader />
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h1 className="text-3xl font-bold text-red-700 flex items-center justify-center gap-2 mb-2">
            <IconMessage size={32} className="text-red-700" />
            Chia sẻ kinh nghiệm
          </h1>
          <p className="text-gray-700 text-lg">
            Những câu chuyện, bí quyết và trải nghiệm thực tế từ cộng đồng hiến máu.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {experiences.map(exp => (
            <div
              key={exp.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 flex flex-col"
            >
              <h2 className="text-xl font-bold text-red-800 mb-1">{exp.title}</h2>
              <p className="text-gray-500 text-sm mb-2">
                {/* {exp.author} &nbsp;|&nbsp; {exp.date} */}
              </p>
              <p className="text-gray-700 flex-1 mb-2">{exp.content}</p>
            </div>
          ))}
        </div>
      </div>
      <GuestFooter />
    </div>
  );
}
