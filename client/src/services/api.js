/** Chama GET /api/convert e devolve { value, unit, result }. Lança Error com a mensagem da API. */
export async function convertTemperature(value, unit) {
  const params = new URLSearchParams({ value: String(value), unit });
  let response;
  let data;
  try {
    response = await fetch(`/api/convert?${params}`);
    data = await response.json();
  } catch {
    throw new Error('Erro de conexão');
  }
  if (!response.ok || data.error) {
    throw new Error(data.error || 'Erro na conversão');
  }
  return data;
}
