import React from "react";
import { Link } from "react-router-dom";

import * as ROUTES from "../constants/routes";
import Content from "./components/content";

import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import ParticlesBg from "particles-bg";
import './learnMore.css'

class LearnMore extends React.Component {
  render() {
    let config = {
      num: [4, 7],
      rps: 0.6,
      radius: [25, 40],
      life: [1.5, 3],
      v: [2, 3],
      tha: [-40, 40],
      // body: "./img/icon.png", // Whether to render pictures
      // rotate: [0, 20],
      alpha: [0.6, 0],
      scale: [1, 0.1],
      position: "center", // all or center or {x:1,y:1,width:100,height:100}
      color: ["random", "#ff0000"],
      cross: "dead", // cross or bround
      random: 15, // or null,
      g: 5, // gravity
      // f: [2, -1], // force
      onParticleUpdate: (ctx, particle) => {
        ctx.beginPath();
        ctx.rect(
          particle.p.x,
          particle.p.y,
          particle.radius * 2,
          particle.radius * 2
        );
        ctx.fillStyle = particle.color;
        ctx.fill();
        ctx.closePath();
      },
    };

    return (
      <>
        <div className = 'learnMore__container'>
          <div className="home">
            <Content
              title="Why journal on Journaly?"
              description="Journaly is a brand new platform for those who want to
            journal. The added securtiy features within Journaly
            is what sets us apart."
            />

            <Content
              title="Authentication & Protection"
              description="Privacy and protection is a vital aspect in every business. Journaly has a two-step authentication process to secure your work behind steel doors. All your writing is hidden away and only you can access it. Even if you forgot to log out, an additional log in is required to get to your journals."
            />

            <Content
              title="Generate a question to inspire your writing"
              description="No idea what to write about? No problem. Use Journaly’s prompt generator to generate a question and inspire your mind."
            />

            <Content
              title="Track your journey on your dashboard"
              description="Journaly’s dashboard showcases all of your journals you have written neatly and elegantly. With a high level view on your dashboard, it is easy to keep track of your journals. "
            />
          </div>

          <div>

            <Link exact to="/Signup">
              <div className="learn">
                See You Inside
                <ChevronRightIcon />
              </div>
            </Link>
          </div>
        </div>

        {/* <ParticlesBg type="custom" config={config} bg={true} /> */}
      </>
    );
  }
}

export default LearnMore;

{
  /* <Link to={ROUTES.LEARN}>
<div className="learn">
  Learn more
  <ChevronRightIcon />
</div>
</Link> */
}
