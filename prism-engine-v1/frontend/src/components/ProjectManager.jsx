import React from 'react';
import { FilePlus, Save } from 'react-feather';

function ProjectManager({ savedProjects, currentProjectId, onNewProject, onSaveProject, onLoadProject }) {
  return (
    <div className="sidebar">
      <div className="button-group">
        <button onClick={onNewProject} className="button">
          <FilePlus size={16} />
          <span>New Project</span>
        </button>
        <button onClick={onSaveProject} className="button">
          <Save size={16} />
          <span>Save</span>
        </button>
      </div>
      <ul className="project-list">
        {savedProjects.map(project => (
          <li
            key={project.id}
            className={`project-item ${project.id === currentProjectId ? 'active' : ''}`}
            onClick={() => onLoadProject(project.id)}
          >
            {project.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectManager;
