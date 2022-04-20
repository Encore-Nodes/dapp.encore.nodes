import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "../Buttons";
import { Sun, Moon, Home, Twitter, Discord, GitBook, Key } from "../Icons";
import NavItem from "./NavItem";

const NavBar: React.FC<{ onConnect: any; isConnected: boolean }> = (props) => {
  const [mounted, setMounted] = useState(false);
  const { systemTheme, theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const currentTheme = theme === "system" ? systemTheme : theme;

    if (!mounted)
      return (
        <div title="Theme switch" onClick={() => setTheme("light")} className="hover:cursor-pointer">
          <Sun />
        </div>
      );

    if (currentTheme === "dark") {
      return (
        <div title="Theme switch" onClick={() => setTheme("light")} className="hover:cursor-pointer">
          <Sun />
        </div>
      );
    } else {
      return (
        <div title="Theme switch" onClick={() => setTheme("dark")} className="mb-1 hover:cursor-pointer">
          <Moon />
        </div>
      );
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="flex justify-center md:justify-between items-center flex-col md:flex-row">
      <div className="flex items-center space-x-8">
        <div className="relative h-12 w-20">
          <Image
            src="/core-logo-final-version.png"
            alt="Core Nodes claim rewards"
            layout="fill"
            objectFit="contain"
            objectPosition={"left"}
          />
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold">Dashboard</h1>
      </div>

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-10 text-slate-400 dark:text-[#62596D] items-center justify-center mt-6 md:mt-0">
        <div className="flex space-x-6 items-center">
          <NavItem title="Website" href="https://core-nodes.online/" icon={<Home />} />
          <NavItem title="Twitter" href="https://twitter.com/EncoreNodes" icon={<Twitter />} newTab={true} />

          <NavItem title="Discord" href="http://discord.gg/ybENpXGctB" icon={<Discord />} newTab={true} />

          <NavItem
            title="Gitbook"
            href="https://core-nodes.gitbook.io/core-nodes/fwpsUeT7w2uhzuaFgwa6/protocol-information/background"
            icon={<GitBook />}
            newTab={true}
          />
          {toggleTheme()}
        </div>
        <div className="text-white">
          {props.isConnected ? (
            <Button primary text="Connected" icon={<Key />} disabled={true} />
          ) : (
            <Button primary text="Connect Wallet" icon={<Key />} onHandleClick={props.onConnect} />
          )}
        </div>
      </div>
    </nav>
  );
};
export default NavBar;
