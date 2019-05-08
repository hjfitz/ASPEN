/* eslint-disable no-restricted-globals */
const CACHENAME = 'ASPEN-v1'

// populate cache on install
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHENAME).then(cache => cache.addAll([
			'/',
			'./',
			'index.html',
			'/js/client.bundle.js',
		])),
	)
})
// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', (event) => {
	console.log('[worker] active')
})

// response from the cache first
self.addEventListener('fetch', (event) => {
	// Skip cross-origin requests, like those for Google Analytics.
	// because scope is awesome in js
	console.log('invoked')
	// Prevent the default, and handle the request ourselves.
	event.respondWith(
		caches.match(event.request).then(response => response || fetch(event.request).catch(() => {
			console.log('[sw] Unable to fetch. Returning base page')
			return caches.match('/')
		})),
	)
})
