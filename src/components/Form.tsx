import React, { useState } from "react";
import axios from "axios";

// Example sub-components
import FormField from "./FormField";
import Button from "./Button";
import AgeSlider from "./AgeSlider/AgeSlider";
import { UploadPhoto } from "./UploadPhoto";
import Calendar from "./Calendar";

const SUBMIT_URL = "http://letsworkout.pl/submit";

interface FormDataType {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  date: string;
  time?: string;
}

export const Form: React.FC = () => {
  const [formData, setFormData] = useState<FormDataType>({
    firstName: "",
    lastName: "",
    email: "",
    age: 8,
    date: "",
    time: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAgeChange = (age: number) => {
    setFormData((prev) => ({ ...prev, age }));
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleDateChange = (date: string) => {
    setFormData((prev) => ({ ...prev, date }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.date ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.email
    ) {
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(
        key,
        (formData[key as keyof FormDataType] as string).toString()
      );
    });
    if (selectedFile) {
      data.append("photo", selectedFile);
    }

    try {
      await axios.post(SUBMIT_URL, data);
      alert("Application submitted!");
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const isFormValid =
    formData.firstName && formData.lastName && formData.email && formData.date;

  return (
    <div className="w-full my-8 rounded-lg">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-full mx-auto sm:w-[342px] lg:w-[426px]"
      >
        <h2 className="text-2xl font-medium mb-3">Personal info</h2>
        <FormField
          label="First Name"
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <FormField
          label="Last Name"
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <FormField
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <AgeSlider age={formData.age} onAgeChange={handleAgeChange} />
        <UploadPhoto onFileSelect={handleFileSelect} />
        <h2 className="text-2xl font-medium mb-3">Your workout</h2>
        <Calendar
          selectedDate={formData.date}
          onDateChange={handleDateChange}
        />
        <Button
          type="submit"
          disabled={!isFormValid}
          className={`${
            isFormValid ? "bg-[#761BE4] hover:bg-[#9747FF]" : "bg-[#CBB6E5]"
          } text-white py-2 px-4 rounded w-full transition-all duration-200 disabled:cursor-not-allowed`}
        >
          Send Application
        </Button>
      </form>
    </div>
  );
};
