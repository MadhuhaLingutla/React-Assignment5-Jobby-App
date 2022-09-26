import './index.css'

const NotFound = () => (
  <div className="failure-view">
    <img
      src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
      alt="not found"
      className="failure-image"
    />
    <h1 className="failure-view-heading">Page Not Found</h1>
    <p className="failure-view-description">
      We're sorry, the page you requested could not be found.
    </p>
  </div>
)

export default NotFound
