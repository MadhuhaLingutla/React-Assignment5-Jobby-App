import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import UserProfile from '../UserProfile'
import FiltersGroup from '../FiltersGroup'

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
    jobDetails: [],
    profileApiStatus: apiStatus.initial,
    jobApiStatus: apiStatus.initial,
    activeEmployementFilterList: [],
    activeSalaryFilter: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobsdata()
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

  getJobsdata = async () => {
    this.setState({jobApiStatus: apiStatus.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {
      activeEmployementFilterList,
      activeSalaryFilter,
      searchInput,
    } = this.state
    const employmentFilterString = activeEmployementFilterList.join(',')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentFilterString}&minimum_package=${activeSalaryFilter}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
  }

  retryProfileDetails = () => {
    this.getProfileData()
  }

  displayProfileDetails = () => {
    const {profileDetails} = this.state
    return <UserProfile profileDetails={profileDetails} />
  }

  loadingView = () => (
    <div className="products-loader-container">
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
    this.setState({activeEmployementFilterList: tempList}, this.getJobsdata)
  }

  getSalaryID = id => {
    this.setState({activeSalaryFilter: id}, this.getJobsdata)
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
          <div className="right-container">Jobs-container</div>
        </div>
      </div>
    )
  }
}

export default Jobs
