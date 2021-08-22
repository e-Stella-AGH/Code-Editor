import React from 'react'
import { Autocomplete } from '@material-ui/lab'
import { TextField } from '@material-ui/core'

export const AutocompleteWrapper = ({ options, style, label, onSelect, defaultValue }) => {
  return (
    <Autocomplete
      defaultValue={defaultValue}
      options={options}
      getOptionLabel={(option) => option}
      style={style || { width: '80%', margin: '1em' }}
      renderInput={(params) => (
        <TextField {...params} label={label} variant='outlined' />
      )}
      onChange={(event, value, reason) => onSelect(value)}
    />
  )
}
