var Organel = require("organic").Organel;

module.exports = Organel.extend(function PostCommitHook(plasma, config){
  Organel.call(this, plasma, config);
  if(config.cwd)
    for(var key in config.cwd)
      config[key] = process.cwd()+config.cwd[key];
  config.postCommitUrl = config.postCommitUrl || "/post-commit";
  this.config = config;
  var self = this;
  this.on("PostCommitHook", function(c, sender, callback){
    this[c.action](c, sender, callback);
  });
  this.on("HttpServer", function(c){
    if(config.log)
      console.log("post-commit-hook", config.postCommitUrl);
    c.data.app.post(config.postCommitUrl, function(req, res, next){
      self.processPostCommit({req: req}, self);
      res.send({success: true});
    })
    return false;
  })
}, {
  "processPostCommit": function(c, sender, callback) {
    this.emit({type: "Self", action: "upgrade"}, sender, callback);
  }
});