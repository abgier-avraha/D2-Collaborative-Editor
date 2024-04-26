const baseUrl = "http://localhost:8000"

export const D2Api = {

  async fetchSvgBase64(script: string)
  {
    console.log(`${baseUrl}/render?script=${encodeURIComponent(script)}`)
    const res = await window.fetch(`${baseUrl}/render?script=${encodeURIComponent(script)}`) 
    const body = await res.text();
    return body;
  }
}