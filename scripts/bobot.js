// Description:
//   BoB = Bot Operative Behaviour


"use strict";
// TODO: add config file
const VerEx = require('verbal-expressions');

const GitHubClient = require('./GitHubClient.js').GitHubClient;
let githubCli = new GitHubClient({
  baseUri: "http://github.at.home/api/v3",
  token:process.env.TOKEN_GHE_27_K33G
})

const words = require('./words.js')


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

  robot.hear(/bob/, (res) => {
    let cmd = res.envelope.message.text;
    //console.log(res.envelope.message.text)
    //let words = res.envelope.message.text.split(" ")
    try {
      if (cmd=="bob") {
        res.send("What?");
      }
      if (words.testIfHelpMeKeyWord(cmd)) {
        res.send("=== HELP ===");
      }
      // get informations about a user
      if (words.testIfUserKeyWord(cmd)) {
        let user = words.getStringAfterUser(cmd)

        //console.log("-->",user)

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
      if (words.testIfSuspendKeyWord(cmd)) {
        let user = words.getStringAfterSuspend(cmd)
        githubCli.suspendUser({handle:user}).then(data => {
          console.log(data);
          res.send(`${user} suspended!`);
        }).catch(error => {
          res.send("No way!!! :rage:");
          console.log("error", error)
        })
      }
      // unsuspend a user
      if (words.testIfUnsuspendKeyWord(cmd)) {
        let user = words.getStringAfterUnsuspend(cmd)
        githubCli.unsuspendUser({handle:user}).then(data => {
          console.log(data);
          res.send(`${user} unsuspended!`);
        }).catch(error => {
          res.send("No way!!! :rage:");
          console.log("error", error)
        })
      }

      // create a repository
      if (words.testIfCreateRepoKeyWords(cmd)) {
        let repoName = words.getStringAfterRepo(cmd)

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

      if (words.testIfCreateOrgaRepoKeyWordsAnd2WordsAfter(cmd)) {
        let repoName = words.getRepoNameAndOrgaName(cmd)[0]
        let repoOrga = words.getRepoNameAndOrgaName(cmd)[1]

        githubCli.createPublicOrganizationRepository({name:repoName, description:"TBD", organization:repoOrga})
          .then(repo => {
            //console.log(repo)
            res.send(repo.html_url);
          }).catch(error => {
            res.send("No way!!! :rage:");
            console.log("error", error)
            //res.send("Huston? We've got a problem");
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
