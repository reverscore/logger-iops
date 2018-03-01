# Logger abstraction for Rapid7 InsightOps

Simple logger abstraction using InsightOps

# Usage

Pass the env variables directly:

- INSIGHTOPTS_TOKEN
- INSIGHTOPTS_REGION

```
var logger = require('logger-iops')
logger.setProcess('someValue')

logger.i('Some message', objectWithExtraData)
logger.e('Some message', objectWithExtraData)
logger.w('Some message', objectWithExtraData)
logger.l('Some message', objectWithExtraData)
```

# Licence
Released under the MIT License
