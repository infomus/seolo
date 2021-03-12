import React from "react";


function Content({ title, description }) {
  return (
    <>
    <div className="home__content">
      <div className="home__header">{title}</div>
      <div className="home__paragraph">{description}</div>
    </div>
      <hr className = 'home__horizontal' />
    </>
  );
}

export default Content;


