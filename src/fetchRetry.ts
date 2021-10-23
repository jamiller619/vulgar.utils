/**
 * Retry a fetch request if it fails.
 * @param url The url to fetch
 * @param options Options passed directly to fetch
 * @param retryAttempts How many times to retry, default is 5
 * @param retryDelay How long to wait between retries, default is 500ms
 */
export default function fetchRetry(
  url: string,
  options?: RequestInit,
  retryAttempts = 5,
  retryDelay = 500
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const retryRequest = (retry: number) => {
      if (retry >= retryAttempts) {
        reject(new Error(`Failed to fetch ${url} after ${retry + 1} attempts`))
      } else {
        setTimeout(() => {
          fetch(url, options)
            .then(resolve)
            .catch(() => retryRequest(retry + 1))
        }, retryDelay)
      }
    }

    retryRequest(0)
  })
}
