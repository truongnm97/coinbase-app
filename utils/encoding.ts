/**
 * Create a query parameter string for an array. The resulting query parameter
 * string must be parsable by Express.
 *
 * @param {string} paramName - Name of the query parameter
 * @param {any[]} arr - The array to be converted to query parameter string
 * @returns string - The query parameter string
 */
export const encodeArray = (paramName: string, arr: any[]): string => {
  return arr.reduce<string>((acc, cur, index) => {
    const prefix = index === 0 ? '' : '&'

    return (
      acc +
      `${prefix}${paramName}[]=${
        typeof cur === 'object'
          ? encodeURIComponent(JSON.stringify(cur))
          : encodeURIComponent(`${cur}`)
      }`
    )
  }, '')
}

/**
 * Create a query parameter string for an object. The resulting query parameter
 * string must be parsable by Express.
 *
 * @param {string} paramName - Name of the query parameter
 * @param {{}} obj - The object to be converted to query parameter string
 * @returns string - The query parameter string
 */
export const encodeObject = (
  paramName: string,
  obj: Record<string, unknown>
): string => {
  return Object.entries(obj).reduce((acc, cur, index) => {
    const [key, val] = cur
    const prefix = index === 0 ? '' : '&'

    return (
      acc +
      `${prefix}${paramName}[${key}]=${
        typeof val === 'object'
          ? encodeURIComponent(JSON.stringify(val))
          : encodeURIComponent(`${val}`)
      }`
    )
  }, '')
}

/**
 * Create a query parameter string for an object with each key being a query
 * parameter name, and each value being a query parameter value. The resulting
 * query parameter string must be parsable by Express.
 *
 * @param {object} queryParams - An object with each key being a query parameter
 * name, and each value being a query parameter value
 * @returns {string} - The query parameter string
 */
export const encodeQueryParams = (queryParams: Record<string, any>): string => {
  return Object.entries(queryParams).reduce(
    (finalUri, queryParam, index): string => {
      const [paramName, paramValue] = queryParam

      let encodedParam

      if (Array.isArray(paramValue)) {
        encodedParam = encodeArray(paramName, paramValue)
      } else if (typeof paramValue === 'object') {
        encodedParam = encodeObject(paramName, paramValue)
      } else {
        encodedParam = encodeURIComponent(`${paramValue}`)
      }

      const prefix = index === 0 ? '' : '&'

      return `${prefix}${encodedParam}`
    },
    ''
  )
}
