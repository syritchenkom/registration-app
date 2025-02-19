// components/Form.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import FormField from './FormField';
import Button from './Button';
import Message from './Message';
import AgeSlider from './AgeSlider';

const API_URL = 'https://api.api-ninjas.com/v1/holidays';
const API_KEY = '8DX8eEe67njS1lbThFsdSw==rQQNpQ8PYbPZBjrx';
const SUBMIT_URL = 'http://letsworkout.pl/submit';

interface HolidayType {
    date: string;
    type: string;
    name: string;
}

interface FormDataType {
  [key: string]: string | number;
  name: string;
  email: string;
  date: string;
  age: number;
}

export const Form: React.FC = () => {
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    date: "",
    age: 8,
  });
  const [holidays, setHolidays] = useState<HolidayType[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios
      .get(API_URL, {
        params: { country: 'PL', year: 2024 },
        headers: { 'X-Api-Key': API_KEY },
      })
      .then((res) => setHolidays(res.data))
      .catch((err) => console.error('Error fetching holidays:', err));
  }, []);

  const isDateDisabled = (date: string) => {

    const parsedDate = new Date(date);
    if(isNaN(parsedDate.getTime())) {
        return false;
    }
    const formattedDate = format(parsedDate, 'yyyy-MM-dd');
    const holiday = holidays.find((h) => h.date === formattedDate);
    return (
      holiday?.type === 'NATIONAL_HOLIDAY' || new Date(date).getDay() === 0
    );
  };

  const handleAgeChange = (age: number) => {
    setFormData((prevData) => ({ ...prevData, age }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData((prevData) =>({...prevData, [name]: value}));

    // setFormData({ ...formData, [name]: value });
    // if (name === 'date') {
    //     const parsedDate = new Date(value);
    //     if(isNaN(parsedDate.getTime())) {
    //       const holiday = holidays.find((h) => h.date === value);
    //       setMessage(holiday?.type === 'OBSERVANCE' ? `Info: ${holiday.name}` : '');
            
    //     }
    // }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
        data.append(key, formData[key].toString());
      });
    try {
      await axios.post(SUBMIT_URL, data);
      alert('Application submitted!');
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-black">Personal info</h2>
      <form onSubmit={handleSubmit} className="space-y-4 text-black">
        <FormField
          label="First Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <FormField
          label="Last Name"
          type="text"
          name="name"
          value={formData.name}
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
        <AgeSlider age={formData.age} onAgeChange={handleAgeChange}/>
        <FormField
          label="Date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          disabled={isDateDisabled(formData.date)}
        />
        
        {message && <Message text={message} />}
        <Button type="submit">Send Application</Button>
      </form>
    </div>
  );
};