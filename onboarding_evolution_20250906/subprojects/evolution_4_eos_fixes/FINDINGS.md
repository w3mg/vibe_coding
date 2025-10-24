# EOS Terminology Bug - Findings

## Problem Statement
LLM is generating "metrics" instead of "measurables" in scorecard onboarding responses.

## Root Cause
The system prompt in `app/models/llm.rb` contains incorrect EOS terminology in the DEFINITIONS section.

## Bugs Found

### Bug 1: Line 629
**File**: `app/models/llm.rb:629`
**Current**:
```
MEASURABLES IN EOS - ...Specifically, they are: 5-15 weekly metrics tracked on the EOS Scorecard...
```

**Should be**:
```
MEASURABLES IN EOS - ...Specifically, they are: 5-15 weekly measurables tracked on the EOS Scorecard...
```

**Impact**: The definition of "measurables" incorrectly uses "metrics" in its own definition, teaching the LLM to conflate the terms.

### Bug 2: Line 631
**File**: `app/models/llm.rb:631`
**Current**:
```
SCORECARD IN EOS - ...Individually owned metrics - each number has one person accountable...
```

**Should be**:
```
SCORECARD IN EOS - ...Individually owned measurables - each number has one person accountable...
```

**Impact**: Reinforces incorrect terminology by using "metrics" in the scorecard definition.

## Verification Method
```bash
grep -n "\bmetrics\b" app/models/llm.rb
```

## Fix Required
Replace both instances of "metrics" with "measurables" in the `build_system_prompt_for_scorecard_measurables` method definitions section.

## EOS Correct Terminology
In EOS (Entrepreneurial Operating System):
- ✅ **MEASURABLES** - The correct term for scorecard items
- ❌ **METRICS** - Incorrect term, not used in EOS

## Documentation Errors
**File**: `doc/llm_scorecard_measurables.md`

The design documentation contains the **same errors** as the code:
- **Line 11**: "5-15 weekly metrics tracked..." → should be "measurables"
- **Line 219**: Same as code bug #1 (definition of MEASURABLES uses "metrics")
- **Line 221**: Same as code bug #2 (SCORECARD definition uses "metrics")
- Line 385: "health metrics" (casual usage - may be acceptable)
- Line 483: "achievement metrics" (casual usage - may be acceptable)

**CRITICAL**: The documentation was the source that the code was copied from. Must fix documentation FIRST, then sync code to match.

## Fix Order (Critical)
1. ✅ Document findings
2. ✅ Verify documentation has same errors
3. ⏳ **FIX DOCUMENTATION FIRST** (doc/llm_scorecard_measurables.md lines 11, 219, 221)
4. ⏳ **FIX CODE SECOND** (app/models/llm.rb lines 629, 631)
5. ⏳ Test LLM responses after fix
