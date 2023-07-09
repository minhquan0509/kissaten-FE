import React, { useState } from 'react';

import './ratingstar.css'

const StarIcon = ({ filled }) => {
  return (
    <span style={{ color: filled ? '#fcba04' : 'gray'}}>
      {filled ? <i className="fa-solid fa-star"></i> : <i className="fa-regular fa-star"></i>}
    </span>
  );
};

const RatingStar = ({ value, onClick }) => {
  const [hoverValue, setHoverValue] = useState(0);

  const handleClick = (newValue) => {
    if (onClick) {
      onClick(newValue);
    }
    console.log(hoverValue);
  };

  const handleMouseEnter = (newValue) => {
    setHoverValue(newValue);
    
  };

  const handleMouseLeave = () => {
    setHoverValue(0);
  };

  return (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className="star"
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
        >
          <StarIcon filled={star <= (hoverValue || value)} />
        </span>
      ))}
    </div>
  );
};

export default RatingStar;
