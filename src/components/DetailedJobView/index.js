import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {IoLocationSharp, IoBagCheck} from 'react-icons/io5'
import {BiLinkExternal} from 'react-icons/bi'

import Header from '../Header'
import './index.css'

const apiStatusList = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failed: 'FAILED',
}

class DetailedJobView extends Component {
  state = {
    jobDetails: {},
    similarJobDetails: [],
    apiStatus: apiStatusList.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  formatJobDetailsData = data => {
    const formatedData = {
      companyLogoUrl: data.job_details.company_logo_url,
      companyWebsiteUrl: data.job_details.company_website_url,
      employmentType: data.job_details.employment_type,
      id: data.job_details.id,
      jobDescription: data.job_details.job_description,
      lifeAtCompanyDescription: data.job_details.life_at_company.description,
      lifeAtCompanyImageUrl: data.job_details.life_at_company.image_url,
      location: data.job_details.location,
      packagePerAnnum: data.job_details.package_per_annum,
      rating: data.job_details.rating,
      skills: data.job_details.skills.map(each => ({
        imageUrl: each.image_url,
        name: each.name,
      })),
      title: data.job_details.title,
    }
    return formatedData
  }

  formatSimilarJobs = data => {
    const formatedData = data.map(each => ({
      companyLogoUrl: each.company_logo_url,
      employmentType: each.employment_type,
      id: each.id,
      jobDescription: each.job_description,
      location: each.location,
      rating: each.rating,
      title: each.title,
    }))
    return formatedData
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusList.inprogress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const formatedData = this.formatJobDetailsData(data)
      console.log('Formated job Details', formatedData)
      const similarJobsFormatedData = this.formatSimilarJobs(data.similar_jobs)
      console.log('similarJobsFormatedData', similarJobsFormatedData)
      this.setState({
        jobDetails: formatedData,
        similarJobDetails: similarJobsFormatedData,
        apiStatus: apiStatusList.success,
      })
    } else {
      this.setState({apiStatus: apiStatusList.failed})
    }
  }

  loadingView = () => (
    <div className="products-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  jobDetailedView = () => {
    const {jobDetails} = this.state
    console.log(jobDetails)
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      lifeAtCompanyDescription,
      lifeAtCompanyImageUrl,
      location,
      packagePerAnnum,
      rating,
      skills,
      title,
    } = jobDetails

    return (
      <div className="job-detailed-view">
        <div className="title-container">
          <img
            src={companyLogoUrl}
            alt="job details company logo"
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
          <div className="description-heading-container">
            <h1 className="description-heading-detailed-view">Description</h1>
            <div className="visit-container">
              <a href={companyWebsiteUrl} className="link-item">
                <p className="visit-text">Visit</p>
                <BiLinkExternal className="visit-icon" />
              </a>
            </div>
          </div>

          <p className="description-content in-detailed-view">
            {jobDescription}
          </p>
        </div>
        <div className="skills-container">
          <h2 className="skills-heading">Skills</h2>
          <ul className="skills-list">
            {skills.map(each => {
              const {imageUrl, name} = each
              return (
                <li className="skill" key={name}>
                  <img className="skill-image" src={imageUrl} alt={name} />
                  <p className="skill-name">{name}</p>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="life-at-company-container">
          <h2 className="life-at-company-heading">Life at Company</h2>
          <div className="life-at-company-details">
            <p className="life-at-company-description">
              {lifeAtCompanyDescription}
            </p>
            <img
              className="life-at-company-image"
              alt="life at company"
              src={lifeAtCompanyImageUrl}
            />
          </div>
        </div>
      </div>
    )
  }

  similarJobsDisplay = () => {
    const {similarJobDetails} = this.state
    console.log('Similar Job Details', similarJobDetails)
    return (
      <div className="similar-jobs-container">
        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        <ul className="similar-jobs-list">
          {similarJobDetails.map(each => {
            const {
              companyLogoUrl,
              employmentType,
              id,
              jobDescription,
              location,
              rating,
              title,
            } = each
            return (
              <li className="similar-job-item" key={id}>
                <div className="title-container">
                  <img
                    src={companyLogoUrl}
                    alt="similar job company logo"
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
                <div className="description-container">
                  <h1 className="description-heading">Description</h1>
                  <p className="description-content">{jobDescription}</p>
                </div>
                <div className="details-container similar-job-details-container">
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
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  retryJobsDetailsData = () => {
    this.getJobDetails()
  }

  jobDetailsFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-view-heading">Oops!Something Went Wrong</h1>
      <p className="failure-view-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="retry-button"
        type="button"
        onClick={this.retryJobsDetailsData}
      >
        Retry
      </button>
    </div>
  )

  jobDetailsViewDecisionMaker = () => {
    console.log('Entering into Decision Maker')
    const {apiStatus} = this.state
    console.log('Current state is', apiStatus)
    switch (apiStatus) {
      case apiStatusList.success:
        return (
          <div className="detailed-view-container">
            {this.jobDetailedView()}
            {this.similarJobsDisplay()}
          </div>
        )
      case apiStatusList.inProgress:
        return this.loadingView()
      case apiStatusList.failed:
        return this.jobDetailsFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="detailed-job-view-container">
        <Header />
        <div className="job-details-responsive-container">
          {this.jobDetailsViewDecisionMaker()}
        </div>
      </div>
    )
  }
}

export default DetailedJobView
