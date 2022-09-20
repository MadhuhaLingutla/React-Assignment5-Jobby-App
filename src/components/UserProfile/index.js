import './index.css'

const UserProfile = props => {
  const {profileDetails} = props
  const {name, profileImageUrl, shortBio} = profileDetails

  return (
    <div className="profile-view">
      <img src={profileImageUrl} className="profile-image" alt="profile" />
      <h1 className="profile-name">{name}</h1>
      <p className="profile-short-bio">{shortBio}</p>
    </div>
  )
}

export default UserProfile
