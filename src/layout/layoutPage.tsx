import ChatBot from "../components/chatbot/ChatBot";
import GuestFooter from "../components/guest/footer/GuestFooter";
import GuestHeader from "../components/guest/header/Header";

import { Outlet } from "react-router-dom";

export default function LayoutPage() {
  return (
    <div>
      <GuestHeader />
      <main>
        <Outlet />
      </main>
      <GuestFooter />
      <ChatBot />
    </div>
  );
}
