import { useEffect, useState } from "react";

const StarRating = ({ stars, onChange }) => {
  const [activeRating, setActiveRating] = useState(stars);
  const [click, setClick] = useState(false);

  useEffect(() => {
    setActiveRating(stars);
  }, [stars]);

  return (
    <>
      <div className="rating-input">
        {[1, 2, 3, 4, 5].map((starOrder) => (
          <div
            key={starOrder}
            className={activeRating >= starOrder ? "filled" : "empty"}
            onMouseEnter={() => {
              if (!click) setActiveRating(starOrder);
            }}
            onMouseLeave={() => {
              if (!click) setActiveRating(activeRating);
            }}
            onClick={() => {
              onChange(starOrder);
              setClick(true);
            }}
          >
            <i className="fa fa-star"></i>{" "}
          </div>
        ))}
        Stars
      </div>
    </>
  );
};

export default StarRating;
