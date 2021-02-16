import React from 'react'
React.useLayoutEffect= React.useEffect

/**
 * As of this writing, in August of 2019, the jest tests spew annoying warnings for MUI components because the MUI
 * components useLayoutEffect by default, which cannot be used by server-side-rendering (SSR).  If we start using SSR
 * and need to test, this file may be removed and we can add the React.useLayoutEffect = React.useEffect to
 * individual files that do not use SSR and do not need to use 'useLayoutEffect' during tests.
 *
 * There also may be other side effects
 *
 */
export default function setup() {
  beforeAll(() => {
      console.log("Setting up")
  })
}