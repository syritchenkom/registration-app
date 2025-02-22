import React from 'react';

interface AgeSliderProps {
  age: number;
  onAgeChange: (age: number) => void;
}

const AgeSlider: React.FC<AgeSliderProps> = ({ age, onAgeChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onAgeChange(Number(event.target.value));
  };

  const getOffset = (value: number) => {
    const minOffset = -11; // offset at min value (8)
    const maxOffset = -25; // offset at max value (100)
    const progress = (value - 8) / (100 - 8); // normalize values in the range [0,1]
    return minOffset + progress * (maxOffset - minOffset);
  };

  return (
    <div className="relative w-full flex items-start flex-col mb-12">
        {/* Label */}
      <label htmlFor="age" className="block text-base">
        Age
      </label>

     {/* Min/Max labels */}
      <div className="flex justify-between w-full text-xs font-normal">
        <span className="ml-1">8</span>
        <span>100</span>
      </div>

      {/* Slider */}
      <div className="relative w-full">
        <input
          type="range"
          id="age"
          name="age"
          min="8"
          max="100"
          value={age}
          onChange={handleChange}
          className="w-full appearance-none h-1 rounded-lg focus:outline-none"
          style={{
            WebkitAppearance: 'none',
            appearance: 'none',
            position: 'relative',
            zIndex: 1,
            background: `linear-gradient(to right, #761BE4 0%, #761BE4 ${(age - 8) / (100 - 8) * 100}%, #CBB6E5 ${(age - 8) / (100 - 8) * 100}%, #CBB6E5 100%)`,
            borderRadius: '8px',
          }}
        />

        {/* SVG indicator under the thumb */}
        <div
          className="absolute -bottom-8 transition-all duration-200"
          style={{
            left: `calc(${((age - 8) / (100 - 8)) * 100}% + ${getOffset(age)}px)`, // Динамічне зміщення
          }}
        >
          <svg width="37" height="31" viewBox="0 0 37 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M22.3971 6L18.5 0L14.6029 6H4C1.79086 6 0 7.79086 0 10V27C0 29.2091 1.79086 31 4 31H33C35.2091 31 37 29.2091 37 27V10C37 7.79086 35.2091 6 33 6H22.3971Z"
              fill="#FAF9FA"
              stroke="#CBB6E5"
            />
            <text x="50%" y="70%" fontSize="12" fill="#761BE4" textAnchor="middle" fontWeight="500">
              {age}
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AgeSlider;