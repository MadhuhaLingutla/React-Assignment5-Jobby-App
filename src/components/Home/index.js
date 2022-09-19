import {Link} from 'react-router-dom'

import Header from '../Header'

import './index.css'

const Home = () => (
  <div className="home-container">
    <Header />
    <div className="content-container">
      <h1 className="home-heading">Find The Job That Fits Your Life</h1>
      <p className="home-description">
        Millions of people are searching for jobs, salary information, company
        reviews. Find the job that fits your ability and potential.
      </p>
      <button className="home-button" type="button">
        <Link to="/jobs" className="link-item">
          Find Jobs
        </Link>
      </button>
    </div>
  </div>
)

export default Home
