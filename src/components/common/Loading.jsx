import React from 'react';

const Loading = ({ message = 'Loading...', fullPage = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 animate-fade-in">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
      <p className="text-text-secondary font-medium">{message}</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-bg-primary/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;
