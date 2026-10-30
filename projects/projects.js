// import { fetchJSON, renderProjects } from '../global.js';
// const projects = await fetchJSON('../lib/projects.json');
// const projectsContainer = document.querySelector('.projects');
// renderProjects(projects, projectsContainer, 'h2');

import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');
projectsContainer.innerHTML = '';

renderProjects(projects, projectsContainer, 'h2');

const projectsTitle = document.querySelector('.projects-title');
projectsTitle.textContent = `${projects.length} Projects`;

import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let arc = arcGenerator({
  startAngle: 0,
  endAngle: 2 * Math.PI,
});

d3.select('svg').append('path').attr('d', arc).attr('fill', 'red');


// let data = [1, 2, 3, 4, 5, 5];
let rolledData = d3.rollups(
  projects,
  (v) => v.length,
  (d) => d.year,
);
let data = rolledData.map(([year, count]) => {
  return { value: count, label: year };
});

let colors = d3.scaleOrdinal(d3.schemeTableau10);

let sliceGenerator = d3.pie().value((d) => d.value);
let arcData = sliceGenerator(data);
let arcs = arcData.map((d) => arcGenerator(d));

arcs.forEach((arc, index) => {
    d3.select('svg')
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(index))
})

let legend = d3.select('.legend');

data.forEach((d, idx) => {
  legend
    .append('li')
    .attr('class', 'legend-item')
    .attr('style', `--color:${colors(idx)}`)
    .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
});

let query = '';
let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('change', (event) => {
  // update query value
  query = event.target.value;
  // filter projects
  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
  // render filtered projects
  renderProjects(filteredProjects, projectsContainer, 'h2');
});

function renderPieChart(projectsGiven) {
  // re-calculate rolled data
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );

  // re-calculate data
  let newData = newRolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  // re-calculate slice generator, arc data, arcs
  let newSliceGenerator = d3.pie().value((d) => d.value);
  let newArcData = newSliceGenerator(newData);
  let newArcs = newArcData.map((d) => arcGenerator(d));

  // clear old paths and legend items
  let newSVG = d3.select('#projects-plot');
  newSVG.selectAll('path').remove();
  let newLegend = d3.select('.legend');
  newLegend.selectAll('li').remove();

  // draw new paths
  newArcs.forEach((arc, idx) => {
    newSVG.append('path').attr('d', arc).attr('fill', colors(idx));
  });

  // draw new legend
  newData.forEach((d, idx) => {
    newLegend
      .append('li')
      .attr('class', 'legend-item')
      .attr('style', `--color:${colors(idx)}`)
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}

// Re-render the pie chart and legend whenever the search changes
searchInput.addEventListener('input', (event) => {
  let filteredForPie = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(event.target.value.toLowerCase());
  });
  renderPieChart(filteredForPie);
});
let selectedIndex = -1;

let svg = d3.select('svg');
svg.selectAll('path').remove();
arcs.forEach((arc, i) => {
  svg
    .append('path')
    .attr('d', arc)
    .attr('fill', colors(i))
    .on('click', () => {
      selectedIndex = selectedIndex === i ? -1 : i;

      svg.selectAll('path').attr('class', (_, idx) => (idx === selectedIndex ? 'selected' : ''));
      legend.selectAll('li').attr('class', (_, idx) => (idx === selectedIndex ? 'legend-item selected' : 'legend-item'));

      if (selectedIndex === -1) {
        renderProjects(projects, projectsContainer, 'h2');
      } else {
        let selectedYear = data[selectedIndex].label;
        let filteredByYear = projects.filter((project) => project.year === selectedYear);
        renderProjects(filteredByYear, projectsContainer, 'h2');
      }
      legend
      .selectAll('li')
      .attr('class', (_, idx) =>
        idx === selectedIndex ? 'legend-item selected' : 'legend-item',);
    })
});

