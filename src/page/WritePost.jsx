import React, { useEffect } from "react";
import EditorBlock from "../components/EditorBlock";

export default function WritePost() {


  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = () => {
    const toolbar = document.querySelector('.ql-toolbar');
    const toolbarHeight = toolbar.getBoundingClientRect().top;
    window.scrollY > toolbarHeight  ? toolbar.classList.add('fixed', "top-[3.56rem]", "left-0", "w-full", "h-fit", "z-[100]") : toolbar.classList.remove('fixed', "top-[3.56rem]", "left-0", "w-full", "h-fit", "z-[100]");
  };

  return (
    <section className="w-11/12 my-0 mx-auto min-h-screen">
      <EditorBlock />
    </section>
  );
}
