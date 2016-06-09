# angular-key-value-editor
A simple UI for editing key-value pairs

## TODO:
- need to ensure that we can support various data formats, not just arrays of       arrays, though the directive itself should be pretty dumb (only support array of arrays)
- optionally invalidate the parent form if something is wonky
  - example: enforce a format for key-value pairs, such as `no spaces`.  
  - should this be easy to use attribs, or a regex? (or both)
- add an image / animated-gif to show what it looks like & how it works
- document dependency on bootstrap/patternfly
- document how one could override the template if they did not want the dependency on bootstrap/patternfly
