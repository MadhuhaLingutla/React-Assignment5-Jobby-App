import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <ul className="nav-container">
      <li className="nav-item">
        <Link className="link-item" to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="header-website logo"
            className="home-website-logo-image"
          />
        </Link>
      </li>
      <li className="nav-item">
        <div className="home-jobs-container">
          <Link to="/" className="link-item">
            <p className="field-item">Home</p>
          </Link>
          <Link className="link-item" to="/jobs">
            <p className="field-item">Jobs</p>
          </Link>
        </div>
      </li>
      <li className="nav-item">
        <button className="logout-button" type="button" onClick={onClickLogout}>
          Logout
        </button>
      </li>
    </ul>
  )
}

export default withRouter(Header)
