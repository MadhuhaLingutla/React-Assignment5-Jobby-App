import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {IoLocationSharp, IoBagCheck} from 'react-icons/io5'

import './index.css'

const JobItem = props => {
  const {jobItem} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobItem

  const linkurl = `jobs/${id}`

  return (
    <li className="job-item-display">
      <Link to={linkurl} className="link-item">
        <div className="title-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="jobs-company-logo"
          />
          <div className="heading-rating">
            <h1 className="company-name">{title}</h1>
            <div className="rating-container">
              <AiFillStar className="rating-icon" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="details-container">
          <div className="sub-details">
            <div className="detail1-container">
              <IoLocationSharp className="detail1-icon" />
              <p className="detail1-text">{location}</p>
            </div>
            <div className="detail1-container">
              <IoBagCheck className="detail1-icon" />
              <p className="detail1-text">{employmentType}</p>
            </div>
          </div>
          <p className="salary">{packagePerAnnum}</p>
        </div>
        <div className="description-container">
          <h1 className="description-heading">Description</h1>
          <p className="description-content">{jobDescription}</p>
        </div>
      </Link>
    </li>
  )
}

export default JobItem
