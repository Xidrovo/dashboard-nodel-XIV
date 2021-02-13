import React from 'react';
import isEmpty from 'lodash/isEmpty';

const TopMetrics = (props) => {
  return (
    <div className="w-full md:w-1/3 ">
      <div className="m-1 p-4 rounded-md shadow-sm bg-white">
        <div className="px-2 font-bold text-base py-2 text-gray-500">
          Top {props.number} {props.title}
        </div>
        {isEmpty(props.values) ? (
          <div className="flex justify-center px-2 pt-2 text-gray-500 font-lg text-base h-12">
            <div>No hay valor por mostrar</div>
          </div>
        ) : (
          props.values.map((value, index) => {
            return (
              <div
                className="flex justify-between px-2 text-gray-500 font-medium text-base"
                key={`${index}-${props.valueKey}`}
              >
                <div>{value[props.labelKey]}</div>
                <div>{value[props.valueKey]}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TopMetrics;
