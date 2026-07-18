import { Viewport as ViewportType } from '@designable-next/core'
import { globalThisPolyfill, requestIdle } from '@designable-next/shared'
import cls from 'classnames'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { usePrefix, useViewport } from '../hooks'
import { AuxToolWidget, EmptyWidget } from '../widgets'
export interface IViewportProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'placeholder'> {
  placeholder?: React.ReactNode
  dragTipsDirection?: 'left' | 'right'
}

export const Viewport: React.FC<IViewportProps> = ({
  placeholder,
  dragTipsDirection,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false)
  const prefix = usePrefix('viewport')
  const viewport = useViewport()
  const ref = useRef<HTMLDivElement>(null)
  const scrollbarRef = useRef<HTMLDivElement>(null)
  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout>>(null)
  const viewportRef = useRef<ViewportType>(null)
  const isFrameRef = useRef(false)
  const scrollbarPrefix = usePrefix('viewport-scrollbar-thumb')

  const updateScrollbar = () => {
    const element = ref.current
    const scrollbar = scrollbarRef.current
    if (!element || !scrollbar) return false

    const { clientHeight, scrollHeight, scrollTop } = element
    if (scrollHeight <= clientHeight) {
      scrollbar.style.opacity = '0'
      return false
    }

    const height = Math.max(24, (clientHeight * clientHeight) / scrollHeight)
    const maxScrollTop = scrollHeight - clientHeight
    const maxScrollbarTop = clientHeight - height
    const normalizedScrollTop = Math.min(Math.max(scrollTop, 0), maxScrollTop)
    const scrollbarTop = (normalizedScrollTop / maxScrollTop) * maxScrollbarTop

    scrollbar.style.height = `${height}px`
    scrollbar.style.transform = `translate3d(0,${
      normalizedScrollTop + scrollbarTop
    }px,0)`
    return true
  }

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    props.onScroll?.(event)
    if (isFrameRef.current || !updateScrollbar()) return

    const scrollbar = scrollbarRef.current
    if (!scrollbar) return
    scrollbar.style.opacity = '1'
    if (scrollEndTimerRef.current) {
      clearTimeout(scrollEndTimerRef.current)
    }
    scrollEndTimerRef.current = setTimeout(() => {
      scrollbar.style.opacity = '0'
    }, 500)
  }

  useEffect(() => {
    return () => {
      if (scrollEndTimerRef.current) {
        clearTimeout(scrollEndTimerRef.current)
      }
    }
  }, [])

  useLayoutEffect(() => {
    const frameElement = ref.current.querySelector('iframe')
    if (!viewport) return
    if (viewportRef.current && viewportRef.current !== viewport) {
      viewportRef.current.onUnmount()
    }
    if (frameElement) {
      frameElement.addEventListener('load', () => {
        viewport.onMount(frameElement, frameElement.contentWindow)
        requestIdle(() => {
          isFrameRef.current = true
          setLoaded(true)
        })
      })
    } else {
      viewport.onMount(ref.current, globalThisPolyfill)
      requestIdle(() => {
        isFrameRef.current = false
        setLoaded(true)
      })
    }
    viewportRef.current = viewport
    return () => {
      viewport.onUnmount()
    }
  }, [viewport])

  return (
    <div
      {...props}
      ref={ref}
      className={cls(prefix, props.className)}
      onScroll={handleScroll}
      style={{
        opacity: !loaded ? 0 : 1,
        overflow: isFrameRef.current ? 'hidden' : 'auto',
        overflowX: 'hidden',
        ...props.style,
      }}
    >
      {props.children}
      <AuxToolWidget />
      <div ref={scrollbarRef} className={scrollbarPrefix} />
      <EmptyWidget dragTipsDirection={dragTipsDirection}>
        {placeholder}
      </EmptyWidget>
    </div>
  )
}
