# CI Build Fixes

This document tracks fixes applied to resolve CI build issues.

## @sinonjs Package Version Pins

**Issue**: CI failures in browser tests due to syntax errors in newer @sinonjs packages.

**Root Cause**: 
- `@sinonjs/samsam@8.0.3` (released 2025-07-25) introduced syntax errors causing karma-typescript parser failures
- `@sinonjs/fake-timers@11.x+` uses ES2020+ optional chaining syntax (`?.`) incompatible with ES5 target in karma config

**Solution**: Added npm overrides to pin to last working versions:
```json
"overrides": {
  "@sinonjs/samsam": "8.0.2",     // Last working version from 2024-09-12  
  "@sinonjs/fake-timers": "10.0.2" // ES5-compatible version
}
```

**Impact**: 
- ✅ Node.js tests continue to pass with full coverage
- ✅ ESNext tests continue to pass  
- ✅ Browser tests parsing errors resolved
- ⚠️ Browser tests require Chrome binary setup to run fully

**Reference**: [Issue #450](https://github.com/nevware21/ts-utils/issues/450), [Failed CI Run](https://github.com/nevware21/ts-utils/actions/runs/17055984352/job/48502594498?pr=448)

**Future**: Monitor upstream @sinonjs packages for fixes and consider removing overrides when compatible versions are released.