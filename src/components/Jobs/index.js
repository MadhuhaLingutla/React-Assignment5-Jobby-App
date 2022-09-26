import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiOutlineSearch} from 'react-icons/ai'

import Header from '../Header'
import UserProfile from '../UserProfile'
import FiltersGroup from '../FiltersGroup'
import JobItem from '../JobItem'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatus = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failed: 'FAILED',
}

class Jobs extends Component {
  state = {
    profileDetails: {},
    jobsData: [],
    profileApiStatus: apiStatus.initial,
    jobApiStatus: apiStatus.initial,
    activeEmployementFilterList: [],
    activeSalaryFilter: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobsData()
  }

  getProfileData = async () => {
    this.setState({profileApiStatus: apiStatus.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const formatedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      console.log('Formated data', formatedData)
      this.setState({
        profileDetails: formatedData,
        profileApiStatus: apiStatus.success,
      })
    } else {
      this.setState({profileApiStatus: apiStatus.failed})
    }
  }

  getJobsData = async () => {
    this.setState({jobApiStatus: apiStatus.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {
      activeEmployementFilterList,
      activeSalaryFilter,
      searchInput,
    } = this.state
    const employmentFilterString = activeEmployementFilterList.join(',')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentFilterString}&minimum_package=${activeSalaryFilter}&search=${searchInput}`
    console.log(apiUrl)
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const formatedJobsData = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      console.log('Formated Jobs Data', formatedJobsData)
      this.setState({
        jobsData: formatedJobsData,
        jobApiStatus: apiStatus.success,
      })
    } else {
      this.setState({jobApiStatus: apiStatus.failed})
    }
  }

  retryProfileDetails = () => {
    this.getProfileData()
  }

  displayProfileDetails = () => {
    const {profileDetails} = this.state
    return <UserProfile profileDetails={profileDetails} />
  }

  loadingView = () => (
    <div className="products-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  profileLoadFailureView = () => (
    <button
      className="retry-button"
      type="button"
      onClick={this.retryProfileDetails}
    >
      Retry
    </button>
  )

  profileViewDecisionMaker = () => {
    const {profileApiStatus} = this.state

    switch (profileApiStatus) {
      case apiStatus.success:
        return this.displayProfileDetails()
      case apiStatus.failed:
        return this.profileLoadFailureView()
      case apiStatus.inProgress:
        return this.loadingView()
      default:
        return null
    }
  }

  getEmploymentFilterList = (id, checkedStatus) => {
    const {activeEmployementFilterList} = this.state
    let tempList = []
    if (checkedStatus) {
      tempList = [...activeEmployementFilterList, id]
    } else {
      tempList = activeEmployementFilterList.filter(each => each !== id)
    }
    this.setState({activeEmployementFilterList: tempList}, this.getJobsData)
  }

  getSalaryID = id => {
    this.setState({activeSalaryFilter: id}, this.getJobsData)
  }

  retryJobsData = () => {
    this.getJobsData()
  }

  noJobsView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="failure-image"
      />
      <h1 className="failure-view-heading">No Jobs Found</h1>
      <p className="failure-view-description">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  jobsLoadFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="failure-view-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="retry-button"
        type="button"
        onClick={this.retryJobsData}
      >
        Retry
      </button>
    </div>
  )

  displayJobsView = () => {
    const {jobsData} = this.state
    if (jobsData.length === 0) {
      return this.noJobsView()
    }
    return (
      <div className="jobs-list">
        {jobsData.map(each => (
          <JobItem jobItem={each} key={each.id} />
        ))}
      </div>
    )
  }

  jobsViewDecisionMaker = () => {
    const {jobApiStatus} = this.state

    switch (jobApiStatus) {
      case apiStatus.success:
        return this.displayJobsView()
      case apiStatus.failed:
        return this.jobsLoadFailureView()
      case apiStatus.inProgress:
        return this.loadingView()
      default:
        return null
    }
  }

  updateSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  sendSearchInput = event => {
    this.getJobsData()
  }

  render() {
    return (
      <div className="jobs-container">
        <Header />
        <div className="jobs-content-container">
          <div className="left-container">
            <div className="profile-details-container">
              {this.profileViewDecisionMaker()}
            </div>
            <div className="filters-container">
              <FiltersGroup
                employmentTypesList={employmentTypesList}
                salaryRangesList={salaryRangesList}
                getEmploymentFilterList={this.getEmploymentFilterList}
                getSalaryID={this.getSalaryID}
              />
            </div>
          </div>
          <div className="right-container">
            <div className="search-bar-container">
              <input
                type="search"
                className="search-bar"
                onChange={this.updateSearchInput}
                placeholder="Search"
              />
              <button
                className="search-icon-container"
                type="button"
                testid="searchButton"
                onClick={this.sendSearchInput}
              >
                <AiOutlineSearch className="search-icon" />
              </button>
            </div>
            <div className="jobs-display-container">
              {this.jobsViewDecisionMaker()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
