import * as React from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { red } from '@mui/material/colors'
import useMediaQuery from '@mui/material/useMediaQuery'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'

import data from './data.json'

export default function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const [selected, setSelected] = React.useState()
  const searchHandler = (event, newValue) => {
    const result = newValue && data.find((x) => x.title === newValue)
    setSelected(result)
  }

  // Create a theme instance.
  const theme = createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
      primary: {
        main: '#556cd6',
      },
      secondary: {
        main: '#19857b',
      },
      error: {
        main: red.A400,
      },
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Autocomplete
            freeSolo
            options={data.map((x) => x.title)}
            onChange={searchHandler}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search food or drink"
                InputProps={{
                  ...params.InputProps,
                  type: 'search',
                }}
              />
            )}
          />
          <List>
            {(selected ? [selected] : data).map(({ title, allowed, content }, i, input) => (
              <React.Fragment key={title}>
                <ListItem>
                  <ListItemText primary={title} secondary={content} />
                </ListItem>
                {i !== input.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Container>
    </ThemeProvider>
  )
}
