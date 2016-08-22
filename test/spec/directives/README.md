# Things to test

- Use the /demo/__test__.html file to hack away at for a visual
- Create a /demo/__template__.html file to match for future
- move /demo/ to /test/manual because this is more obvious in purpose
  - and update the gulp task

- single editor
  - no attribs
  - just entries
  - just entries with each attribute alone
  - entries
    - with attribute overrides on each entry
- multiple editors with different data
- multiple editors with the same data
- data updates via $timeout
  - simulate api call
  - verify $watch calls do not error out
