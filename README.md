# JS-WIWI

firebase line bot for my javascript line group

### setup firebase functions config
use `firebase functions:config:set` command line to setup env variable
```bash
firebase functions:config:set domain.url="<firebaseProject>.web.app"  #setup firebase host url
firebase functions:config:set line.channel.accesstoken="xxxxx"  #setup line channel api accesstoken
firebase functions:config:set line.secret.="xxxxx"  #setup line channel api secret
```
then in `functions` folder run `npm run getConfig`, local config will generate on `.runtimeconfig.json` like follow json.
```
{
  "line": {
    "channel": {
      "accesstoken": "xxx",
      "secret": "xxx"
    }
  },
  "domain": {
    "url": "XXX"
  }
}
```