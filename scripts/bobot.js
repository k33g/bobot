// Description:
//   BoB = Bot Operative Behaviour


"use strict";
// TODO: add config file
// TODO: add some functional "goodies"

const GitHubClient = require('./GitHubClient.js').GitHubClient;
let githubCli = new GitHubClient({
  baseUri: "http://github.at.home/api/v3",
  token:process.env.TOKEN_GHE_27_BOBTHEBOT
})

//  token:process.env.TOKEN_GHE_27_K33G

String.prototype.equals = function(x) { return x == this; }
let tokenize = cmd => {
  let tokenizedCmd = cmd.split(" ").filter(item => item !== "");
  //tokenizedCmd.forEach(item => item.prototype.equals = (x) => x == item);
  tokenizedCmd.first = () => tokenizedCmd[0];
  tokenizedCmd.second = () => tokenizedCmd[1];
  tokenizedCmd.third = () => tokenizedCmd[2];
  tokenizedCmd.fourth = () => tokenizedCmd[3];
  tokenizedCmd.fifth = () => tokenizedCmd[4];
  tokenizedCmd.sixth = () => tokenizedCmd[5];

  return tokenizedCmd;
}


module.exports =  (robot) =>  {

  robot.on("plop", (data) =>{
    console.log("Hey 👏",data)
  })
  robot.emit("plop",42)

  // Get rooms id: https://slack.com/api/channels.list?token=HUBOT_SLACK_TOKEN
  robot.messageRoom('C278BQHRV', 'Hello :earth_africa:')
  /*
  - "id":"C278BQHRV","name":"general"
  - "id":"C279GEGER","name":"ops"
  - "id":"C278CLABB","name":"random"
  */

  // http://localhost:8082/hey/hubot
  robot.router.get('/hey/hubot', (req, res) => {
    robot.messageRoom('C278BQHRV', 'Somebody try to :wave: me, please :hourglass_flowing_sand:');
    res.send({});
  });

  // listen to hook(s)
  robot.router.post('/hey/hubot', (req, res) => {
    robot.messageRoom('C279GEGER', [
      `:zap: Event: ${req.headers['x-github-event']}\n`,
      `:panda_face: sender: ${req.body.sender.login} | ${req.body.sender.html_url}\n`,
      `:house: organization: ${req.body.organization.login} | ${req.body.organization.url}\n`,
      `:package: repository: ${req.body.repository.name} | ${req.body.repository.html_url}\n`,
      `:page_facing_up: head_commit: ${req.body.head_commit.message}\n`,
      `${req.body.head_commit.url}\n`
    ].join(""));
    res.send({});
  });


  robot.hear(/bob/, (res) => {
    let cmd = res.envelope.message.text;
    let tokenizedCmd = tokenize(cmd);

    try {
      if (tokenizedCmd.first().equals("bob") && tokenizedCmd.length == 1) {
        res.send("What?");
      }
      if (tokenizedCmd.second().equals("helpme")) {
        res.send("=== HELP ===");
      }
      // get informations about a user
      if (tokenizedCmd.second().equals("user")) {
        let user = tokenizedCmd.third()

        githubCli.fetchUser({handle:user}).then(user => {
          //console.log(user);
          let message = [
            `login: ${user.login} :smile:\n`,
            `blog: ${user.blog}\n`,
            `email: ${user.email}\n`,
            `html_url: ${user.html_url}\n`,
            `repos_url: ${user.repos_url}\n`,
            `suspended_at: ${user.suspended_at}`
          ].join("")

          res.send(message);

        }).catch(error => {
          res.send("No way!!! :rage:");
          console.log("error", error)
        })
      }
      // suspend a user
      if (tokenizedCmd.second().equals("suspend")) {
        let user = tokenizedCmd.third();

        githubCli.suspendUser({handle:user}).then(data => {
          console.log(data);
          res.send(`${user} suspended!`);
        }).catch(error => {
          res.send("No way!!! :rage:");
          console.log("error", error)
        })
      }
      // unsuspend a user
      if (tokenizedCmd.second().equals("unsuspend")) {
        let user = tokenizedCmd.third();

        githubCli.unsuspendUser({handle:user}).then(data => {
          console.log(data);
          res.send(`${user} unsuspended!`);
        }).catch(error => {
          res.send("No way!!! :rage:");
          console.log("error", error)
        })
      }

      // create a repository
      // bob create repo something
      if (tokenizedCmd.second().equals("create") && tokenizedCmd.third().equals("repo")) {
        let repoName = tokenizedCmd.fourth()

        githubCli.createPublicRepository({name:repoName, description:"TBD"})
          .then(repo => {
            //console.log(repo)
            res.send(repo.html_url);
          }).catch(error => {
            res.send("No way!!! :rage:");
            console.log("error", error)
            //res.send("Huston? We've got a problem");
          })

      }
      // bob create orga repo something ACME
      if (
        tokenizedCmd.second().equals("create") &&
        tokenizedCmd.third().equals("orga") &&
        tokenizedCmd.fourth().equals("repo")) {


        let repoName = tokenizedCmd.fifth()
        let repoOrga = tokenizedCmd.sixth()

        githubCli.createPublicOrganizationRepository({name:repoName, description:"TBD", organization:repoOrga})
          .then(repo => {
            res.send(repo.html_url);
          }).catch(error => {
            res.send("No way!!! :rage:");
            console.log("error", error)
          })

      }

    } catch(err) {
      res.send("Huston? We've got a problem :scream:");
    } finally {

    }



  });



  robot.hear(/deploy/, (res) => {
    res.send("deploy what?");
  });


  robot.hear(/\?/, (res) => {
    res.send("BoB = Bot Operative Behaviour");
  });

};
