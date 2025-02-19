import React from 'react';

interface AgeSliderProps {
age: number;
onAgeChange: (age: number) => void;

}

const AgeSlider: React.FC<AgeSliderProps> = ({age, onAgeChange}) => {
//   const [age, setAge] = useState<number>(8);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onAgeChange(Number(event.target.value));
  };

  return (
    <div>
      <label htmlFor="age" className="block text-sm font-medium text-gray-700">
        Age: {age}
      </label>
      <input
        type="range"
        id="age"
        name="age"
        min="8"
        max="100"
        value={age}
        onChange={handleChange}
        className="mt-1 w-full"
      />
    </div>
  );
};

export default AgeSlider;