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
    }
  }

  loadingView = () => (
    <div className="products-loader-container">
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
      id,
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
          <div className="description-heading-container">
            <p className="description-heading-detailed-view">Description</p>
            <div className="visit-container">
              <p className="visit-text">Visit</p>
              <Link to={companyWebsiteUrl} className="link-item">
                <BiLinkExternal className="visit-icon" />
              </Link>
            </div>
          </div>

          <p className="description-content in-detailed-view">
            {jobDescription}
          </p>
        </div>
        <div className="skills-container">
          <h2 className="skills-heading">Skills</h2>
          <div className="skills-list">
            {skills.map(each => {
              const {imageUrl, name} = each
              return (
                <div className="skill">
                  <img className="skill-image" src={imageUrl} alt={name} />
                  <p className="skill-name">{name}</p>
                </div>
              )
            })}
          </div>
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
    return <div className="similar-jobs-view">Similar Jobs View View</div>
  }

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
