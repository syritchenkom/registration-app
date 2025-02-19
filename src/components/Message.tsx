import React from 'react';

interface MessageProps {
  text: string;
}

const Message: React.FC<MessageProps> = ({ text }) => (
  <p className="text-blue-600">{text}</p>
);

export default Message;