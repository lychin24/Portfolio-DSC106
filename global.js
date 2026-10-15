console.log("IT'S ALIVE")

function $$(selector, context=document) {
    return Array.from(context.querySelectorAll(selector))
}

// navLinks = $$("nav a")

// let currentLink = navLinks.find(
//   (a) => a.host === location.host && a.pathname === location.pathname,
// );

// currentLink?.classList.add('current');


let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'resume/', title: 'Resume' },
  { url: 'contact/', title: 'Contact' },
  { url: 'https://github.com/lychin24/', title: 'Github' }

];

let nav = document.createElement('nav');
document.body.prepend(nav);

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? "/"                  // Local server
    : "/Portfolio-DSC106/";         // GitHub Pages repo name

for (let p of pages) {
  let url = p.url;
  let title = p.title;
    if (!url.startsWith('http')) {
        url = BASE_PATH + url;}
  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;
  if (a.host === location.host && a.pathname === location.pathname) {
  a.classList.add('current');}
  if (a.host !== location.host) {
    a.target = '_blank'
  }


a.classList.toggle(
  'current',
  a.host === location.host && a.pathname === location.pathname,
);
  nav.append(a);  
}

document.body.insertAdjacentHTML(
  'afterbegin',
  `
	<label class="color-scheme">
		Theme:
		<select>
            <option value="light dark">Automatic</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
		</select>
	</label>`
);

select.addEventListener('input', function (event) {
  console.log('color scheme changed to', event.target.value);
});
