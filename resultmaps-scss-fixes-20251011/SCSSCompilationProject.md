# SCSS Compilation Fix | Design

Fix compilation errors and bloating in .scss to CSS functionality

## Success Criteria

- [ ] 0 compilation errors across all .scss files  
- [ ] File sizes reduced by at least 40%  
- [ ] Faithful rendering \- no visual changes between October and July releases  
- [ ] No major upgrades needed to SCSS compilation engine during this evolution cycle  
- [ ] Compatible with current asset packager until its removal

## Background

* ResultMaps: \[\#todo \#missing: link to relevant ResultMaps objective\]  
* Deployment is blocked \- compilation errors are breaking the build. Cannot deploy until a fix… or alternative solution is implemented.

## Approach

- Claude Code finds all compilation errors in .scss and .css files  
- Compile list of errors  
- Develop prompt for Claude Code to assemble list of files  
- Develop prompt for Claude Code to work on individual files  
- Fix errors \- replace @extend with mixins (bloating cause)  
- Visual testing by human in local environment  
- Set up staging server  
- Confirm push capability to staging server  
- Create separate branch for changes  
- Push from branch to staging for testing  
- Test on staging server

## Questions and Issues

| Issue | Status | Notes |
| :---- | :---- | :---- |
| \[\#todo \#missing: any blocking issues\] |  |  |

### **Claude Code Prompts**

**Prompt 1 \- Assemble list of files:** "Find all .scss and .css files in this codebase that have compilation errors. Create a list with the file path and the compilation errors found in each file."

**Prompt 2 \- Fix individual file:** "Fix all compilation errors in \[filename\] by replacing @extend with mixins. Maintain faithful rendering \- the compiled CSS output must produce identical visual results."  
