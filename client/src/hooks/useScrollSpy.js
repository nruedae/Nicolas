import { useState, useEffect } from 'react'

export function useScrollSpy(sectionIds) {
  const [activeId, setActiveId] = useState(sectionIds[0])

  useEffect(() => {
    const observers = []

    const callback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id)
        }
      })
    }

    const options = {
      rootMargin: '-40% 0px -55% 0px',
      threshold: 0,
    }

    sectionIds.forEach(id => {
      const el = document.getElementById(id)
      if (el) {
        const observer = new IntersectionObserver(callback, options)
        observer.observe(el)
        observers.push(observer)
      }
    })

    return () => observers.forEach(o => o.disconnect())
  }, [sectionIds])

  return activeId
}
