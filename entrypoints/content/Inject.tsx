import React, { useState, useRef, useEffect } from 'react';
import { FaMagic } from "react-icons/fa";
import "../main.css";
import { BiDownArrowAlt, BiSend } from 'react-icons/bi';
import { RxReload } from 'react-icons/rx';

const Inject: React.FC = () => {
  const [modal, setModal] = useState(false);
  const [value, setValue] = useState("");
  const [isRegenerate, setIsRegenerate] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  function handleModal() {
    setModal(true);
  }

  function GenerateText() {
    setValue("Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.");
  }

  function handleInsert() {
    const textarea = document.querySelector('div[role="textbox"]') as HTMLDivElement | null;

    if (textarea) {
      const existingParagraph = textarea.querySelector('p') as HTMLParagraphElement | null;

      if (value.trim() !== "") {
        if (existingParagraph) {
          existingParagraph.textContent += value;
        } else {
          const newParagraph = document.createElement('p');
          newParagraph.textContent = value;
          textarea.appendChild(newParagraph);
        }

        const emptyParagraph = textarea.querySelector('p:empty');
        if (emptyParagraph) {
          emptyParagraph.remove();
        }

        textarea.setAttribute('aria-label', '');
      } else {
        if (!existingParagraph) {
          const placeholderParagraph = document.createElement('p');
          placeholderParagraph.innerHTML = '<br>';
          textarea.appendChild(placeholderParagraph);
        }

        textarea.setAttribute('aria-label', 'Write a message…');
      }


      const breakElements = textarea.querySelectorAll('br');
      breakElements.forEach((br) => br.remove());
    } else {
      console.log('Textarea not found.');
    }

    setModal(false);
    setValue("");
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setModal(false);
      }
    }
    if (modal) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modal]);

  return (
    <div className='w-8/12'>
      <FaMagic onClick={handleModal} className='absolute bottom-5 right-2 text-4xl mr-4 my-2 bg-white cursor-pointer p-1 text-blue-500 rounded-full my-auto' />
      {modal && (
        <div className='fixed top-0 left-0 w-screen h-screen grid place-items-center z-50 bg-gray-500/50'>
          <div ref={modalRef}
            onMouseDown={(e) => e.stopPropagation()}
            className='w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 bg-white max-h-fit p-4 rounded-2xl grid place-items-end gap-6'>
            <textarea
              value={value}
              draggable={false}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Generate Text'
              className='outline-0 border-2 w-full bg-transparent p-2 text-gray-400 border-gray-200 resize-none h-24 md:h-32'
            ></textarea>
            <div className='flex flex-col sm:flex-row gap-4 sm:gap-6'>
              <button
                onClick={handleInsert}
                className='bg-gray-700 p-2 rounded-md flex items-center hover:bg-gray-800 text-white w-full sm:w-auto'
              >
                Insert <BiDownArrowAlt className='text-2xl ml-2' />
              </button>
              <button
                onClick={(e) => {
                  GenerateText()
                  setIsRegenerate(true)
                }}
                className={`p-2 rounded-md flex items-center ${isRegenerate ? 'bg-blue-500/50' : 'bg-blue-500'} hover:${isRegenerate ? 'bg-blue-800/50' : 'bg-blue-800'} text-white w-full sm:w-auto`}
              >
                {isRegenerate ? (
                  <div className='flex gap-2 items-center'>
                    <RxReload className='text-2xl ml-2' /> Regenerate 
                  </div>
                ) : (
                  <div className='flex gap-2 items-center'>
                    <BiSend className='text-2xl ml-2' /> Generate 
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inject;
