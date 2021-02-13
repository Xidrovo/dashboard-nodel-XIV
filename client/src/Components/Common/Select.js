import React, { useState } from 'react';

const Options = (props) => {
  const handleSelected = (option) => {
    props.changeValue(option);
    props.setCurrentValue(option.label);
  };

  return (
    <div className={`rounded-md bg-white absolute z-50  shadow-md w-full`}>
      {props.options.map((option) => {
        return (
          <div
            className="text-gray-400 font-semibold flex cursor-pointer hover:bg-blue-400 hover:text-white px-4 rounded-md py-2"
            key={option.value}
            onClick={() => handleSelected(option)}
          >
            {option.label}
          </div>
        );
      })}
    </div>
  );
};

const Select = (props) => {
  const [show, setShow] = useState(false);
  const [currentValue, setCurrentValue] = useState('');

  return (
    <div
      className={`rounded-md bg-white py-2 relative ${props.className} `}
      onClick={() => {
        setShow(!show);
      }}
    >
      <div className="px-4 text-gray-400 font-semibold flex justify-between cursor-pointer">
        <div>{currentValue || props.placeholder || 'Haga su elección'}</div>
        <div className="rotate-down"> {'>'} </div>
      </div>
      {show && (
        <Options
          options={props.options}
          setCurrentValue={setCurrentValue}
          changeValue={props.changeValue}
        />
      )}
    </div>
  );
};

export default Select;
