import { useContext } from "react";
import { useEffect, useState } from "react";

import Image from "next/image";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsGithub } from "react-icons/bs";
import { AiFillLinkedin } from "react-icons/ai";

import { usePersistedState } from "@/hooks/usePersistedState";

import { ConfigModalFormContext } from "@/Contexts";

import { BaseButton } from "./button/BaseButton";

const selectOptions = [
  {
    value: 0,
    label: "-",
  },
  // {
  //   value: 5000,
  //   label: "5 sec - TESTING PURPOSES",
  // },
  {
    value: 300000,
    label: "5 minutes",
  },
  {
    value: 600000,
    label: "10 minutes",
  },
  {
    value: 900000,
    label: "15 minutes",
  },
];

export default function Navbar() {
  const configModalCtx = useContext(ConfigModalFormContext);

  const [toggleMenu, setToggleMenu] = useState(false);
  const [toggleConfigModal, setToggleConfigModal] = useState(false);
  const [toggleDarkMode, setToggleDarkMode] = usePersistedState('dark_mode');
  const [referencePrice, setReferencePrice] = useState('');

  const [timeUpdateInterval, setTimeUpdateInterval] = useState(0);

  function handleToggleMenu() {
    if (toggleMenu) setToggleMenu(false);
    else setToggleMenu(true);
  }

  function handleToggleMenuItem(event) {
    const valueNameAttr = event.target.name;

    if (valueNameAttr === "configuration") {
      setToggleConfigModal(true);
      setToggleMenu(false);
    }
  }

  /**
   * TODO: Move this to specific component in the future
   * @param {*} event
   */
  function handleSelectUpdateInterval(event) {
    const value = +event.target.value;

    setTimeUpdateInterval(value);
  }

  function saveConfigModal(e) {
    e.preventDefault();

    configModalCtx.configModalForm({
      timeUpdateInterval,
      referencePrice,
    });

    setToggleConfigModal(false);
  }

  /**
   * @todo
   * refactor
   * @component
   */
  const Modal = ({ title, children }) => {
    return (
      <div className="absolute top-[90px] inset-x-0 max-w-full z-10 flex justify-center duration-500 transition-all">
        <div className="w-10/12 bg-purple-900 text-neutral p-4 flex flex-col items-center">
          {/* modal-header */}
          <div>
            <h5>{title}</h5>
            <BaseButton onClick={() => setToggleConfigModal(false)}>Close</BaseButton>
          </div>
          {/* modal-body */}
          <div>{children}</div>
          {/* modal-footer */}
          <div></div>
        </div>
      </div>
    );
  };

  function handleToggleDarkMode(e) {
    setToggleDarkMode(e.target.checked);
  }

  function handleHitPriceInput(e) {
    setReferencePrice(e.target.value);
  }

  /**
   * @todo
   * refactor
   * @component
   */
  const ConfigModal = () => {
    return (
      <Modal title="Configuration">
        { referencePrice }

        <form onSubmit={saveConfigModal}>
          <div className="">
            {toggleDarkMode ?  <i>🔆</i> : <i>🌙</i>}
            
            <label htmlFor="">Dark theme</label>
            <input
              type="checkbox"
              className="bg-purple-800"
              onChange={handleToggleDarkMode}
              checked={toggleDarkMode}
            />
          </div>
          <div className="">
            <label htmlFor="">Sound alert when price is lower than</label>
            <input type="number" className="bg-purple-800" placeholder="0,00" value={referencePrice} onChange={handleHitPriceInput} />
          </div>
          <div className="">
            <label htmlFor="">Update interval</label>
            <select
              onChange={handleSelectUpdateInterval}
              className="bg-purple-800"
            >
              {selectOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <BaseButton type="submit">Save</BaseButton>
          <BaseButton type="reset">Reset</BaseButton>
        </form>
      </Modal>
    );
  };

  /**
   * @todo
   * refactor
   * @component
   */
  const Menu = ({ children, toggleMobileMenuFlag }) => {
    return (
      <>
        <div
          className={`${
            !toggleMobileMenuFlag ? "hidden" : ""
          } md:w-auto md:block absolute md:static top-[110px] md:top-0 inset-x-0 max-w-full z-50 md:z-0 flex justify-center duration-500 transition-all ease-in`}
        >
          {children}
        </div>

        <BaseButton onClick={handleToggleMenu} className="md:hidden p-3">
          {!toggleMenu ? (
            <GiHamburgerMenu size={36} className="text-purple" />
          ) : (
            <strong className="text-purple text-3xl">X</strong>
          )}
        </BaseButton>
      </>
    );
  };

  /**
   * @todo
   * refactor
   * @component
   */
  const MenuItem = ({ items }) => {
    return (
      <div className="md:w-full w-80 bg-purple-900 md:bg-transparent text-neutral p-4 md:p-0 flex md:flex-row flex-col items-center">
        {items.map((item, index) => {
          return (
            <a
              key={index}
              className="md:font-medium md:text-xl md:w-auto md:text-neutral md:p-2 pb-4 font-semibold text-lg cursor-pointer"
              name={item.name}
              onClick={item.onClick}
            >
              {item.label}
            </a>
          );
        })}
      </div>
    );
  };

  /**
   * @todo Should be moved to a utils file
   * @param {String} url 
   */
  function openNewBrowserTab(url) {
    window.open(url, '_blank');
  }

  useEffect(() => {
    if (toggleDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [toggleDarkMode]);

  return (
    <nav className="bg-purple-600 mb-12 dark:bg-gray">
      {toggleConfigModal && <ConfigModal />}
      <div className="flex flex-row items-center justify-between p-3">
        <Image src="/logo.png" alt="logo" width="160" height="160" />

        <div className="flex flex-row items-center">
          <Menu toggleMobileMenuFlag={toggleMenu}>
            <MenuItem
              items={[
                {
                  label: "Configuration",
                  name: "configuration",
                  onClick: handleToggleMenuItem,
                },
              ]}
            />
          </Menu>

          <div className="hidden md:flex p-4">
            <BsGithub size={25} className="text-neutral cursor-pointer" onClick={() => openNewBrowserTab(process.env.NEXT_PUBLIC_GITHUB_URL)} />
            <AiFillLinkedin size={25} className="text-neutral ml-3 cursor-pointer" onClick={() => openNewBrowserTab(process.env.NEXT_PUBLIC_LINKEDIN_URL)} />
          </div>
        </div>
      </div>
    </nav>
  );
}
