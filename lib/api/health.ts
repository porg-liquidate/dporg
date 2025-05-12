export async function apiHealth() {
    const response = await fetch('http://localhost:3001/health')
    return await response.json()   
}