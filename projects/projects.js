import { fetchJSON, renderProjects } from "../lib/projects.json";
const projects = await fetchJSON('../lib/projects.json');
renderProjects(projects, projectsContainer, 'h2');
