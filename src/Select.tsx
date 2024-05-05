import { createRef, useEffect, useRef, useState } from "react"
import styles from "./select.module.css"

export type SelectOption = {
  label: string
  value: string | number
}

type SingleSelectProps = {
  multiple?: false
  value?: SelectOption
  onChange: (value: SelectOption | undefined) => void
}

type MultipleSelectProps = {
  multiple: true
  value: SelectOption[]
  onChange: (value: SelectOption[]) => void
}

type SelectProps = {
  options: SelectOption[]
} & (SingleSelectProps | MultipleSelectProps)

export function Select({ multiple, options, value, onChange }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)

  const optionRefs = useRef<HTMLLIElement[]>([])
  const selectOptionsRef = createRef<HTMLUListElement>()
  const containerRef = useRef<HTMLDivElement>(null)

  function clearOptions(
    evnt: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    evnt.stopPropagation()
    multiple ? onChange([]) : onChange(undefined)
  }

  function mouseSelectOption(
    evnt: React.MouseEvent<HTMLLIElement | HTMLButtonElement, MouseEvent>,
    option: SelectOption
  ): void {
    evnt.stopPropagation()

    if (multiple) {
      if (value.includes(option)) {
        onChange(value.filter((opt) => opt !== option))
      } else {
        onChange([...value, option])
      }
    } else {
      if (option !== value) {
        onChange(option)
      }
    }

    setIsOpen(false)
  }

  function selectOption(option: SelectOption): void {
    if (multiple) {
      if (value.includes(option)) {
        onChange(value.filter((opt) => opt !== option))
      } else {
        onChange([...value, option])
      }
    } else {
      if (option !== value) {
        onChange(option)
      }
    }

    setIsOpen(false)
  }

  function isOptionSelected(option: SelectOption) {
    return multiple ? value.includes(option) : option === value
  }

  function addToRefs(el: HTMLLIElement) {
    if (el && !optionRefs.current?.includes(el)) {
      optionRefs.current?.push(el)
    }
  }

  // https://stackoverflow.com/questions/16308037/detect-when-elements-within-a-scrollable-div-are-out-of-view
  function ensureInView(container: HTMLUListElement, element: HTMLLIElement) {
    //Determine container top and bottom
    let cTop = container.scrollTop
    let cBottom = cTop + container.clientHeight

    //Determine element top and bottom
    let eTop = element.offsetTop
    let eBottom = eTop + element.clientHeight

    //Check if out of view
    if (eTop < cTop) {
      container.scrollTop -= cTop - eTop
    } else if (eBottom > cBottom) {
      container.scrollTop += eBottom - cBottom
    }
  }

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (e.target !== containerRef.current) return

      switch (e.code) {
        case "Enter":
          setIsOpen((prev) => !prev)
          if (isOpen) {
            selectOption(options[highlightedIndex])
          }
          if (highlightedIndex > 0 && optionRefs.current) {
            optionRefs.current[highlightedIndex].scrollIntoView()
          }
          break
        case "Space":
          setIsOpen(true)
          break
        case "Escape":
          setIsOpen(false)
          break

        case "ArrowUp":
        case "ArrowDown": {
          if (!isOpen) {
            setIsOpen(true)
            break
          }

          const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1)
          if (newValue >= 0 && newValue < options.length) {
            setHighlightedIndex(newValue)
            if (selectOptionsRef.current && optionRefs) {
              ensureInView(
                selectOptionsRef.current,
                optionRefs.current[newValue]
              )
            }
          }
          break
        }

        default:
          break
      }
    }

    containerRef.current?.addEventListener("keydown", keyHandler)

    return () => {
      containerRef.current?.removeEventListener("keydown", keyHandler)
    }
  }, [isOpen, highlightedIndex, options])

  // console.log("--> optionRefs", optionRefs)

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className={styles.container}
      onClick={() => setIsOpen((prev) => !prev)}
      onBlur={() => setIsOpen(false)}
    >
      <span className={styles.value}>
        {multiple
          ? value.map((v) => (
              <button
                key={v.value}
                className={styles["option-badge"]}
                onClick={(e) => mouseSelectOption(e, v)}
              >
                {v.label} <span className={styles["remove-btn"]}>&times;</span>
              </button>
            ))
          : value?.label}
      </span>
      <button className={styles["clear-btn"]} onClick={(e) => clearOptions(e)}>
        &times;
      </button>
      <div className={styles.divider}></div>
      <div className={`${styles.caret} ${isOpen ? styles.show : ""}`}></div>
      <ul
        ref={selectOptionsRef}
        className={`${styles.options} ${isOpen ? styles.show : ""}`}
      >
        {options.map((option, index) => (
          <li
            key={option.value}
            ref={addToRefs}
            className={`${styles.option} ${
              highlightedIndex === index ? styles.highlighted : ""
            } ${isOptionSelected(option) ? styles.selected : ""}`}
            onClick={(e) => mouseSelectOption(e, option)}
            onMouseEnter={() => setHighlightedIndex(index)}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
