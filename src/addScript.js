

export default (name, command) => {
  exec(`npmAddScript -k ${name} -v ${command}`)
}
