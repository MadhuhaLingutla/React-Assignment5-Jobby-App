import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
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

  jobDetailsViewDecisionMaker = () => {}

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
