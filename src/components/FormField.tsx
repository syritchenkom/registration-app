import React, { useState } from "react";

interface FormFieldProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type,
  name,
  value,
  onChange,
  required = false,
  disabled = false,
}) => {
  const [error, setError] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleBlur = () => {
    if (name === "email") {
      setError(!validateEmail(value));
    }
  };

  return (
    <div>
      <label className="block text-base font-normal text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        required={required}
        disabled={disabled}
        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
          error
            ? "border-[#ED4545] border-2 bg-[#FEECEC] focus:border-red-500"
            : "border-[#CBB6E5] bg-white focus:border-[#761BE4] focus:border-2"
        }`}
      />
      {error ? (
        <p className="flex text-black text-sm mt-1">
          <span className="h-4 w-4 mr-1 mt-1 flex justify-center items-center bg-red-500 text-white rounded-full">
            !
          </span>
          Please use correct formatting. <br /> Example: address@email.com
        </p>
      ) : null}
    </div>
  );
};

export default FormField;
