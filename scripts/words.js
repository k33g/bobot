const VerEx = require('verbal-expressions');


let testIfUserKeyWord = (str) => VerEx()
  .startOfLine()
  .then('bob')
  .whitespace()
  .then('user')
  .whitespace()
  .word()
  .endOfLine().test(str)

let getStringAfterUser = (str) => VerEx()
  .startOfLine()
  .something()
  .whitespace()
  .beginCapture('user')
  .something()
  .endCapture().exec(str)[1] //TODO: test if null

let testIfSuspendKeyWord = (str) => VerEx()
  .startOfLine()
  .then('bob')
  .whitespace()
  .then('suspend')
  .whitespace()
  .word()
  .endOfLine().test(str);

let testIfUnsuspendKeyWord = (str) => VerEx()
  .startOfLine()
  .then('bob')
  .whitespace()
  .then('unsuspend')
  .whitespace()
  .word()
  .endOfLine().test(str);

let getStringAfterSuspend = (str) => VerEx()
  .startOfLine()
  .something()
  .whitespace()
  .beginCapture('suspend')
  .something()
  .endCapture().exec(str)[1] //TODO: test if null

let getStringAfterUnsuspend = (str) => VerEx()
  .startOfLine()
  .something()
  .whitespace()
  .beginCapture('unsuspend')
  .something()
  .endCapture().exec(str)[1] //TODO: test if null

let testIfCreateRepoKeyWords = (str) => VerEx()
  .startOfLine()
  .then('bob')
  .whitespace()
  .then('create')
  .whitespace()
  .then('repo')
  .whitespace()
  .something() // repo-demo , if (word) doesn't create
  .endOfLine().test(str);

let getStringAfterRepo = (str) => VerEx()
  .startOfLine()
  .something()
  .whitespace()
  .beginCapture('repo')
  .something()
  .endCapture().exec(str)[1] //TODO: test if null

// eg: "bob create orgarepo tools, ACME"
let testIfCreateOrgaRepoKeyWordsAnd2WordsAfter = (str) => VerEx()
  .startOfLine()
  .then('bob')
  .whitespace()
  .then('create')
  .whitespace()
  .then('orgarepo')
  .whitespace()
  .something().then(",").something()
  .endOfLine().test(str);

let getStringAfterOrgaRepo = (str) => VerEx()
  .startOfLine()
  .something()
  .whitespace()
  .beginCapture('orgarepo')
  .anything().then(",").anything()
  .endCapture().exec(str)[1] //TODO: test if null

let getRepoNameAndOrgaName = (str) => getStringAfterOrgaRepo(str).split(",").map((item)=>item.trim())

module.exports = {
  testIfHelpMeKeyWord: (str) => VerEx()
      .startOfLine()
      .then('bob')
      .whitespace()
      .then('helpme')
      .endOfLine().test(str),
  testIfUserKeyWord: testIfUserKeyWord,
  getStringAfterUser: getStringAfterUser,
  testIfSuspendKeyWord: testIfSuspendKeyWord,
  testIfUnsuspendKeyWord: testIfUnsuspendKeyWord,
  getStringAfterSuspend: getStringAfterSuspend,
  getStringAfterUnsuspend: getStringAfterUnsuspend,
  testIfCreateRepoKeyWords: testIfCreateRepoKeyWords,
  getStringAfterRepo: getStringAfterRepo,
  testIfCreateOrgaRepoKeyWordsAnd2WordsAfter: testIfCreateOrgaRepoKeyWordsAnd2WordsAfter,
  getStringAfterOrgaRepo: getStringAfterOrgaRepo,
  getRepoNameAndOrgaName: getRepoNameAndOrgaName

}
