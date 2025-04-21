// src/components/dashboard/ProjectList.jsx
import ProjectCard from './ProjectCard';

const ProjectList = ({ projects }) => {
  // Group projects by status
  const activeProjects = projects.filter(project => !project.completed);
  const completedProjects = projects.filter(project => project.completed);

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-500">You don't have any projects yet</h3>
        <p className="mt-2 text-sm text-gray-400">Click "Add Project" to create your first project</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Active Projects</h2>
        {activeProjects.length === 0 ? (
          <p className="text-gray-500">No active projects</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      {completedProjects.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Completed Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;