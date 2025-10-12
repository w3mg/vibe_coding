# Onboarding Evolution 3 | Design

\*\*the up to date version of this document will be in the vibe\_coding folder under 

## Success Criteria

- [ ] High impact, positive onboarding experience for new users with 100x improvements in activition and users getting to wow/aha moments  
- [ ] Help for users who skipped onboarding, but want to know how to easily get things done  
- [ ] Code quality adheres to our standards and expectations by following clear Rails MVC principles where logic lives in models, controllers route, and views display  
- [ ] Code quality adheres to our standards and expectations by following TDD practices which in turn requires a bias toward UNIT tests  
- [ ] Code quality adheres to our standards and expectations by following Code Complete best practices  
- [ ] Code quality adheres to our standards and expectations by being objectively hard to break, confuse or mess up in any way shape or form  
- [ ] CODE is easy to understand and discuss because it uses clear naming conventions and makes it hard to misunderstand or confuse a problem  
- [ ] Specifications allow for human or ai to pick up specific, well scoped, single focused tasks and complete them  
- [ ] Tracking allows human or ai to understand the big picture and immediate next step

## Background

* Evolution 1 documents  
* This allows us to increase user activation 100-fold to above 90%


### **Prior/related Documents**

| Title | Importance | What it is/ notes |
| :---- | :---- | :---- |
| \[\#todo \#missing: existing onboarding documentation\] | Critical | Current onboarding flow/specs |
| code\_complete practices | Critical | Coding standards to follow |
| \[\#todo \#verify: user activation tracking doc?\] | Critical | How we measure activation currently  |

## 

## 

## Architecture/Technical Approach

We're going to create a standalone controller dedicated to onboarding. We will not use prior controllers. It is called onboarding\_controller.   
Doing this will allow us to support our future requirements for a very robust onboarding experience while adhering to our core value of shipping fast and learning fast.   
It's also going to allow us to hit our success criteria of being hard to break and keeping things easy to think about.

## Project Management

- Must be easy to follow and pick up by either human or ai whethe during the project or after  
- FLAT Master todo list tracked in onboarding\_evolution\_3.md , with ai/human doing tight scope, TDD approach, adhering to all success criteria and design principles.  Must use brackets that are either empty or have an \[x\]  
- Must allow for hand off between devs \- scott and patrick 

## Ideas for the approach

- Pull in and cleanup existing logic from today controller  
- Reexamine and possibly remove use of session variable, or at the very least control the setting of the session variable in a unit or functional testable way rather than in the views  
- Simplify logic around onboarding layout, focusing it in the new onboarding controller  
- Simplify the layout for onboarding

## Issues

| Issue | Status | Notes |
| :---- | :---- | :---- |
| In V1 \- Use of session variable in current implementation is difficult to follow or set, and puts logic in the view | Addressed by this iteration (evolution 3\) |  |
| In v1 Current evolution fails to handle new users on the same computer, making testing difficult and or hacky to have happen; and making automated tests impossible | Addressed by this iteration (evolution 3\) |  |

## Future functionality that WILL NOT be included in this iteration but that this iteration enables

\[ \] skippable (skip for now) capability  
\[ \] access onboarding screen even months later after usage  
\[ \] different onboarding per role  
\[ \] user customizable onboarding per role

