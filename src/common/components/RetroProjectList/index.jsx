import React, {PropTypes} from 'react'
import styles from './index.scss'

export default function RetroProjectList(props) {
  const {projects, onClickProject} = props

  return (
    <div className={styles.projectList}>
      <div className={styles.header}>
        <h5>Available Retrospectives</h5>
      </div>
      <hr className={styles.headerDivider}/>
      <div className={styles.projectListPrompt}>Select a project:</div>
      <div>
        {projects.map((project, i) => (
          <div key={i} className={styles.projectListItem}>
            {'• '}
            <a href="" onClick={onClickProject(project)}>
              {`${project.name} (cycle ${project.cycle.cycleNumber})`}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

RetroProjectList.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    cycle: PropTypes.object.isRequired,
  })).isRequired,
  onClickProject: PropTypes.func.isRequired,
}
