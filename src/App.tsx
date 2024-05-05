import { Fragment } from "react/jsx-runtime"
import { Select, SelectOption } from "./Select"
import { useState } from "react"

const options: SelectOption[] = [
  { value: "ett", label: "Ett" },
  { value: "två", label: "Två" },
  { value: "tre", label: "Tre" },
  { value: "fyra", label: "Fyra" },
  { value: "fem", label: "Fem" },
  { value: "sex", label: "Sex" },
  { value: "sju", label: "Sju" },
  { value: "åtta", label: "Åtta" },
  { value: "nio", label: "Nio" },
  { value: "tio", label: "Tio" },
  { value: "elva", label: "Elva" },
  { value: "tolv", label: "Tolv" },
  { value: "tretton", label: "Tretton" },
]

function App() {
  const [values, setValues] = useState<SelectOption[]>([])
  const [value, setValue] = useState<SelectOption | undefined>()

  return (
    <Fragment>
      <Select
        multiple
        options={options}
        value={values}
        onChange={(opt) => setValues(opt)}
      />
      <br />
      <hr />
      <br />
      <Select
        options={options}
        value={value}
        onChange={(opt) => setValue(opt)}
      />
    </Fragment>
  )
}

export default App
