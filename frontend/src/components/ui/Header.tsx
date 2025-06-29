import React from "react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => (
  <header className="flex items-center justify-between -mt-12 font-germania px-12 py-4 bg-transparent relative z-10">
    <div className="flex items-center gap-3">
      <img src={logo} alt="HuddMeet Logo" width={40} height={40} />
      <span className="text-2xl tracking-wide">HuddMeet</span>
    </div>
    <div className="flex gap-4">
      <Button color="primary" size="lg" className="transition-all duration-200">
        Register
      </Button>
      <Button color="grey" size="lg" className="transition-all duration-200">
        Login
      </Button>
    </div>
  </header>
);

export default Header;
