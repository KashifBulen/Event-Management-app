import NodeCache from 'node-cache'
import { freemem, totalmem } from 'os'
import { join } from 'path'

// cache memory usage threshold
const MEM_THRESHOLD = 0.8
// check memory usage every 5 minutes
const MEM_CHECK_INTERVAL_MS = 5 * 60 * 1000

export declare type CacheStore = {
	/** get a cached key and change the stats */
	get<T>(key: string): T | undefined;
	/** set a key in the cache */
	set<T>(key: string, value: T): void;
	/** delete a key from the cache */
	del(key: string): void;
	/** flush all data */
	flushAll(): void;
};

export function makeCacheFactory() {
	const cache = new NodeCache({
		// check expired data every 10 minutes
		checkperiod: 10 * 60,
		deleteOnExpire: true,
		useClones: false
	})

	let checkInterval: NodeJS.Timeout


	return {
		produce,
		flushIfMemoryExceeded,
		flushAll() {
			console.log('flushing memory')
			cache.flushAll()
		},
		startMemoryCheck() {
			checkInterval = setInterval(() => {
				flushIfMemoryExceeded()
			}, MEM_CHECK_INTERVAL_MS)
		},
		close() {
			clearInterval(checkInterval)
			cache.close()
		}
	}

	function produce(ttl: number, ...path: string[]): CacheStore {
		const name = join(...path)
		return {
			get(key) {
				return cache.get(join(name, key))
			},
			set(key, value) {
				cache.set(join(name, key), value, ttl)
			},
			del(key) {
				cache.del(join(name, key))
			},
			flushAll() {
				// a bit inefficient,
				// but we've CPU to spare
				const allKeys = cache.keys()
				for (const key of allKeys) {
					if (key.startsWith(name)) {
						cache.del(key)
					}
				}
			}
		}
	}

	function flushIfMemoryExceeded() {
		const memUsed = getMemoryUsedFraction()


		if (memUsed > MEM_THRESHOLD) {
			console.log('memory exceeded flushing memory')
			cache.flushAll()
		}
	}

	function getMemoryUsedFraction() {
		const free = freemem() / totalmem()
		const freeMemoryInMB = freemem() / 1024 / 1024;
		const totalMemoryInMB = totalmem() / 1024 / 1024;

		console.log('Free Memory:', freeMemoryInMB.toFixed(2), 'MB');
		console.log('Total Memory:', totalMemoryInMB.toFixed(2), 'MB');
		return 1 - free
	}
}

export const cacheFactory = makeCacheFactory()