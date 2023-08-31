'use client'
import { useState, useEffect, useMemo } from 'react'
import { DOTS, breakpoints } from './const'

export function useDebounce (value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function usePagination ({ currentPage = 1, pageSize = 25, totalCount = 0, siblingCount = 1 }) {
  const paginationRange = useMemo((): Array<number | typeof DOTS> => {
    const range = (start: number, end: number) => {
      const length = end - start + 1
      return Array.from({ length }, (_, idx) => idx + start)
    }

    const totalPages = Math.ceil(totalCount / pageSize)
    const totalPagesNumbers = siblingCount + 5

    if (totalPagesNumbers >= totalPages) return range(1, totalPages)

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < (totalPages - 2)

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount
      const leftRange = range(1, leftItemCount)

      return [...leftRange, DOTS, totalPages]
    } else if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount
      const rightRange = range(totalPages - rightItemCount + 1, totalPages)
      return [1, DOTS, ...rightRange]
    } else {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex)
      return [1, DOTS, ...middleRange, DOTS, totalPages]
    }
  }, [currentPage, pageSize, totalCount, siblingCount])

  const { firstIndexToShow, lastIndexToShow } = useMemo(() => {
    const lastIndex = currentPage * pageSize
    const firstIndex = lastIndex - pageSize
    return {
      firstIndexToShow: firstIndex,
      lastIndexToShow: Math.max(lastIndex, totalCount)
    }
  }, [currentPage, pageSize, totalCount])

  return { paginationRange, firstIndexToShow, lastIndexToShow }
}

export function useBreakpoint () {
  const [breakpoint, setBreakpoint] = useState<typeof breakpoints.xs>(0)

  useEffect(() => {
    const width = window.innerWidth

    if (width > 0 && width < 640) {
      setBreakpoint(breakpoints.xs)
    }
    if (width > 640 && width < 768) {
      setBreakpoint(breakpoints.sm)
    }
    if (width > 768 && width < 1024) {
      setBreakpoint(breakpoints.md)
    }
    if (width > 1024 && width < 1280) {
      setBreakpoint(breakpoints.lg)
    }
    if (width > 1280 && width < 1536) {
      setBreakpoint(breakpoints.xl)
    }
    if (width >= 1536) {
      setBreakpoint(breakpoints.xxl)
    }
  }, [])

  return breakpoint
}
