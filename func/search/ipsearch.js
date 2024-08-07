import fetch from 'node-fetch'

async function getipdetails(ip) {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json`)
    return await response.json()
  } catch (error) {
    return console.error(error), null
  }
}

export default getipdetails
