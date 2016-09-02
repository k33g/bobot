// Description:
//   BoB = Bot Operative Behaviour

"use strict";
// TODO: add config file
var GitHubClient = require('./GitHubClient.js').GitHubClient;
var githubCli = new GitHubClient({
  baseUri: "http://github.at.home/api/v3",
  token:process.env.TOKEN_GHE_27_K33G
})

function checkIfString(str) {
  return {
    contains: (subStr) => new RegExp( '\\b' + subStr + '\\b', 'i').test(str)
  };
}

function getLastWordOf(str) {
  return str.split(" ").splice(-1)[0];
}
function getBeforeLastWordOf(str) {
  return str.split(" ").splice(-1)[0];
}

module.exports =  (robot) =>  {

  //console.log(robot)

  robot.on("plop", (data) =>{
    console.log("====>>>",data)
    //res.send("yo! :wink:");

  })


  robot.emit("plop",42)

  //robot.brain.emit('.....')




  robot.hear(/bob/, (res) => {
    let cmd = res.envelope.message.text;
    //console.log(res.envelope.message.text)
    //let words = res.envelope.message.text.split(" ")
    try {
      if (cmd=="bob") {
        res.send("What?");
      }
      if (checkIfString(cmd).contains("user")) {
        let user = getLastWordOf(cmd)
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

      if (checkIfString(cmd).contains("suspend")) { // il faudrait vérifier que c'est un mot
        let user = getLastWordOf(cmd)
        githubCli.suspendUser({handle:user}).then(data => {
          console.log(data);
          res.send(`${user} suspended!`);
        }).catch(error => {
          res.send("No way!!! :rage:");
          console.log("error", error)
        })
      }

      if (checkIfString(cmd).contains("unsuspend")) {
        let user = getLastWordOf(cmd)
        githubCli.unsuspendUser({handle:user}).then(data => {
          console.log(data);
          res.send(`${user} unsuspended!`);
        }).catch(error => {
          res.send("No way!!! :rage:");
          console.log("error", error)
        })
      }


      if (checkIfString(cmd).contains("create") && checkIfString(cmd).contains("repo")) {
        let repoName = getLastWordOf(cmd)

        githubCli.createPublicRepository({name:repoName, description:"TBD"})
          .then(repo => {
            console.log(repo)
            res.send(repo.html_url);
          }).catch(error => {
            res.send("No way!!! :rage:");
            console.log("error", error)
            //res.send("Huston? We've got a problem");
          })

      }

      if (checkIfString(cmd).contains("create") && checkIfString(cmd).contains("orgarepo")) {
        let repoName = getLastWordOf(cmd)
        let repoOrga = getBeforeLastWordOf(cmd)

        githubCli.createPublicOrganizationRepository({name:repoName, description:"TBD", organization:repoOrga})
          .then(repo => {
            console.log(repo)
            res.send(repo.html_url);
          }).catch(error => {
            res.send("No way!!! :rage:");
            console.log("error", error)
            //res.send("Huston? We've got a problem");
          })

      }


    } catch(err) {
      res.send("Huston? We've got a problem");
    } finally {

    }



  });

  robot.hear(/k33g\?/, (res) => {

    //var githubCli = getCli()
    githubCli.fetchUser({handle:'k33g'}).then(user => {
      console.log(user);
      res.send(user.login + " " + user.avatar_url);
      res.send(`blog: ${user.blog}`);
      res.send(`email: ${user.email}`);


    }).catch(error => {
      console.log("error", error)
    })

  });

  robot.hear(/deploy/, (res) => {
    res.send("deploy what?");
  });


  robot.hear(/\?/, (res) => {
    res.send("BoB = Bot Operative Behaviour");
  });

};
