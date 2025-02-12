exports.checkUserExistOrNot = `select user_id,email,password from users where email=?`
exports.insertIntoUsers = `insert into users(user_name,email,email_varification_token,updated_date) values(?,?,?,?)`
exports.checkTokenExistOrNot = `select user_id from users where email_varification_token=?`
exports.updateUserPassword = `update users set email_varification_token=? ,password =? ,updated_date=? where email=?`
exports.getUserDetails = `select user_id,user_name,role,email from users where user_id=?`
exports.getCandidateList = `select candidate_id,candidate_name,candidate_image_url from candidates`
exports.checkVoteExistOrNot = `select vote_id from votes where user_id=?`
exports.storeVote = `insert into votes(candidate_id,user_id,updated_date) values(?,?,?)`
exports.getAllVotes = `select vote_id,candidate_id,user_id,updated_date from votes`