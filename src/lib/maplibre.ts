import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

export async function loadMapLibre() {
 const maplibre = await import('maplibre-gl');
 maplibre.setWorkerUrl(workerUrl);
 return maplibre;
}
