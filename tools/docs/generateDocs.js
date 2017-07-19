const { findFiles } = require('./findFiles')
const { parseDocumentation } = require('./parseDocumentation')
const { ascend } = require('167')
const { writeFileSync } = require('fs')
const { join } = require('path')

exports.generateDocs = generateDocs

function generateDocs(packageDirectory) {
  const README = join(packageDirectory, 'README.md')
  const PACKAGE_JSON = join(packageDirectory, 'package.json')

  const files = findFiles(packageDirectory)

  const parsedDocumentation = parseDocumentation(files)
  
  const api = parsedDocumentation.map(displayDocumentation).join('\n')

  const readme = generateReadme(Object.assign({}, require(PACKAGE_JSON)))

  writeFileSync(README, readme + `\n` + api)
}

function generateReadme(packageJson) {
  const { name, version, description } = packageJson

  return (`# ${name} -- ${version}

${description}

## Get it
\`\`\`sh
yarn add ${name}
# or
npm install --save ${name}
\`\`\`

## API Documentation

All functions are curried!`)

}

function displayDocumentation({ file, description, name, example, code, type }) {
  const header = `
#### ${replaceBrackets(name)}

<p>

${replaceBrackets(description)}

</p>

`

  const api = 
`
<details>
  <summary>See an example</summary>
  
\`\`\`typescript
${example}
\`\`\`

</details>

<details>
  <summary>See the code</summary>

\`\`\`typescript

${code}

\`\`\`

</details>

<hr />
`

const typeExample = `
\`\`\`typescript

${example}

\`\`\`
`

  return header + (type ? typeExample : api)
}

function replaceBrackets(str) {
  return str.replace(/</g, '\\<').replace(/>/g, '\\>')
}
