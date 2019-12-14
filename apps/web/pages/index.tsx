import { Results } from './results'

export default () => (
  <>
    <input placeholder="Search..." />
    <Results />
    <style jsx global>
      {globalStyles}
    </style>
  </>
)

const globalStyles = `
* {
  display: flex;
  flex-flow: column;
  box-sizing: border-box;
  flex-shrink: 0;
  align-items: stretch;
}

.row {
  flex-direction: row;
}

svg {
  backface-visibility: hidden;
  -webkit-transform: translateZ(0) scale(1, 1);
  transform: translateZ(0);
}

p a:hover {
  color: #a07ff7;
}

body {
  outline: 0;
  /* flexbox has super weird behavior otherwise where things dont "shrink to fit" unless you set this */
  min-width: 0;
}

body * {
  outline: 0;
}

script,
body script {
  display: none;
}

small {
  display: inline;
}

img {
  border: none;
}

body,
.smooth-container {
  scroll-behavior: smooth;
}

/* Change Autocomplete styles in Chrome*/
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus input:-webkit-autofill,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
  -webkit-text-fill-color: red;
  background-color: red;
  transition: background-color 5000s ease-in-out 0s;
}

::selection {
  background: #8c60f8;
  color: #fff;
  text-shadow: none;
}

*::selection,
.theme-docsPageTheme *::selection,
.theme-light *::selection {
  background: #8c60f8;
  color: #fff;
  text-shadow: none;
}

input,
textarea,
select {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
    'Oxygen', 'Ubuntu', 'Cantarell', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
}

style {
  display: none;
}

a {
  color: lightblue;
  text-decoration: underline;
  color: inherit;
  cursor: pointer;
}

/* reset elements from flex */

a,
span,
em,
b,
strong,
i {
  display: inline;
}

script,
meta,
link {
  display: none;
}

a,
input,
textarea,
select {
  outline: 0;
}

p,
h1,
h2,
h3,
h4,
h5,
h6,
br {
  display: block;
}

ol,
ul {
  margin: 0;
  padding: 0;
  white-space: normal;
}

p,
h1,
h2,
h3,
h4,
h5,
h6,
code,
pre {
  margin-top: 0;
  margin-bottom: 0;
}

pre,
code {
  margin: 0;
}

code {
  margin: 0;
  padding: 0;
  display: inline-block;
}

img {
  display: block;
}

li {
  display: list-item;
}

p code {
  display: inline-block;
  padding: 0;
}

table {
  display: table;
}
tr {
  display: table-row;
}
thead {
  display: table-header-group;
}
tbody {
  display: table-row-group;
}
tfoot {
  display: table-footer-group;
}
col {
  display: table-column;
}
colgroup {
  display: table-column-group;
}
td,
th {
  display: table-cell;
}
caption {
  display: table-caption;
}

/* reset mark */
mark {
  background: none;
  color: auto;
}

blockquote {
  margin: 0;
  padding: 0;
}

/* Reset 2.0 */
/*
* What follows is the result of much research on cross-browser styling.
* Credit left inline and big thanks to Nicolas Gallagher, Jonathan Neal,
* Kroc Camen, and the H5BP dev community and team.
*/

html {
  color: #222;
  font-size: 1em;
  line-height: 1.4;
}

hr {
  display: block;
  height: 1px;
  border: 0;
  border-top: 1px solid #eee;
  margin: 16px 0 32px 0;
  padding: 0;
}

/*
* Remove the gap between audio, canvas, iframes,
* images, videos and the bottom of their containers:
* https://github.com/h5bp/html5-boilerplate/issues/440
*/

audio,
canvas,
iframe,
img,
svg,
video {
  vertical-align: middle;
}

/*
* Remove default fieldset styles.
*/

fieldset {
  border: 0;
  margin: 0;
  padding: 0;
}
`
