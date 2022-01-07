const fs = require('fs');

fs.writeFileSync('../desktop/~watcher.txt', `${Date.now()}`);