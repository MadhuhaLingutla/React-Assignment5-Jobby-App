import './index.css'

const FiltersGroup = props => {
  const {
    employmentTypesList,
    salaryRangesList,
    getEmploymentFilterList,
    getSalaryID,
  } = props
  return (
    <div className="filters-view">
      <div className="filters-group employment-filter">
        <h1 className="filter-title">Type of Employment</h1>
        <ul className="filters-list">
          {employmentTypesList.map(each => {
            const {label, employmentTypeId} = each
            const onClickemployemnt = event => {
              getEmploymentFilterList(event.target.value, event.target.checked)
            }
            return (
              <li className="filter-item" key={employmentTypeId}>
                <input
                  type="checkbox"
                  id={employmentTypeId}
                  className="input-filter-field"
                  value={employmentTypeId}
                  onChange={onClickemployemnt}
                />
                <label
                  className="input-filter-label"
                  htmlFor={employmentTypeId}
                >
                  {label}
                </label>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="filters-group">
        <h1 className="filter-title">Salary Range</h1>
        <ul className="filters-list">
          {salaryRangesList.map(each => {
            const {label, salaryRangeId} = each
            const onClickSalary = event => {
              getSalaryID(event.target.value)
            }
            return (
              <li className="filter-item" key={salaryRangeId}>
                <input
                  type="radio"
                  id={salaryRangeId}
                  className="input-filter-field"
                  value={salaryRangeId}
                  onChange={onClickSalary}
                  name="salary-filter"
                />
                <label className="input-filter-label" htmlFor={salaryRangeId}>
                  {label}
                </label>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default FiltersGroup
