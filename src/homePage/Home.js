import React from "react";
import "./styles/home.css";
import Tilt from "react-tilt";
import { Link } from "react-router-dom";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import * as ROUTES from "../constants/routes";


import ParticlesBg from 'particles-bg'

class Home extends React.Component {
  render() {

    
    return (
      <>
        <div className="home">
          <div className="home__content">
            <div className="home__header home__header__home">Journal <b>privately</b> and securely on Journaly</div>
            <div className="home__paragraph">
              Journaling should be secure and easy. With Journaly, you can
              express yourself freely without the added stress of having someone
              accidently read your work.
            </div>
            <Link to={ROUTES.LEARN}>
              <div className="learn">
                Learn more
                <ChevronRightIcon />
              </div>
            </Link>
          </div>
        </div>
        <ParticlesBg type="circle"  bg={true} />
      </>
    );
  }
}

export default Home;
